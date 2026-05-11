import { supabase } from "@/integrations/supabase/client";

export type Severity = "healthy" | "mild" | "severe";

export interface PlantDiseaseAnalysis {
  rawLabel: string;
  plant: string;
  disease: string;
  confidence: number; // 0..1
  confidenceLabel: string; // e.g. "94.2%"
  severity: Severity;
}

interface HFPrediction {
  label: string;
  score: number;
}

function parseLabel(rawLabel: string): { plant: string; disease: string; isHealthy: boolean } {
  // Labels look like "Tomato___Early_blight" or "Apple___healthy"
  const [plantRaw, diseaseRaw = ""] = rawLabel.split("___");
  const plant = plantRaw.replace(/_/g, " ").trim() || "Unknown";
  const diseaseClean = diseaseRaw.replace(/_/g, " ").trim();
  const isHealthy = /healthy/i.test(diseaseClean) || diseaseClean === "";
  const disease = isHealthy ? "None Detected" : diseaseClean || "Unknown disease";
  return { plant, disease, isHealthy };
}

function deriveSeverity(isHealthy: boolean, disease: string, confidence: number): Severity {
  if (isHealthy) return "healthy";
  const d = disease.toLowerCase();
  if (/(late|severe|black rot|bacterial|virus|blight)/.test(d) && confidence >= 0.7) {
    return "severe";
  }
  if (/(early|mild|spot|rust|scab|mosaic)/.test(d)) return "mild";
  return confidence >= 0.85 ? "severe" : "mild";
}

async function fileToBytes(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}

export async function analyzePlantDisease(file: File): Promise<PlantDiseaseAnalysis> {
  const bytes = await fileToBytes(file);

  const { data, error } = await supabase.functions.invoke("analyze-plant", {
    body: bytes,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to call diagnosis service");
  }

  const predictions = (data as { predictions?: HFPrediction[]; error?: string })?.predictions;
  if (!Array.isArray(predictions)) {
    throw new Error((data as { error?: string })?.error || "Unexpected response from diagnosis service");
  }

  const top = [...predictions].sort((a, b) => b.score - a.score)[0];
  if (!top) throw new Error("No predictions returned by the model");

  const { plant, disease, isHealthy } = parseLabel(top.label);
  const severity = deriveSeverity(isHealthy, disease, top.score);

  return {
    rawLabel: top.label,
    plant,
    disease,
    confidence: top.score,
    confidenceLabel: `${(top.score * 100).toFixed(1)}%`,
    severity,
  };
}
