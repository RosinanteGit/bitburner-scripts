/** @param {import("..").NS } ns */
export async function main (ns) {
  let target = ns.args[0]
  let threadsNeededToWeakenFromGrow = ns.args[1]
  let threadsNeededToGrow = ns.args[2]
  let timeForWeaken = ns.args[3]
  let timeForGrow = ns.args[4]

  // step delay can likely be modified, just be careful with it
  let stepDelay = 3000

  // the amount of time to sleep before starting the grow threads
  // designed by default to have grow finish approximately 3s before weaken
  let timeForGrowWeakenSleep = timeForWeaken - timeForGrow - stepDelay

  // here we use "grow" as a discrimination variable so the hack-scheduler
  // can use its own weaken threads
  ns.run('weaken-target.js', threadsNeededToWeakenFromGrow, target, 'grow')
  await ns.sleep(timeForGrowWeakenSleep)
  ns.run('grow-target.js', threadsNeededToGrow, target)
  await ns.sleep(stepDelay)
}