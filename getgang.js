/** @param {NS} ns **/

export async function main (ns) {
  ns.disableLog('ALL') // Logs be gone

  ns.tail() // Open log window

  let murderAttempts = ns.args[0] // How many murders to perform?
  let secsRemaining = murderAttempts * 3 + 3 // Gets total time to perform murders, in seconds. Add three to display full time remaining.

  if (ns.args[0] == null) {
    // Checks for argument for of homicides to perform. Kills script if none is passed
    ns.print('\nArgument required: number of murders to perform.\n')
  }

  if (ns.isBusy() === true) {
    // Kills script if player is doing something else; creating program, faction work, etc.
    ns.print('Busy doing somethine else right now.\n')
  } else {
    for (let i = 0; i < murderAttempts; ++i) {
      // performs requested number of murders

      ns.commitCrime('Homicide') // performs a murder
      ns.print(
        '\nCommitting Homicide: ' + (i + 1) + ' of ' + murderAttempts + '\n'
      )

      secsRemaining = secsRemaining - 3 // Subtract three seconds per loop

      let timeRemaining = ns.nFormat(secsRemaining, '00:00:00') // Converts seconds remaining into HH:MM:SS format
      let murders = ns.getPlayer().numPeopleKilled // Gets number of murders player has committed
      let karma = ns.heart.break() // Gets player karma
      let karmaNeeded = -54000 - karma // Karma needed to unlock gangs minus current player karma

      if (karmaNeeded > 0) {
        // Stops the count of karma and murders needed once -54000 karma is reached.
        karmaNeeded = 0
      }

      let murdersNeeded = Math.abs(Math.ceil(karmaNeeded)) / 3 // Turns negative karma positive and rounds up to next whole number, then divides by karma received per murder

      ns.print('Current karma: ' + Math.floor(karma)) // Rounds karma down to nearest whole number to not come up short
      ns.print('Murders committed: ' + murders) // Homicides committed by player
      ns.print('Karma needed for gang: ' + Math.ceil(karmaNeeded)) // Rounds karma needed up to next whole number to not come up short
      ns.print('Murders needed: ' + Math.ceil(murdersNeeded)) // Murders required to hit -54000 karma

      ns.print('Time Remaing: ' + timeRemaining) // Time remaining for run to finish

      await ns.sleep(3000) // Waits three seconds for homicide to finish, then runs through loop again.

      if (secsRemaining == 3) {
        // Displays no time left after final run of loop
        ns.print('\nTime Remaining: 00:00:00')
      }
    }
  }
}
