"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050a14",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: "linear-gradient(135deg, #d4af37, #b8960c)",
            margin: "0 auto 16px",
          }} />
          <p style={{ color: "#71717a", fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div>
      {/* Auth header bar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(10,22,40,0.9)",
        borderBottom: "1px solid #1e293b",
        backdropFilter: "blur(12px)",
        padding: "0 32px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, #d4af37, #b8960c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 13, color: "#050a14",
          }}>A</div>
          <span style={{ fontFamily: "serif", fontSize: 18, fontWeight: 700, color: "#d4af37" }}>AllFi</span>
          <span style={{ fontSize: 10, color: "rgba(212,175,55,0.5)", letterSpacing: "0.1em", marginLeft: 4 }}>PRIVATE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#71717a" }}>{session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              padding: "6px 14px",
              background: "transparent",
              border: "1px solid #27272a",
              borderRadius: 6,
              color: "#a1a1aa",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
      <div style={{ paddingTop: 52 }}>
        {children}
      </div>
    </div>
  );
}
