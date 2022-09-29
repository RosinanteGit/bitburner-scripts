/** @param {import("..").NS } ns */
export async function main (ns) {
  for (let file of ns.ls('home', '/Temp/')) ns.rm(file)
}
