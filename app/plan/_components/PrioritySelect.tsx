"use client";

import { useEffect, useState } from "react";
import { priorityBadgeClass } from "../_lib/priority";
import type { Priority } from "../_lib/types";
import { PRIORITY_OPTIONS } from "../_lib/types";

type PrioritySelectProps = {
  value: Priority;
  onChange: (priority: Priority) => void;
};

export default function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  // Customizable <select> allows a <button> trigger; React's HTML nest check does not.
  // Only inject the trigger after we know the browser opts into appearance: base-select.
  const [useBaseSelect, setUseBaseSelect] = useState(false);
  const label = PRIORITY_OPTIONS.find((opt) => opt.value === value)?.label ?? value.toUpperCase();

  useEffect(() => {
    setUseBaseSelect(typeof CSS !== "undefined" && CSS.supports("appearance", "base-select"));
  }, []);

  return (
    <select
      value={value}
      aria-label="Priority"
      data-priority={value}
      className={`plan-priority-select ${priorityBadgeClass(value)}`}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onChange={(event) => onChange(event.target.value as Priority)}
    >
      {useBaseSelect ? (
        <button type="button" className="plan-priority-select__trigger">
          <span className="plan-priority-select__label">{label}</span>
          <span className="plan-priority-select__caret" aria-hidden="true">
            <CaretDownIcon />
          </span>
        </button>
      ) : null}
      {PRIORITY_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className={`plan-priority-option plan-priority-option--${opt.value}`}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function CaretDownIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path
        d="M1.5 2.75L4 5.25L6.5 2.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
