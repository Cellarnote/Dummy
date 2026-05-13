"use client";
import { useState } from "react";

const serviceDefaults: Record<string, { basic: string; deluxe: string; premium: string }> = {
  Wool:      { basic: "Dry vacuum & light spot treatment", deluxe: "Hand wash, stain removal & lay-flat dry", premium: "Full hand wash, enzyme treatment, repair & block dry" },
  Silk:      { basic: "Gentle surface dust & spot treat", deluxe: "Specialist hand clean, pH-neutral rinse & air dry", premium: "Full immersion wash, fringe restore, silk-safe protector & flat dry" },
  Nylon:     { basic: "Vacuum & spot clean", deluxe: "Hot water extraction & deodorise", premium: "Deep steam clean, stain guard & express dry" },
  Polyester: { basic: "Vacuum & spot clean", deluxe: "Steam clean & deodorise", premium: "Full steam extraction, stain guard & next-day dry" },
  Cotton:    { basic: "Vacuum & surface spot treat", deluxe: "Gentle machine wash, mild detergent & air dry", premium: "Full wash, colour restore & flat dry" },
  Jute:      { basic: "Dry vacuum & light spot treat", deluxe: "Low-moisture spot clean & air dry", premium: "Full dry clean, reshape & UV protect" },
};

const careIconMap: Record<string, { label: string; icon: React.ReactNode }> = {
  vacuum:   { label: "Vacuum",     icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h13l3-6H6L3 12z"/><circle cx="7" cy="17" r="2"/><circle cx="14" cy="17" r="2"/><path d="M3 12v3"/></svg> },
  handwash: { label: "Hand Wash",  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s0 4 4 4 4-4 4-4V9a1 1 0 00-2 0v3"/><path d="M10 12V7a1 1 0 012 0v5"/><path d="M12 12V6a1 1 0 012 0v6"/><path d="M14 11V8a1 1 0 012 0v5c0 3-2 5-4 5"/><path d="M8 14V9a1 1 0 00-2 0v3c0 1 .5 2 2 2z"/></svg> },
  spot:     { label: "Spot Clean", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 2 5 9 5 13a7 7 0 0014 0c0-4-3-11-7-11z"/><path d="M9 13a3 3 0 006 0"/></svg> },
  steam:    { label: "Steam Clean", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9c0-2 1.5-3 1.5-5"/><path d="M12 9c0-2 1.5-3 1.5-5"/><path d="M18 9c0-2 1.5-3 1.5-5"/><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 16h.01M12 16h.01M17 16h.01"/></svg> },
  airdry:   { label: "Air Dry",    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg> },
  noblech:  { label: "No Bleach",  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l9 12 9-12H3z"/><line x1="4" y1="4" x2="20" y2="20"/></svg> },
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
  const [rescheduled, setRescheduled] = useState(false);
  const [reschedulePrompt, setReschedulePrompt] = useState(false);

  const firstName = card.customers?.first_name ?? "";
  const careIcons: string[] = Array.isArray(card.care_icons) ? card.care_icons : [];

  const n = careIcons.length;
  const careRows =
    n === 0 ? [] :
    n <= 3   ? [careIcons] :
    n <= 4   ? [careIcons.slice(0, 2), careIcons.slice(2)] :
               [careIcons.slice(0, 3), careIcons.slice(3)];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#eaf4d2", maxWidth: "480px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ background: "#eaf4d2", padding: "40px 24px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <img src="/logo.png" alt="Logo" style={{ height: "48px", objectFit: "contain" }} />
          {firstName && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontStyle: "italic", color: "#070e06" }}>Hello,</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 500, color: "#070e06" }}>{firstName}</span>
            </div>
          )}
        </div>

        {/* WELCOME */}
        <div style={{ textAlign: "center", fontSize: "12px", color: "#4b7a45", lineHeight: 1.7, padding: "4px 32px 20px" }}>
          Your Master Cleaners service card — everything your carpet needs for care and maintenance, all in one place.
        </div>

        <div style={{ padding: "4px 24px 40px", display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* CARPET */}
          <div>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(43,85,37,0.9)", marginBottom: "14px", textAlign: "center" }}>Carpet</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <svg width="200" height="88" viewBox="0 0 200 88" style={{ display: "block", overflow: "hidden" }}>
                <g transform="translate(6, 6) rotate(15, 0, 0)">
                  <rect x="0" y="0" width="260" height="260" rx="28" fill="#d4ecb0" stroke="#2b5525" strokeWidth="3"/>
                  <rect x="12" y="12" width="236" height="236" rx="22" fill="none" stroke="#2b5525" strokeWidth="1.5" strokeOpacity="0.4"/>
                </g>
              </svg>
              <div style={{ textAlign: "center" }}>
                {card.carpet_size && (
                  <div style={{ fontSize: "22px", fontWeight: 600, color: "#070e06", lineHeight: 1, marginBottom: "4px" }}>{card.carpet_size}</div>
                )}
                {card.carpet_material && (
                  <div style={{ fontSize: "13px", color: "#4b7a45", fontWeight: 400 }}>{card.carpet_material}</div>
                )}
              </div>
            </div>
          </div>

          {/* CARE */}
          {careIcons.length > 0 && (
            <div>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(43,85,37,0.9)", marginBottom: "14px", textAlign: "center" }}>Care</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {careRows.map((row, ri) => (
                  <div key={ri} style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                    {row.map((key) => {
                      const c = careIconMap[key];
                      if (!c) return null;
                      return (
                        <div key={key} style={{ width: "76px", minHeight: "76px", borderRadius: "12px", border: "1px solid #2b5525", background: "#d4ecb0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#2b5525", padding: "10px 6px", gap: "7px" }}>
                          {c.icon}
                          <span style={{ fontSize: "10px", color: "#2b5525", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>{c.label}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              {card.care_details && (
                <div style={{ marginTop: "14px", fontSize: "12px", color: "#4b7a45", lineHeight: 1.7, textAlign: "center" }}>{card.care_details}</div>
              )}
            </div>
          )}

          {/* SERVICES */}
          <div>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(43,85,37,0.9)", marginBottom: "6px", textAlign: "center" }}>Services</div>
            <div style={{ fontSize: "11px", color: "#4b7a45", textAlign: "center", marginBottom: "14px", lineHeight: 1.5 }}>Select from the options below to schedule our services.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
              {(["basic", "deluxe", "premium"] as const).map((key) => {
                const on = selectedService === key;
                const desc = on && card.service_details
                  ? card.service_details
                  : serviceDefaults[card.carpet_material]?.[key] ?? "";
                return (
                  <div
                    key={key}
                    onClick={() => { setSelectedService(on ? "" : key); setReschedulePrompt(false); }}
                    style={{ padding: "12px 16px", border: `1px solid ${on ? "#2b5525" : "rgba(0,0,0,0.08)"}`, borderRadius: "10px", background: on ? "#eaf4d2" : "white", cursor: "pointer", transition: "all 0.15s" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: desc ? "6px" : 0 }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: on ? "#2b5525" : "#374151", textTransform: "capitalize" }}>{key}</span>
                      {on && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2b5525", flexShrink: 0 }} />}
                    </div>
                    {desc && (
                      <div style={{ fontSize: "11px", color: on ? "#4b7a45" : "#9ca3af", lineHeight: 1.5 }}>{desc}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RESCHEDULE */}
            {rescheduled ? (
              <div style={{ textAlign: "center", padding: "16px 8px" }}>
                <div style={{ position: "relative", textAlign: "center", padding: "16px 0" }}>
                  <span style={{ position: "absolute", top: "-2px", left: "50%",    transform: "translateX(-60%)", fontSize: "16px", color: "#2b5525" }}>✦</span>
                  <span style={{ position: "absolute", top: "0px",  left: "50%",    transform: "translateX(30%)",  fontSize: "8px",  color: "#2b5525" }}>✧</span>
                  <span style={{ position: "absolute", top: "2px",  left: "40px",                                  fontSize: "10px", color: "#2b5525" }}>✧</span>
                  <span style={{ position: "absolute", top: "-4px", right: "40px",                                 fontSize: "13px", color: "#2b5525" }}>✦</span>
                  <span style={{ position: "absolute", bottom: "0px",  left: "50%", transform: "translateX(-80%)", fontSize: "10px", color: "#2b5525" }}>✦</span>
                  <span style={{ position: "absolute", bottom: "-2px", left: "50%", transform: "translateX(20%)",  fontSize: "8px",  color: "#2b5525" }}>✧</span>
                  <span style={{ fontSize: "18px", fontWeight: 600, color: "#2b5525" }}>Carpet Cleaning Awaits!</span>
                </div>
                <div style={{ fontSize: "13px", color: "#4b7a45", marginTop: "8px", lineHeight: 1.6 }}>A Master Cleaners servicer will reach out to you shortly.</div>
              </div>
            ) : (
              <>
                <div
                  onClick={() => { if (selectedService) { setRescheduled(true); setReschedulePrompt(false); } else { setReschedulePrompt(true); } }}
                  style={{ background: "#2b5525", borderRadius: "8px", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "white", letterSpacing: "0.04em" }}>Reschedule Services</span>
                </div>
                {reschedulePrompt && (
                  <div style={{ fontSize: "11px", color: "rgba(43,85,37,0.8)", textAlign: "center", marginTop: "8px", lineHeight: 1.4 }}>
                    Please select a service to complete rescheduling.
                  </div>
                )}
              </>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div style={{ padding: "24px", textAlign: "center", borderTop: "0.5px solid rgba(43,85,37,0.15)", background: "#eaf4d2" }}>
          <div style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.08em" }}>Master Cleaners Service Portal</div>
        </div>

      </div>
    </>
  );
}
