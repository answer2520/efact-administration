"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi } from "./api";
import { setAuthToken } from "./session";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/entreprises";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await authApi.login(username, password);
      setAuthToken(token);
      router.push(decodeURIComponent(callbackUrl));
    } catch (err) {
      setError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0052CC]">
          e<span className="text-[#00A8FF]">Fact</span>
        </h1>
        <p className="mt-2 text-sm text-[#6B778C]">
          Connectez-vous pour accéder à l&apos;administration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Nom d'utilisateur"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          required
          autoComplete="username"
        />

        <Input
          label="Mot de passe"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <Button type="submit" loading={loading} className="mt-2 w-full">
          Se connecter
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-[#6B778C]">
        Mode démo : <span className="font-medium text-[#172B4D]">admin / admin</span>
      </p>
    </div>
  );
}
