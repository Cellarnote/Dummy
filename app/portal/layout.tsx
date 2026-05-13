"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    label: "Dashboard",
    href: "/portal/dashboard",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: "Card Manager",
    href: "/portal/tags",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    label: "Customer Manager",
    href: "/portal/customers",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/portal/settings",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #eaf4d2; }
      `}</style>

      <div style={{ background: "white", borderBottom: "0.5px solid rgba(0,0,0,0.08)", padding: "0 24px 0 16px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", flexDirection: "column", gap: "4px", width: "32px", height: "32px", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ width: "20px", height: "1.5px", background: "#070e06", borderRadius: "1px", transition: "all 0.2s", transform: drawerOpen ? "rotate(45deg) translateY(5.5px)" : "none" }} />
          <div style={{ width: "20px", height: "1.5px", background: "#070e06", borderRadius: "1px", transition: "all 0.2s", opacity: drawerOpen ? 0 : 1 }} />
          <div style={{ width: "20px", height: "1.5px", background: "#070e06", borderRadius: "1px", transition: "all 0.2s", transform: drawerOpen ? "rotate(-45deg) translateY(-5.5px)" : "none" }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo.png" alt="Logo" style={{ height: "28px", objectFit: "contain" }} />
        </div>
      </div>

      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 40, top: "52px" }}
        />
      )}

      <div style={{ position: "fixed", top: "52px", left: 0, bottom: 0, width: "220px", background: "white", borderRight: "0.5px solid rgba(0,0,0,0.08)", zIndex: 45, transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "8px 0" }}>
          {navLinks.map((link, i) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 20px", fontSize: "12px", fontWeight: active ? 500 : 400, color: active ? "#2b5525" : "#4b5563", textDecoration: "none", borderBottom: i < navLinks.length - 1 ? "0.5px solid rgba(0,0,0,0.06)" : "none", background: active ? "#eaf4d2" : "transparent", transition: "background 0.15s" }}
              >
                <span style={{ color: active ? "#2b5525" : "#9ca3af", flexShrink: 0 }}>{link.icon}</span>
                {link.label}
                {active && <div style={{ marginLeft: "auto", width: "4px", height: "4px", borderRadius: "50%", background: "#2b5525" }} />}
              </Link>
            );
          })}
        </div>
        <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.06)", padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "10px", fontWeight: 500, color: "#6b7280" }}>i</span>
          </div>
          <span style={{ fontSize: "12px", fontWeight: 400, color: "#6b7280" }}>Help & support</span>
        </div>
      </div>

      <div>{children}</div>
    </>
  );
}
