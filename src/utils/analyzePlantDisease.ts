import { supabase } from "@/integrations/supabase/client";

export type Severity = "healthy" | "mild" | "severe";
type SeverityWithUnknown = Severity | "unknown";

const SEVERITY_MAP: Record<string, Severity> = {
  "Apple___Apple_scab": "mild",
  "Apple___Black_rot": "severe",
  "Apple___Cedar_apple_rust": "mild",
  "Apple___healthy": "healthy",
  "Blueberry___healthy": "healthy",
  "Cherry_(including_sour)___Powdery_mildew": "mild",
  "Cherry_(including_sour)___healthy": "healthy",
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": "mild",
  "Corn_(maize)___Common_rust_": "mild",
  "Corn_(maize)___Northern_Leaf_Blight": "severe",
  "Corn_(maize)___healthy": "healthy",
  "Grape___Black_rot": "severe",
  "Grape___Esca_(Black_Measles)": "severe",
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": "mild",
  "Grape___healthy": "healthy",
  "Orange___Haunglongbing_(Citrus_greening)": "severe",
  "Peach___Bacterial_spot": "severe",
  "Peach___healthy": "healthy",
  "Pepper,_bell___Bacterial_spot": "severe",
  "Pepper,_bell___healthy": "healthy",
  "Potato___Early_blight": "mild",
  "Potato___Late_blight": "severe",
  "Potato___healthy": "healthy",
  "Raspberry___healthy": "healthy",
  "Soybean___healthy": "healthy",
  "Squash___Powdery_mildew": "mild",
  "Strawberry___Leaf_scorch": "mild",
  "Strawberry___healthy": "healthy",
  "Tomato___Bacterial_spot": "severe",
  "Tomato___Early_blight": "mild",
  "Tomato___Late_blight": "severe",
  "Tomato___Leaf_Mold": "mild",
  "Tomato___Septoria_leaf_spot": "mild",
  "Tomato___Spider_mites Two-spotted_spider_mite": "mild",
  "Tomato___Target_Spot": "mild",
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "severe",
  "Tomato___Tomato_mosaic_virus": "severe",
  "Tomato___healthy": "healthy",
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
  const normalizedLabel = top.label.replace(/_{2,}/g, "___");
  const severity = SEVERITY_MAP[normalizedLabel] ?? SEVERITY_MAP[top.label] ?? "unknown";
  const { plant, disease } = parseLabel(normalizedLabel);

  return {
    rawLabel: top.label,
    plant,
    disease,
    confidence: top.score,
    confidenceLabel: `${(top.score * 100).toFixed(1)}%`,
    severity,
  };
}
