//** @param {NS} ns **/
/** @param {import("..").NS } ns */
export async function main (ns) {
  var torVorh = false //First things first, do we have a TOR?
  torVorh = ns.getPlayer().tor
  if (torVorh == false) {
    //No TOR, return to terminal
    //ns.purchaseTor()
    ns.tprint('Kein TOR!!!')
    return
  } else {
    //Scan for ALL servers, even those scan.analyze 10 doesnt see from home
    var scanned = ns.scan('home')
    var servers = new Set()
    var serversFullSet = new Set()
    servers.add('home')
    while (scanned.length > 0) {
      const s = scanned.pop()
      if (!servers.has(s)) {
        servers.add(s)
        scanned = scanned.concat(ns.scan(s))
      }
    }
    serversFullSet = servers //Save a Full scan as backup
    servers.delete('home') //Removing our own servers
    servers.forEach(
      (
        server //My added part for personal servers
      ) => {
        if (
          server ==
          'daemon' +
            ('-0' ||
              '-1' ||
              '-2' ||
              '-3' ||
              '-4' ||
              '-5' ||
              '-6' ||
              '-7' ||
              '-8' ||
              '-9' ||
              '-10' ||
              '-11' ||
              '-12' ||
              '-13' ||
              '-14' ||
              '-15' ||
              '-16' ||
              '-17' ||
              '-18' ||
              '-19' ||
              '-20' ||
              '-21' ||
              '-22' ||
              '-23' ||
              '-24')
        ) {
          servers.delete(server)
        }
      }
    )
    servers = Array.from(servers)
    serversFullSet = Array.from(serversFullSet)
    var numberServersUsed = servers.length //Mine from here on
    var numberServers = serversFullSet.length
    var rootHelpers = 0 //vars to determine which servers in the list we can actually root
    var sql = false
    var ssh = false
    var smtp = false
    var http = false
    var ftp = false
    if (ns.fileExists('sqlinject.exe')) {
      //figuring out what helpers we have, and how many in total
      rootHelpers++
      sql = true
    }
    if (ns.fileExists('httpworm.exe')) {
      rootHelpers++
      http = true
    }
    if (ns.fileExists('relaysmtp.exe')) {
      rootHelpers++
      smtp = true
    }
    if (ns.fileExists('ftpcrack.exe')) {
      rootHelpers++
      ftp = true
    }
    if (ns.fileExists('brutessh.exe')) {
      rootHelpers++
      ssh = true
    }
    servers.forEach(server => {
      if (!ns.hasRootAccess(server)) {
        //accounting for the number of ports, and which
        if (ns.getServerNumPortsRequired(server) <= rootHelpers) {
          //ones we can open
          if (sql == true) {
            ns.sqlinject(server)
          }
          if (http == true) {
            ns.httpworm(server)
          }
          if (smtp == true) {
            ns.relaysmtp(server)
          }
          if (ftp == true) {
            ns.ftpcrack(server)
          }
          if (ssh == true) {
            ns.brutessh(server)
          }
          ns.nuke(server)}
          // if (ns.getServerMaxMoney(server) > 0) {
          // Mine, only hack/grow/weaken cycles for servers
          //ns.exec(server + '.script', 'home', 1500) //that actually have money; and run them with 1500 threads
          // on the home server (3,6 TB, enough for 1t==1000b per cycle @my augs)
          else {
            //Servers without money are subtracted from the count of scripts that
            numberServersUsed-- //should be running in the end
          }
        }
        //await (ns.installBackdoor(server));
      } // else if (ns.getServerMaxMoney(server) == 0) {
        //numberServersUsed--
      
    
    ns.tprint(numberServersUsed + ' / ' + numberServers) //How many scripts shopuld be running(63 for me)
    servers.forEach(server => {
      //Check if it ate a script and try to restart it
      if (
        !ns.isRunning(server + '.script', 'home') &&
        ns.getServerMaxMoney(server) > 0
      ) {
        ns.tprint('Missing: ' + server + '\n Trying to start it.')
        ns.exec(server + '.script', 'home', 1500)
        if (!ns.isRunning(server + '.script', 'home')) {
          ns.tprint('Nope; HELP!!!')
        } else {
          ns.tprint('Success!!!')
        }
      }
    })
  }
}
