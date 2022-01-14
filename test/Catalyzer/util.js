/** @param {import("..").NS } ns */
export async function getServerNames (ns) {
  let names = []
  getNames(ns, names, 'home')
  return names
}
/** @param {import("..").NS } ns */
async function getNames (ns, list, target) {
  if (list.includes(target)) {
    return
  }
  list.push(target)
  let targets = ns.scan(target)
  for (const target of targets) {
    getNames(ns, list, target)
  }
}
