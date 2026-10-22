"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EntrepriseList } from "@/features/entreprises/components/EntrepriseList";
import { entreprisesApi } from "@/features/entreprises/api";
import type { Entreprise } from "@/features/entreprises/types";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

export default function EntreprisesPage() {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function fetchEntreprises(searchValue: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await entreprisesApi.list({ search: searchValue || undefined });
      setEntreprises(data);
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

  useEffect(() => {
    fetchEntreprises("");
  }, []);

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    fetchEntreprises(value);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Entreprises</h1>
        <Link href="/entreprises/nouvelle">
          <Button>+ Nouvelle entreprise</Button>
        </Link>
      </div>

      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Rechercher par NIF ou nom…"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <EntrepriseList entreprises={entreprises} loading={loading} />
    </div>
  );
}
