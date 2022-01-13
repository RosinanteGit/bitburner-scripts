/** @param {import(".").NS } ns */

// GAME CONSTANTS
export var weakenFactorPerThread = 0.053125 // EACH THREAD WEAKENS THE SEC LEVEL BY THIS AMOUNT, PER DOCUMENTATION
export var secLevelIncPerGrowThread = 0.0004 // EACH GROW THREAD RAISES THE SECURITY BY THIS AMOUNT, PER DOCUMENTATION
export var secLevelIncPerHackThread = 0.002 // EACH HACK THREAD RAISES THE SECURITY BY THIS AMOUNT, PER DOCUMENTATION

// FUNCTIONS
// CALC THREAD COUNT NEEDED TO MAKE SERVER HAVE MAX MONEY
export function getMaxGrowThreadCount (ns, target) {
  // DATA CAPTURE FROM TARGET
  if (ns.getServerMaxMoney(target) > 0) {
    // ENSURE WE DON'T GET AN UNDEFINED DIVISION RESULT
    // DIVIDE MAX $ BY CURRENT $ TO FIND THE MULTIPLIER, ADDING 1 TO AVOID DIVIDING BY ZERO
    let growthFactor =
      ns.getServerMaxMoney(target) / (ns.getServerMoneyAvailable(target) + 1) // ADD A 1 TO AVOID DIVISION BY ZERO

    // CALC
    let growThreads = Math.ceil(ns.growthAnalyze(target, growthFactor)) // CALCULATE # OF THREADS NEEDED TO WEAKEN TARGET TO MINIMUM SEC LEVEL

    // RETURN
    return growThreads // RETURNS THREAD COUNT TO GROW MONEY TO MAX
  } else {
    // RETURN AN IMPOSSIBLE VALUE IF THE SERVER HAS NO MONEY HACKABLE (LIKE PERSONAL SERVERS)
    return -1
  } // END IF
} // END FUNC

// CALC THREAD COUNT NEEDED TO TAKE SERVER DOWN TO MIN SEC LEVEL
export function getMaxWeakenThreadCount (ns, target) {
  if (
    ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)
  ) {
    // DATA CAPTURE FROM TARGET
    let currSecLvl = ns.getServerSecurityLevel(target)
    let minSecLvl = ns.getServerMinSecurityLevel(target)

    // CALC
    let weakenThreads = Math.round(
      (currSecLvl - minSecLvl) / weakenFactorPerThread
    )

    // RETURN
    return weakenThreads // RETURNS THREAD COUNTS TO LOWER SEC LVL TO MIN
  } else {
    return 0 // PREVENT AN NaN/UNDEFINED RESULT
  } // END IF
} // END FUNC

// CALC THREAD COUNT NEEDED TO TAKE ALL THE MONEY
export function getMaxHackThreadCount (ns, target) {
  // NO POINT IN HACKING THE SERVER IF THERE'S NO MONEY THERE
  if (ns.getServerMaxMoney(target) > 0) {
    // ENSURE WE DON'T GET AN UNDEFINED DIVISION RESULT
    //CALC
    // hackAnalyze() RETURNS STRAIGHT PERCENTAGE STOLEN VIA ONE THREAD,
    // DIVIDE 100 BY THAT RESULT TO GET TOTAL THREADS NEEDED TO TAKE 100%
    // OF THE MONEY
    let hackThreads = Math.ceil(100 / (100 * ns.hackAnalyze(target)))

    // RETURN
    return hackThreads // RETURNS THREAD COUNT NEEDED TO TAKE ALL THE MONEY
  } else {
    // RETURN AN IMPOSSIBLE VALUE IF THE SERVER HAS NO MONEY HACKABLE
    return 0
  } // END IF
} // END FUNC
