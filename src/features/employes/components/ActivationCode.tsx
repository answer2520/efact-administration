"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

export interface ActivationCodeProps {
  /** Code à afficher (null tant qu'il n'est pas généré). */
  code: string | null;
  /** ISO date d'expiration du code. */
  expiresAt: string | null;
  /** En cours de génération. */
  generating?: boolean;
  /** Callback pour générer un nouveau code. */
  onGenerate: () => void;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Expiré";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ActivationCode({ code, expiresAt, generating, onGenerate }: ActivationCodeProps) {
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!expiresAt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemaining(0);
      return;
    }

    function update() {
      const diff = new Date(expiresAt!).getTime() - Date.now();
      setRemaining(Math.max(0, diff));
      if (diff <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    update();
    intervalRef.current = setInterval(update, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [expiresAt]);

  const isExpired = remaining <= 0;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="mb-3 text-sm font-medium text-gray-700">Code d'activation</h3>

      {code && !isExpired ? (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg bg-blue-50 px-6 py-4">
            <span className="font-mono text-3xl font-bold tracking-[0.3em] text-blue-700">
              {code}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Valide pendant : <span className="font-mono font-medium text-gray-700">{formatCountdown(remaining)}</span>
          </p>
          <p className="text-xs text-gray-400">
            Transmettez ce code à l&apos;employé pour activer son application mobile.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {code && isExpired && (
            <p className="text-sm text-red-600">Le code a expiré.</p>
          )}
          <Button onClick={onGenerate} loading={generating} variant="secondary">
            {code ? "Régénérer un code" : "Générer un code d&apos;activation"}
          </Button>
          {!code && (
            <p className="text-xs text-gray-400">
              Le code sera valide 3 minutes après génération.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
