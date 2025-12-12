import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({ value, suffix, label, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, value, delay]);

  return (
    <div ref={ref} className="text-center group">
      <div className="relative">
        <p className="text-3xl md:text-4xl font-bold text-primary tabular-nums">
          {count}
          <span className="text-xl md:text-2xl">{suffix}</span>
        </p>
        <div className="absolute -inset-2 bg-primary/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
      </div>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

export const StatsCounter: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-8 md:gap-12 py-6">
      <StatItem value={38} suffix="+" label="Plant Species" delay={0} />
      <div className="h-12 w-px bg-border/50" />
      <StatItem value={95} suffix="%" label="Accuracy" delay={200} />
      <div className="h-12 w-px bg-border/50" />
      <StatItem value={50} suffix="k+" label="Scans" delay={400} />
    </div>
  );
};
