"use client";
import { useState } from "react";

const demoItems = [
  { id: "item-001", title: "Product Alpha" },
  { id: "item-002", title: "Product Beta" },
  { id: "item-003", title: "Product Gamma" },
  { id: "item-004", title: "Product Delta" },
  { id: "item-005", title: "Custom Item" },
];

const expTypes = ["Retail", "Event", "Demo", "Sample", "Gift", "Custom"];

export default function TagManager() {
  const [selectedTab, setSelectedTab] = useState("Experience");
  const [selectedExp, setSelectedExp] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageFrom, setMessageFrom] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmt, setDiscountAmt] = useState("");
  const [orderTab, setOrderTab] = useState<"Queue" | "Orders" | "Inventory">("Queue");

  const tabs = ["Experience", "Sections", "Coupon", "Advanced"];

  const [sections, setSections] = useState({
    description: true,
    message: true,
    rating: true,
    coupon: true,
  });

  const selectedProduct = demoItems.find((p) => p.id === selectedItem) || null;

  const slug = selectedProduct
    ? `${selectedProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${selectedExp.toLowerCase() || "retail"}`
    : "";

  const tapUrl = slug ? `yourapp.com/tap/${slug}` : "";

  async function saveTag(overrides: Record<string, any> = {}) {
    if (!selectedItem || !selectedProduct) return;

    const generatedSlug = `${selectedProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${selectedExp.toLowerCase() || "retail"}`;

    await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: generatedSlug,
        tenant_id: "demo",
        item_id: selectedItem,
        item_name: selectedProduct.title,
        experience_type: selectedExp || "retail",
        tap_url: `https://yourapp.com/tap/${generatedSlug}`,
        status: "preview",
        sections,
        description,
        message,
        message_from: messageFrom,
        coupon_code: discountCode,
        coupon_discount: discountAmt,
        ...overrides,
      }),
    });
  }

  function toggleSection(key: keyof typeof sections) {
    setSections((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveTag({ sections: updated });
      return updated;
    });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
        input, select, textarea, button { font-family: 'Inter', sans-serif; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #2b5525 !important; }
        .phone-preview::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>

        {/* CAROUSEL LABEL */}
        <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "14px" }}>Your tags</div>

        {/* TAG CAROUSEL */}
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none", marginBottom: "28px" }}>

          <div style={{ flexShrink: 0, width: "160px", height: "200px", borderRadius: "12px", border: "0.5px dashed rgba(0,0,0,0.18)", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#9ca3af" }}>+</div>
            <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 400 }}>New tag</div>
          </div>

          <div style={{ flexShrink: 0, width: "220px", height: "200px", borderRadius: "12px", border: "0.5px solid rgba(0,0,0,0.08)", background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", padding: "20px", textAlign: "center" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#eaf4d2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </div>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "#070e06" }}>No tags yet</div>
            <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 400, lineHeight: 1.6 }}>Add your first tag to get started</div>
          </div>

        </div>

        {/* BUILDER PANEL */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", overflow: "hidden" }}>

          {/* TABS */}
          <div style={{ display: "flex", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
            {tabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{ padding: "12px 20px", fontSize: "11px", fontWeight: selectedTab === tab ? 600 : 400, color: selectedTab === tab ? "#2b5525" : "#9ca3af", cursor: "pointer", letterSpacing: "0.04em", borderBottom: selectedTab === tab ? "1.5px solid #2b5525" : "1.5px solid transparent", transition: "all 0.15s" }}
              >
                {tab}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px" }}>

            {/* FORM SIDE */}
            <div style={{ padding: "20px", borderRight: "0.5px solid rgba(0,0,0,0.08)" }}>

              {/* ITEM SELECT */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#374151", marginBottom: "5px", display: "block" }}>Select item</label>
                <select
                  value={selectedItem}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedItem(id);
                  }}
                  style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", background: "white", fontSize: "12px", color: selectedItem ? "#070e06" : "#9ca3af", appearance: "none", cursor: "pointer" }}
                >
                  <option value="" disabled>Select an item</option>
                  {demoItems.map((item) => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                  ))}
                </select>
                <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "4px", fontWeight: 400 }}>Demo items — replace with your own catalog in production</div>
              </div>

              {/* EXPERIENCE TYPE */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#374151", marginBottom: "8px", display: "block" }}>Experience type</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px" }}>
                  {expTypes.map((exp) => (
                    <button
                      key={exp}
                      onClick={() => {
                        setSelectedExp(exp);
                        saveTag({ experience_type: exp.toLowerCase() });
                      }}
                      style={{ padding: "8px 6px", border: `0.5px solid ${selectedExp === exp ? "#2b5525" : "rgba(0,0,0,0.1)"}`, borderRadius: "4px", background: selectedExp === exp ? "#eaf4d2" : "#eaf4d2", fontSize: "9px", color: selectedExp === exp ? "#2b5525" : "#6b7280", cursor: "pointer", textAlign: "center", letterSpacing: "0.04em", transition: "all 0.15s" }}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
                {!selectedExp && <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "6px", fontWeight: 400 }}>Select a type to configure the experience</div>}
              </div>

              {selectedExp && (
                <>
                  {/* DESCRIPTION */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "8px", display: "block" }}>Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onBlur={() => saveTag({ description })}
                      placeholder="Describe this item or experience…"
                      style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", background: "white", fontSize: "12px", color: "#070e06", resize: "none", height: "72px", lineHeight: 1.6 }}
                    />
                  </div>

                  {/* MESSAGE */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "8px", display: "block" }}>Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onBlur={() => saveTag({ message })}
                      placeholder="A personal message shown on the tag experience…"
                      style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", background: "white", fontSize: "12px", color: "#070e06", resize: "none", height: "72px", lineHeight: 1.6, marginBottom: "8px" }}
                    />
                    <input
                      value={messageFrom}
                      onChange={(e) => setMessageFrom(e.target.value)}
                      onBlur={() => saveTag({ message_from: messageFrom })}
                      placeholder="Attributed to e.g. Jane Smith, Product Manager"
                      style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", background: "white", fontSize: "12px", color: "#070e06" }}
                    />
                  </div>

                  {/* SECTIONS */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "10px", display: "block" }}>Sections on / off</label>
                    {[
                      { key: "description", label: "Description" },
                      { key: "message", label: "Message" },
                      { key: "rating", label: "Star rating" },
                      { key: "coupon", label: "Coupon offer" },
                    ].map(({ key, label }) => (
                      <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
                        <span style={{ fontSize: "12px", color: "#070e06", fontWeight: 400 }}>{label}</span>
                        <div
                          onClick={() => toggleSection(key as keyof typeof sections)}
                          style={{ width: "32px", height: "18px", borderRadius: "20px", background: sections[key as keyof typeof sections] ? "#2b5525" : "#f3f4f6", border: sections[key as keyof typeof sections] ? "none" : "0.5px solid rgba(0,0,0,0.1)", position: "relative", cursor: "pointer", transition: "background 0.15s" }}
                        >
                          <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: sections[key as keyof typeof sections] ? "auto" : "2px", right: sections[key as keyof typeof sections] ? "2px" : "auto", transition: "all 0.15s" }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* COUPON */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "8px", display: "block" }}>Coupon</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px" }}>
                      <div>
                        <label style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px", display: "block" }}>Discount</label>
                        <input value={discountAmt} onChange={(e) => setDiscountAmt(e.target.value)} onBlur={() => saveTag({ coupon_discount: discountAmt })} placeholder="e.g. 15%" style={{ width: "100%", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", fontSize: "12px", color: "#070e06" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px", display: "block" }}>Code</label>
                        <input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} onBlur={() => saveTag({ coupon_code: discountCode })} placeholder="SAVE15" style={{ width: "80px", padding: "8px 10px", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "4px", fontSize: "12px", color: "#070e06" }} />
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* PREVIEW SIDE */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", background: "#eaf4d2" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "14px" }}>Consumer preview</div>

              {/* PHONE DEVICE */}
              <div className="phone-preview" style={{ width: "160px", borderRadius: "28px", overflow: "hidden", border: "6px solid #1f2937", background: "#070e06", marginBottom: "12px", maxHeight: "480px", overflowY: "auto", scrollbarWidth: "none" }}>

                <div style={{ height: "20px", background: "#070e06", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "60px", height: "10px", background: "#1f2937", borderRadius: "10px" }} />
                </div>

                {selectedItem && selectedProduct ? (
                  <>
                    {/* HERO */}
                    <div style={{ height: "120px", background: "#070e06", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "12px", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "relative", zIndex: 2 }}>
                        <div style={{ fontSize: "7px", letterSpacing: "0.1em", color: "rgba(168,210,130,0.7)", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: "3px" }}>
                          {selectedExp || "Experience"}
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "#f0f9ff", lineHeight: 1.2 }}>
                          {selectedProduct.title}
                        </div>
                      </div>
                    </div>

                    {/* BODY */}
                    <div style={{ background: "white", padding: "10px" }}>

                      {sections.description && (
                        <div style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: "0.5px solid #f3f4f6" }}>
                          <div style={{ fontSize: "7px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "3px" }}>Description</div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#374151", lineHeight: 1.5, fontWeight: 400 }}>
                            {description || "Item description will appear here…"}
                          </div>
                        </div>
                      )}

                      {sections.message && (
                        <div style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: "0.5px solid #f3f4f6" }}>
                          <div style={{ fontSize: "7px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "3px" }}>Message</div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "#374151", lineHeight: 1.5, fontStyle: "italic" }}>
                            {message ? `"${message}"` : '"Your message here…"'}
                          </div>
                          {messageFrom && <div style={{ fontSize: "7px", color: "#9ca3af", marginTop: "2px" }}>— {messageFrom}</div>}
                        </div>
                      )}

                      {sections.rating && (
                        <div style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: "0.5px solid #f3f4f6" }}>
                          <div style={{ fontSize: "7px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "4px" }}>Rate your experience</div>
                          <div style={{ display: "flex", gap: "2px" }}>
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} width="12" height="12" viewBox="0 0 12 12">
                                <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5" fill="#2b5525" opacity="0.25"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                      )}

                      {sections.coupon && discountAmt && discountCode && (
                        <div style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: "0.5px solid #f3f4f6" }}>
                          <div style={{ background: "#eaf4d2", border: "0.5px solid rgba(43,85,37,0.2)", borderRadius: "6px", padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ fontSize: "7px", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "1px" }}>Your exclusive offer</div>
                              <div style={{ fontSize: "10px", fontWeight: 600, color: "#2b5525", letterSpacing: "0.06em" }}>{discountCode}</div>
                            </div>
                            <div style={{ fontSize: "13px", color: "#2b5525", fontWeight: 600 }}>{discountAmt}</div>
                          </div>
                        </div>
                      )}

                      <div>
                        <div style={{ fontSize: "7px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "4px" }}>Stay connected</div>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <div style={{ flex: 1, background: "#eaf4d2", border: "0.5px solid rgba(43,85,37,0.2)", borderRadius: "4px", padding: "4px 6px", fontSize: "8px", color: "#9ca3af" }}>your@email.com</div>
                          <div style={{ background: "#2b5525", color: "white", borderRadius: "4px", padding: "4px 6px", fontSize: "8px" }}>Join</div>
                        </div>
                      </div>

                    </div>
                  </>
                ) : (
                  <div style={{ height: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.15)", lineHeight: 1.6 }}>Select an item to preview</div>
                  </div>
                )}

              </div>

              {/* TAG URL */}
              <div style={{ marginTop: "16px", width: "100%", maxWidth: "200px", background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "12px" }}>
                <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "6px" }}>Tag URL</div>
                <div style={{ fontSize: "10px", color: selectedItem ? "#2b5525" : "#9ca3af", fontFamily: "monospace", wordBreak: "break-all" }}>
                  {selectedProduct
                    ? `yourapp.com/tap/${selectedProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${selectedExp.toLowerCase() || "retail"}`
                    : "Appears after item is selected"}
                </div>
              </div>

              {/* QR CODE */}
              {tapUrl && (
                <div style={{ marginTop: "12px", width: "100%", maxWidth: "200px", background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>Scan to preview</div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://${tapUrl}`)}&color=2563eb&bgcolor=ffffff`}
                    alt="QR code"
                    style={{ width: "100px", height: "100px", borderRadius: "4px" }}
                  />
                  <div style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 400, textAlign: "center", lineHeight: 1.6 }}>Scan with your phone camera to preview the tap experience</div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* TAG ORDER CARD */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "12px", overflow: "hidden", marginTop: "24px" }}>
          <div style={{ padding: "14px 20px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af" }}>Tag orders</div>
          </div>
          <div style={{ display: "flex", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
            {(["Queue", "Orders", "Inventory"] as const).map((t) => (
              <div key={t} onClick={() => setOrderTab(t)} style={{ padding: "10px 20px", fontSize: "12px", color: orderTab === t ? "#2b5525" : "#9ca3af", cursor: "pointer", borderBottom: orderTab === t ? "1.5px solid #2b5525" : "1.5px solid transparent", letterSpacing: "0.04em", transition: "all 0.15s" }}>
                {t}
              </div>
            ))}
          </div>
          {orderTab === "Queue" && (
            <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280" }}>No tags in queue</div>
              <div style={{ fontSize: "10px", fontWeight: 400, color: "#9ca3af", lineHeight: 1.6, maxWidth: "220px" }}>Configure an item above and it will appear here ready to order.</div>
            </div>
          )}
          {orderTab === "Orders" && (
            <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280" }}>No orders yet</div>
              <div style={{ fontSize: "10px", fontWeight: 400, color: "#9ca3af", lineHeight: 1.6, maxWidth: "220px" }}>Place your first order from the queue and it will appear here with tracking details.</div>
            </div>
          )}
          {orderTab === "Inventory" && (
            <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280" }}>No inventory yet</div>
              <div style={{ fontSize: "10px", fontWeight: 400, color: "#9ca3af", lineHeight: 1.6, maxWidth: "220px" }}>Tags will appear here once an order has been delivered.</div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
