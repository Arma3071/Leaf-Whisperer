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
  const label = rawLabel.replace(/_/g, " ").trim();

  let plant = label;
  let disease = "Unknown";

  const withMatch = label.match(/^(.+?)\s+with\s+(.+)$/i);
  const dashMatch = label.match(/^(.+?)\s+[–-]\s+(.+)$/);
  const tripleMatch = rawLabel.match(/^(.+?)___(.+)$/);

  if (withMatch) {
    plant = withMatch[1].trim();
    disease = withMatch[2].trim();
  } else if (dashMatch) {
    plant = dashMatch[1].trim();
    disease = dashMatch[2].trim();
  } else if (tripleMatch) {
    plant = tripleMatch[1].replace(/_/g, " ").trim();
    disease = tripleMatch[2].replace(/_/g, " ").trim();
  }

  const isHealthy = /healthy/i.test(disease) || disease === "";
  if (isHealthy) disease = "None Detected";

  return { plant: plant || "Unknown", disease: disease || "Unknown", isHealthy };
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
