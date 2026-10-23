"use client";

import { useMemo } from "react";
import { PERMISSION_CATALOG, getModulePermissionCodes } from "./permission-catalog";

export interface PermissionPickerProps {
  /** Codes sélectionnés, ex. ["F00", "F01", "CL01"] */
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
}

export function PermissionPicker({ selected, onChange, disabled }: PermissionPickerProps) {
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggleCode(code: string) {
    if (selectedSet.has(code)) {
      onChange(selected.filter((c) => c !== code));
    } else {
      onChange([...selected, code]);
    }
  }

  function toggleModule(moduleName: string) {
    const codes = getModulePermissionCodes(moduleName);
    const allChecked = codes.every((c) => selectedSet.has(c));
    if (allChecked) {
      onChange(selected.filter((c) => !codes.includes(c)));
    } else {
      onChange([...new Set([...selected, ...codes])]);
    }
  }

  function selectAll() {
    const all = PERMISSION_CATALOG.flatMap((m) => m.permissions.map((p) => p.code));
    onChange(all);
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

      {PERMISSION_CATALOG.map((mod) => {
        const codes = mod.permissions.map((p) => p.code);
        const allChecked = codes.every((c) => selectedSet.has(c));
        const someChecked = codes.some((c) => selectedSet.has(c));

        return (
          <div key={mod.module} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <input
                type="checkbox"
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = !allChecked && someChecked;
                }}
                onChange={() => toggleModule(mod.module)}
                disabled={disabled}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-800">{mod.module}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {mod.permissions.map((p) => (
                <label
                  key={p.code}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedSet.has(p.code)}
                    onChange={() => toggleCode(p.code)}
                    disabled={disabled}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-mono text-xs text-gray-400">{p.code}</span>
                  {p.label}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
