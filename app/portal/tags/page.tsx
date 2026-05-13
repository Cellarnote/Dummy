"use client";
import { useState, type ReactElement } from "react";
import { supabase } from "@/lib/supabase";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  email: string;
}

const materialDefaults: Record<string, { care: string[]; careDetails: string; services: { basic: string; deluxe: string; premium: string } }> = {
  Wool:      { care: ["handwash", "spot", "airdry", "noblech"], careDetails: "Your carpet is Wool and requires gentle hand washing to preserve its natural fibres. Spot treat stains promptly and always lay flat to air dry. Bleach should never be used as it will damage the wool and cause irreversible shrinkage.", services: { basic: "Dry vacuum & light spot treatment", deluxe: "Hand wash, stain removal & lay-flat dry", premium: "Full hand wash, enzyme treatment, repair & block dry" } },
  Silk:      { care: ["handwash", "spot", "airdry", "noblech"], careDetails: "Your carpet is Silk and requires specialist hand cleaning using pH-neutral products only. Spot treat with care and allow to air dry completely flat. Bleach must never be used — it will permanently damage the delicate silk fibres and cause colour loss.", services: { basic: "Gentle surface dust & spot treat", deluxe: "Specialist hand clean, pH-neutral rinse & air dry", premium: "Full immersion wash, fringe restore, silk-safe protector & flat dry" } },
  Nylon:     { care: ["vacuum", "spot", "steam"],               careDetails: "Your carpet is Nylon and benefits from regular vacuuming to maintain its resilience and appearance. Spot clean stains as they occur to prevent setting. Periodic steam cleaning provides a thorough deep clean and helps neutralise odours.", services: { basic: "Vacuum & spot clean", deluxe: "Hot water extraction & deodorise", premium: "Deep steam clean, stain guard & express dry" } },
  Polyester: { care: ["vacuum", "spot", "steam"],               careDetails: "Your carpet is Polyester and responds well to routine vacuuming and prompt spot treatment. Steam cleaning is recommended periodically to lift embedded dirt, refresh the fibres, and remove odours without causing damage.", services: { basic: "Vacuum & spot clean", deluxe: "Steam clean & deodorise", premium: "Full steam extraction, stain guard & next-day dry" } },
  Cotton:    { care: ["handwash", "vacuum", "airdry"],          careDetails: "Your carpet is Cotton and should be vacuumed regularly to remove surface dirt and debris. When a deeper clean is needed, hand wash gently with a mild detergent and lay flat to air dry to prevent shrinkage or distortion.", services: { basic: "Vacuum & surface spot treat", deluxe: "Gentle machine wash, mild detergent & air dry", premium: "Full wash, colour restore & flat dry" } },
  Jute:      { care: ["vacuum", "spot", "airdry"],              careDetails: "Your carpet is Jute and should be vacuumed regularly to prevent dirt from embedding in its natural plant fibres. Spot clean only when necessary and avoid saturating with water. Always allow to air dry thoroughly to prevent mould or fibre distortion.", services: { basic: "Dry vacuum & light spot treat", deluxe: "Low-moisture spot clean & air dry", premium: "Full dry clean, reshape & UV protect" } },
  Other:     { care: [],                                        careDetails: "", services: { basic: "", deluxe: "", premium: "" } },
};

export default function TagManager() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageFrom, setMessageFrom] = useState("");
  const [carpetSize, setCarpetSize] = useState("");
  const [carpetMaterial, setCarpetMaterial] = useState("");
  const [carpetNotes, setCarpetNotes] = useState("");
  const [careActive, setCareActive] = useState<Set<string>>(new Set());
  const [careDetails, setCareDetails] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");
  const [cardId, setCardId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [tapUrl, setTapUrl] = useState("");
  const [rescheduled, setRescheduled] = useState(false);
  const [reschedulePrompt, setReschedulePrompt] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const sections = { description: true, message: true, rating: true, coupon: true };
  const discountCode = "";
  const discountAmt = "";

  async function handleLastNameChange(value: string) {
    setLastName(value);
    setCustomerId(null);
    if (value.length < 2) {
      setCustomerSearchResults([]);
      setShowCustomerDropdown(false);
      return;
    }
    const { data } = await supabase
      .from("customers")
      .select("id, first_name, last_name, address, phone, email")
      .ilike("last_name", `%${value}%`)
      .limit(5);
    const results = data ?? [];
    setCustomerSearchResults(results);
    setShowCustomerDropdown(results.length > 0);
  }

  function handleCustomerSelect(c: Customer) {
    setFirstName(c.first_name ?? "");
    setLastName(c.last_name ?? "");
    setAddress(c.address ?? "");
    setPhone(c.phone ?? "");
    setEmail(c.email ?? "");
    setCustomerId(c.id);
    setShowCustomerDropdown(false);
    setCustomerSearchResults([]);
    // Pass name directly — state hasn't flushed yet when this runs
    initCard(c.id, c.first_name ?? "", c.last_name ?? "");
  }

  function buildSlug(first: string, last: string, cardId: string) {
    const clean = (s: string) =>
      s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const parts = [clean(last), clean(first)].filter(Boolean);
    parts.push(cardId.slice(0, 8));
    return parts.join("-");
  }

  async function initCard(overrideCid?: string, overrideFirst?: string, overrideLast?: string) {
    if (cardId) return;

    const effectiveFirst = overrideFirst ?? firstName;
    const effectiveLast = overrideLast ?? lastName;

    let cid: string | null | undefined = overrideCid ?? customerId;
    if (!cid) {
      if (!effectiveLast) return;
      const { data: existing } = await supabase
        .from("customers")
        .select("id")
        .ilike("last_name", effectiveLast)
        .limit(1)
        .maybeSingle();

      if (existing) {
        cid = existing.id;
      } else {
        const newCid = crypto.randomUUID();
        await supabase.from("customers").insert({
          id: newCid, first_name: effectiveFirst, last_name: effectiveLast,
          address, phone, email,
        });
        cid = newCid;
      }
      setCustomerId(cid!);
    }

    const newCardId = crypto.randomUUID();
    const slug = buildSlug(effectiveFirst, effectiveLast, newCardId);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "demo-carpetcleaners.vercel.app";
    const url = `https://${appUrl}/tap/${slug}`;
    await supabase.from("cards").insert({
      id: newCardId, slug, customer_id: cid,
      carpet_size: carpetSize, carpet_material: carpetMaterial,
      notes: carpetNotes, care_icons: Array.from(careActive),
      care_details: careDetails, service: selectedService, tap_url: url,
    });
    setCardId(newCardId);
    setTapUrl(url);
  }

  async function updateCard(patch: Record<string, unknown>) {
    if (!cardId) return;
    await supabase.from("cards").update(patch).eq("id", cardId);
  }

  function toggleCare(key: string) {
    setCareActive(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      updateCard({ care_icons: Array.from(n) });
      return n;
    });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
        input, select, textarea, button { font-family: 'Inter', sans-serif; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #2b5525 !important; }
        .phone-preview::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>

        {/* TOOLBAR */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#2b5525", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 500, color: "white", cursor: "pointer", flexShrink: 0, letterSpacing: "0.02em" }}>
            <span style={{ fontSize: "14px", lineHeight: 1 }}>+</span> New Card
          </button>
          <div style={{ flex: 1, position: "relative" }}>
            <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              placeholder="Search Existing Cards"
              style={{ width: "100%", padding: "8px 10px 8px 30px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "6px", background: "white", fontSize: "11px", color: "#374151" }}
            />
          </div>
        </div>

        {/* BUILDER PANEL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "16px", alignItems: "stretch" }}>

            {/* FORM SIDE */}
            <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#2b5525", letterSpacing: "0.04em" }}>Customer</span>
              </div>
              <div style={{ padding: "20px" }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <div style={{ position: "relative" }}>
                  <input
                    value={lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    onBlur={() => { setTimeout(() => setShowCustomerDropdown(false), 150); if (!customerId && !cardId && lastName) initCard(); }}
                    placeholder="Last name"
                    style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", fontSize: "12px", color: "#070e06" }}
                  />
                  {showCustomerDropdown && customerSearchResults.length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 20, background: "white", border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", marginTop: "2px", overflow: "hidden" }}>
                      {customerSearchResults.map((c) => (
                        <div
                          key={c.id}
                          onMouseDown={(e) => { e.preventDefault(); handleCustomerSelect(c); }}
                          style={{ padding: "8px 12px", cursor: "pointer", fontSize: "12px", color: "#070e06", borderBottom: "0.5px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "baseline", gap: "4px" }}
                        >
                          <span style={{ fontWeight: 500 }}>{c.last_name}</span>
                          {c.first_name && <span style={{ color: "#374151" }}>{c.first_name}</span>}
                          {c.email && <span style={{ fontSize: "10px", color: "#9ca3af", marginLeft: "4px" }}>{c.email}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={async () => {
                    if (customerId && firstName) {
                      await supabase.from("customers").update({ first_name: firstName }).eq("id", customerId);
                    }
                  }}
                  placeholder="First name"
                  style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", fontSize: "12px", color: "#070e06" }}
                />
              </div>

              <input value={address} onChange={(e) => setAddress(e.target.value)} onBlur={() => updateCard({ address })} placeholder="Address" style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", fontSize: "12px", color: "#070e06", marginBottom: "10px" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => updateCard({ phone })} placeholder="Phone" style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", fontSize: "12px", color: "#070e06" }} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => updateCard({ email })} placeholder="Email" style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", fontSize: "12px", color: "#070e06" }} />
              </div>


              </div>
              <div style={{ padding: "12px 20px", borderTop: "0.5px solid rgba(0,0,0,0.08)", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#2b5525", letterSpacing: "0.04em" }}>Carpet</span>
              </div>
              <div style={{ padding: "20px" }}>

                {/* SIZE + MATERIAL */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  <select value={carpetSize} onChange={(e) => { setCarpetSize(e.target.value); updateCard({ carpet_size: e.target.value }); }} style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", background: "white", fontSize: "12px", color: carpetSize ? "#070e06" : "#9ca3af", appearance: "none", cursor: "pointer" }}>
                    <option value="" disabled>Size</option>
                    {["2×3", "4×6", "5×7", "6×9", "8×10", "9×12", "10×14", "Custom"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <select value={carpetMaterial} onChange={(e) => {
                      const mat = e.target.value;
                      setCarpetMaterial(mat);
                      const def = materialDefaults[mat];
                      if (def) {
                        setCareActive(new Set(def.care));
                        setCareDetails(def.careDetails);
                        setSelectedService("");
                        setServiceDetails("");
                        updateCard({ carpet_material: mat, care_icons: def.care, care_details: def.careDetails, service: "", service_details: "" });
                      } else {
                        updateCard({ carpet_material: mat });
                      }
                    }} style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", background: "white", fontSize: "12px", color: carpetMaterial ? "#070e06" : "#9ca3af", appearance: "none", cursor: "pointer" }}>
                    <option value="" disabled>Material</option>
                    {["Wool", "Nylon", "Polyester", "Cotton", "Silk", "Jute", "Other"].map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>

{/* NOTES */}
                <textarea value={carpetNotes} onChange={(e) => setCarpetNotes(e.target.value)} onBlur={() => updateCard({ notes: carpetNotes })} placeholder="Notes" style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", background: "white", fontSize: "12px", color: "#070e06", resize: "none", height: "72px", lineHeight: 1.6 }} />

              </div>

              {/* CARE HEADER */}
              <div style={{ padding: "12px 20px", borderTop: "0.5px solid rgba(0,0,0,0.08)", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#2b5525", letterSpacing: "0.04em" }}>Care</span>
              </div>

              <div style={{ padding: "20px" }}>
                {/* CARE ICONS */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  {[
                    { key: "vacuum", label: "Vacuum", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h13l3-6H6L3 12z"/><circle cx="7" cy="17" r="2"/><circle cx="14" cy="17" r="2"/><path d="M3 12v3"/></svg> },
                    { key: "handwash", label: "Hand Wash", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s0 4 4 4 4-4 4-4V9a1 1 0 00-2 0v3"/><path d="M10 12V7a1 1 0 012 0v5"/><path d="M12 12V6a1 1 0 012 0v6"/><path d="M14 11V8a1 1 0 012 0v5c0 3-2 5-4 5"/><path d="M8 14V9a1 1 0 00-2 0v3c0 1 .5 2 2 2z"/><path d="M6 4c0-1 1-2 2-2"/><path d="M10 3c0-1 1-1.5 2-1.5"/></svg> },
                    { key: "spot", label: "Spot Clean", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 2 5 9 5 13a7 7 0 0014 0c0-4-3-11-7-11z"/><path d="M9 13a3 3 0 006 0"/></svg> },
                    { key: "steam", label: "Steam Clean", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9c0-2 1.5-3 1.5-5"/><path d="M12 9c0-2 1.5-3 1.5-5"/><path d="M18 9c0-2 1.5-3 1.5-5"/><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 16h.01M12 16h.01M17 16h.01"/></svg> },
                    { key: "airdry", label: "Air Dry", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg> },
                    { key: "noblech", label: "No Bleach", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l9 12 9-12H3z"/><line x1="4" y1="4" x2="20" y2="20"/></svg> },
                  ].map(({ key, label, icon }) => {
                    const on = careActive.has(key);
                    return (
                      <div key={key} onClick={() => toggleCare(key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "10px", border: `1px solid ${on ? "#2b5525" : "rgba(0,0,0,0.1)"}`, background: on ? "#eaf4d2" : "white", display: "flex", alignItems: "center", justifyContent: "center", color: on ? "#2b5525" : "#9ca3af", transition: "all 0.15s" }}>
                          {icon}
                        </div>
                        <span style={{ fontSize: "9px", color: on ? "#2b5525" : "#9ca3af", fontWeight: on ? 500 : 400, textAlign: "center", lineHeight: 1.3 }}>{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CARE DETAILS */}
                <textarea value={careDetails} onChange={(e) => setCareDetails(e.target.value)} onBlur={() => updateCard({ care_details: careDetails })} placeholder="Care details" style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", background: "white", fontSize: "12px", color: "#070e06", resize: "none", height: "72px", lineHeight: 1.6 }} />
              </div>

              {/* SERVICES HEADER */}
              <div style={{ padding: "12px 20px", borderTop: "0.5px solid rgba(0,0,0,0.08)", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#2b5525", letterSpacing: "0.04em" }}>Services</span>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                  {(["basic", "deluxe", "premium"] as const).map((key) => {
                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    const defaultDesc = materialDefaults[carpetMaterial]?.services[key] ?? "";
                    const on = selectedService === key;
                    const isEditing = editingService === key;
                    const displayDesc = on ? (serviceDetails || defaultDesc) : defaultDesc;

                    function commitEdit() {
                      const final = editText.trim() === "" ? defaultDesc : editText.trim();
                      setServiceDetails(final);
                      updateCard({ service_details: final });
                      setEditingService(null);
                    }

                    return (
                      <div
                        key={key}
                        onClick={() => {
                          if (isEditing) return;
                          const v = on ? "" : key;
                          const det = on ? "" : defaultDesc;
                          setSelectedService(v);
                          setServiceDetails(det);
                          setEditingService(null);
                          updateCard({ service: v, service_details: det });
                        }}
                        style={{ padding: "10px 14px", border: `1px solid ${on ? "#2b5525" : "rgba(0,0,0,0.08)"}`, borderRadius: "8px", background: on ? "#eaf4d2" : "white", cursor: isEditing ? "default" : "pointer", transition: "all 0.15s" }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: on ? "6px" : 0 }}>
                          <span style={{ fontSize: "12px", fontWeight: 600, color: on ? "#2b5525" : "#070e06" }}>{label}</span>
                          {on && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2b5525" }} />
                              <span
                                onClick={(e) => { e.stopPropagation(); setEditingService(key); setEditText(serviceDetails || defaultDesc); }}
                                style={{ fontSize: "9px", color: "#2b5525", cursor: "pointer", textDecoration: "underline", lineHeight: 1 }}
                              >Edit</span>
                            </div>
                          )}
                        </div>
                        {on && (
                          isEditing ? (
                            <textarea
                              autoFocus
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitEdit(); } }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ width: "100%", fontSize: "10px", color: "#2b5525", background: "transparent", border: "none", borderBottom: "1px solid #2b5525", outline: "none", resize: "none", lineHeight: 1.5, padding: "2px 0", fontFamily: "inherit" }}
                              rows={2}
                            />
                          ) : (
                            <div style={{ fontSize: "10px", color: "#2b5525", lineHeight: 1.5 }}>{displayDesc}</div>
                          )
                        )}
                        {!on && defaultDesc && (
                          <div style={{ fontSize: "10px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{defaultDesc}</div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* PREVIEW SIDE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(43,85,37,0.75)", letterSpacing: "0.04em", marginBottom: "14px" }}>CONSUMER PREVIEW</div>

              {/* PHONE DEVICE */}
              <div className="phone-preview" style={{ width: "160px", height: "346px", borderRadius: "28px", overflow: "hidden", border: "6px solid #1f2937", background: "#070e06", marginBottom: "12px", overflowY: "auto", scrollbarWidth: "none" }}>

                <div style={{ height: "20px", background: "#070e06", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "60px", height: "10px", background: "#1f2937", borderRadius: "10px" }} />
                </div>

                {/* HEADER */}
                <div style={{ background: "#eaf4d2", padding: "24px 10px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <img src="/logo.png" alt="Logo" style={{ height: "32px", objectFit: "contain" }} />
                  {firstName && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "#070e06" }}>Hello,</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 500, color: "#070e06", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{firstName}</span>
                    </div>
                  )}
                </div>

                <div style={{ padding: "2px 10px 10px", display: "flex", flexDirection: "column", gap: "12px", background: "#eaf4d2" }}>

                  {/* WELCOME */}
                  <div style={{ textAlign: "center", fontSize: "9px", color: "#4b7a45", lineHeight: 1.6, paddingBottom: "2px" }}>
                    Your Master Cleaners service card — everything your carpet needs for care and maintenance, all in one place.
                  </div>

                  {/* CARPET */}
                  <div style={{ paddingBottom: "9px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(43,85,37,0.9)", marginBottom: "6px", textAlign: "center" }}>Carpet</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <svg width="100" height="44" viewBox="0 0 100 44" style={{ display: "block", overflow: "hidden" }}>
                        <g transform="translate(3, 3) rotate(15, 0, 0)">
                          <rect x="0" y="0" width="130" height="130" rx="14" fill="#d4ecb0" stroke="#2b5525" strokeWidth="2"/>
                          <rect x="7" y="7" width="116" height="116" rx="10" fill="none" stroke="#2b5525" strokeWidth="1" strokeOpacity="0.4"/>
                        </g>
                      </svg>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "#070e06" }}>{carpetSize || "—"}</div>
                        {carpetMaterial && <div style={{ fontSize: "10px", color: "#4b7a45" }}>{carpetMaterial}</div>}
                      </div>
                    </div>
                  </div>

                  {/* CARE */}
                  {careActive.size > 0 && (() => {
                    const icons = [...careActive];
                    const n = icons.length;
                    const rows = n <= 3 ? [icons] : n <= 4 ? [icons.slice(0, 2), icons.slice(2)] : [icons.slice(0, 3), icons.slice(3)];
                    const miniIcons: Record<string, ReactElement> = {
                      vacuum:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h13l3-6H6L3 12z"/><circle cx="7" cy="17" r="2"/><circle cx="14" cy="17" r="2"/><path d="M3 12v3"/></svg>,
                      handwash: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s0 4 4 4 4-4 4-4V9a1 1 0 00-2 0v3"/><path d="M10 12V7a1 1 0 012 0v5"/><path d="M12 12V6a1 1 0 012 0v6"/><path d="M14 11V8a1 1 0 012 0v5c0 3-2 5-4 5"/><path d="M8 14V9a1 1 0 00-2 0v3c0 1 .5 2 2 2z"/></svg>,
                      spot:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 2 5 9 5 13a7 7 0 0014 0c0-4-3-11-7-11z"/><path d="M9 13a3 3 0 006 0"/></svg>,
                      steam:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9c0-2 1.5-3 1.5-5"/><path d="M12 9c0-2 1.5-3 1.5-5"/><path d="M18 9c0-2 1.5-3 1.5-5"/><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 16h.01M12 16h.01M17 16h.01"/></svg>,
                      airdry:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>,
                      noblech:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l9 12 9-12H3z"/><line x1="4" y1="4" x2="20" y2="20"/></svg>,
                    };
                    return (
                      <div style={{ paddingBottom: "9px" }}>
                        <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(43,85,37,0.9)", marginBottom: "6px", textAlign: "center" }}>Care</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          {rows.map((row, ri) => (
                            <div key={ri} style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                              {row.map((key) => (
                                <div key={key} style={{ width: "37px", minHeight: "37px", borderRadius: "6px", border: "0.5px solid #2b5525", background: "#d4ecb0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#2b5525", padding: "4px 2px", gap: "3px" }}>
                                  {miniIcons[key]}
                                  <span style={{ fontSize: "5px", color: "#2b5525", fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>
                                    {{ vacuum: "Vacuum", handwash: "Hand Wash", spot: "Spot Clean", steam: "Steam", airdry: "Air Dry", noblech: "No Bleach" }[key]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        {careDetails && (
                          <div style={{ marginTop: "8px", fontSize: "8px", color: "#4b7a45", lineHeight: 1.6, fontWeight: 400, textAlign: "center" }}>{careDetails}</div>
                        )}
                      </div>
                    );
                  })()}

                  {/* SERVICES */}
                  <div style={{ paddingBottom: "12px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(43,85,37,0.8)", marginBottom: "4px", textAlign: "center" }}>Services</div>
                    <div style={{ fontSize: "7px", color: "#4b7a45", textAlign: "center", marginBottom: "8px", lineHeight: 1.4 }}>Select from the options below to schedule our services.</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {(["basic", "deluxe", "premium"] as const).map((key) => {
                        const on = selectedService === key;
                        const desc = materialDefaults[carpetMaterial]?.services[key] ?? "";
                        return (
                          <div key={key} onClick={() => { const v = on ? "" : key; const det = on ? "" : desc; setSelectedService(v); setServiceDetails(det); updateCard({ service: v, service_details: det }); }} style={{ padding: "5px 8px", border: `0.5px solid ${on ? "#2b5525" : "rgba(0,0,0,0.08)"}`, borderRadius: "6px", background: on ? "#eaf4d2" : "white", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", transition: "all 0.15s" }}>
                            <span style={{ fontSize: "8px", fontWeight: 600, color: on ? "#2b5525" : "#374151", textTransform: "capitalize", flexShrink: 0 }}>{key}</span>
                            {desc && <span style={{ fontSize: "7px", color: on ? "#2b5525" : "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{desc}</span>}
                            {on && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#2b5525", flexShrink: 0 }} />}
                          </div>
                        );
                      })}
                    </div>

                    {/* RESCHEDULE BUTTON / CONFIRMATION */}
                    <div style={{ marginTop: "8px" }}>
                      {rescheduled ? (
                        <div style={{ textAlign: "center", padding: "8px 4px" }}>
                          <div style={{ position: "relative", textAlign: "center", padding: "8px 0" }}>
                            <span style={{ position: "absolute", top: "-1px", left: "50%",    transform: "translateX(-60%)", fontSize: "8px", color: "#2b5525" }}>✦</span>
                            <span style={{ position: "absolute", top: "0px",  left: "50%",    transform: "translateX(30%)",  fontSize: "4px", color: "#2b5525" }}>✧</span>
                            <span style={{ position: "absolute", top: "1px",  left: "32px",   fontSize: "5px", color: "#2b5525" }}>✧</span>
                            <span style={{ position: "absolute", top: "-2px", right: "30px",  fontSize: "6px", color: "#2b5525" }}>✦</span>
                            <span style={{ position: "absolute", bottom: "0px", left: "50%",  transform: "translateX(-80%)", fontSize: "5px", color: "#2b5525" }}>✦</span>
                            <span style={{ position: "absolute", bottom: "-1px", left: "50%", transform: "translateX(20%)",  fontSize: "4px", color: "#2b5525" }}>✧</span>
                            <span style={{ fontSize: "9px", fontWeight: 600, color: "#2b5525" }}>Carpet Cleaning Awaits!</span>
                          </div>
                          <div style={{ fontSize: "7px", color: "#4b7a45", marginTop: "4px", lineHeight: 1.5 }}>A Master Cleaners servicer will reach out to you shortly.</div>
                        </div>
                      ) : (
                        <>
                          <div
                            onClick={() => {
                              if (selectedService) { setRescheduled(true); setReschedulePrompt(false); }
                              else { setReschedulePrompt(true); }
                            }}
                            style={{ background: "#2b5525", borderRadius: "6px", padding: "7px 8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                          >
                            <span style={{ fontSize: "10px", fontWeight: 600, color: "white", letterSpacing: "0.04em", lineHeight: 1 }}>Reschedule Services</span>
                          </div>
                          {reschedulePrompt && (
                            <div style={{ fontSize: "7px", color: "rgba(43,85,37,0.8)", textAlign: "center", marginTop: "5px", lineHeight: 1.4 }}>
                              Please select a service to complete rescheduling.
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* SERVICE CARD URL */}
              <div style={{ marginTop: "16px", width: "100%", maxWidth: "200px" }}>
                <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "6px" }}>Service Card URL</div>
                <div style={{ fontSize: "10px", color: tapUrl ? "#2b5525" : "#9ca3af", fontFamily: "monospace", wordBreak: "break-all", padding: "0 6px" }}>
                  {tapUrl || <span>Generated when last name<br />is entered</span>}
                </div>
              </div>

            </div>

            {/* PRINT PREVIEW */}
            {tapUrl && (
              <div style={{ padding: "20px", background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(43,85,37,0.75)", letterSpacing: "0.04em", marginBottom: "14px" }}>PRINT PREVIEW</div>

                <div style={{ width: "160px", height: "240px", border: "0.75px solid #2b5525", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
                  <img src="/logo.png" alt="Logo" style={{ height: "28px", objectFit: "contain", filter: "brightness(0)" }} />
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(0,0,0,0.95)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Service Card</div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(tapUrl)}&color=070e06&bgcolor=ffffff`}
                    alt="QR"
                    style={{ width: "90px", height: "90px", borderRadius: "4px" }}
                  />
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", color: "rgba(0,0,0,0.95)", textTransform: "uppercase", textAlign: "center", lineHeight: 1.6, marginTop: "2px" }}>Scan for<br />Service Details</div>
                </div>
              </div>
            )}

            {/* EXPORT CARD */}
            {tapUrl && (
              <div style={{ padding: "20px", background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(43,85,37,0.75)", letterSpacing: "0.04em", marginBottom: "6px" }}>EXPORT</div>
                <div style={{ fontSize: "10px", color: "#9ca3af", lineHeight: 1.6, marginBottom: "16px" }}>Card is configured and ready. Export the print file for your label printer.</div>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => {}}
                  style={{ width: "100%", padding: "10px", background: "#2b5525", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "white", letterSpacing: "0.04em", cursor: "pointer" }}
                >
                  Export Print File
                </button>
              </div>
            )}

            </div>
        </div>


      </div>
    </>
  );
}
