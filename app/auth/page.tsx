import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Sign In" };

export default function AuthPage() {
  return (
    <main className="av-main">
      <AuthForm />
    </main>
  );
}
