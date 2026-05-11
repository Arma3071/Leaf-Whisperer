import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Download, 
  RefreshCw,
  Leaf,
  Activity,
  Percent,
  Info,
  Sparkles,
  Shield,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateDiagnosisReport } from "@/utils/generateReport";

export interface DiagnosisData {
  plant: string;
  disease: string;
  severity: "healthy" | "mild" | "severe" | "unknown";
  confidence: string;
  maskUrl?: string;
  recommendations?: string[];
}

interface DiagnosisResultProps {
  data: DiagnosisData;
  imagePreview: string;
  onScanNew: () => void;
}

const severityConfig = {
  healthy: {
    icon: CheckCircle2,
    label: "Healthy",
    colorClass: "bg-severity-healthy text-severity-healthy-foreground",
    borderClass: "border-severity-healthy/30",
    bgClass: "bg-severity-healthy/10",
    glowClass: "glow-healthy",
    message: "Your plant looks healthy! Keep up the good care.",
    gradient: "from-severity-healthy/20 to-severity-healthy/5",
  },
  mild: {
    icon: AlertTriangle,
    label: "Mild Disease",
    colorClass: "bg-severity-mild text-severity-mild-foreground",
    borderClass: "border-severity-mild/30",
    bgClass: "bg-severity-mild/10",
    glowClass: "glow-mild",
    message: "Early signs detected. Treatment recommended.",
    gradient: "from-severity-mild/20 to-severity-mild/5",
  },
  severe: {
    icon: AlertCircle,
    label: "Severe Disease",
    colorClass: "bg-severity-severe text-severity-severe-foreground",
    borderClass: "border-severity-severe/30",
    bgClass: "bg-severity-severe/10",
    glowClass: "glow-severe",
    message: "Urgent action required. Immediate treatment needed.",
    gradient: "from-severity-severe/20 to-severity-severe/5",
  },
  unknown: {
    icon: Info,
    label: "Unknown",
    colorClass: "bg-muted text-muted-foreground",
    borderClass: "border-border/30",
    bgClass: "bg-muted/10",
    glowClass: "",
    message: "Severity could not be determined from this label.",
    gradient: "from-muted/30 to-muted/5",
  },
};

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  data,
  imagePreview,
  onScanNew,
}) => {
  const [showMask, setShowMask] = useState(false);
  const config = severityConfig[data.severity];
  const Icon = config.icon;

  const handleDownload = () => {
    generateDiagnosisReport(data, imagePreview);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 animate-slide-up">
      {/* Hero Severity Banner */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-500",
        config.glowClass,
        "glass"
      )}>
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50",
          config.gradient
        )} />
        
        {/* Animated particles for healthy */}
        {data.severity === "healthy" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-severity-healthy/30 animate-pulse"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.3}s`,
                  width: 16,
                  height: 16,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="relative flex items-center gap-4">
          <div className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl transition-transform hover:scale-110",
            config.colorClass
          )}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xl font-bold text-foreground">{config.label}</p>
              <Badge className={cn(config.colorClass, "text-xs")}>{data.confidence}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{config.message}</p>
          </div>
        </div>
      </div>

      {/* Image Display with Mask Toggle */}
      <Card className="glass overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Visual Analysis
            </CardTitle>
            {data.maskUrl && (
              <div className="flex items-center gap-2">
                <Label htmlFor="mask-toggle" className="text-sm text-muted-foreground">
                  Disease Map
                </Label>
                <Switch
                  id="mask-toggle"
                  checked={showMask}
                  onCheckedChange={setShowMask}
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={imagePreview}
              alt="Analyzed leaf"
              className={cn(
                "w-full h-auto transition-all duration-500",
                showMask && data.maskUrl ? "opacity-0 scale-95" : "opacity-100 scale-100"
              )}
            />
            {data.maskUrl && (
              <img
                src={data.maskUrl}
                alt="Disease mask overlay"
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-all duration-500",
                  showMask ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
              />
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis Details */}
      <Card className="glass">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Leaf, label: "Plant", value: data.plant },
              { icon: Activity, label: "Disease", value: data.disease },
              { icon: Percent, label: "Confidence", value: data.confidence },
              { icon: Shield, label: "Status", value: config.label },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-background/50 hover:bg-background/80 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {data.recommendations && data.recommendations.length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Recommendations</p>
              </div>
              <ul className="space-y-2">
                {data.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground p-2 rounded-lg hover:bg-background/50 transition-colors"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex-1 h-12 glass border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
        <Button
          onClick={onScanNew}
          className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Scan New Leaf
        </Button>
      </div>
    </div>
  );
};
