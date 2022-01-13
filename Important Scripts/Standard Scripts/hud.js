/** @param {import("..").NS } ns */
// Add script income per second
headers.push('Inc.')
values.push(ns.nFormat(ns.getScriptIncome()[0], '$0.00a') + '/s')
// Add script exp gain rate per second
headers.push('Xp')
values.push(ns.nFormat(ns.getScriptExpGain(), '0.00a') + '/s')
// Add hacknet income per second
headers.push('HN Inc.')
let prod = 0
for (var n = 0; n < ns.hacknet.numNodes(); n++) {
  prod = prod + ns.hacknet.getNodeStats(n)['production']
}
values.push(ns.nFormat(prod, '$0.00a') + '/s')
//home ram usage
headers.push('')
values.push('')
headers.push('Home')
values.push(
  ns.nFormat(ns.getServerUsedRam('home') / ns.getServerMaxRam('home'), '00.00%')
)
headers.push(ns.nFormat(ns.getServerUsedRam('home') * 1000000000, '0.00 b'))
values.push(ns.nFormat(ns.getServerMaxRam('home') * 1000000000, '0.00 b'))

//pserver ramusage
headers.push('')
values.push('')
headers.push('SERVER')
let max = 0
let used = 0
for (let server of ns.getPurchasedServers()) {
  max = max + ns.getServerMaxRam(server)
  used = used + ns.getServerUsedRam(server)
}
values.push(ns.nFormat(used / max, '00.00%')) //total %
headers.push(ns.nFormat(used * 1000000000, '0.00 b')) //used
values.push(ns.nFormat(max * 1000000000, '0.00 b')) //total
ns.atExit(() => {
  hook0.innerHTML = ''
  hook1.innerHTML = ''
})