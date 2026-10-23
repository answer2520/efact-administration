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
      if (err instanceof ApiError) {
        setError(getErrorMessage(err.code));
      } else {
        setError(getErrorMessage("INTERNAL_ERROR"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="mb-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">eFact</h1>
        <p className="mt-1 text-sm text-gray-500">Connectez-vous pour accéder à l&apos;administration</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
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

      <Button type="submit" loading={loading} className="mt-2">
        Se connecter
      </Button>

      <p className="text-center text-xs text-gray-400">
        Mode fake : admin / admin
      </p>
    </form>
  );
}
