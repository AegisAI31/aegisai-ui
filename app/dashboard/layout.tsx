"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import "./dashboard.css";

type User = {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Unauthorized");
        const userData = await res.json();
        setUser(userData);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/dashboard/evaluate", label: "Trust Evaluation", icon: "shield" },
    { href: "/dashboard/reports", label: "Reports", icon: "audit" },
    { href: "/dashboard/api-keys", label: "API Keys", icon: "key" },
    { href: "/dashboard/prompt-generator", label: "Prompt Generator", icon: "prompt" },
    { href: "/dashboard/sdk", label: "SDK", icon: "sdk" },
    { href: "/dashboard/audit-trails", label: "Audit Trails", icon: "audit" },
  ];

  const utilityNavItems = [
    { href: "/dashboard/profile", label: "Settings", icon: "settings" },
  ];

  return (
    <div className={`dash-shell ${sidebarCollapsed ? "collapsed" : ""}`}>
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          <Link href="/dashboard" className="dash-logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="dash-logo-icon">
              <path d="M20 2L37 12V28L20 38L3 28V12L20 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M20 10L30 16V24L20 30L10 24V16L20 10Z" fill="currentColor" opacity="0.15" />
              <circle cx="20" cy="20" r="4" fill="currentColor" />
            </svg>
            {!sidebarCollapsed && <span>AegisAI</span>}
          </Link>

          <button
            className="dash-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarCollapsed ? (
                <polyline points="9 18 15 12 9 6" />
              ) : (
                <polyline points="15 18 9 12 15 6" />
              )}
            </svg>
          </button>
        </div>

        <nav className="dash-nav">
          {mainNavItems.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item ${isActive ? "active" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <NavIcon name={item.icon} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
          <div className="dash-nav-divider">
            {!sidebarCollapsed && <span>Utilities</span>}
          </div>
          {utilityNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item ${isActive ? "active" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <NavIcon name={item.icon} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-user-card">
            <div className="dash-avatar">
              {user.email.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="dash-user-info">
                <span className="dash-user-email">{user.email}</span>
                <span className="dash-user-role">{user.role}</span>
              </div>
            )}
          </div>
          <button className="dash-logout-btn" onClick={logout} title="Sign out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!sidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <main className="dash-main">
        {children}
      </main>
    </div>
  );
}

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "prompt":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case "sdk":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "audit":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "shield":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "key":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      );
    case "settings":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}
