"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@allfi.app");
  const [password, setPassword] = useState("allfi2026");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #050a14 0%, #0a1628 50%, #050a14 100%)",
      fontFamily: "var(--font-sans, sans-serif)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        padding: 32,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: "linear-gradient(135deg, #d4af37, #b8960c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 24, color: "#050a14",
            margin: "0 auto 16px",
          }}>A</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#d4af37", marginBottom: 4 }}>AllFi</h1>
          <p style={{ color: "#71717a", fontSize: 14 }}>Sign in to your asset manager</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 16,
          padding: 32,
        }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#a1a1aa", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#09090b",
                border: "1px solid #27272a",
                borderRadius: 8,
                color: "#fafafa",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#a1a1aa", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#09090b",
                border: "1px solid #27272a",
                borderRadius: 8,
                color: "#fafafa",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 16, textAlign: "center" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(135deg, #d4af37, #b8960c)",
              border: "none",
              borderRadius: 8,
              color: "#050a14",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo hint */}
        <p style={{ textAlign: "center", color: "#52525b", fontSize: 12, marginTop: 20 }}>
          Demo: demo@allfi.app / allfi2026
        </p>
      </div>
    </div>
  );
}
