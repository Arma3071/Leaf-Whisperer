import React from "react";
import { Leaf } from "lucide-react";

interface ProcessingLoaderProps {
  imagePreview: string;
}

export const ProcessingLoader: React.FC<ProcessingLoaderProps> = ({ imagePreview }) => {
  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in-up">
      {/* Image preview with scanning effect */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <img
            src={imagePreview}
            alt="Uploaded leaf"
            className="h-64 w-64 object-cover"
          />
          {/* Scanning line effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent animate-pulse" />
          <div 
            className="absolute left-0 right-0 h-1 bg-primary/80 shadow-lg"
            style={{
              animation: "scan 2s ease-in-out infinite",
            }}
          />
        </div>
        
        {/* Pulsing ring */}
        <div className="absolute -inset-4 rounded-3xl border-2 border-primary/30 animate-pulse-ring" />
      </div>

      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Leaf className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold text-foreground">Analyzing your leaf...</h3>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          Our AI is examining the image for signs of disease and calculating severity
        </p>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              style={{
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 4px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
