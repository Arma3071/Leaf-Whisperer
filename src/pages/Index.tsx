import React, { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { ProcessingLoader } from "@/components/ProcessingLoader";
import { DiagnosisResult, DiagnosisData } from "@/components/DiagnosisResult";

type AppState = "upload" | "processing" | "result";

// Mock diagnosis data for demo - in production, this would come from your API
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
  const [appState, setAppState] = useState<AppState>("upload");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData | null>(null);

  const handleImageUpload = useCallback((file: File, preview: string) => {
    setImagePreview(preview);
    setAppState("processing");

    // Simulate API call - replace with actual backend call
    // const formData = new FormData();
    // formData.append('image', file);
    // fetch('/api/diagnose', { method: 'POST', body: formData })
    //   .then(res => res.json())
    //   .then(data => { setDiagnosisData(data); setAppState('result'); })

    setTimeout(() => {
      // Randomly assign severity for demo purposes
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-lg">
          {appState === "upload" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Diagnose Your Plants
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Upload a photo of your plant's leaf and our AI will analyze it for diseases and provide actionable recommendations.
                </p>
              </div>
              
              <UploadZone 
                onImageUpload={handleImageUpload} 
                isProcessing={false} 
              />
              
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">38+</p>
                  <p className="text-xs text-muted-foreground">Plant Species</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">95%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">50k+</p>
                  <p className="text-xs text-muted-foreground">Scans</p>
                </div>
              </div>
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

      <footer className="py-4 px-4 border-t border-border bg-card/50">
        <p className="text-center text-xs text-muted-foreground">
          AgriGuard AI • Empowering farmers with intelligent crop protection
        </p>
      </footer>
    </div>
  );
};

export default Index;
