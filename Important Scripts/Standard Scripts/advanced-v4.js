/* This script is mainly come from steam user @PG SDVX,
 * I just modify the part tells us "how to choose a correct target"
 * Mem cost: 5.45GB since I deleted a lot of functions.
 * some further optimize techniques(e.g., exec another program and exit itself.) could be done to shrink the memory usage.
 * But I may not do that.
 * Special Thanks to @PG SDVX who create the framework and allow me to re-use the code.
 * Intermediate - Advanced Auto Farm + Modules
 * A plug and play, set and forget script with modules that'll farm in a mostly optimised fashion */

/** @param {import("..").NS } ns */
export async function main (ns) {
  const min_server_ram = 0
  const home_ram_reserve = 0
  //const calc_mathod = 'HIGH PROFIT'// should be one of ['HIGH PROFIT',' HIGH  EXP ']
  const calc_mathod = ' HIGH  EXP ' // remember to disable the line above when active it.
  //const calc_mathod = 'N00DLE ONLY'// not test yet
  //configs above could be modified before scripts run.
  //Note: changing configs above have no effect for running scripts.
  //things below is constants, which should NOT be changed unless the constant are incorrect.
  const GWH_mem_usage = [1.75, 1.75, 1.7]
  const script_memory_usage = 5.45
  const weaken_reduce = 0.05

  //Welcome to the Auto Farm part 2: Electric Boogaloo - Advanced Edition
  //This script is a little more complicated to explain easily, it dedicates high RAM servers to attack high profit servers
  //This is also set and forget, your EXEs and hacking level are reacquired each second, so new servers are added without needing to reboot it
  //Well I hope this brings you ideas, knowledge and or profits :D

  function info (t, s) {
    if (t == 'MM') {
      return ns.getServerMaxMoney(s)
    }
    if (t == 'MA') {
      return ns.getServerMoneyAvailable(s)
    }
    if (t == 'MR') {
      return ns.getServerMaxRam(s)
    }
    if (t == 'UR') {
      return ns.getServerUsedRam(s)
    }
    if (t == 'NPR') {
      return ns.getServerNumPortsRequired(s)
    }
    if (t == 'RHL') {
      return ns.getServerRequiredHackingLevel(s)
    }
    if (t == 'SL') {
      return ns.getServerSecurityLevel(s)
    }
    if (t == 'MSL') {
      return ns.getServerMinSecurityLevel(s)
    }
  }
  function calc_method (server) {
    if (calc_mathod == 'HIGH PROFIT') {
      return Math.floor(info('MM', server) / info('MSL', server))
    } else if (calc_mathod == ' HIGH  EXP ') {
      return (info('RHL', server) * info('RHL', server)) / info('MSL', server)
    } else return server == 'n00dles'
  }

  ns.disableLog('ALL')
  const arraySort = arr => arr.sort((a, b) => b[0] - a[0])

  var files = ['/scripts/grow.ns', '/scripts/weak.ns', '/scripts/hack.ns']
  var exec = ['grow', 'weaken', 'hack']
  for (var j = 0; j < 3; j++) {
    await ns.write(
      files[j],
      '/** @param {NS} ns**/\nexport async function main(ns) {await ns.' +
        exec[j] +
        '(ns.args[0])}',
      'w'
    )
  }

  var exclude = [''] //Servers names that won't be used as hosts or deleted

  var servers
  var hosts
  var targets
  var exes
  var tarIndex
  var loop
  var hType
  var tmp
  var act
  var extra
  var cycle = [0, '▄', '█', '▀', '█']
  if (false) {
    brutessh()
    ftpcrack()
    relaysmtp()
    httpworm()
    sqlinject()
  }

  const checkM = (c, d) => eval(c < ns.getPlayer().money / d)
  function str (s) {
    if (s.length > 17) {
      return s.substring(0, 14) + '...'
    } else {
      return s
    }
  }

  async function scanExes () {
    for (let hack of [
      'brutessh',
      'ftpcrack',
      'relaysmtp',
      'sqlinject',
      'httpworm'
    ]) {
      if (ns.fileExists(hack + '.exe')) {
        exes.push(hack)
      }
    }
  }

  function log (extra) {
    if (cycle[0] >= 4) {
      cycle[0] = 0
    }
    cycle[0]++
    ns.clearLog()
    ns.print(extra)
    ns.print('╔═══╦════════════════════════════════════╗')
    tmp = targets.slice(0, 12)
    ns.print(
      `║ ${cycle[cycle[0]]} ║ ` + calc_mathod + '            BALANCE     ║'
    )
    for (let t of tmp) {
      if (!act[t[1]]) act[t[1]] = '-'
      ns.print(
        `║ ${act[t[1]]} ║ ${str(t[1])}` +
          `${ns.nFormat(info('MA', t[1]), '0a')} / ${ns.nFormat(
            info('MM', t[1]),
            '0a'
          )} : ${ns.nFormat(
            info('MA', t[1]) / info('MM', t[1]),
            '0%'
          )} ║`.padStart(36 - str(t[1]).length)
      )
    }
    ns.print('╠═══╩════════════════════════════════════╝')
    ns.print(
      `║ EXE ${exes.length}/5 ║ HOSTS ${hosts.length} ║ TARGETS ${targets.length}`
    )
    ns.print('╠═════════════════════════════════════════')
  }

  async function scanServers (host, current) {
    //Combined scan and check
    for (let server of ns.scan(current)) {
      if (info('NPR', server) <= exes.length && host != server) {
        {
          for (let hack of exes) {
            ns[hack](server)
          }
          ns.nuke(server)
        }
        if (
          info('MM', server) != 0 &&
          info('RHL', server) <= ns.getHackingLevel() &&
          info('MSL', server) < 100
        ) {
          targets.push([calc_method(server), server])
        }
        if (info('MR', server) > min_server_ram && !exclude.includes(server)) {
          hosts.push([
            info('MR', server),
            server,
            Math.floor(info('MR', server) / GWH_mem_usage[1])
          ])
        }
        servers.push(server)
        await ns.scp(files, 'home', server)
        await scanServers(current, server)
      }
    }
  }

  async function hackAll (aiming_target) {
    //Dedicates high RAM servers to high value ones
    var sum = 0
    for (let host of hosts) {
      sum += host[2]
    }
    extra += 'Threads for weaken or grow: ' + sum
    sum *= weaken_reduce
    extra += '\nweaken effect             : ' + sum
    for (let host of hosts) {
      if (tarIndex > targets.length - 1) {
        tarIndex = 0
        loop = true
      }
      let target = aiming_target //targets[tarIndex][1];
      function fRam () {
        let f = info('MR', host[1]) - info('UR', host[1])
        if (host[1] == 'home') {
          return Math.max(f - home_ram_reserve, 0)
        } else {
          return f
        }
      }
      if (info('SL', target) > info('MSL', target) + Math.min(5, sum)) {
        hType = 1
      } else if (info('MA', target) < info('MM', target) * 0.8) {
        hType = 0
      } else {
        hType = 2
      } /*
				if ((hType == 0 || hType == 2) && fRam() / info('MR', host[1]) > .13 && fRam() > 4) {
					tmp = [Math.ceil(fRam() / 1.75 * .8), Math.floor(fRam() / 1.75 * .15), Math.floor(fRam() / 1.75 - (Math.ceil(fRam() / 1.75 * .15) + Math.floor(fRam() / 1.75 * .80)))]
					if (tmp[0] > 0) { ns.exec(files[0], host[1], tmp[0], target) }
					if (tmp[1] > 0) { ns.exec(files[1], host[1], tmp[1], target) }
					if (tmp[2] > 0) { ns.exec(files[2], host[1], tmp[2], target) }
				}
			}
			tarIndex++// */
      var tmp = Math.floor(fRam() / GWH_mem_usage[hType])
      tmp > 0 && ns.exec(files[hType], host[1], tmp, target, 'auto')
      if (!loop) {
        if (hType == 0) {
          act[target] = 'G'
        } else if (hType == 1) {
          act[target] = 'W'
        } else if (hType == 2) {
          act[target] = 'H'
        } else act[target] = 'U'
      }
    }
  }
  ns.tail()
  while (true) {
    //Keeps everything running once per second
    servers = []
    targets = []
    hosts = [
      [
        info('MR', 'home'),
        'home',
        Math.floor(
          (info('MR', 'home') - script_memory_usage) / GWH_mem_usage[1]
        )
      ]
    ]
    exes = []
    tarIndex = 0
    loop = false
    act = {}
    extra = ''
    await scanExes()
    await scanServers('', 'home')
    targets = arraySort(targets)
    hosts = arraySort(hosts)
    if (ns.args.length > 0) await hackAll(ns.args[0])
    else await hackAll(targets[tarIndex][1])
    log(extra)
    await ns.asleep(1000)
  }
}
export function autocomplete (data, args) {
  return [...data.servers]
}
