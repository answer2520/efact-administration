import { Suspense } from "react";
import { LoginForm } from "@/features/auth/LoginForm";

export default function ConnexionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Suspense
        fallback={
          <div className="text-sm text-gray-400">Chargement…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
