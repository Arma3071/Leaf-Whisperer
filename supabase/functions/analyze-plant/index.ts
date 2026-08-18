import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible";
import { generateText, Output } from "npm:ai";
import { z } from "npm:zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PredictionsSchema = z.object({
  predictions: z
    .array(
      z.object({
        label: z
          .string()
          .describe('Format: "<Plant> with <Disease>" or "<Plant> with Healthy"'),
        score: z.number().min(0).max(1),
      }),
    )
    .min(1)
    .max(4),
});

function toBase64(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < arr.length; i += chunk) {
    binary += String.fromCharCode(...arr.subarray(i, i + chunk));
  }
  return btoa(binary);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "AI is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contentType = req.headers.get("content-type") || "application/octet-stream";
    const bytes = await req.arrayBuffer();

    if (!bytes.byteLength) {
      return new Response(JSON.stringify({ error: "Empty image body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": key },
    });

    const dataUrl = `data:${contentType.startsWith("image/") ? contentType : "image/jpeg"};base64,${toBase64(bytes)}`;

    const { output } = await generateText({
      model: gateway("google/gemini-3.6-flash"),
      output: Output.object({ schema: PredictionsSchema }),
      system:
        "You are a plant pathology classifier trained on the PlantVillage dataset (38 classes). " +
        "Given a photo, return up to 4 ranked predictions with calibrated confidence scores summing to about 1. " +
        'Each label MUST use the exact format "<Plant> with <Disease>" (e.g. "Tomato with Late Blight") ' +
        'or "<Plant> with Healthy" for a healthy leaf. ' +
        "If the image is not a plant leaf, return several low-confidence predictions (all below 0.4).",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Diagnose this plant leaf." },
            { type: "image", image: dataUrl },
          ],
        },
      ],
    });

    const predictions = output?.predictions ?? [];
    if (!predictions.length) {
      return new Response(JSON.stringify({ error: "No predictions returned" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ predictions }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});