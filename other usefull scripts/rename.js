/** @param {import("..").NS } ns */
export async function main (ns) {
  let files = ns.ls('home', '.ns')
  for (let file of files) {
    let newFileName = file.substring(0, file.length - 2) + 'js'
    let contents = await ns.read(file)
    await ns.write(newFileName, contents)
    ns.rm(file)
    ns.tprint("INFO: file '" + file + "' was renamed to '" + newFileName + "'")
  }
}
