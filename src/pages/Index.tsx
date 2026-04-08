import React, { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { ProcessingLoader } from "@/components/ProcessingLoader";
import { DiagnosisResult, DiagnosisData } from "@/components/DiagnosisResult";
import { ParticleField } from "@/components/ParticleField";
import { FloatingLeaves } from "@/components/FloatingLeaves";
import { GlowOrb } from "@/components/GlowOrb";
import { StatsCounter } from "@/components/StatsCounter";
import { Sparkles, Zap, Shield, Leaf } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useScanHistory } from "@/hooks/useScanHistory";

type AppState = "upload" | "processing" | "result";

// Mock diagnosis data for demo
const mockDiagnosis: DiagnosisData = {
  plant: "Tomato",
  disease: "Early Blight",
  severity: "mild",
  confidence: "94.2%",
  recommendations: [
    "Remove affected leaves immediately to prevent spread",
    "Apply fungicide containing chlorothalonil or copper",
    "Improve air circulation around plants",
    "Water at the base to keep leaves dry",
  ],
};

const Index: React.FC = () => {
  const { user } = useAuth();
  const { saveScan } = useScanHistory();
  const [appState, setAppState] = useState<AppState>("upload");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);

  const handleImageUpload = useCallback((file: File, preview: string) => {
    setImagePreview(preview);
    setAppState("processing");

    setTimeout(() => {
      const severities: Array<"healthy" | "mild" | "severe"> = ["healthy", "mild", "severe"];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      
      setDiagnosisData({
        ...mockDiagnosis,
        severity: randomSeverity,
        disease: randomSeverity === "healthy" ? "None Detected" : mockDiagnosis.disease,
        recommendations: randomSeverity === "healthy" 
          ? ["Continue regular watering schedule", "Monitor for any changes", "Maintain proper spacing between plants"]
          : mockDiagnosis.recommendations,
      });
      setAppState("result");
    }, 3000);
  }, []);

  const handleScanNew = useCallback(() => {
    setAppState("upload");
    setImagePreview("");
    setDiagnosisData(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Effects */}
      <ParticleField />
      <FloatingLeaves />
      
      {/* Gradient Orbs */}
      <GlowOrb className="top-20 -left-32" color="primary" size="lg" />
      <GlowOrb className="bottom-40 -right-32" color="accent" size="xl" />
      <GlowOrb className="top-1/2 left-1/4" color="primary" size="md" />
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-lg">
          {appState === "upload" && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Powered by Advanced AI</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="text-foreground">Diagnose Your</span>
                  <br />
                  <span className="text-gradient">Plants Instantly</span>
                </h2>
                
                <p className="text-muted-foreground max-w-md mx-auto text-base">
                  Upload a photo of your plant's leaf and our AI will analyze it 
                  for diseases and provide actionable recommendations.
                </p>
              </div>
              
              <UploadZone 
                onImageUpload={handleImageUpload} 
                isProcessing={false} 
              />
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { icon: Zap, label: "Instant Analysis" },
                  { icon: Shield, label: "95% Accuracy" },
                  { icon: Leaf, label: "38+ Species" },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm"
                  >
                    <feature.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-muted-foreground">{feature.label}</span>
                  </div>
                ))}
              </div>
              
              <StatsCounter />
            </div>
          )}

          {appState === "processing" && (
            <ProcessingLoader imagePreview={imagePreview} />
          )}

          {appState === "result" && diagnosisData && (
            <DiagnosisResult
              data={diagnosisData}
              imagePreview={imagePreview}
              onScanNew={handleScanNew}
            />
          )}
        </div>
      </main>

      <footer className="py-4 px-4 glass border-t border-border/30 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            AgriGuard AI • Empowering farmers with intelligent crop protection
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-severity-healthy animate-pulse" />
            System Online
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
