import { supabase } from "@/integrations/supabase/client";

export type Severity = "healthy" | "mild" | "severe";
type SeverityWithUnknown = Severity | "unknown";

const getSeverity = (label: string): Severity => {
  const l = label.toLowerCase().replace(/_/g, " ");

  if (l.includes("healthy")) return "healthy";

  const severeKeywords = [
    "late blight", "black rot", "mosaic virus", "yellow leaf curl",
    "citrus greening", "haunglongbing", "esca", "black measles",
    "northern leaf blight",
  ];

  if (severeKeywords.some((k) => l.includes(k))) return "severe";

  return "mild";
};

export interface PlantDiseaseAnalysis {
  rawLabel: string;
  plant: string;
  disease: string;
  confidence: number; // 0..1
  confidenceLabel: string; // e.g. "94.2%"
  severity: SeverityWithUnknown;
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

  console.log("Raw label from model:", top.label);
  const severity: SeverityWithUnknown = getSeverity(top.label);
  const { plant, disease } = parseLabel(top.label);

  return {
    rawLabel: top.label,
    plant,
    disease,
    confidence: top.score,
    confidenceLabel: `${(top.score * 100).toFixed(1)}%`,
    severity,
  };
}
