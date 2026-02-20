import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-top">
          <BrandLogo />
        </div>
        <AuthForm mode="signup" />
        <div className="auth-back">
          <Link href="/">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
