/** @param {import("..").NS } ns */
export async function main (ns) {
  if (ns.stanek.activeFragments().length == 0) return
  while (1) {
    for (let f of ns.stanek.activeFragments()) await ns.stanek.charge(f.x, f.y)
  }
}
