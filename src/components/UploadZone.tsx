import React, { useCallback, useState } from "react";
import { Upload, Image, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onImageUpload: (file: File, preview: string) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="relative">
      {/* Decorative corner elements */}
      <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
      <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center gap-6 p-8 md:p-12",
          "rounded-2xl border-2 border-dashed transition-all duration-500",
          "glass overflow-hidden group",
          isDragOver
            ? "border-primary bg-primary/10 scale-[1.02] glow-primary"
            : "border-border/50 hover:border-primary/50 hover:bg-primary/5",
          isProcessing && "pointer-events-none opacity-50"
        )}
      >
        {/* Background shimmer effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          isDragOver ? "opacity-100 animate-shimmer" : "group-hover:opacity-50"
        )} />
        
        {/* Animated icon container */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className={cn(
            "absolute inset-0 rounded-full border-2 border-dashed border-primary/30",
            isDragOver && "animate-rotate-slow"
          )} style={{ width: 100, height: 100, margin: -10 }} />
          
          {/* Pulsing rings */}
          <div className={cn(
            "absolute inset-0 rounded-full bg-primary/10",
            isDragOver && "animate-ping"
          )} style={{ width: 80, height: 80 }} />
          
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <Upload className={cn(
              "h-10 w-10 text-primary transition-transform duration-300",
              isDragOver && "scale-110"
            )} strokeWidth={1.5} />
          </div>
          
          {/* Sparkle decorations */}
          <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-primary animate-pulse" />
          <Zap className="absolute -bottom-1 -left-2 h-3 w-3 text-accent-foreground animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>

        <div className="text-center space-y-2 relative z-10">
          <h3 className="text-xl font-semibold text-foreground">
            {isDragOver ? "Drop it here!" : "Drop your leaf image"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Our AI will analyze it instantly and detect any diseases
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          <label className="cursor-pointer group/btn">
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-100">
              <Image className="h-4 w-4" />
              Browse Files
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground relative z-10">
          <div className="flex -space-x-1">
            <span className="inline-block h-4 w-4 rounded-full bg-primary/20 ring-2 ring-background" />
            <span className="inline-block h-4 w-4 rounded-full bg-primary/30 ring-2 ring-background" />
            <span className="inline-block h-4 w-4 rounded-full bg-primary/40 ring-2 ring-background" />
          </div>
          Supports JPG, PNG, WEBP • Max 20MB
        </div>
      </div>
    </div>
  );
};
