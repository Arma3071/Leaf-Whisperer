import React, { useCallback, useState } from "react";
import { Upload, Camera, Image } from "lucide-react";
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
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative flex flex-col items-center justify-center gap-6 p-8 md:p-12",
        "rounded-2xl border-2 border-dashed transition-all duration-300",
        "bg-card/50 backdrop-blur-sm",
        isDragOver
          ? "border-primary bg-accent/50 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-accent/30",
        isProcessing && "pointer-events-none opacity-50"
      )}
    >
      {/* Animated ring effect */}
      <div className="relative">
        <div className={cn(
          "absolute inset-0 rounded-full bg-primary/20",
          isDragOver && "animate-pulse-ring"
        )} />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-10 w-10 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Drop your leaf image here
        </h3>
        <p className="text-sm text-muted-foreground">
          or click to browse your files
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Image className="h-4 w-4" />
            Browse Files
          </span>
        </label>
        
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            className="hidden"
          />
          <span className="inline-flex items-center gap-2 rounded-lg border border-primary bg-transparent px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10">
            <Camera className="h-4 w-4" />
            Take Photo
          </span>
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        Supports JPG, PNG, WEBP • Max 20MB
      </p>
    </div>
  );
};
