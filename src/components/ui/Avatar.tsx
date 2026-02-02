"use client";

import React from "react";
import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({
  src,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };

  const imageSizes = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-xs overflow-hidden bg-surface-100 border border-surface-200",
          sizes[size],
          className,
        )}
      >
        <Image
          src={src}
          alt={name}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xs bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold shadow-soft",
        sizes[size],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
