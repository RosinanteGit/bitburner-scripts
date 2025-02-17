/** @param {NS} ns **/
export async function main(ns) {
  var server = ns.args[0] //Host to hack
  var server2 = ns.getHostname() //Server to run scripts on
  var i = 0
  var c = 0
  var player = ns.getPlayer()
  var fserver = ns.getServer(server)
  // Added some scripts from daemon.js and his helpers to the Ram Cost Calculation
  var h = ns.getScriptRam('host-manager.js')
  var j = ns.getScriptRam('/Temp/join-faction-loop.js')
  var a = ns.getScriptRam('auto-upgrade.js')
  var t = ns.getScriptRam('/Temp/stockmarket-summary-tail.js')
  var m = ns.getScriptRam('stockmaster.js')
  var s = ns.getScriptRam('stats.js')
  var x = ns.getScriptRam('work-for-faction.js')
  var n = ns.getScriptRam('sleeve.js')
  var b = ns.getScriptRam('gangs.js')
  var contstantRam = ns.getScriptRam('/OP/OP.js') //grabbing script RAM values
  var hackscriptRam = ns.getScriptRam('/OP/hack.js')
  var growscriptRam = ns.getScriptRam('/OP/grow.js')
  var weakenscriptRam = ns.getScriptRam('/OP/weaken.js')
  var maxRam = ns.getServerMaxRam(server2) - contstantRam - b - n - x - s - m - t - a - j - h //getting 100% of total RAM I can use that exclude the OP script and 32GB
  var weakenThreads = (hackThreads * 0.002 + weakenThreads * 0.04) / 0.05 // getting exact number of weaken threads new Formula
  //var weakenThreads = 2000 - ns.getServerMinSecurityLevel(server) / 0.05 // old
  var maxGrowThreads = maxRam / growscriptRam - weakenscriptRam * 2000
  var cs = ns.getServerSecurityLevel(server)
  var ms = ns.getServerMinSecurityLevel(server)
  var mm = ns.getServerMaxMoney(server)
  var ma = ns.getServerMoneyAvailable(server)
  //Priming the server.  Max money and Min security must be acheived for this to work
  if (ma < mm == true) {
    ns.exec('/OP/weaken.js', server2, 2000, server, 0)
    ns.exec('/OP/grow.js', server2, maxGrowThreads, server, 0)
    var WeakenTime = ns.formulas.hacking.weakenTime(fserver, player)
    await ns.sleep(WeakenTime + 1000)
    mm = ns.getServerMaxMoney(server)
    ma = ns.getServerMoneyAvailable(server)
    player = ns.getPlayer()
    fserver = ns.getServer(server)
    cs = ns.getServerSecurityLevel(server)
    ms = ns.getServerMinSecurityLevel(server)
  }
  //If Max Money is true, making sure security level is at its minimum
  if (cs > ms == true) {
    ns.exec('/OP/weaken.js', server2, 2000, server, 0)
    WeakenTime = ns.formulas.hacking.weakenTime(fserver, player)
    await ns.sleep(WeakenTime + 1000)
    cs = ns.getServerSecurityLevel(server)
    ms = ns.getServerMinSecurityLevel(server)
  }
  //Refreshing server stats now that the security level is at the minmum, and maybe our player stats have changed as priming can take a while
  player = ns.getPlayer()
  fserver = ns.getServer(server)
  var HPercent = ns.formulas.hacking.hackPercent(fserver, player) * 100
  var GPercent = ns.formulas.hacking.growPercent(fserver, 1, player, 1)
  WeakenTime = ns.formulas.hacking.weakenTime(fserver, player)
  var GrowTime = ns.formulas.hacking.growTime(fserver, player)
  var HackTime = ns.formulas.hacking.hackTime(fserver, player)
  // changed Math.round to math.ceil on Grow and Weaken Threads and to math.floor on Hack Threads
  var growThreads = Math.ceil(2.3 / (GPercent - 1)) //Getting the amount of threads I need to grow 200%.  I only need 100% but I'm being conservative here
  var hackThreads = Math.floor(75 / HPercent) //Getting the amount of threads I need to hack 75% of the funds
  weakenThreads = Math.ceil((cs - ms) + (growThreads * 0.004)) / 0.05 // Getting required threads to fully weaken the server new Formula
  var totalRamForRun =
    hackscriptRam * hackThreads +
    growscriptRam * growThreads +
    weakenscriptRam * weakenThreads //Calculating how much RAM is used for a single run
  var sleepTime = WeakenTime / (maxRam / totalRamForRun) //finding how many runs this server can handle and setting the time between run execution
  //if (sleepTime<500) // Testing forcing a min sleep time of 500 ms
  //{sleepTime = 500;
  //}
  var shiftCount = maxRam / totalRamForRun
  var offset = sleepTime / 2
  var gOffset = offset / 4
  var hOffset = offset / 2
  if (totalRamForRun > maxRam) {
    ns.print('Not enough RAM for a single run. Try an easier host')
    kill('/OP/OP.js')
  }
  while (true) {
    var wsleep = 0 //At one point I made the weaken call sleep so I've kept it around
    var gsleep = WeakenTime - GrowTime - gOffset //Getting the time to have the Growth execution sleep, then shaving some off to beat the weaken execution
    var hsleep = WeakenTime - HackTime - hOffset //Getting time for hack, shaving off more to make sure it beats both weaken and growth
    var UsedRam = ns.getServerUsedRam(server2)
    if (totalRamForRun >= maxRam - UsedRam == false && cs == ms) {
      //making sure I have enough RAM to do a full run
      ns.exec('/OP/weaken.js', server2, weakenThreads, server, wsleep, i)
      ns.exec('/OP/grow.js', server2, growThreads, server, gsleep, i)
      ns.exec('/OP/hack.js', server2, hackThreads, server, hsleep, i)
      if (c < shiftCount) {
        await ns.sleep(sleepTime)
        c++
      } else {
        await ns.sleep(sleepTime + offset)
        c = 0
      }
      i++
    } else {
      await ns.sleep(1000)
    }
  }
  await ns.sleep(120000)
}