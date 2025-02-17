import { getConfig } from '/lib/fs.js'
import { scan } from '/lib/scan.js'
const CONFIG_PATH = '/etc/svc/wsStatsConnector/config.txt'
function getGameState (ns) {
  const HOSTS = scan(ns).map(host => ns.getServer(host))
  const LOCAL_RAM_TOTAL = ns.getServerMaxRam('home')
  const LOCAL_RAM_USED = ns.getServerUsedRam('home')
  const LOCAL_RAM_FREE = LOCAL_RAM_TOTAL - LOCAL_RAM_USED
  const RAM_HOSTS = HOSTS.filter(
    host => host.hasAdminRights && host.hostname !== 'home'
  )
  const REMOTE_RAM_TOTAL = RAM_HOSTS.map(host => host.maxRam).reduce(
    (acc, cur) => acc + cur,
    0
  )
  const REMOTE_RAM_USED = RAM_HOSTS.map(host => host.ramUsed).reduce(
    (acc, cur) => acc + cur,
    0
  )
  const REMOTE_RAM_FREE = REMOTE_RAM_TOTAL - REMOTE_RAM_USED
  return {
    player: ns.getPlayer(),
    ram: {
      local: {
        total: LOCAL_RAM_TOTAL,
        used: LOCAL_RAM_USED,
        free: LOCAL_RAM_FREE
      },
      remote: {
        total: REMOTE_RAM_TOTAL,
        used: REMOTE_RAM_USED,
        free: REMOTE_RAM_FREE
      }
    },
    processes: HOSTS.flatMap(host =>
      ns.ps(host.hostname).map(proc => ({ host: host.hostname, ...proc }))
    )
  }
}
let open = false
export async function main (ns) {
  const config = await getConfig(ns, CONFIG_PATH, {
    serverUrl: 'ws://127.0.0.1:9090/game'
  })
  let ws = new WebSocket(config.serverUrl)
  ws.onopen = () => {
    open = true
    ns.toast(`Connected to stats server at '${config.serverUrl}'.`, 'success')
  }
  ws.onclose = () => {
    open = false
    ns.toast(
      `Closed connection to stats server at '${config.serverUrl}'.`,
      'warning'
    )
    ns.exit()
  }
  ws.onerror = () => {
    ns.toast(
      `Connection error with stats server at '${config.serverUrl}'.`,
      'error'
    )
  }
  while (true) {
    if (open) {
      ws.send(JSON.stringify({ state: getGameState(ns) }))
    }
    await ns.asleep(100)
  }
}
