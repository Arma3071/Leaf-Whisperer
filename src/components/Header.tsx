import React from "react";
import { Leaf, Shield } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-4 md:px-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm" />
            <div className="relative flex items-center justify-center h-10 w-10 rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">AgriGuard AI</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Plant Disease Detection</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">AI-Powered Analysis</span>
        </div>
      </div>
    </header>
  );
};
