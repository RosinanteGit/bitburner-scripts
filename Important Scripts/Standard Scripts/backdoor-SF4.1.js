/** @param {import(".").NS } ns */
export async function main (ns) {
  if (false) {
    brutessh()
    ftpcrack()
    relaysmtp()
    httpworm()
    sqlinject()
  }
  var a = new Set()
  var b = new Set()
  b.add('home')
  function scanExes () {
    var exes = []
    for (let hack of [
      'brutessh',
      'ftpcrack',
      'relaysmtp',
      'sqlinject',
      'httpworm'
    ]) {
      if (ns.fileExists(hack + '.exe')) {
        exes.push(hack)
      } else {
        ns.tprint(hack + ' not found')
      }
    }
    return exes
  }
  /**
	 @param {string} host
	 @param {string} current
	 @param {string[]} exes
	 **/
  async function scanServers (host, current, exes) {
    //Combined scan and check
    ns.connect(current)
    b.add(current)
    for (let server of ns.scan(current)) {
      if (host != server) {
        ns.connect(server)
        await scanServers(current, server, exes)
        ns.connect(current)
        if (!a.has(server)) {
          if (
            ns.getServerNumPortsRequired(server) <= exes.length &&
            ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()
          ) {
            a.add(server)
            ns.connect(server)
            for (let hack of exes) {
              ns[hack](server)
            }
            ns.nuke(server)
            await ns.installBackdoor()
            ns.tprintf('Successfully installed backdoor on ' + server)
            ns.connect(current)
          } else {
            waiting = true
            ns.print(
              'waiting: ' +
                server +
                '- ' +
                ns.getServerNumPortsRequired(server) +
                '<=' +
                exes.length +
                ',' +
                ns.getServerRequiredHackingLevel(server) +
                ' <= ' +
                ns.getHackingLevel()
            )
          }
        }
      }
    }
    ns.connect(current)
  }
  ns.purchaseTor()
  a.add('home')
  ns.disableLog('ALL')
  ns.enableLog('installBackdoor')
  var loop_counter = 0
  var waiting = true
  while (waiting) {
    var x = ns.asleep(1000)
    waiting = false
    ns.purchaseTor()
    for (let exe of [
      'brutessh.exe',
      'ftpcrack.exe',
      'relaysmtp.exe',
      'httpworm.exe',
      'sqlinject.exe',
      'serverprofiler.exe',
      'deepscanv1.exe',
      'deepscanv2.exe',
      'autolink.exe',
      'Formulas.exe'
    ])
      ns.purchaseProgram(exe)
    var exes = scanExes()
    await scanServers('', 'home', exes)
    ns.print('loop done: ' + loop_counter)
    loop_counter += 1
    await x
  }
  ns.tprint('backdoor done.')
}
