"use client";
import { useState } from "react";

const dateRanges = ["Last 7 days", "Last 30 days", "This month", "All time"];

const metrics = [
  {
    label: "Total scans",
    value: null,
    sub: "All time",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
  {
    label: "Leads captured",
    value: null,
    sub: "Emails collected",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    label: "Conversion rate",
    value: null,
    sub: "Scan → email",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: "Conversions",
    value: null,
    sub: "Via tag scan",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    label: "New visitors",
    value: null,
    sub: "First-time scanners",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    label: "Returning visitors",
    value: null,
    sub: "Scanned more than once",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
      </svg>
    ),
  },
  {
    label: "Avg. session",
    value: null,
    sub: "Time on tag page",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: "Bounce rate",
    value: null,
    sub: "Left without engaging",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
  },
];

const trafficSources = [
  { label: "NFC scan", pct: null },
  { label: "Direct", pct: null },
  { label: "Social", pct: null },
  { label: "Paid", pct: null },
];

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("All time");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
        button { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: "22px", fontWeight: 600, color: "#070e06", marginBottom: "4px" }}>
              Dashboard
            </h1>
            <p style={{ fontSize: "12px", fontWeight: 400, color: "#9ca3af" }}>
              Add your first NFC tag to start seeing data here.
            </p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: "6px 10px", border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: "6px", background: "white", fontSize: "11px", color: "#374151", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
          >
            {dateRanges.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* METRIC CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "10px", marginBottom: "24px" }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "10px", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af" }}>{m.label}</div>
                <div style={{ color: "#d1d5db" }}>{m.icon}</div>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "26px", fontWeight: 600, color: m.value ? "#070e06" : "#d1d5db", lineHeight: 1, marginBottom: "4px" }}>
                {m.value ?? "—"}
              </div>
              <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 400 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* MAP + LEADS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "16px", marginBottom: "24px" }}>

          <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>Scan geography</div>
              <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 400 }}>No scans yet</div>
            </div>
            <div style={{ height: "280px", background: "#eaf4d2", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", position: "relative", overflow: "hidden" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${(i + 1) * 14}%`, height: "0.5px", background: "rgba(0,0,0,0.04)" }} />
              ))}
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${(i + 1) * 12}%`, width: "0.5px", background: "rgba(0,0,0,0.04)" }} />
              ))}
              <div style={{ zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 400, color: "#6b7280" }}>No scan data yet</div>
                <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 400, textAlign: "center", maxWidth: "200px", lineHeight: 1.6 }}>Scan locations will appear here once users start engaging with your tags</div>
              </div>
            </div>
          </div>

          <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>Recent leads</div>
              <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 400 }}>0 total</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "32px 0" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 400, color: "#6b7280" }}>No leads yet</div>
              <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 400, textAlign: "center", lineHeight: 1.6, maxWidth: "180px" }}>Leads captured from tag scans will appear here in real time</div>
            </div>
          </div>

        </div>

        {/* TRAFFIC + ENGAGEMENT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>

          <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "16px" }}>Traffic sources</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {trafficSources.map((src) => (
                <div key={src.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "12px", color: "#070e06", fontWeight: 400 }}>{src.label}</span>
                    <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 400 }}>—</span>
                  </div>
                  <div style={{ height: "4px", background: "#f3f4f6", borderRadius: "2px" }}>
                    <div style={{ height: "4px", background: "#d1d5db", borderRadius: "2px", width: "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "16px" }}>Engagement</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { label: "Page views", val: "—", sub: "Total tag page loads" },
                { label: "Avg. session duration", val: "—", sub: "Time spent on experience" },
                { label: "Bounce rate", val: "—", sub: "Left without interacting" },
                { label: "Conversion rate", val: "—", sub: "Scan → email captured" },
              ].map((item, i, arr) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < arr.length - 1 ? "0.5px solid rgba(0,0,0,0.06)" : "none" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 400, color: "#070e06" }}>{item.label}</div>
                    <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 400, marginTop: "1px" }}>{item.sub}</div>
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: 300, color: "#d1d5db" }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* GETTING STARTED */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", padding: "24px" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "16px" }}>Get started</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[
              { step: "01", title: "Create your first tag", desc: "Choose an item, pick an experience type, and generate your NFC URL.", action: "Go to Tag Manager", href: "/portal/tags", done: false },
              { step: "02", title: "Preview the experience", desc: "Scan the QR code to preview what users see when they tap your tag.", action: "Preview", href: "/portal/tags", done: false },
              { step: "03", title: "Go live", desc: "Publish your tag and program your physical NFC tag with the generated URL.", action: "View settings", href: "/portal/settings", done: false },
            ].map((item) => (
              <div key={item.step} style={{ background: "#eaf4d2", borderRadius: "8px", padding: "16px" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "24px", fontWeight: 700, color: "rgba(43,85,37,0.12)", lineHeight: 1, marginBottom: "8px" }}>{item.step}</div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#070e06", marginBottom: "4px" }}>{item.title}</div>
                <div style={{ fontSize: "11px", fontWeight: 400, color: "#9ca3af", lineHeight: 1.6, marginBottom: "12px" }}>{item.desc}</div>
                <a href={item.href} style={{ display: "inline-block", padding: "7px 14px", border: "0.5px solid #2b5525", borderRadius: "4px", background: "transparent", fontSize: "10px", color: "#2b5525", cursor: "pointer", letterSpacing: "0.04em", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>{item.action}</a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
