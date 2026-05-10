const HF_MODEL_URL =
  "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

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
  const token = import.meta.env.VITE_HF_TOKEN as string | undefined;
  if (!token) {
    throw new Error(
      "VITE_HF_TOKEN is not set. Add it in Workspace Settings → Build Secrets."
    );
  }

  const bytes = await fileToBytes(file);

  const res = await fetch(HF_MODEL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: bytes,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HuggingFace API error [${res.status}]: ${text || res.statusText}`);
  }

  const data = (await res.json()) as HFPrediction[] | { error?: string };

  if (!Array.isArray(data)) {
    throw new Error(data?.error || "Unexpected response from HuggingFace API");
  }

  const top = [...data].sort((a, b) => b.score - a.score)[0];
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