"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/portal/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Invalid credentials");
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
        input { font-family: 'Inter', sans-serif; }
        input:focus { outline: none; border-color: #2b5525 !important; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "360px" }}>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "22px", fontWeight: 500, color: "#070e06", marginBottom: "6px" }}>Demo Portal</div>
            <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: 300 }}>Sign in to your account</div>
          </div>

          <form onSubmit={handleSubmit} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", color: "#070e06" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", color: "#070e06" }}
              />
            </div>

            {error && (
              <div style={{ fontSize: "12px", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "4px", padding: "8px 12px" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "10px", background: loading ? "#9ca3af" : "#2b5525", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: loading ? "default" : "pointer" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

          </form>

        </div>
      </div>
    </>
  );
}
