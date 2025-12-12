import React from "react";
import { Leaf, Cpu, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingLoaderProps {
  imagePreview: string;
}

const steps = [
  { icon: Search, label: "Detecting leaf structure", delay: 0 },
  { icon: Cpu, label: "Analyzing with AI model", delay: 1 },
  { icon: Leaf, label: "Identifying disease patterns", delay: 2 },
];

export const ProcessingLoader: React.FC<ProcessingLoaderProps> = ({ imagePreview }) => {
  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in-up">
      {/* Image preview with advanced scanning effect */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Corner brackets */}
        <div className="absolute -inset-4 pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
        </div>
        
        <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-primary/20">
          <img
            src={imagePreview}
            alt="Uploaded leaf"
            className="h-64 w-64 object-cover"
          />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
          
          {/* Scanning line */}
          <div 
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-lg animate-scan-line"
            style={{ boxShadow: '0 0 20px 5px hsl(var(--primary) / 0.5)' }}
          />
          
          {/* Corner detection points */}
          {[
            "top-4 left-4",
            "top-4 right-4",
            "bottom-4 left-4",
            "bottom-4 right-4",
          ].map((pos, i) => (
            <div
              key={i}
              className={cn("absolute w-2 h-2 rounded-full bg-primary animate-pulse", pos)}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        
        {/* Rotating ring */}
        <div className="absolute -inset-6 rounded-3xl border border-primary/20 animate-rotate-slow" />
      </div>

      {/* Processing steps */}
      <div className="w-full max-w-xs space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl glass animate-fade-in-up"
              style={{ animationDelay: `${step.delay * 0.3}s` }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <span className="text-sm text-foreground flex-1">{step.label}</span>
              <div className="flex gap-0.5">
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    style={{
                      animation: "bounce-dot 1s ease-in-out infinite",
                      animationDelay: `${(i * 3 + j) * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          Analysis in progress...
        </p>
        <p className="text-xs text-muted-foreground/70">
          This usually takes 2-3 seconds
        </p>
      </div>

      <style>{`
        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
