/** @param {import("..").NS } ns */

//additional function, needed to merge arrays.
Array.prototype.unique = function () {
  var a = this.concat()
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1)
    }
  }
  return a
}

export async function main (ns) {
  ns.disableLog('ALL') //Disable it for troubleshoting
  ns.print('Start')
  //You should create basic scripts with exact names. Like await ns.hack(ns.args[0]);
  var files = ['weaken.ns', 'grow.ns', 'hack.ns']
  var servers = ns.scan('home')
  var newservers
  var koefs = [0]
  var targetserver = 'n00dles' //will be changed later
  var serversnuked = ['home'] //list of nuked, active servers
  var i = 1

  while (true) {
    //Find servers, nuke and add to list
    for (var element of servers) {
      //It is infinity for, that scan again and again all servers an new ones.
      await ns.sleep(1000)
      ns.clearLog()
      var newservers = ns.scan(element)
      var servers = servers.concat(newservers).unique()
      ns.print('Start for ' + element)

      //Buy servers
      var ram = 8
      var myservers = ns.getPurchasedServers()
      if (myservers[1]) {
        var ramofmyservers = ns.getServerMaxRam(myservers[1])
      }
      await ns.sleep(1000)
      if (
        myservers.length < ns.getPurchasedServerLimit() &&
        ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)
      ) {
        var number = myservers.length + 1
        var hostname = ns.purchaseServer('pserv-' + number, ram)
        await ns.scp(files, 'home', hostname)
        ns.killall(hostname)
        ns.print('Buy ' + hostname)
      } else if (
        ns.getPurchasedServerCost(ramofmyservers * 2) * 250 <
        ns.getServerMoneyAvailable('home')
      ) {
        for (var ser of myservers) {
          ns.killall(ser)
          ns.deleteServer(ser)
        }
        for (var i = 0; i < 25; i++) {
          var myservers = ns.getPurchasedServers()
          var ram = ramofmyservers * 2
          var number = myservers.length + i
          var hostname = ns.purchaseServer('pserv-' + number, ram)
          await ns.scp(files, 'home', hostname)
          ns.killall(hostname)
          ns.print('Buy ' + hostname)
        }
      }

      //Check ports power
      var portpower = [0, 0, 0, 0, 0]
      var portcounter = 0
      if (ns.fileExists('BruteSSH.exe')) {
        portpower[0] = 1
        portcounter++
      }
      if (ns.fileExists('FTPCrack.exe')) {
        portpower[1] = 1
        portcounter++
      }
      if (ns.fileExists('relaySMTP.exe')) {
        portpower[2] = 1
        portcounter++
      }
      if (ns.fileExists('HTTPWorm.exe')) {
        portpower[3] = 1
        portcounter++
      }
      if (ns.fileExists('SQLInject.exe')) {
        portpower[4] = 1
        portcounter++
      }

      //Nuke servers
      if (serversnuked.indexOf(element) >= 0) {
        ns.print('Already nuked ' + element)
      } else if (ns.hasRootAccess(element)) {
        serversnuked.push(element)
        await ns.scp(files, 'home', element)
      } else if (ns.getServerNumPortsRequired(element) > portcounter) {
        ns.print('No port power for ' + element)
      } else if (
        ns.getHackingLevel() < ns.getServerRequiredHackingLevel(element)
      ) {
        ns.print('No skill for' + element)
      } else {
        if (portpower[0]) {
          ns.brutessh(element)
        }
        if (portpower[1]) {
          ns.ftpcrack(element)
        }
        if (portpower[2]) {
          ns.relaysmtp(element)
        }
        if (portpower[3]) {
          ns.httpworm(element)
        }
        if (portpower[4]) {
          ns.sqlinject(element)
        }
        ns.nuke(element)
        ns.print('Nuked ' + element)
        //ns.installBackdoor(element); //Will work in mid game

        //To push files
        await ns.scp(files, 'home', element)
        await ns.killall(element)
        serversnuked.push(element)
        ns.print('all files on ' + element)
      }

      //To find a target, You can comment this part and just use targetserver
      if (serversnuked.indexOf(element) >= 0) {
        var money = ns.getServerMaxMoney(element)
        var security = ns.getServerMinSecurityLevel(element)
        var koef = (money / security) * 0.000001
        if (koefs.some(el => el >= koef)) {
          koefs.push(koef)
        } else {
          targetserver = element
          koefs.push(koef)
          ns.print(targetserver)
        }
      }

      //Launch action on all servers nuked.
      //Check what should be done, weak, grow or hack, hack
      //You can change % to experiment, try to do hack often but for small portions.
      for (var rs of serversnuked) {
        if (ns.getServerMaxRam(rs) - ns.getServerUsedRam(rs) >= 2) {
          var threadsH = Math.floor(
            Math.floor(ns.getServerMaxRam(rs) / 1.75) * 0.01
          )
          var threadsW = Math.floor(
            Math.floor(ns.getServerMaxRam(rs) / 1.75) * 0.62
          )
          var threadsG = Math.floor(
            Math.floor(ns.getServerMaxRam(rs) / 1.75) * 0.37
          )
          if (rs == 'home') {
            var threadsH = Math.floor(
              ((ns.getServerMaxRam(rs) - 20) / 1.75) * 0.01
            )
            var threadsW = Math.floor(
              ((ns.getServerMaxRam(rs) - 20) / 1.75) * 0.62
            )
            var threadsG = Math.floor(
              ((ns.getServerMaxRam(rs) - 20) / 1.75) * 0.37
            )
          }
          if (ns.scriptRunning('weaken.ns', rs)) {
          } else if (threadsW > 0) {
            ns.exec('weaken.ns', rs, threadsW, targetserver)
          }
          if (ns.scriptRunning('grow.ns', rs)) {
          } else if (threadsG > 0) {
            ns.exec('grow.ns', rs, threadsG, targetserver)
          }
          if (ns.scriptRunning('hack.ns', rs)) {
          } else if (threadsH > 0) {
            ns.exec('hack.ns', rs, threadsH, targetserver)
          }
        } else {
        }
      }
    }
  }
}
