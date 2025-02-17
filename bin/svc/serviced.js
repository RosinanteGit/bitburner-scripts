import { deploy } from '/lib/deploy.js'
import { exec } from '/lib/exec.js'
import * as fs from '/lib/fs.js'
import { nuke } from '/lib/nuke.js'
import { scan } from '/lib/scan.js'
export async function main (ns) {
  ns.disableLog('ALL')
  const CONFIG = await fs.getConfig(ns, '/etc/serviced/config.json', {
    serviceDirectory: '/etc/serviced/services/'
  })
  const SERVICE_FILE_NAMES = ns
    .ls('home')
    .filter(file =>
      file.startsWith(fs.normalizeFoldername(CONFIG.serviceDirectory))
    )
    .filter(file => file.endsWith('.service.txt'))
  if (SERVICE_FILE_NAMES.length === 0) {
    ns.tprint(`There are no services to deploy.`)
    ns.exit()
  }
  const SERVERS = scan(ns)
  SERVERS.forEach(host => nuke(ns, host))
  let services = []
  for (let filename of SERVICE_FILE_NAMES) {
    let fileRaw = await fs.readFile(ns, filename)
    try {
      let service = JSON.parse(fileRaw)
      ns.tprint(`Loaded service '${service.name}' @ '${filename}'.`)
      services.push(service)
    } catch (e) {
      ns.tprint(`Bad service file @ '${filename}'.`)
    }
  }
  let success = 0
  for (let service of services) {
    let broke = false
    for (let dependency of service.dependencies ?? []) {
      let dep = fs.normalizeFilename(dependency)
      if (!ns.fileExists(dep, 'home')) {
        ns.tprint(
          `Failed to deploy service '${service.name}': Bad Dependency: '${dep}'`
        )
        broke = true
        break
      }
      for (let host of SERVERS) {
        let scpOk = await ns.scp(dep, 'home', host)
        if (!scpOk) {
          ns.tprint(
            `Failed to deploy service '${service.name}': File Transfer Failure`
          )
          broke = true
          break
        }
        if (broke) {
          break
        }
      }
    }
    if (broke) {
      continue
    }
    if (service.hostname !== undefined) {
      if (service.threads === 'MAX') {
        ns.tprint(
          `Failed to deploy service '${service.name}': Bad Thread Count`
        )
        continue
      }
      let execStatus = await exec(
        ns,
        service.filename,
        service.hostname,
        service.threads,
        service.args
      )
      if (execStatus === -1) {
        ns.tprint(`Failed to deploy service '${service.name}': Bad Filename`)
        continue
      }
      if (execStatus === -2) {
        ns.tprint(`Failed to deploy service '${service.name}': Bad Host`)
        continue
      }
      if (execStatus === -3 || execStatus === -5) {
        ns.tprint(
          `Failed to deploy service '${service.name}': Bad Thread Count`
        )
        continue
      }
      if (execStatus === -4) {
        ns.tprint(
          `Failed to deploy service '${service.name}': Insufficient Ram`
        )
        continue
      }
      if (execStatus === -6) {
        ns.tprint(
          `Failed to deploy service '${service.name}': Service Already Running`
        )
        continue
      }
      if (execStatus === -7) {
        ns.tprint(
          `Failed to deploy service '${service.name}': File Transfer Failure`
        )
        continue
      }
      ns.tprint(
        `Successfully deployed service '${service.name}' on host '${service.hostname}'`
      )
      success++
    } else {
      let deployStatus = await deploy(
        ns,
        service.filename,
        service.threads,
        service.args,
        {
          allowDeployOnHome: service.allowDeployOnHome ?? true
        }
      )
      let hosts = deployStatus.hosts.filter(host => host.pid > 0)
      if (hosts.length === 0) {
        ns.tprint(
          `Failed to deploy service '${service.name}': No Hosts Available`
        )
        continue
      }
      ns.tprint(
        `Successfully deployed service '${service.name}' on ${
          hosts.length
        } hosts: ${hosts.map(host => host.hostname).join(', ')}`
      )
      success++
    }
  }
  ns.tprint(
    `Successfully deployed ${success} of ${SERVICE_FILE_NAMES.length} services.`
  )
  ns.tprint(`Exiting.`)
}
