import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";
import { Footer } from "@/components/footer";

export default function LoginPage() {
  return (
    <>
      <main className="auth-page shell">
        <div className="auth-header">
          <BrandLogo />
          <Link href="/" className="ghost-btn">
            ← Back to Home
          </Link>
        </div>
        <AuthForm mode="login" />
      </main>
      
      <Footer />
    </>
  );
}
