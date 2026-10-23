import { Suspense } from "react";
import { LoginForm } from "@/features/auth/LoginForm";

export default function ConnexionPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #E8EEF6 0%, #D2DCE8 100%)",
      }}
    >
      <Suspense fallback={<div className="text-sm text-[#6B778C]">Chargement…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
