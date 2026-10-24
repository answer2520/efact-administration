"use client";

import { Button } from "@/components/ui/Button";

export interface DeviceCardProps {
  /** deviceId tel que stocké en base (identifiant matériel du téléphone). */
  deviceId: string | null;
  unlinking?: boolean;
  onUnlink?: () => void;
}

export function DeviceCard({ deviceId, unlinking, onUnlink }: DeviceCardProps) {
  if (!deviceId) {
    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Appareil associé</h3>
        <p className="text-sm text-gray-400">
          Aucun appareil n'est associé à cet employé.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Appareil associé</h3>
        <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
          Associé
        </span>
      </div>

      <dl className="flex flex-col gap-2 text-sm">
        <dt className="text-gray-500">Identifiant appareil</dt>
        <dd className="break-all font-mono text-xs text-gray-700">{deviceId}</dd>
      </dl>

      {onUnlink && (
        <div className="mt-4 border-t pt-3">
          <Button variant="danger" size="sm" loading={unlinking} onClick={onUnlink}>
            Dissocier l'appareil
          </Button>
        </div>
      )}
    </div>
  );
}
