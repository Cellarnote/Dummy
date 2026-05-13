"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  email: string;
}

interface CardRow {
  id: string;
  carpet_size: string;
  carpet_material: string;
  service: string;
  tap_url: string;
}

export default function CustomerManager() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSearch(q: string) {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setShowResults(false); return; }
    const { data } = await supabase
      .from("customers")
      .select("*")
      .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`)
      .limit(6);
    setSearchResults(data ?? []);
    setShowResults(true);
  }

  async function loadCustomer(c: Customer) {
    setFirstName(c.first_name ?? "");
    setLastName(c.last_name ?? "");
    setAddress(c.address ?? "");
    setPhone(c.phone ?? "");
    setEmail(c.email ?? "");
    setCustomerId(c.id);
    setSearchQuery(`${c.first_name} ${c.last_name}`);
    setShowResults(false);
    setSaved(false);
    const { data } = await supabase.from("cards").select("id, carpet_size, carpet_material, service, tap_url").eq("customer_id", c.id);
    setCards(data ?? []);
  }

  function newCustomer() {
    setFirstName(""); setLastName(""); setAddress("");
    setPhone(""); setEmail(""); setNotes("");
    setCustomerId(null); setCards([]);
    setSearchQuery(""); setSearchResults([]); setShowResults(false);
    setSaved(false);
  }

  async function saveCustomer() {
    if (!firstName && !lastName) return;
    if (customerId) {
      await supabase.from("customers").update({ first_name: firstName, last_name: lastName, address, phone, email }).eq("id", customerId);
    } else {
      const id = crypto.randomUUID();
      await supabase.from("customers").insert({ id, first_name: firstName, last_name: lastName, address, phone, email });
      setCustomerId(id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", fontSize: "12px", color: "#070e06", fontFamily: "inherit", outline: "none" };
  const sectionHeader = (label: string) => (
    <div style={{ padding: "12px 20px", borderTop: "0.5px solid rgba(0,0,0,0.08)", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
      <span style={{ fontSize: "14px", fontWeight: 600, color: "#2b5525", letterSpacing: "0.04em" }}>{label}</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
        input, textarea, button { font-family: 'Inter', sans-serif; }
        input:focus, textarea:focus { outline: none; border-color: #2b5525 !important; }
      `}</style>

      <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>

        {/* TOOLBAR */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={newCustomer}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#2b5525", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 500, color: "white", cursor: "pointer", flexShrink: 0, letterSpacing: "0.02em" }}
          >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>+</span> New Customer
          </button>
          <div style={{ flex: 1, position: "relative" }}>
            <svg style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search Existing Customers"
              style={{ width: "100%", padding: "8px 10px 8px 30px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "6px", background: "white", fontSize: "11px", color: "#374151" }}
            />
            {showResults && searchResults.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "6px", marginTop: "4px", zIndex: 20, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                {searchResults.map((c) => (
                  <div
                    key={c.id}
                    onMouseDown={() => loadCustomer(c)}
                    style={{ padding: "10px 14px", fontSize: "12px", color: "#070e06", cursor: "pointer", borderBottom: "0.5px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <span style={{ fontWeight: 500 }}>{c.first_name} {c.last_name}</span>
                    <span style={{ fontSize: "10px", color: "#9ca3af" }}>{c.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BUILDER PANEL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "16px", alignItems: "stretch" }}>

          {/* FORM COLUMN */}
          <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px 20px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#2b5525", letterSpacing: "0.04em" }}>Customer</span>
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={saveCustomer} placeholder="Last name" style={inputStyle} />
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" style={inputStyle} />
              </div>
              <input value={address} onChange={(e) => setAddress(e.target.value)} onBlur={saveCustomer} placeholder="Address" style={inputStyle} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={saveCustomer} placeholder="Phone" style={inputStyle} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={saveCustomer} placeholder="Email" style={inputStyle} />
              </div>
            </div>

            {sectionHeader("Notes")}
            <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Customer notes"
                style={{ ...inputStyle, resize: "none", flex: 1, minHeight: "100px", lineHeight: 1.6 }}
              />
            </div>

            {/* SAVE ROW */}
            <div style={{ padding: "14px 20px", borderTop: "0.5px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: saved ? "#2b5525" : "transparent", fontWeight: 500, transition: "color 0.2s" }}>Saved</span>
              <button
                onClick={saveCustomer}
                style={{ padding: "7px 18px", background: "#2b5525", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 500, color: "white", cursor: "pointer", letterSpacing: "0.02em" }}
              >
                Save Customer
              </button>
            </div>
          </div>

          {/* CARDS / RUGS COLUMN */}
          <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px 20px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(43,85,37,0.75)", letterSpacing: "0.04em" }}>RUGS & CARDS</span>
            </div>

            {customerId && cards.length > 0 ? (
              <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {cards.map((c) => (
                    <div key={c.id} style={{ padding: "12px 14px", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "8px", background: "#eaf4d2" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#070e06" }}>{c.carpet_size || "—"}</span>
                        {c.service && (
                          <span style={{ fontSize: "9px", fontWeight: 600, color: "#2b5525", background: "white", border: "0.5px solid #2b5525", borderRadius: "4px", padding: "2px 6px", textTransform: "capitalize" }}>{c.service}</span>
                        )}
                      </div>
                      {c.carpet_material && (
                        <div style={{ fontSize: "10px", color: "#4b7a45", marginBottom: "6px" }}>{c.carpet_material}</div>
                      )}
                      {c.tap_url && (
                        <div style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.tap_url}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", gap: "10px", textAlign: "center" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280" }}>No cards yet</div>
                <div style={{ fontSize: "10px", color: "#9ca3af", lineHeight: 1.6, maxWidth: "180px" }}>
                  {customerId ? "No service cards found for this customer." : "Search for a customer or create a new one to view their rugs and cards."}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
