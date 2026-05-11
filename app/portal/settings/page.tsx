"use client";
import { useState } from "react";

export default function Settings() {
  const [accountName, setAccountName] = useState("Demo Account");
  const [domain, setDomain] = useState("yourapp.com");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
        input, select { font-family: 'Inter', sans-serif; }
        input:focus, select:focus { outline: none; border-color: #2b5525 !important; }
      `}</style>

      <div style={{ padding: "24px", maxWidth: "720px", margin: "0 auto" }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#070e06", marginBottom: "4px" }}>Settings</h1>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>Manage your account and portal configuration.</p>
        </div>

        {/* ACCOUNT */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
          <div style={{ padding: "16px 20px", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>Account</div>
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Account name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                style={{ width: "100%", maxWidth: "360px", padding: "8px 12px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "6px", fontSize: "13px", color: "#070e06" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Tag base domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ width: "100%", maxWidth: "360px", padding: "8px 12px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "6px", fontSize: "13px", color: "#070e06" }}
              />
              <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "4px" }}>Used to construct tap URLs: {domain}/tap/&lt;slug&gt;</div>
            </div>
            <div>
              <button style={{ padding: "8px 18px", background: "#2b5525", color: "white", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                Save changes
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
          <div style={{ padding: "16px 20px", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>Notifications</div>
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { label: "New lead alerts", sub: "Get an email when someone submits via a tag", value: emailNotifs, set: setEmailNotifs },
              { label: "Weekly summary report", sub: "Receive a weekly digest of tag activity", value: weeklyReport, set: setWeeklyReport },
            ].map((item, i, arr) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < arr.length - 1 ? "0.5px solid rgba(0,0,0,0.06)" : "none" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 400, color: "#070e06" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{item.sub}</div>
                </div>
                <div
                  onClick={() => item.set(!item.value)}
                  style={{ width: "36px", height: "20px", borderRadius: "20px", background: item.value ? "#2b5525" : "#e5e7eb", position: "relative", cursor: "pointer", transition: "background 0.15s", flexShrink: 0 }}
                >
                  <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: item.value ? "auto" : "2px", right: item.value ? "2px" : "auto", transition: "all 0.15s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DANGER ZONE */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>Danger zone</div>
          </div>
          <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 400, color: "#070e06" }}>Delete all tags</div>
              <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>Permanently remove all NFC tags and associated data.</div>
            </div>
            <button style={{ padding: "8px 16px", background: "transparent", color: "#dc2626", border: "0.5px solid #dc2626", borderRadius: "6px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
              Delete all
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
