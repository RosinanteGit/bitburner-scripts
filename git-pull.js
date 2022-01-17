const filesToDownload = [
  'analyze-hack.js',
  'cascade-kill.js',
  'cleanup.js',
  'crime.js',
  'daemon.js',
  'faction-manager.js',
  'farm-intelligence.js',
  'gangs.js',
  'get-list.js',
  'git-pull.js',
  'hacknet-upgrade-manager.js',
  'helpers.js',
  'host-manager.js',
  'remove-worst-server.js',
  'reserve.js',
  'reserve.txt',
  'run-command.js',
  'scan.js',
  'sleeve.js',
  'spend-hacknet-hashes.js',
  'stats.js',
  'stockmaster.js',
  'work-for-factions.js',
  '/Flags/deleting.txt',
  '/Remote/grow-target.js',
  '/Remote/hack-target.js',
  '/Remote/manualhack-target.js',
  '/Remote/weak-target.js',
  '/Tasks/backdoor-all-servers.js',
  '/Tasks/backdoor-all-servers.js.backdoor-one.js',
  '/Tasks/contractor.js',
  '/Tasks/contractor.js.solver.js',
  '/Tasks/program-manager.js',
  '/Tasks/ram-manager.js',
  '/Tasks/run-with-delay.js',
  '/Tasks/tor-manager.js',
  '/Tasks/write-file.js',
  '/OP/OP.js',
  '/OP/grow.js',
  '/OP/hack.js',
  '/OP/weaken.js',
]
const baseUrl = 'https://raw.githubusercontent.com/RosinanteGit/bitburner-scripts/'


/**
 * @param {NS} ns
 **/
export async function main(ns) {
  ns.disableLog("sleep")
  const args = ns.flags([['branch', 'main']])

  for ( let filename of filesToDownload ) {
    ns.scriptKill(filename, 'home')
    ns.rm(filename)
    await ns.sleep(50)
    await download(ns, filename, args.branch)
  }
  await ns.sleep(50)
  ns.tprint('Killed and deleted old scripts.')
  await ns.sleep(50)
  ns.tprint(`Files downloaded.`)

  await ns.sleep(50)
  ns.tprint(`Starting startup/run.js`)
  ns.spawn('/startup/run.js', 1)
}

export async function download(ns, filename, branch) {
  const fileUrl = filename.includes("/") ? filename : "/" + filename;
  const path = baseUrl + branch + '/src' + fileUrl
  ns.tprint(`Trying to download ${path}`)
  await ns.wget(path + '?ts=' + new Date().getTime(), filename)
}