/** @param {import(".").NS } ns */
export async function main (ns) {
  let fin
  fin = 0

  let n = 0
  while (fin == 0) {
    if (ns.getPlayer().money >= '200000') {
      ns.purchaseTor()

      if (
        ns.getPlayer().money >= 500000 &&
        ns.purchaseProgram('brutessh.exe') == false
      )
        ns.purchaseProgram('brutessh.exe')

      if (
        ns.getPlayer().money >= 1500000 &&
        ns.purchaseProgram('FTPCrack.exe') == false
      )
        ns.purchaseProgram('FTPCrack.exe')

      if (
        ns.getPlayer().money >= 5000000 &&
        ns.purchaseProgram('relaySMTP.exe') == false
      )
        ns.purchaseProgram('relaySMTP.exe')

      if (
        ns.getPlayer().money >= 30000000 &&
        ns.purchaseProgram('HTTPWorm.exe') == false
      )
        ns.purchaseProgram('HTTPWorm.exe')

      if (
        ns.getPlayer().money >= 250000000 &&
        ns.purchaseProgram('SQLInject.exe') == false
      )
        ns.purchaseProgram('SQLInject.exe')

      if (
        ns.getPlayer().money >= 500000 &&
        ns.purchaseProgram('ServerProfiler.exe') == false
      )
        ns.purchaseProgram('ServerProfiler.exe')

      if (
        ns.getPlayer().money >= 500000 &&
        ns.purchaseProgram('DeepscanV1.exe') == false
      )
        ns.purchaseProgram('DeepscanV1.exe')

      if (
        ns.getPlayer().money >= 25000000 &&
        ns.purchaseProgram('DeepscanV2.exe') == false
      )
        ns.purchaseProgram('DeepscanV2.exe')

      if (
        ns.getPlayer().money >= 1000000 &&
        ns.purchaseProgram('AutoLink.exe') == false
      )
        ns.purchaseProgram('AutoLink.exe')

      if (
        ns.getPlayer().money >= 500000000000 &&
        ns.purchaseProgram('Formulas.exe') == false
      ) {
        ns.purchaseProgram('Formulas.exe')
        fin = 1
      }
    }

    await ns.asleep(1000)
  }
}
