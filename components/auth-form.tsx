"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || payload.detail || "Authentication failed");
      }
      window.location.href = "/dashboard";
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <h1>{isSignup ? "Create Your Account" : "Welcome Back"}</h1>
      <p className="muted">
        {isSignup 
          ? "Start securing your AI outputs with enterprise-grade trust orchestration." 
          : "Sign in to access your AegisAI dashboard and manage your AI governance."}
      </p>
      <label>
        <span>Work Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
        />
      </label>
      <label>
        <span>Password</span>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 characters"
        />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="solid-btn" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
        {loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
      </button>
      <p className="switch">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Sign in" : "Sign up for free"}
        </Link>
      </p>
    </form>
  );
}
