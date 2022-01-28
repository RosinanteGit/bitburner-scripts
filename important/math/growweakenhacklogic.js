/* logic part */

var growThreads = Math.round(((4/(GPercent-1))));
var hackThreads = Math.round((50/HPercent));
var uweakenThreads = Math.round((weakenThreads - (growThreads*0.004)));
var totalRamForRun = (hackscriptRam*hackThreads)+(growscriptRam*growThreads)+(weakenscriptRam*weakenThreads)
var sleepTime = (WeakenTime/(maxRam/totalRamForRun))

/* Execution part */

if((runRamTotal>= (maxRam-UsedRam))==false)

ns.exec('/newserver/weaken.script',server2,uweakenThreads,server,wsleep,i); 
ns.exec('/newserver/grow.script',server2,growThreads,server,gsleep,i); 
ns.exec('/newserver/hack.script',server2,hackThreads,server,hsleep,i);

await ns.sleep(sleepTime) i++