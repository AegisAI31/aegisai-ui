import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";
import { HeroAnimation } from "@/components/hero-animation";
import { ModelCarousel } from "@/components/model-carousel";
import "./hero-animation.css";

const pillars = [
  {
    num: "01",
    title: "Safety & Toxicity Detection",
    description: "Real-time detection and filtering of harmful, offensive, or inappropriate content across all AI interactions."
  },
  {
    num: "02",
    title: "Hallucination Prevention",
    description: "Verify accuracy and consistency of AI outputs against trusted knowledge bases and factual sources."
  },
  {
    num: "03",
    title: "Bias & Fairness Analysis",
    description: "Identify and mitigate demographic, cultural, and systemic biases to ensure fair AI responses."
  },
  {
    num: "04",
    title: "Prompt Security Shield",
    description: "Advanced protection against injection attacks, jailbreaks, and adversarial prompt manipulation."
  },
  {
    num: "05",
    title: "Compliance Enforcement",
    description: "Automated adherence to regulatory requirements, industry standards, and organizational policies."
  }
];

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Secure Access Control",
    description: "JWT authentication, API key management, role-based access, and multi-factor authentication support."
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: "Complete Audit Trail",
    description: "Detailed logging, request tracking, pillar-level outputs, and compliance-ready reporting."
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "Data Privacy",
    description: "End-to-end encryption, GDPR compliance, data residency options, and configurable retention policies."
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "High Availability",
    description: "Multi-region deployment, automatic failover, load balancing, and 24/7 monitoring."
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: "Compliance Certified",
    description: "SOC 2 Type II, HIPAA compliant, ISO 27001 certified with comprehensive audit capabilities."
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    title: "Custom Policies",
    description: "Organization-specific rules, custom thresholds, weighted scoring, and automated responses."
  }
];

export default function LandingPage() {
  return (
    <>
      <main>
        <header className="topbar shell">
          <BrandLogo />
          <nav className="topnav">
            <Link href="#pillars">Trust Pillars</Link>
            <Link href="#features">Security</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
          <div className="top-actions">
            <Link className="ghost-btn" href="/login">
              Sign In
            </Link>
            <Link className="solid-btn" href="/signup">
              Get Started
            </Link>
          </div>
        </header>

        <section className="hero-section">
          <div className="shell">
            <div className="hero-grid">
              <div className="hero-text">
                <div className="hero-badge">
                  <span className="hero-badge-dot" />
                  Enterprise AI Governance
                </div>
                <h1 className="hero-title">
                  Secure Every AI<br />
                  Output <span className="accent">Before Production</span>
                </h1>
                <p className="hero-subtitle">
                  AegisAI empowers enterprises with five-pillar trust orchestration, 
                  ensuring every AI interaction is safe, compliant, and aligned with 
                  your brand values — protecting your reputation while accelerating 
                  AI adoption.
                </p>
                <div className="hero-actions">
                  <Link className="solid-btn large" href="/signup">
                    Start Free Trial
                  </Link>
                  <Link className="ghost-btn large" href="/dashboard">
                    View Dashboard
                  </Link>
                </div>
              </div>
              <div className="hero-visual">
                <HeroAnimation />
              </div>
            </div>
          </div>
        </section>

        <section className="trust-bar">
          <div className="shell">
            <p className="trust-bar-label">Trusted enterprise grade models</p>
            <p className="trust-bar-sub">
              Every pillar is powered by best-in-class open-source AI safety models — free tier, production-ready.
            </p>
          </div>
          <ModelCarousel />
        </section>

        <section className="stats-section">
          <div className="shell">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">&lt;200ms</div>
                <div className="stat-label">Average Evaluation Latency</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">99.9%</div>
                <div className="stat-label">Production Uptime SLA</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">5 Pillars</div>
                <div className="stat-label">Comprehensive Trust Engine</div>
              </div>
            </div>
          </div>
        </section>

        <section className="pillars-section" id="pillars">
          <div className="shell">
            <div className="section-header">
              <h2>Five-Pillar Trust Engine</h2>
              <p>
                Comprehensive AI evaluation framework analyzing every interaction 
                across five critical dimensions for consistent policy enforcement.
              </p>
            </div>
            <div className="pillars-list">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="pillar-item">
                  <div className="pillar-num">{pillar.num}</div>
                  <div className="pillar-content">
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="shell">
            <div className="section-header">
              <h2>Enterprise-Grade Security</h2>
              <p>
                Built with security-first principles for modern enterprises 
                that demand the highest standards of protection.
              </p>
            </div>
            <div className="features-grid">
              {features.map((f) => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="shell">
            <div className="cta-box">
              <h2>Ready to Secure Your AI?</h2>
              <p>
                Join leading enterprises using AegisAI for safe, compliant AI interactions.
              </p>
              <div className="cta-actions">
                <Link className="solid-btn large" href="/signup">
                  Start Free Trial
                </Link>
                <Link className="ghost-btn large" href="/login">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
