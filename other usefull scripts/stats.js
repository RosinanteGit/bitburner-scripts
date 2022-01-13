/** @param {import(".").NS } ns */
export async function main (ns) {
  const hook0 = eval("document.getElementById('overview-extra-hook-0')")
  const hook1 = eval("document.getElementById('overview-extra-hook-1')")
  while (true) {
    try {
      const headers = []
      const values = []
      // Add script income per second
      headers.push('Inc.')
      values.push(ns.nFormat(ns.getScriptIncome()[0], '$0.00a') + '/sec')
      // Add script exp gain rate per second
      headers.push('XP')
      values.push(
        ns.nFormat(ns.getScriptExpGain().toPrecision(5), '0.0a') + '/sec'
      )
      // TODO: Add more neat stuff
      // Now drop it into the placeholder elements
      hook0.innerText = headers.join(' \n')
      hook1.innerText = values.join('\n')
    } catch (err) {
      // This might come in handy later
      ns.print('ERROR: Update Skipped: ' + String(err))
    }
    await ns.sleep(1000)
    ns.atExit(() => {
      hook0.innerHTML = ''
      hook1.innerHTML = ''
    })
  }
}
