Introduction:

Weak, Hack, and Grow only affect the server *once they execute*.Time for execution is calculated at *launch of the process*

You can run multiple Weak, Hack, and Grow commands on the same server *in parallel*.

For example, if you've fully weaken and grown your servers first (which you must do for this to work) you could get something like this

WeakenTime = 1 minuteGrowTime = 45 secondHackTime = 15 seconds

You can execute a command to weaken the server, grow the server (with a sleep that is the difference of WeakenTime and GrowTime) and hack (with a sleep that is the difference between WeakenTime and HackTime).

Then you adjust the sleeps by 100-200ms, making sure Hack fires first ( which needs to only take 50% of the funds), then Grow (which needs to grow at least 100% to replace funds hacked) then Weaken which will reset the security level back to the minimum. //adjusted to 75% currently

Then repeat that script every 1 second, and you'll get 50% of the server's maximum money per second. //adjusted to 75% currently

How to use:
1. It appears Bitburner has a setting in the options menu that dictates how long to wait for each script. Default is 25ms. I lowered mine to 5ms and quintupled my output. Not sure if every machine can handle it though
2. Reduce Min Security of target Server to 1 via hashnet hashes
3. Spend Rest in Maximum Money of target Server
4. run OP.js megacorp (u can change target Server)
5. Profit!

Usefull Aliases:

`alias OPS=run stats.js; run work-for-factions.js --fast-crimes-only --no-coding-contracts; run stockmaster.js --show-market-summary; home; run gangs.js; run sleeve.js` - Runs usefull scripts in Background and starts Statsviewer

`alias op=cd /OP/; run OP.js megacorp --tail` - execute OP.js with server megacorp (u can change the target to the server u want to hack)
