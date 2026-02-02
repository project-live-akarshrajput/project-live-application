"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GenderFilterProps {
  value: "male" | "female" | "any";
  onChange: (value: "male" | "female" | "any") => void;
}

export default function GenderFilter({ value, onChange }: GenderFilterProps) {
  const options = [
    { value: "any" as const, label: "Anyone" },
    { value: "male" as const, label: "Male" },
    { value: "female" as const, label: "Female" },
  ];

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-sm text-surface-500 mr-2">Match with:</span>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-3 py-1.5 rounded-xs text-sm font-medium transition-all duration-200",
            value === option.value
              ? "bg-primary-500 text-white shadow-button"
              : "bg-surface-100 text-surface-600 hover:bg-surface-200",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
