import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ParticleField } from "@/components/ParticleField";
import { GlowOrb } from "@/components/GlowOrb";
import { 
  History as HistoryIcon, 
  Leaf, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Trash2,
  Download,
  Eye,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScanRecord {
  id: string;
  date: string;
  time: string;
  plant: string;
  disease: string;
  severity: "healthy" | "mild" | "severe";
  confidence: string;
  imageUrl: string;
}

// Mock scan history data
const mockHistory: ScanRecord[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "09:32 AM",
    plant: "Tomato",
    disease: "Early Blight",
    severity: "mild",
    confidence: "94.2%",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400"
  },
  {
    id: "2",
    date: "2024-01-14",
    time: "02:15 PM",
    plant: "Apple",
    disease: "None Detected",
    severity: "healthy",
    confidence: "98.1%",
    imageUrl: "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=400"
  },
  {
    id: "3",
    date: "2024-01-14",
    time: "11:45 AM",
    plant: "Potato",
    disease: "Late Blight",
    severity: "severe",
    confidence: "91.7%",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82ber49?w=400"
  },
  {
    id: "4",
    date: "2024-01-13",
    time: "04:20 PM",
    plant: "Grape",
    disease: "Powdery Mildew",
    severity: "mild",
    confidence: "89.5%",
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400"
  },
  {
    id: "5",
    date: "2024-01-12",
    time: "08:00 AM",
    plant: "Corn",
    disease: "None Detected",
    severity: "healthy",
    confidence: "96.3%",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400"
  },
  {
    id: "6",
    date: "2024-01-11",
    time: "03:30 PM",
    plant: "Pepper",
    disease: "Bacterial Spot",
    severity: "severe",
    confidence: "87.9%",
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400"
  }
];

const History: React.FC = () => {
  const [records, setRecords] = useState<ScanRecord[]>(mockHistory);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "healthy" | "mild" | "severe">("all");
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null);

  const filteredRecords = selectedFilter === "all" 
    ? records 
    : records.filter(r => r.severity === selectedFilter);

  const deleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-severity-healthy" />;
      case "mild":
        return <AlertTriangle className="h-5 w-5 text-severity-mild" />;
      case "severe":
        return <AlertCircle className="h-5 w-5 text-severity-severe" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      healthy: { bg: "bg-severity-healthy/20", text: "text-severity-healthy" },
      mild: { bg: "bg-severity-mild/20", text: "text-severity-mild" },
      severe: { bg: "bg-severity-severe/20", text: "text-severity-severe" }
    };
    const { bg, text } = variants[severity] || variants.healthy;
    return (
      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", bg, text)}>
        {severity}
      </span>
    );
  };

  const stats = {
    total: records.length,
    healthy: records.filter(r => r.severity === "healthy").length,
    mild: records.filter(r => r.severity === "mild").length,
    severe: records.filter(r => r.severity === "severe").length
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <ParticleField />
      <GlowOrb className="top-20 -left-32" color="primary" size="lg" />
      <GlowOrb className="bottom-40 -right-32" color="accent" size="xl" />
      
      <Header />
      
      <main className="flex-1 relative z-10 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-4">
              <HistoryIcon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Your Scans</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Scan History</span>
            </h1>
            <p className="text-muted-foreground">
              View and manage your past plant diagnoses
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: stats.total, color: "text-primary" },
              { label: "Healthy", value: stats.healthy, color: "text-severity-healthy" },
              { label: "Mild", value: stats.mild, color: "text-severity-mild" },
              { label: "Severe", value: stats.severe, color: "text-severity-severe" }
            ].map((stat, i) => (
              <div key={i} className="glass rounded-xl p-3 text-center">
                <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["all", "healthy", "mild", "severe"].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter as typeof selectedFilter)}
                className={cn(
                  selectedFilter === filter && filter === "healthy" && "bg-severity-healthy hover:bg-severity-healthy/90",
                  selectedFilter === filter && filter === "mild" && "bg-severity-mild text-severity-mild-foreground hover:bg-severity-mild/90",
                  selectedFilter === filter && filter === "severe" && "bg-severity-severe hover:bg-severity-severe/90"
                )}
              >
                {filter === "all" ? "All Scans" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>

          {/* History List */}
          {filteredRecords.length > 0 ? (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="glass rounded-2xl p-4 hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                      <img
                        src={record.imageUrl}
                        alt={record.plant}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400";
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{record.plant}</h3>
                        {getSeverityBadge(record.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {record.disease} • {record.confidence} confidence
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {record.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {record.time}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRecord(record.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl">
              <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No scan records found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start scanning plants to build your history
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={selectedRecord.imageUrl}
                  alt={selectedRecord.plant}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400";
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plant</span>
                  <span className="font-medium text-foreground">{selectedRecord.plant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disease</span>
                  <span className="font-medium text-foreground">{selectedRecord.disease}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Severity</span>
                  {getSeverityBadge(selectedRecord.severity)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium text-foreground">{selectedRecord.confidence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">{selectedRecord.date} at {selectedRecord.time}</span>
                </div>
              </div>
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <footer className="py-4 px-4 glass border-t border-border/30 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            AgriGuard AI • Empowering farmers with intelligent crop protection
          </p>
        </div>
      </footer>
    </div>
  );
};

export default History;
