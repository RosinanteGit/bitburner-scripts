/** @param {import("..").NS } ns */
export async function main (ns) {
  let newPercentage = ns.args[0]
  if (!ns.tryWritePort(1, newPercentage)) {
    ns.tprint('Port is full; port write failed!')
  }
}