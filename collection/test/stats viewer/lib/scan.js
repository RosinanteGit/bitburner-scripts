/**
 * Deduplicate an array by converting it to a Set and back.
 * @param array The array to be de-duplicated.
 * @returns An array lacking any duplicate elements.
 */
function dedupe (array) {
  return [...new Set(array)]
}
/**
 * A function which returns all available hosts.
 * @param ns A Netscript context.
 * @returns A list of all available hosts.
 */
export function scan (ns) {
  let hosts = ['home']
  let oldHostsLen = 0
  let i = 0
  while (oldHostsLen < hosts.length && i < 9) {
    oldHostsLen = hosts.length
    hosts = dedupe(hosts.flatMap(host => ns.scan(host).concat(hosts)))
  }
  return hosts
}
