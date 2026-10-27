import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Antenna, CheckCircle2, Crosshair, Globe2, Radar, Shield, ShieldCheck, Signal, UserRound, X } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

type Threat = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "FRIENDLY";
type Drone = { id: string; model: string; location: string; region: string; lat: number; lon: number; altitude: number; speed: number; threat: Threat; alerts: number; angle: number };

const initialDrones: Drone[] = [
  { id: "UAV-104", model: "Quadrotor X4", location: "Bengaluru, India", region: "ASIA", lat: 48, lon: 38, altitude: 120, speed: 42, threat: "CRITICAL", alerts: 3, angle: 12 },
  { id: "UAV-218", model: "Fixed-Wing Scout", location: "London, United Kingdom", region: "EUROPE", lat: 34, lon: 26, altitude: 210, speed: 56, threat: "HIGH", alerts: 2, angle: 104 },
  { id: "UAV-309", model: "Micro UAV", location: "Washington, USA", region: "NORTH AMERICA", lat: 24, lon: 45, altitude: 85, speed: 28, threat: "MEDIUM", alerts: 1, angle: 192 },
  { id: "UAV-412", model: "Survey Drone", location: "Tokyo, Japan", region: "ASIA", lat: 76, lon: 35, altitude: 95, speed: 34, threat: "LOW", alerts: 0, angle: 256 },
  { id: "UAV-527", model: "Cargo Multirotor", location: "Dubai, UAE", region: "MIDDLE EAST", lat: 57, lon: 51, altitude: 160, speed: 47, threat: "MEDIUM", alerts: 1, angle: 318 },
  { id: "UAV-633", model: "Recon UAV", location: "Sydney, Australia", region: "OCEANIA", lat: 83, lon: 72, altitude: 130, speed: 39, threat: "HIGH", alerts: 2, angle: 72 },
];

function Home() {
  const [operator, setOperator] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SENTINEL OPERATOR");
  const [signedIn, setSignedIn] = useState(false);
  const [drones, setDrones] = useState(initialDrones);
  const [selectedId, setSelectedId] = useState("UAV-104");
  const [notice, setNotice] = useState("Simulation ready. Awaiting operator action.");
  const [lastAction, setLastAction] = useState("No action recorded");
  const [clock, setClock] = useState("00:00:00");

  useEffect(() => {
    const update = () => setClock(new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" }) + " UTC");
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const selected = drones.find((drone) => drone.id === selectedId) ?? drones[0];
  const criticalCount = drones.filter((drone) => drone.threat === "CRITICAL").length;
  const alertState = criticalCount > 0 ? "CRITICAL" : "NORMAL";
  const threatCounts = useMemo(() => ({
    total: drones.length,
    high: drones.filter((d) => d.threat === "HIGH" || d.threat === "CRITICAL").length,
    medium: drones.filter((d) => d.threat === "MEDIUM").length,
    low: drones.filter((d) => d.threat === "LOW" || d.threat === "FRIENDLY").length,
  }), [drones]);

  function acknowledge(action: "JAM RF" | "NEUTRALIZE" | "FRIENDLY") {
    const current = drones.find((d) => d.id === selectedId);
    if (!current) return;
    const temporaryThreat: Threat = action === "FRIENDLY" ? "FRIENDLY" : action === "JAM RF" ? "MEDIUM" : "LOW";
    setDrones((all) => all.map((d) => d.id === selectedId ? { ...d, threat: temporaryThreat, alerts: action === "FRIENDLY" ? d.alerts : d.alerts + 1 } : d));
    const message = action === "FRIENDLY"
      ? selectedId + " marked FRIENDLY. Critical alert cleared for this target."
      : action === "JAM RF"
        ? "Simulated RF-jam acknowledgement recorded for " + selectedId + "."
        : "Simulated neutralization acknowledgement recorded for " + selectedId + ".";
    setNotice(message);
    setLastAction(action + " · " + selectedId);
    if (action !== "FRIENDLY") {
      window.setTimeout(() => {
        setDrones((all) => all.map((d) => d.id === selectedId && d.threat !== "FRIENDLY" ? { ...d, threat: "MEDIUM" } : d));
        setNotice(selectedId + " returned to MEDIUM in the simulation.");
      }, 5000);
    }
  }

  if (!signedIn) {
    return (
      <main className="login-screen">
        <div className="login-grid" />
        <section className="login-card">
          <div className="brand-mark"><Radar size={28} /><span>AEGIS <b>//</b> C-UAS</span></div>
          <p className="eyebrow">COUNTER-UNMANNED AIRCRAFT SYSTEM</p>
          <h1>Command access</h1>
          <p className="muted">Sign in to open the simulated operations console.</p>
          <form onSubmit={(event) => { event.preventDefault(); if (operator.trim().length < 3 || password.length < 6) { setNotice("Use an Operator ID with 3+ characters and password with 6+ characters."); return; } setSignedIn(true); setNotice("Operator session started in simulation mode."); }}>
            <label>OPERATOR ID<input value={operator} onChange={(e) => setOperator(e.target.value)} placeholder="Enter operator ID" autoComplete="username" required /></label>
            <label>PASSWORD<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" required /></label>
            <label>ACCESS ROLE<select value={role} onChange={(e) => setRole(e.target.value)}><option>SENTINEL OPERATOR</option><option>MISSION COMMANDER</option><option>ANALYST</option></select></label>
            {notice.includes("Use an Operator") && <p className="form-error">{notice}</p>}
            <button className="primary-btn full-btn" type="submit">AUTHENTICATE <span>→</span></button>
          </form>
          <div className="login-foot"><ShieldCheck size={15} /> Academic demonstration · simulated access only</div>
        </section>
        <div className="login-version">AEGIS CONSOLE / BUILD 1.0.0</div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark small"><div className="brand-icon"><Radar size={21} /></div><span>AEGIS <b>//</b> C-UAS</span></div>
        <div className="topbar-center"><span className="live-dot" /> SIMULATION ACTIVE <span className="top-divider">/</span> GLOBAL SENSOR NETWORK</div>
        <div className="topbar-right"><span className="clock">{clock}</span><button className="operator-chip" onClick={() => setSignedIn(false)} title="Sign out"><UserRound size={15} /> {operator || "Operator"} <X size={13} /></button></div>
      </header>
      <div className="dashboard">
        <aside className="sidebar">
          <div className="side-label">COMMAND</div>
          <div className="side-item active"><Crosshair size={17} /> Operations overview</div>
          <div className="side-item"><Globe2 size={17} /> Global surveillance <span className="side-count">{drones.length}</span></div>
          <div className="side-item"><Signal size={17} /> Signal analysis</div>
          <div className="side-label second">SYSTEM</div>
          <div className="side-item"><Activity size={17} /> Event history</div>
          <div className="side-item"><Shield size={17} /> Access control</div>
          <div className="sidebar-bottom"><div className="connection-status"><span className="live-dot" /> SIMULATION ONLINE</div><p>Training environment. No live sensor connection.</p></div>
        </aside>
        <section className="main-content">
          <div className="page-heading"><div><p className="eyebrow">OPERATIONS / OVERVIEW</p><h1>Threat management <span>console</span></h1><p className="muted">Global simulated target monitoring and status acknowledgement.</p></div><div className={"alert-pill " + (alertState === "CRITICAL" ? "critical" : "normal")}><span className="alert-light" /><div><small>GLOBAL ALERT</small><strong>{alertState}</strong></div>{alertState === "CRITICAL" ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}</div></div>
          <div className="stat-grid">
            <Stat label="TRACKED TARGETS" value={String(threatCounts.total).padStart(2, "0")} detail="Across 6 regions" icon={<Radar size={18} />} />
            <Stat label="HIGH / CRITICAL" value={String(threatCounts.high).padStart(2, "0")} detail="Requires attention" icon={<AlertTriangle size={18} />} accent="red" />
            <Stat label="MEDIUM THREAT" value={String(threatCounts.medium).padStart(2, "0")} detail="Monitoring" icon={<Activity size={18} />} accent="amber" />
            <Stat label="LOW / FRIENDLY" value={String(threatCounts.low).padStart(2, "0")} detail="Nominal status" icon={<ShieldCheck size={18} />} accent="green" />
          </div>
          <div className="content-grid">
            <section className="panel map-panel">
              <div className="panel-header"><div><span className="section-kicker">LIVE PICTURE</span><h2>Global target map</h2></div><span className="panel-tag"><span className="live-dot" /> SIMULATED FEED</span></div>
              <div className="map-view">
                <div className="map-gridlines" />
                <svg className="world-map" viewBox="0 0 800 390" role="img" aria-label="Stylized world map with simulated target markers">
                  <path d="M75 86 L108 49 155 39 180 56 215 51 238 79 226 107 197 119 186 151 156 158 144 190 115 178 103 148 78 133 65 106Z M185 194 L211 204 226 233 220 265 237 294 223 337 201 322 189 282 173 251 162 218Z M318 81 L354 58 399 65 424 86 459 77 484 95 478 117 443 126 428 153 393 147 378 174 350 157 336 126 313 114Z M365 174 L405 160 437 176 450 212 430 245 416 282 392 309 374 280 367 244 346 213Z M488 85 L529 61 583 66 617 89 655 87 697 112 718 139 699 158 661 147 637 165 606 151 580 173 557 145 526 138 511 113Z M583 186 L614 194 633 217 619 248 590 257 574 229Z M679 280 L711 268 735 286 722 308 690 307Z" />
                  {drones.map((drone) => <g key={drone.id} transform={"translate(" + (drone.lat * 7.1 + 35) + " " + (drone.lon * 3.25 + 20) + ")"} onClick={() => setSelectedId(drone.id)} className="map-target" role="button" tabIndex={0} aria-label={"Select " + drone.id}>
                    <circle r={drone.id === selectedId ? 17 : 12} className={"target-halo " + threatClass(drone.threat)} />
                    <circle r="4.5" className={"target-dot " + threatClass(drone.threat)} />
                    {drone.id === selectedId && <text x="14" y="-12">{drone.id}</text>}
                  </g>)}
                </svg>
                <div className="map-coordinates">GLOBAL VIEW / WGS-84 <span>RANGE: 3.0 KM</span></div>
                <div className="map-legend"><span><i className="legend-dot red" /> Critical / High</span><span><i className="legend-dot amber" /> Medium</span><span><i className="legend-dot green" /> Low / Friendly</span></div>
              </div>
              <div className="map-footer"><span><span className="live-dot" /> {drones.length} simulated tracks</span><span>POSITION DATA: SIMULATED</span></div>
            </section>
            <section className="panel target-panel">
              <div className="panel-header"><div><span className="section-kicker">TRACK MANAGEMENT</span><h2>Detected targets</h2></div><span className="count-tag">{drones.length} TRACKS</span></div>
              <div className="target-list">{drones.map((drone) => <button key={drone.id} className={"target-row " + (drone.id === selectedId ? "selected" : "")} onClick={() => setSelectedId(drone.id)}><span className={"target-symbol " + threatClass(drone.threat)}><Crosshair size={16} /></span><span className="target-copy"><strong>{drone.id}</strong><small>{drone.location}</small></span><span className={"threat-tag " + threatClass(drone.threat)}>{drone.threat}</span></button>)}</div>
              <div className="target-list-foot">Select a target to inspect details and log a simulated action.</div>
            </section>
          </div>
          <div className="bottom-grid">
            <section className="panel detail-panel"><div className="panel-header"><div><span className="section-kicker">SELECTED TRACK</span><h2>Target details</h2></div><span className={"threat-tag " + threatClass(selected.threat)}>{selected.threat}</span></div><div className="selected-title"><div className="selected-icon"><Crosshair size={23} /></div><div><h3>{selected.id}</h3><p>{selected.model} <span>·</span> {selected.region}</p></div></div><div className="detail-grid"><Detail label="LOCATION" value={selected.location} /><Detail label="ALTITUDE" value={selected.altitude + " m"} /><Detail label="SPEED" value={selected.speed + " km/h"} /><Detail label="PRIOR ALERT COUNT" value={String(selected.alerts).padStart(2, "0")} /></div><div className="action-title">SIMULATED ACTION ACKNOWLEDGEMENT</div><div className="action-buttons"><button className="action-btn jam" onClick={() => acknowledge("JAM RF")}><Antenna size={16} /> JAM RF</button><button className="action-btn neutralize" onClick={() => acknowledge("NEUTRALIZE")}><Crosshair size={16} /> NEUTRALIZE</button><button className="action-btn friendly" onClick={() => acknowledge("FRIENDLY")}><ShieldCheck size={16} /> FRIENDLY</button></div><p className="action-note">Actions update simulated records only. No physical system is controlled.</p></section>
            <section className="panel history-panel"><div className="panel-header"><div><span className="section-kicker">OPERATOR LOG</span><h2>Recent acknowledgement</h2></div><Activity size={18} className="muted-icon" /></div><div className="log-entry"><span className="log-icon"><CheckCircle2 size={17} /></span><div><strong>{lastAction}</strong><p>{notice}</p></div></div><div className="history-stat"><span>SELECTED TARGET</span><strong>{selected.id}</strong></div><div className="history-stat"><span>PRIOR ALERT COUNT</span><strong>{String(selected.alerts).padStart(2, "0")}</strong></div><div className="history-stat"><span>CURRENT THREAT</span><strong className={"text-" + threatClass(selected.threat)}>{selected.threat}</strong></div><div className="system-note"><ShieldCheck size={16} /><p>Academic prototype: all locations and target records are simulated, not live sensor readings or real drone tracking.</p></div></section>
          </div>
          <footer className="page-footer"><span>AEGIS C-UAS · ACADEMIC SIMULATION</span><span>ROLE: {role} <i /> {clock}</span></footer>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, detail, icon, accent = "" }: { label: string; value: string; detail: string; icon: React.ReactNode; accent?: string }) {
  return <div className={"stat-card " + accent}><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></div>;
}
function Detail({ label, value }: { label: string; value: string }) {
  return <div className="detail-item"><span>{label}</span><strong>{value}</strong></div>;
}
function threatClass(threat: Threat) {
  if (threat === "CRITICAL" || threat === "HIGH") return "red";
  if (threat === "MEDIUM") return "amber";
  return "green";
}
