/** @param {import("..").NS } ns */
export async function main (ns) {
  let target = ns.args[0]
  let threadsNeededToWeakenFromHack = ns.args[1]
  let threadsNeededToHack = ns.args[2]
  let timeForWeaken = ns.args[3]
  let timeForHack = ns.args[4]

  // step delay can likely be modified; just be careful with it
  let stepDelay = 3000

  // the amound of time to sleep before starting the hack threads
  // designed by default to have hack finish approximately 3s before weaken
  let timeForHackWeakenSleep = timeForWeaken - timeForHack - stepDelay

  // here we use "hack" as a discrimination variable so the grow-scheduler
  // can also run its own weaken threads
  ns.run('weaken-target.js', threadsNeededToWeakenFromHack, target, 'hack')
  await ns.sleep(timeForHackWeakenSleep)
  ns.run('hack-target.js', threadsNeededToHack, target)
  await ns.sleep(stepDelay)
}