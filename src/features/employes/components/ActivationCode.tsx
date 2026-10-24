"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

export interface ActivationCodeProps {
  /** Code généré (null = pas encore généré). */
  codeActivation: string | null;
  /** ISO 8601 UTC — date d'expiration. null = pas de code. */
  expireLe: string | null;
  generating?: boolean;
  onGenerate: () => void;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Expiré";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ActivationCode({ codeActivation, expireLe, generating, onGenerate }: ActivationCodeProps) {
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!expireLe) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemaining(0);
      return;
    }

    function tick() {
      const diff = new Date(expireLe!).getTime() - Date.now();
      setRemaining(Math.max(0, diff));
      if (diff <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [expireLe]);

  const isExpired = remaining <= 0;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="mb-3 text-sm font-medium text-gray-700">Code d'activation</h3>

      {codeActivation && !isExpired ? (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg bg-blue-50 px-6 py-4">
            <span className="font-mono text-3xl font-bold tracking-[0.3em] text-blue-700">
              {codeActivation}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Expire dans :{" "}
            <span className="font-mono font-medium text-gray-700">
              {formatCountdown(remaining)}
            </span>
          </p>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(codeActivation)}
            className="text-sm text-blue-600 hover:underline"
          >
            Copier le code
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {codeActivation && isExpired && (
            <p className="text-sm text-red-600">Le code a expiré.</p>
          )}
          <Button onClick={onGenerate} loading={generating} variant="secondary">
            {codeActivation ? "Régénérer un code" : "Générer un code d'activation"}
          </Button>
          {!codeActivation && (
            <p className="text-xs text-gray-400">
              Valide 3 minutes après génération.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
