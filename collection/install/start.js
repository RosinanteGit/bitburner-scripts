/** @param {import("..").NS } ns */
export async function main (ns) {
  if (ns.getHostname() !== 'home') {
    throw new Exception('Run the script from home')
  }

  await ns.wget(
    `https://raw.githubusercontent.com/moriakaice/bitburner/master/src/initHacking.ns?ts=${new Date().getTime()}`,
    'initHacking.ns'
  )
  ns.spawn('initHacking.ns', 1)
}
