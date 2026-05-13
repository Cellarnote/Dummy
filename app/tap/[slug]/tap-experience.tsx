"use client";
import { useState } from "react";

const careIconMap: Record<string, { label: string; icon: React.ReactNode }> = {
  vacuum:   { label: "Vacuum",     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h13l3-6H6L3 12z"/><circle cx="7" cy="17" r="2"/><circle cx="14" cy="17" r="2"/><path d="M3 12v3"/></svg> },
  handwash: { label: "Hand Wash",  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s0 4 4 4 4-4 4-4V9a1 1 0 00-2 0v3"/><path d="M10 12V7a1 1 0 012 0v5"/><path d="M12 12V6a1 1 0 012 0v6"/><path d="M14 11V8a1 1 0 012 0v5c0 3-2 5-4 5"/><path d="M8 14V9a1 1 0 00-2 0v3c0 1 .5 2 2 2z"/></svg> },
  spot:     { label: "Spot Clean", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 2 5 9 5 13a7 7 0 0014 0c0-4-3-11-7-11z"/><path d="M9 13a3 3 0 006 0"/></svg> },
  steam:    { label: "Steam",      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9c0-2 1.5-3 1.5-5"/><path d="M12 9c0-2 1.5-3 1.5-5"/><path d="M18 9c0-2 1.5-3 1.5-5"/><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 16h.01M12 16h.01M17 16h.01"/></svg> },
  airdry:   { label: "Air Dry",    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg> },
  noblech:  { label: "No Bleach",  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l9 12 9-12H3z"/><line x1="4" y1="4" x2="20" y2="20"/></svg> },
};

interface Card {
  id: string;
  carpet_size: string;
  carpet_material: string;
  notes: string;
  care_icons: string[];
  care_details: string;
  service: string;
  service_details: string;
  tap_url: string;
  customers: { first_name: string; last_name: string } | null;
}

export default function TapExperience({ card }: { card: Card }) {
  const [selectedService, setSelectedService] = useState(card.service || "");
  const firstName = card.customers?.first_name ?? "";
  const careIcons: string[] = Array.isArray(card.care_icons) ? card.care_icons : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#eaf4d2", maxWidth: "480px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ background: "#eaf4d2", padding: "32px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#070e06", letterSpacing: "0.08em" }}>MC</div>
          {firstName && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontStyle: "italic", color: "#070e06" }}>Hello,</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 500, color: "#070e06" }}>{firstName}</span>
            </div>
          )}
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "28px", background: "#eaf4d2" }}>

          {/* CARPET */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "14px" }}>~ Carpet ~</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <svg width="220" height="96" viewBox="0 0 220 96" style={{ display: "block", overflow: "hidden" }}>
                <g transform="translate(6, 6) rotate(15, 0, 0)">
                  <rect x="0" y="0" width="290" height="290" rx="28" fill="#d4ecb0" stroke="#2b5525" strokeWidth="3"/>
                  <rect x="12" y="12" width="266" height="266" rx="22" fill="none" stroke="#2b5525" strokeWidth="1.5" strokeOpacity="0.4"/>
                </g>
              </svg>
              <div style={{ textAlign: "center" }}>
                {card.carpet_size && (
                  <div style={{ fontSize: "22px", fontWeight: 600, color: "#070e06", lineHeight: 1, marginBottom: "4px" }}>{card.carpet_size}</div>
                )}
                {card.carpet_material && (
                  <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 400 }}>{card.carpet_material}</div>
                )}
              </div>
            </div>
          </div>

          {/* CARE */}
          {careIcons.length > 0 && (
            <div>
              <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "14px" }}>~ Care ~</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {careIcons.map((key) => {
                  const c = careIconMap[key];
                  if (!c) return null;
                  return (
                    <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "52px", height: "52px", borderRadius: "10px", border: "1px solid #2b5525", background: "#eaf4d2", display: "flex", alignItems: "center", justifyContent: "center", color: "#2b5525" }}>
                        {c.icon}
                      </div>
                      <span style={{ fontSize: "9px", color: "#6b7280", textAlign: "center", lineHeight: 1.3 }}>{c.label}</span>
                    </div>
                  );
                })}
              </div>
              {card.care_details && (
                <div style={{ marginTop: "12px", fontSize: "13px", color: "#6b7280", lineHeight: 1.6, fontWeight: 400 }}>{card.care_details}</div>
              )}
            </div>
          )}

          {/* SERVICES */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "14px" }}>~ Services ~</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(["basic", "deluxe", "premium"] as const).map((key) => {
                const on = selectedService === key;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedService(on ? "" : key)}
                    style={{ padding: "14px 18px", border: `1px solid ${on ? "#2b5525" : "rgba(0,0,0,0.08)"}`, borderRadius: "10px", background: on ? "#eaf4d2" : "white", cursor: "pointer", transition: "all 0.15s" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: on ? "6px" : 0 }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: on ? "#2b5525" : "#070e06", textTransform: "capitalize" }}>{key}</span>
                      {on && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#2b5525" }} />}
                    </div>
                    {on && card.service_details && (
                      <div style={{ fontSize: "12px", color: "#2b5525", lineHeight: 1.5, fontWeight: 400 }}>{card.service_details}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div style={{ padding: "24px", textAlign: "center", borderTop: "0.5px solid rgba(0,0,0,0.1)", background: "#eaf4d2" }}>
          <div style={{ fontSize: "10px", color: "#d1d5db", letterSpacing: "0.06em" }}>MC Service Portal</div>
        </div>

      </div>
    </>
  );
}
