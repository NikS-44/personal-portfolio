"use client";

import { THEMES } from "../_data/themes";

interface ColorPickerProps {
  value: string;
  onChange: (themeId: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-lg font-semibold text-gray-800">Color theme</legend>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {THEMES.map((theme) => (
          <label
            key={theme.id}
            className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition ${
              value === theme.id ? `${theme.border} ring-2 ${theme.ring}` : "border-transparent hover:border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="colorTheme"
              value={theme.id}
              checked={value === theme.id}
              onChange={() => onChange(theme.id)}
              className="sr-only"
            />
            <div className={`h-8 w-full rounded-lg ${theme.bg} border ${theme.border}`} />
            <span className="text-center text-xs font-medium text-gray-700">{theme.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
