"use client";

const today = new Date();
const hour = today.getHours();
const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const stats = [
  {
    label: "Total Customers",
    value: "48",
    sub: "+3 new this month",
    warn: false,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    label: "QR-Tagged Rugs",
    value: "61",
    sub: "78% of customers tagged",
    warn: false,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  },
  {
    label: "Rebook Rate",
    value: "64%",
    sub: "+8% vs last quarter",
    warn: false,
    positive: true,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  },
  {
    label: "Jobs This Month",
    value: "12",
    sub: "3 unconfirmed",
    warn: true,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
];

const activity = [
  { initials: "SL", name: "Sarah L.", action: "QR Scan", time: "2 min ago", type: "qr" },
  { initials: "MR", name: "Marcus R.", action: "Rebooked", time: "1h ago", type: "rebook" },
  { initials: "JP", name: "Jane P.", action: "New Customer", time: "3h ago", type: "new" },
  { initials: "TK", name: "Tom K.", action: "QR Scan", time: "Yesterday", type: "qr" },
];

const tagColors: Record<string, { bg: string; color: string }> = {
  qr:     { bg: "#eaf4d2", color: "#2b5525" },
  rebook: { bg: "#d4ecb0", color: "#2b5525" },
  new:    { bg: "rgba(43,85,37,0.1)", color: "#4b7a45" },
};

const rugCoverage = [
  { label: "Area Rugs",          pct: 82, color: "#2b5525" },
  { label: "Runners",            pct: 67, color: "#4b7a45" },
  { label: "Orientals",          pct: 45, color: "#6b7280" },
  { label: "Outdoor / Synthetic",pct: 30, color: "#9ca3af" },
];

const jobs = [
  { date: "May 14", name: "Sarah L.",  rugs: 2, method: "QR Booked",      pending: false },
  { date: "May 15", name: "Marcus R.", rugs: 1, method: "Phone Booked",    pending: false },
  { date: "May 16", name: "Jane P.",   rugs: 3, method: "Pending Confirm", pending: true  },
  { date: "May 17", name: "Tom K.",    rugs: 2, method: "QR Booked",       pending: false },
  { date: "May 18", name: "Anna S.",   rugs: 1, method: "Pending Confirm", pending: true  },
  { date: "May 19", name: "David M.",  rugs: 2, method: "Phone Booked",    pending: false },
];

const WARN = "#d97706";

export default function Dashboard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
        @media (max-width: 640px) {
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .panel-grid { grid-template-columns: 1fr !important; }
          .jobs-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* GREETING */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "24px 28px", marginBottom: "16px" }}>
          <div style={{ fontSize: "22px", fontWeight: 600, color: "#070e06", marginBottom: "4px" }}>{greeting}, Master Cleaners</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 400 }}>{dateStr} &nbsp;·&nbsp; 3 jobs scheduled this week &nbsp;·&nbsp; 2 pending confirmation</div>
        </div>

        {/* STAT CARDS */}
        <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "10px", marginBottom: "16px" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "#eaf4d2", border: "0.5px solid rgba(0,0,0,0.06)", borderRadius: "10px", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280" }}>{s.label}</div>
                <div style={{ color: "#2b5525", opacity: 0.5 }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: "26px", fontWeight: 600, color: "#070e06", lineHeight: 1, marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "10px", color: s.warn ? WARN : s.positive ? "#2b5525" : "#9ca3af", fontWeight: s.warn || s.positive ? 500 : 400 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ACTIVITY + COVERAGE */}
        <div className="panel-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>

          {/* RECENT ACTIVITY */}
          <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "16px" }}>Recent Activity</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {activity.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < activity.length - 1 ? "0.5px solid rgba(0,0,0,0.06)" : "none" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eaf4d2", border: "0.5px solid rgba(43,85,37,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#2b5525" }}>{a.initials}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 500, color: "#070e06" }}>{a.name}</div>
                    <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "1px" }}>{a.time}</div>
                  </div>
                  <div style={{ background: tagColors[a.type].bg, color: tagColors[a.type].color, fontSize: "9px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{a.action}</div>
                </div>
              ))}
            </div>
          </div>

          {/* QR TAG COVERAGE */}
          <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "16px" }}>QR Tag Coverage by Rug Type</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {rugCoverage.map((r) => (
                <div key={r.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#070e06", fontWeight: 400 }}>{r.label}</span>
                    <span style={{ fontSize: "11px", color: r.color, fontWeight: 600 }}>{r.pct}%</span>
                  </div>
                  <div style={{ height: "5px", background: "rgba(0,0,0,0.06)", borderRadius: "3px" }}>
                    <div style={{ height: "5px", background: r.color, borderRadius: "3px", width: `${r.pct}%`, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* UPCOMING JOBS */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "16px" }}>Upcoming Jobs</div>
          <div className="jobs-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {jobs.map((j, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", border: `0.5px solid ${j.pending ? WARN : "rgba(0,0,0,0.08)"}`, borderRadius: "8px", background: j.pending ? "rgba(217,119,6,0.04)" : "#eaf4d2" }}>
                <div style={{ background: j.pending ? WARN : "#2b5525", borderRadius: "6px", padding: "5px 8px", flexShrink: 0, textAlign: "center", minWidth: "46px" }}>
                  <div style={{ fontSize: "9px", fontWeight: 600, color: "white", letterSpacing: "0.04em" }}>{j.date}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "#070e06" }}>{j.name}</div>
                  <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "1px" }}>{j.rugs} rug{j.rugs !== 1 ? "s" : ""}</div>
                </div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: j.pending ? WARN : "#2b5525", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{j.method}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
