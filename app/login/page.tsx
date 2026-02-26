import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-top">
          <BrandLogo />
        </div>
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
        <div className="auth-back">
          <Link href="/">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
