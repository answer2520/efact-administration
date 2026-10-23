"use client";

import { Button } from "@/components/ui/Button";
import type { Device } from "../types";

export interface DeviceCardProps {
  device: Device | null;
  /** En cours de dissociation. */
  unlinking?: boolean;
  /** Callback pour dissocier l'appareil. */
  onUnlink?: () => void;
}

export function DeviceCard({ device, unlinking, onUnlink }: DeviceCardProps) {
  if (!device) {
    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Appareil associé</h3>
        <p className="text-sm text-gray-400">
          Aucun appareil n&apos;est actuellement associé à cet employé.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Appareil associé</h3>
        <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
          Actif
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {device.model && (
          <>
            <dt className="text-gray-500">Modèle</dt>
            <dd className="text-gray-900">{device.model}</dd>
          </>
        )}
        {device.os && (
          <>
            <dt className="text-gray-500">Système</dt>
            <dd className="text-gray-900">{device.os}</dd>
          </>
        )}
        <dt className="text-gray-500">Enregistré le</dt>
        <dd className="text-gray-900">
          {new Date(device.registeredAt).toLocaleDateString("fr-FR")}
        </dd>
        {device.lastSeen && (
          <>
            <dt className="text-gray-500">Dernière activité</dt>
            <dd className="text-gray-900">
              {new Date(device.lastSeen).toLocaleDateString("fr-FR")}
            </dd>
          </>
        )}
      </dl>

      {onUnlink && (
        <div className="mt-4 border-t pt-3">
          <Button variant="danger" size="sm" loading={unlinking} onClick={onUnlink}>
            Dissocier l&apos;appareil
          </Button>
        </div>
      )}
    </div>
  );
}
