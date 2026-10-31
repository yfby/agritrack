"use client";

import { useState } from "react";
import { inputClass, labelClass } from "@/lib/ui";

export function ColorField({
  idPrefix,
  defaultValue,
  error,
}: {
  idPrefix: string;
  defaultValue: string;
  error?: string;
}) {
  const [color, setColor] = useState(defaultValue);

  return (
    <div>
      <label htmlFor={`${idPrefix}-color-text`} className={labelClass}>
        Color
      </label>
      <div className="flex items-center gap-2">
        <input
          id={`${idPrefix}-color-picker`}
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          aria-label="Pick a color"
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-stone-300 bg-white p-1"
        />
        <input
          id={`${idPrefix}-color-text`}
          name="color"
          type="text"
          required
          value={color}
          onChange={(event) => setColor(event.target.value)}
          maxLength={7}
          spellCheck={false}
          placeholder="#16a34a"
          className={`${inputClass} font-mono uppercase`}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
