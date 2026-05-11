"use client";
import { useState } from "react";

interface Tag {
  id: string;
  item_name: string;
  item_id: string;
  experience_type: string;
  description: string;
  message: string;
  message_from: string;
  coupon_code: string;
  coupon_discount: string;
  sections: {
    description: boolean;
    message: boolean;
    rating: boolean;
    coupon: boolean;
  };
  tenant_id: string;
}

export default function TapExperience({ tag }: { tag: Tag }) {
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sections = tag.sections || {
    description: true,
    message: true,
    rating: true,
    coupon: true,
  };

  async function handleSubmit() {
    if (!email || !email.includes("@")) return;
    setSubmitting(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        rating,
        tenant_id: tag.tenant_id,
        item_id: tag.item_id,
        item_name: tag.item_name,
        tag_id: tag.id,
        experience_type: tag.experience_type,
        source: "nfc_tap",
      }),
    });
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f4f5f7; }
        input { font-family: 'Inter', sans-serif; }
        input:focus { outline: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f4f5f7", maxWidth: "480px", margin: "0 auto" }}>

        {/* HERO */}
        <div style={{
          minHeight: "200px",
          background: "#1e3a5f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "32px 24px 24px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.14em", color: "rgba(147,197,253,0.7)", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: "8px" }}>
              {tag.experience_type}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "28px", fontWeight: 600, color: "#f0f9ff", lineHeight: 1.1 }}>
              {tag.item_name}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "0", background: "white" }}>

          {/* DESCRIPTION */}
          {sections.description && tag.description && (
            <div style={{ paddingBottom: "20px", marginBottom: "20px", borderBottom: "0.5px solid #f3f4f6" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>About this</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#374151", lineHeight: 1.7, fontWeight: 400 }}>
                {tag.description}
              </div>
            </div>
          )}

          {/* MESSAGE */}
          {sections.message && tag.message && (
            <div style={{ paddingBottom: "20px", marginBottom: "20px", borderBottom: "0.5px solid #f3f4f6" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>Message</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#374151", lineHeight: 1.7, fontStyle: "italic", fontWeight: 400 }}>
                &ldquo;{tag.message}&rdquo;
              </div>
              {tag.message_from && (
                <div style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginTop: "8px", fontWeight: 400 }}>
                  — {tag.message_from}
                </div>
              )}
            </div>
          )}

          {/* STAR RATING */}
          {sections.rating && (
            <div style={{ paddingBottom: "20px", marginBottom: "20px", borderBottom: "0.5px solid #f3f4f6" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>Rate your experience</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill={s <= (hoverRating || rating) ? "#2563eb" : "none"}
                    stroke="#2563eb"
                    strokeWidth="1"
                    style={{ cursor: "pointer", transition: "all 0.15s" }}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
              </div>
            </div>
          )}

          {/* COUPON */}
          {sections.coupon && tag.coupon_code && tag.coupon_discount && (
            <div style={{ paddingBottom: "20px", marginBottom: "20px", borderBottom: "0.5px solid #f3f4f6" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>Your exclusive offer</div>
              <div style={{ background: "#eff6ff", border: "0.5px solid rgba(37,99,235,0.15)", borderRadius: "10px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "4px" }}>Use code at checkout</div>
                  <div style={{ fontSize: "18px", fontWeight: 600, color: "#2563eb", letterSpacing: "0.1em" }}>{tag.coupon_code}</div>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "28px", color: "#2563eb", fontWeight: 600 }}>{tag.coupon_discount}</div>
              </div>
            </div>
          )}

          {/* EMAIL CAPTURE */}
          {!submitted ? (
            <div style={{ paddingBottom: "20px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9ca3af", fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}>
                Stay connected
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "17px", color: "#111827", fontWeight: 500, marginBottom: "14px", lineHeight: 1.4 }}>
                Get updates on new releases and offers.
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ width: "100%", padding: "12px 16px", border: "0.5px solid #d1d5db", borderRadius: "6px", fontSize: "14px", color: "#111827", background: "white", marginBottom: "10px" }}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ width: "100%", padding: "14px", background: submitting ? "#93c5fd" : "#2563eb", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.06em", fontWeight: 500, cursor: submitting ? "default" : "pointer" }}
              >
                {submitting ? "Submitting…" : "Stay connected"}
              </button>
            </div>
          ) : (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "22px", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>
                Thank you.
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 400, lineHeight: 1.6 }}>
                You&apos;ll hear from us soon.
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div style={{ padding: "20px 24px", textAlign: "center", borderTop: "0.5px solid #f3f4f6", background: "white" }}>
          <div style={{ fontSize: "10px", color: "#d1d5db", fontWeight: 400, letterSpacing: "0.06em" }}>
            Powered by <span style={{ color: "#2563eb" }}>Demo Portal</span>
          </div>
        </div>

      </div>
    </>
  );
}
