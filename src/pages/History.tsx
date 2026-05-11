import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ParticleField } from "@/components/ParticleField";
import { GlowOrb } from "@/components/GlowOrb";
import { 
  History as HistoryIcon, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Trash2,
  Eye,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useScanHistory, ScanRecord } from "@/hooks/useScanHistory";

const History: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { scans, loading, deleteScan } = useScanHistory();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "healthy" | "mild" | "severe">("all");
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null);

  const filteredRecords = selectedFilter === "all" 
    ? scans 
    : scans.filter(r => r.severity === selectedFilter);

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      healthy: { bg: "bg-severity-healthy/20", text: "text-severity-healthy" },
      mild: { bg: "bg-severity-mild/20", text: "text-severity-mild" },
      severe: { bg: "bg-severity-severe/20", text: "text-severity-severe" },
      unknown: { bg: "bg-muted/40", text: "text-muted-foreground" }
    };
    const { bg, text } = variants[severity] || variants.unknown;
    return (
      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", bg, text)}>
        {severity}
      </span>
    );
  };

  const stats = {
    total: scans.length,
    healthy: scans.filter(r => r.severity === "healthy").length,
    mild: scans.filter(r => r.severity === "mild").length,
    severe: scans.filter(r => r.severity === "severe").length
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
        <ParticleField />
        <GlowOrb className="top-20 -left-32" color="primary" size="lg" />
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 relative z-10">
          <div className="text-center glass rounded-2xl p-8 max-w-md">
            <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-foreground">Sign in to view history</h2>
            <p className="text-muted-foreground mb-6">
              Create an account to save your scans and access them from any device.
            </p>
            <Button onClick={() => navigate("/auth")} className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <ParticleField />
      <GlowOrb className="top-20 -left-32" color="primary" size="lg" />
      <GlowOrb className="bottom-40 -right-32" color="accent" size="xl" />
      <Header />
      
      <main className="flex-1 relative z-10 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-4">
              <HistoryIcon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Your Scans</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Scan History</span>
            </h1>
            <p className="text-muted-foreground">View and manage your past plant diagnoses</p>
          </div>

          {/* Stats */}
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

          {/* Filters */}
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

          {loading ? (
            <div className="text-center py-12 glass rounded-2xl">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your scans...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="space-y-3">
              {filteredRecords.map((record) => {
                const date = new Date(record.created_at);
                return (
                  <div key={record.id} className="glass rounded-2xl p-4 hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-4">
                      {record.image_url && (
                        <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                          <img src={record.image_url} alt={record.plant} className="h-full w-full object-cover" />
                        </div>
                      )}
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
                            {date.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(record)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteScan.mutate(record.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl">
              <HistoryIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No scan records found</p>
              <p className="text-sm text-muted-foreground mt-1">Start scanning plants to build your history</p>
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
              {selectedRecord.image_url && (
                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                  <img src={selectedRecord.image_url} alt={selectedRecord.plant} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="space-y-2">
                {[
                  { label: "Plant", value: selectedRecord.plant },
                  { label: "Disease", value: selectedRecord.disease },
                  { label: "Confidence", value: selectedRecord.confidence },
                  { label: "Date", value: new Date(selectedRecord.created_at).toLocaleString() },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Severity</span>
                  {getSeverityBadge(selectedRecord.severity)}
                </div>
              </div>
              {selectedRecord.recommendations && selectedRecord.recommendations.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <p className="font-medium text-foreground mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {selectedRecord.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary font-medium">{i + 1}.</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <footer className="py-4 px-4 glass border-t border-border/30 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">AgriGuard AI • Empowering farmers with intelligent crop protection</p>
        </div>
      </footer>
    </div>
  );
};

export default History;
