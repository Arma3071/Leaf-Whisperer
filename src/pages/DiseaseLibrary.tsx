import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ParticleField } from "@/components/ParticleField";
import { GlowOrb } from "@/components/GlowOrb";
import { 
  Search, 
  Leaf, 
  AlertTriangle, 
  CheckCircle,
  AlertCircle,
  Filter,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { diseaseLibrary as diseases } from "@/data/diseaseLibrary";

const plants = Array.from(new Set(diseases.map(d => d.plant)));

const DiseaseLibrary: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<"all" | "healthy" | "mild" | "severe">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = 
      disease.name.toLowerCase().includes(search.toLowerCase()) ||
      disease.plant.toLowerCase().includes(search.toLowerCase());
    const matchesPlant = !selectedPlant || disease.plant === selectedPlant;
    const matchesSeverity = selectedSeverity === "all" || disease.severity === selectedSeverity;
    return matchesSearch && matchesPlant && matchesSeverity;
  });

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
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Knowledge Base</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Disease Library</span>
            </h1>
            <p className="text-muted-foreground">
              Browse comprehensive information on plant diseases
            </p>
          </div>

          {/* Search & Filters */}
          <div className="glass rounded-2xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search diseases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedSeverity === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSeverity("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedSeverity === "healthy" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSeverity("healthy")}
                  className={selectedSeverity === "healthy" ? "bg-severity-healthy text-severity-healthy-foreground hover:bg-severity-healthy/90" : ""}
                >
                  Healthy
                </Button>
                <Button
                  variant={selectedSeverity === "mild" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSeverity("mild")}
                  className={selectedSeverity === "mild" ? "bg-severity-mild text-severity-mild-foreground hover:bg-severity-mild/90" : ""}
                >
                  Mild
                </Button>
                <Button
                  variant={selectedSeverity === "severe" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSeverity("severe")}
                  className={selectedSeverity === "severe" ? "bg-severity-severe text-severity-severe-foreground hover:bg-severity-severe/90" : ""}
                >
                  Severe
                </Button>
              </div>
            </div>
            
            {/* Plant Filter Pills */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <Button
                variant={selectedPlant === null ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPlant(null)}
              >
                All Plants
              </Button>
              {plants.map(plant => (
                <Button
                  key={plant}
                  variant={selectedPlant === plant ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPlant(plant)}
                >
                  {plant}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredDiseases.length} of {diseases.length} diseases
          </p>

          {/* Disease Cards */}
          <div className="space-y-4">
            {filteredDiseases.map((disease) => (
              <Collapsible
                key={disease.id}
                open={expandedId === disease.id}
                onOpenChange={(open) => setExpandedId(open ? disease.id : null)}
              >
                <div className="glass rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform">
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-left">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center",
                        disease.severity === "healthy"
                          ? "bg-severity-healthy/20"
                          : disease.severity === "mild"
                          ? "bg-severity-mild/20"
                          : "bg-severity-severe/20"
                      )}>
                        {disease.severity === "healthy" ? (
                          <CheckCircle className="h-6 w-6 text-severity-healthy" />
                        ) : disease.severity === "mild" ? (
                          <AlertTriangle className="h-6 w-6 text-severity-mild" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-severity-severe" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{disease.name}</h3>
                          <Badge variant={disease.severity === "severe" ? "destructive" : disease.severity === "mild" ? "secondary" : "outline"}>
                            {disease.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{disease.plant}</p>
                      </div>
                    </div>
                    <ChevronDown className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      expandedId === disease.id && "rotate-180"
                    )} />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t border-border/30 pt-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-severity-mild" />
                            Symptoms
                          </h4>
                          <ul className="space-y-1">
                            {disease.symptoms.map((s, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-severity-severe" />
                            Causes
                          </h4>
                          <ul className="space-y-1">
                            {disease.causes.map((c, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-severity-healthy" />
                            Treatment
                          </h4>
                          <ul className="space-y-1">
                            {disease.treatment.map((t, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-severity-healthy mt-1.5 flex-shrink-0" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-primary" />
                            Prevention
                          </h4>
                          <ul className="space-y-1">
                            {disease.prevention.map((p, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>

          {filteredDiseases.length === 0 && (
            <div className="text-center py-12 glass rounded-2xl">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No diseases found matching your criteria</p>
            </div>
          )}
        </div>
      </main>

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

export default DiseaseLibrary;
