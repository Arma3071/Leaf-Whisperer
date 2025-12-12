import React from "react";
import { cn } from "@/lib/utils";

interface GlowOrbProps {
  className?: string;
  color?: "primary" | "accent" | "mild" | "severe";
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

const colorMap = {
  primary: "bg-primary/30",
  accent: "bg-accent/40",
  mild: "bg-severity-mild/30",
  severe: "bg-severity-severe/30",
};

const sizeMap = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
  xl: "w-[500px] h-[500px]",
};

export const GlowOrb: React.FC<GlowOrbProps> = ({
  className,
  color = "primary",
  size = "md",
  animate = true,
}) => {
  return (
    <div
      className={cn(
        "absolute rounded-full blur-3xl pointer-events-none",
        colorMap[color],
        sizeMap[size],
        animate && "animate-pulse-slow",
        className
      )}
    />
  );
};
