class PortBuster {
    filename;
    _exec;
    constructor(filename, exec) {
        this.filename = filename;
        this._exec = exec;
    }
    check(ns) {
        return ns.fileExists(this.filename, "home");
    }
    exec(ns, host) {
        this._exec(ns, host);
    }
}
const PORT_BUSTERS = [
    new PortBuster("BruteSSH.exe", (ns, host) => ns.brutessh(host)),
    new PortBuster("FTPCrack.exe", (ns, host) => ns.ftpcrack(host)),
    new PortBuster("relaySMTP.exe", (ns, host) => ns.relaysmtp(host)),
    new PortBuster("HTTPWorm.exe", (ns, host) => ns.httpworm(host)),
    new PortBuster("SQLInject.exe", (ns, host) => ns.sqlinject(host))
];
/**
 * Runs NUKE.exe on the specified host. Uses all available/neccessary port busters (Ex. BruteSSH.exe, FTPCrack.exe, etc.) before doing so.
 * @param ns A Netscript context.
 * @param host The host to be NUKED.
 * @returns Whether or not the host was successfuly nuked.
 */
export function nuke(ns, host) {
    const BUSTERS_AVAIL = PORT_BUSTERS.filter(buster => buster.check(ns));
    if (!ns.serverExists(host)) {
        return false;
    }
    if (ns.hasRootAccess(host)) {
        return false;
    }
    if (ns.getServerNumPortsRequired(host) > BUSTERS_AVAIL.length) {
        return false;
    }
    BUSTERS_AVAIL.forEach(buster => buster.exec(ns, host));
    ns.nuke(host);
    return true;
}
