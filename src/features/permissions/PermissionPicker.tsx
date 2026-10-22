"use client";

import { useMemo } from "react";
import { PERMISSION_CATALOG, getModulePermissionKeys } from "./permission-catalog";

export interface PermissionPickerProps {
  /** Clés sélectionnées, ex. ["entreprises:read", "employes:create"] */
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
}

export function PermissionPicker({ selected, onChange, disabled }: PermissionPickerProps) {
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function togglePermission(key: string) {
    if (selectedSet.has(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  }

  function toggleModule(moduleKey: string) {
    const moduleKeys = getModulePermissionKeys(moduleKey);
    const allChecked = moduleKeys.every((k) => selectedSet.has(k));
    if (allChecked) {
      onChange(selected.filter((k) => !moduleKeys.includes(k)));
    } else {
      const merged = new Set([...selected, ...moduleKeys]);
      onChange([...merged]);
    }
  }

  function selectAll() {
    const allKeys = PERMISSION_CATALOG.flatMap((m) =>
      m.actions.map((a) => `${m.key}:${a.key}`),
    );
    onChange(allKeys);
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Permissions</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            disabled={disabled}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            Tout cocher
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="text-sm text-gray-500 hover:underline disabled:opacity-50"
          >
            Tout décocher
          </button>
        </div>
      </div>

      {PERMISSION_CATALOG.map((module) => {
        const moduleKeys = getModulePermissionKeys(module.key);
        const allChecked = moduleKeys.every((k) => selectedSet.has(k));
        const someChecked = moduleKeys.some((k) => selectedSet.has(k));

        return (
          <div
            key={module.key}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center gap-2 border-b pb-2">
              <input
                type="checkbox"
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = !allChecked && someChecked;
                }}
                onChange={() => toggleModule(module.key)}
                disabled={disabled}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-800">{module.label}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {module.actions.map((action) => {
                const key = `${module.key}:${action.key}`;
                return (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSet.has(key)}
                      onChange={() => togglePermission(key)}
                      disabled={disabled}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {action.label}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
