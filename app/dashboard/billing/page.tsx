"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PricingCard, { PLANS, type PricingPlan } from "@/components/billing/PricingCard";
import { AUTH_API_URL } from "@/lib/config";

interface BillingStatus {
  plan_tier: string;
  plan_status: string;
  eval_count_month: number;
  billing_period_end: string | null;
  stripe_customer_id: string | null;
}

const EVAL_LIMITS: Record<string, number> = {
  free: 1000,
  grow: 25000,
  scale: 150000,
  enterprise: Infinity,
};

export default function BillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      setToast("Subscription activated! Welcome to VeldrixAI.");
    } else if (searchParams.get("cancelled") === "1") {
      setToast("Checkout cancelled.");
    }
  }, [searchParams]);

  useEffect(() => {
    fetch(`${AUTH_API_URL}/billing/status`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePlanSelect = async (plan: PricingPlan) => {
    if (plan.id === "free") return;
    if (plan.id === "enterprise") {
      window.location.href = "mailto:sales@veldrix.ai?subject=Enterprise+Inquiry";
      return;
    }

    try {
      const res = await fetch(`${AUTH_API_URL}/billing/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: plan.id, cycle }),
      });

      if (res.status === 401) {
        router.push(`/login?redirect=/dashboard/billing&plan=${plan.id}&cycle=${cycle}`);
        return;
      }

      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      setToast("Error starting checkout. Please try again.");
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch(`${AUTH_API_URL}/billing/create-portal-session`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.portal_url) {
        window.location.href = data.portal_url;
      }
    } catch {
      setToast("Error opening billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  const currentLimit = status ? (EVAL_LIMITS[status.plan_tier] ?? 1000) : 1000;
  const usagePercent =
    status && currentLimit !== Infinity
      ? Math.min(100, (status.eval_count_month / currentLimit) * 100)
      : 0;

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Toast */}
      {toast && (
        <div
          onClick={() => setToast(null)}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "rgba(124,58,237,0.9)",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "14px",
            cursor: "pointer",
            zIndex: 999,
            backdropFilter: "blur(8px)",
          }}
        >
          {toast}
        </div>
      )}

      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
        Billing & Plans
      </h1>
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginBottom: "32px" }}>
        Manage your subscription and usage quotas.
      </p>

      {/* Current usage card */}
      {!loading && status && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "36px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: "24px",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>
              Current Plan
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px", fontWeight: 600, color: "#fff", textTransform: "capitalize" }}>
                {status.plan_tier}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "20px",
                  background:
                    status.plan_status === "active"
                      ? "rgba(6,182,212,0.15)"
                      : status.plan_status === "past_due"
                      ? "rgba(234,179,8,0.15)"
                      : "rgba(239,68,68,0.15)",
                  color:
                    status.plan_status === "active"
                      ? "#06b6d4"
                      : status.plan_status === "past_due"
                      ? "#eab308"
                      : "#ef4444",
                  textTransform: "capitalize",
                }}
              >
                {status.plan_status}
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>
              Usage this month
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>
              {status.eval_count_month.toLocaleString()}
              {currentLimit !== Infinity && (
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>
                  {" "}/ {currentLimit.toLocaleString()}
                </span>
              )}
            </div>
            <div
              style={{
                marginTop: "6px",
                height: "4px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${usagePercent}%`,
                  background:
                    usagePercent > 90
                      ? "#ef4444"
                      : usagePercent > 70
                      ? "#eab308"
                      : "linear-gradient(90deg, #7c3aed, #06b6d4)",
                  borderRadius: "4px",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>
              Renewal
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
              {status.billing_period_end
                ? new Date(status.billing_period_end).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </div>

          {status.stripe_customer_id && (
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {portalLoading ? "Opening…" : "Manage billing"}
            </button>
          )}
        </div>
      )}

      {/* Billing cycle toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>Monthly</span>
        <button
          onClick={() => setCycle(cycle === "monthly" ? "annual" : "monthly")}
          style={{
            width: "44px",
            height: "24px",
            borderRadius: "12px",
            background: cycle === "annual" ? "#7c3aed" : "rgba(255,255,255,0.1)",
            border: "none",
            cursor: "pointer",
            position: "relative",
            transition: "background 0.2s",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "3px",
              left: cycle === "annual" ? "23px" : "3px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.2s",
            }}
          />
        </button>
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
          Annual{" "}
          <span style={{ color: "#06b6d4", fontSize: "12px" }}>save 20%</span>
        </span>
      </div>

      {/* Plan cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            cycle={cycle}
            currentPlan={status?.plan_tier}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>
    </div>
  );
}
