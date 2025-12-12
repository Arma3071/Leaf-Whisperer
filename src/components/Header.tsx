import React from "react";
import { Leaf, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-4 md:px-6 glass sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Animated Logo */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent-foreground rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-accent-foreground animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-gradient">AgriGuard</span>
              <span className="text-foreground"> AI</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Intelligent Plant Disease Detection
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-severity-healthy opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-severity-healthy" />
          </div>
          <span className="text-muted-foreground hidden sm:inline">AI Active</span>
          <Shield className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  );
};
