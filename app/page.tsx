import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";

const pillars = [
  {
    title: "Safety & Toxicity Detection",
    description: "Real-time detection and filtering of harmful, offensive, or inappropriate content across all AI interactions."
  },
  {
    title: "Hallucination Prevention",
    description: "Verify accuracy and consistency of AI outputs against trusted knowledge bases and factual sources."
  },
  {
    title: "Bias & Fairness Analysis",
    description: "Identify and mitigate demographic, cultural, and systemic biases to ensure fair AI responses."
  },
  {
    title: "Prompt Security Shield",
    description: "Advanced protection against injection attacks, jailbreaks, and adversarial prompt manipulation."
  },
  {
    title: "Compliance Enforcement",
    description: "Automated adherence to regulatory requirements, industry standards, and organizational policies."
  }
];

export default function LandingPage() {
  return (
    <>
      <main className="landing-page">
        <header className="topbar shell">
          <BrandLogo />
          <nav className="topnav">
            <Link href="#features">Features</Link>
            <Link href="#pillars">Trust Pillars</Link>
            <Link href="#security">Security</Link>
          </nav>
          <div className="top-actions">
            <Link className="ghost-btn" href="/login">
              Log in
            </Link>
            <Link className="solid-btn" href="/signup">
              Get Started
            </Link>
          </div>
        </header>

        <section className="hero shell">
          <div className="hero-image">
            <div className="robot-container">
              <Image 
                src="/AIRobot.jpg" 
                alt="AI Robot" 
                width={700} 
                height={700}
                priority
              />
            </div>
          </div>
          
          <div className="hero-content">
            <p className="tag">Enterprise AI Governance</p>
            <h1>Secure Every AI Output Before Production</h1>
            <p>
              AegisAI empowers your brand with enterprise-grade AI governance. 
              Our five-pillar trust orchestration ensures every AI interaction 
              is safe, compliant, and aligned with your brand values—protecting 
              your reputation while accelerating AI adoption.
            </p>
            <div className="hero-actions">
              <Link className="solid-btn" href="/signup">
                Start Free Trial
              </Link>
              <Link className="ghost-btn" href="/dashboard">
                View Dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="shell section" style={{ padding: '3rem 0' }}>
          <div className="stats">
            <article>
              <strong>&lt;200ms</strong>
              <span>Average Evaluation Latency</span>
            </article>
            <article>
              <strong>99.9%</strong>
              <span>Production Uptime SLA</span>
            </article>
            <article>
              <strong>5 Pillars</strong>
              <span>Comprehensive Trust Engine</span>
            </article>
          </div>
        </section>

        <section className="shell section" id="pillars">
          <h2>Five-Pillar Trust Engine</h2>
          <p className="muted">
            Comprehensive AI evaluation framework analyzing every interaction 
            across five critical dimensions for consistent policy enforcement.
          </p>
          <div className="grid">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="card">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="shell section" id="security">
          <h2>Enterprise-Grade Security</h2>
          <p className="muted">
            Built with security-first principles for modern enterprises.
          </p>
          <div className="grid">
            <article className="card">
              <h3>Secure Access Control</h3>
              <p>
                JWT authentication, API key management, role-based access, 
                and multi-factor authentication support.
              </p>
            </article>
            <article className="card">
              <h3>Complete Audit Trail</h3>
              <p>
                Detailed logging, request tracking, pillar-level outputs, 
                and compliance-ready reporting.
              </p>
            </article>
            <article className="card">
              <h3>Data Privacy</h3>
              <p>
                End-to-end encryption, GDPR compliance, data residency options, 
                and configurable retention policies.
              </p>
            </article>
            <article className="card">
              <h3>High Availability</h3>
              <p>
                Multi-region deployment, automatic failover, load balancing, 
                and 24/7 monitoring.
              </p>
            </article>
            <article className="card">
              <h3>Compliance Certified</h3>
              <p>
                SOC 2 Type II, HIPAA compliant, ISO 27001 certified with 
                comprehensive audit capabilities.
              </p>
            </article>
            <article className="card">
              <h3>Custom Policies</h3>
              <p>
                Organization-specific rules, custom thresholds, weighted scoring, 
                and automated responses.
              </p>
            </article>
          </div>
        </section>

        <section className="shell section" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <h2>Ready to Secure Your AI?</h2>
          <p className="muted" style={{ marginBottom: '2rem' }}>
            Join leading enterprises using AegisAI for safe, compliant AI interactions.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link className="solid-btn" href="/signup">
              Start Free Trial
            </Link>
            <Link className="ghost-btn" href="/login">
              Sign In
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
