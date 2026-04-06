"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardGuard from "./DashboardGuard";

export default function RootPage() {
  return (
    <DashboardGuard>
      <LandingContent />
    </DashboardGuard>
  );
}

function LandingContent() {
  const features = [
    { title: "Unified View", desc: "Bank, stocks, crypto, DeFi — one dashboard.", icon: "◈" },
    { title: "Privacy First", desc: "Self-hosted. Your data never leaves your server.", icon: "◉" },
    { title: "Multi-Currency", desc: "Toggle between USDC, BTC, ETH, and CNY.", icon: "◎" },
    { title: "Real-Time Sync", desc: "CEX APIs + on-chain data, updated continuously.", icon: "◇" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #050a14 0%, #0a1628 50%, #050a14 100%)",
      color: "#fafafa",
    }}>
      {/* Hero */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "100px 32px 80px",
        textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 16,
          background: "linear-gradient(135deg, #d4af37, #b8960c)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: 32, color: "#050a14",
          margin: "0 auto 32px",
        }}>A</div>
        <h1 style={{
          fontFamily: "serif",
          fontSize: "clamp(36px, 6vw, 56px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: 16,
          background: "linear-gradient(135deg, #d4af37, #f0d060)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          AllFi Asset Manager
        </h1>
        <p style={{
          fontSize: 18,
          color: "#71717a",
          maxWidth: 520,
          margin: "0 auto 40px",
          lineHeight: 1.6,
        }}>
          Your complete financial picture — banking, securities, and digital assets
          unified in one private, self-hosted dashboard.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/dashboard" style={{
            padding: "12px 28px",
            background: "linear-gradient(135deg, #d4af37, #b8960c)",
            borderRadius: 8,
            color: "#050a14",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}>
            Go to Dashboard →
          </Link>
          <a href="https://github.com/openclawsean024-create/allfi-asset-manager" target="_blank" rel="noopener" style={{
            padding: "12px 28px",
            background: "transparent",
            border: "1px solid #27272a",
            borderRadius: 8,
            color: "#a1a1aa",
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
          }}>
            View on GitHub
          </a>
        </div>
      </div>

      {/* Features */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "0 32px 100px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
      }}>
        {features.map((f) => (
          <div key={f.title} style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            padding: 24,
          }}>
            <div style={{ fontSize: 24, marginBottom: 12, color: "#d4af37" }}>{f.icon}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
            <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
