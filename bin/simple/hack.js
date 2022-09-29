/**
 * A Bitburner script which hacks whatever host is passed as the first argument.
 *
 * Usage: `run /bin/simple/hack.js <target>`
 * @module
 */
/**
 * The main function, called whenever the script is run.
 * @param ns A Netscript context.
 */
export async function main (ns) {
  const TARGET = ns.args[0]
  if (TARGET === undefined) {
    ns.exit()
    return
  }
  await ns.hack(TARGET)
}
