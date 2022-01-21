# Downloading the whole repository

If you manually `nano git-pull.js` from the terminal and copy the [contents of that script](https://raw.githubusercontent.com/alainbryden/bitburner-scripts/main/git-pull.js), you should be able to run it once and download the rest of the files I use. Early-game, many will be useless because they are only enabled by late-game features, but they shouldn't give you too many problems just being there.

## Customizations

I encourage you to make a fork and customize scripts to your own needs / liking. Please don't make a PR back to me unless you truly think it's something all would benefit from. If you fork the repository, you can update `git-pull.js` to include your github account as the default.

# Running scripts

Scripts can mostly be run on their own, but are primarily designed to be orchestrated by `daemon.js`. If you `run daemon.js` from the terminal, it will start several other scripts.

## Customizing
Near the top of the main method, there are a list of scripts that are spanwed initially, and periodically. Some may be commented out (for example host-manager, I like to manually manage when servers are bought lately - but you may wish to re-enable this.) Once you've downloaded this file, you should customize it with the default options you like, and comment out the external scripts you don't want to run.

## Alias

You may find it useful to set up an alias with the default options you like rather than editing the file itself. I personally use:

`alias start="run daemon.js -v --tail --stock-manipulation"`

This way I can just enter `start` in the terminal after each reset, and the rest is handled automatically.

other aliases i use:

open ports and install backdoor
`alias root="run BruteSSH.exe; run FTPCrack.exe; run relaySMTP.exe; run HTTPworm.exe; run SQLInject.exe; run NUKE.exe; backdoor"`

rebuy everything after restart
`alias rebuy="buy BruteSSH.exe; buy FTPCrack.exe; buy relaySMTP.exe; buy HTTPWorm.exe; buy SQLInject.exe; buy ServerProfiler.exe; buy DeepscanV1.exe; buy DeepscanV2.exe; buy AutoLink.exe; buy Formulas.exe"`

start with XP Focus
`alias startxp="run daemon.js -v -x --tail --stock-manipulation --silent-misfires"`

"Broker" if farming with OP
`alias stock="run stockmaster.js --show-market-summary"`

starts worker if farming with OP
`alias work="run work-for-factions.js --fast-crimes-only --no-coding-contracts"`

option to sell hashes as soon as possible
`alias hash="run spend-hacknet-hashes.js -l"`

sell Stocks before restarting!
`alias sell="run stockmaster.js --liquidate"`

invites to Factions preffered
`alias invites="run work-for-factions.js --invites-only --fast-crimes-only --no-coding-contracts"`

start OP.js from home folder
`alias op="cd /OP/; run OP.js megacorp --tail"`

finds good targets and opens OP folder
`alias anal="cd home; run analyze-hack.js; cd OP"`

serverlist
`alias scan="run scan.js"`

open "dev" console for debugging/testing
`alias dev="run dev.js"`

# Disclaimer

This is my own repository of scripts for playing Bitburner.
I often go to some lengths to make them generic and customizable, but am by no means providing these scripts as a "service" to the bitburner community.
It's meant as an easy way for me to share code with friends, and track changes and bugs in my scripts.

- If you wish to use my scripts or copy from them, feel free!
- If you think you found a bug in them and want to let me know, awesome!
- Please don't be insulted if you make a feature request, bug report, or pull request that I decline to act on.
While I do like my work to be helpful to others and re-used, I am only willing to put so much effort into customizing it to others' specific needs or whims.
You should fork the code, and start tweaking it the way you want it to behave. That's more in the spirit of the game!

Hit up the Bitburner Discord with any questions: https://discord.gg/Wjrs92b3
Many helpful folks in there are familiar with my scripts or ones similar to them and can address your questions and concerns far quicker than I can.


# Edit:

Credit goes to u/__Aimbot__ on Reddit from this Post https://www.reddit.com/r/Bitburner/comments/rm48o1/the_best_hacking_approach_ive_seen_so_far/
and on alainbryden https://github.com/alainbryden/bitburner-scripts for their great scripts!

1. u need at least 4TB Ram (more is better!) and `Formulas.exe` for this to work!
2. go to Options and set Netscript exec time to 5ms!!!
3. kill the daemon.js and the other helpers u can run stats.js, work-for-factions.js, host-manager.js etc.
4. `run analyze-hack.js --tail` to determine the server u want to milk. (phantasy, the-hub, are usually good targets midgame when megacorp is later on)
5. to start go in the /OP/ folder and type `run OP.js Servername --tail`
6. Profit!
