import React from "react";
import { cn } from "@/lib/utils";

const leaves = [
  { size: 24, delay: 0, duration: 20, left: "10%" },
  { size: 18, delay: 3, duration: 25, left: "25%" },
  { size: 32, delay: 7, duration: 22, left: "45%" },
  { size: 20, delay: 2, duration: 28, left: "65%" },
  { size: 28, delay: 5, duration: 24, left: "80%" },
  { size: 16, delay: 10, duration: 26, left: "90%" },
];

export const FloatingLeaves: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {leaves.map((leaf, i) => (
        <div
          key={i}
          className="absolute animate-float-leaf"
          style={{
            left: leaf.left,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
          }}
        >
          <svg
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary/20"
          >
            <path
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.4 0 2.7-.3 3.9-.8C11.5 18.7 8.5 14 8.5 8.5c0-1.4.3-2.7.8-3.9.3-.7.7-1.4 1.2-2 .4-.5.8-.9 1.5-1.4V2z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
