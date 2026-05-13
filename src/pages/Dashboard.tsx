import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ParticleField } from "@/components/ParticleField";
import { GlowOrb } from "@/components/GlowOrb";
import { useAuth } from "@/contexts/AuthContext";
import { useScanHistory, ScanRecord } from "@/hooks/useScanHistory";
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Activity,
  Target,
  Calendar,
  PieChart,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const SEVERITY_COLORS: Record<string, string> = {
  Healthy: "hsl(142, 76%, 36%)",
  Mild: "hsl(38, 92%, 50%)",
  Severe: "hsl(0, 84%, 50%)",
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildAnalytics(scans: ScanRecord[]) {
  const total = scans.length;
  const sevCounts = { healthy: 0, mild: 0, severe: 0 };
  const plantCounts: Record<string, { scans: number; healthy: number }> = {};
  const dailyCounts: Record<string, { healthy: number; diseased: number }> = {};
  const monthlyCounts: Record<string, number> = {};

  const now = new Date();
  const weekStart = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));

  let weekScans = 0;
  let confidenceSum = 0;
  let confidenceCount = 0;

  for (const s of scans) {
    const sev = (s.severity || "").toLowerCase();
    if (sev === "healthy") sevCounts.healthy++;
    else if (sev === "severe") sevCounts.severe++;
    else sevCounts.mild++;

    const plant = s.plant || "Unknown";
    plantCounts[plant] = plantCounts[plant] || { scans: 0, healthy: 0 };
    plantCounts[plant].scans++;
    if (sev === "healthy") plantCounts[plant].healthy++;

    const created = new Date(s.created_at);
    if (created >= weekStart) weekScans++;

    const dayKey = created.toLocaleDateString(undefined, { weekday: "short" });
    dailyCounts[dayKey] = dailyCounts[dayKey] || { healthy: 0, diseased: 0 };
    if (sev === "healthy") dailyCounts[dayKey].healthy++;
    else dailyCounts[dayKey].diseased++;

    const monthKey = created.toLocaleDateString(undefined, { month: "short" });
    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;

    const conf = parseFloat((s.confidence || "").replace("%", ""));
    if (!Number.isNaN(conf)) {
      confidenceSum += conf;
      confidenceCount++;
    }
  }

  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyScans = dayOrder.map((day) => ({
    day,
    healthy: dailyCounts[day]?.healthy ?? 0,
    diseased: dailyCounts[day]?.diseased ?? 0,
  }));

  const diseaseDistribution = [
    { name: "Healthy", value: sevCounts.healthy, color: SEVERITY_COLORS.Healthy },
    { name: "Mild", value: sevCounts.mild, color: SEVERITY_COLORS.Mild },
    { name: "Severe", value: sevCounts.severe, color: SEVERITY_COLORS.Severe },
  ];

  const plantStats = Object.entries(plantCounts)
    .map(([plant, v]) => ({
      plant,
      scans: v.scans,
      healthyPct: v.scans ? Math.round((v.healthy / v.scans) * 100) : 0,
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5);

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyTrend = monthOrder
    .filter((m) => monthlyCounts[m])
    .map((m) => ({ month: m, scans: monthlyCounts[m] }));

  const diseasesFound = sevCounts.mild + sevCounts.severe;
  const avgConfidence = confidenceCount ? confidenceSum / confidenceCount : 0;

  return {
    total,
    weekScans,
    diseasesFound,
    avgConfidence,
    weeklyScans,
    diseaseDistribution,
    plantStats,
    monthlyTrend,
  };
}

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { scans, loading } = useScanHistory();

  const analytics = useMemo(() => buildAnalytics(scans), [scans]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const stats = [
    {
      label: "Total Scans",
      value: analytics.total.toLocaleString(),
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "Avg Confidence",
      value: analytics.avgConfidence ? `${analytics.avgConfidence.toFixed(1)}%` : "—",
      icon: Target,
      color: "text-severity-healthy",
    },
    {
      label: "Diseases Found",
      value: analytics.diseasesFound.toLocaleString(),
      icon: Leaf,
      color: "text-severity-mild",
    },
    {
      label: "This Week",
      value: analytics.weekScans.toLocaleString(),
      icon: Calendar,
      color: "text-accent-foreground",
    },
  ];

  const hasData = analytics.total > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <ParticleField />
      <GlowOrb className="top-20 -left-32" color="primary" size="lg" />
      <GlowOrb className="bottom-40 -right-32" color="accent" size="xl" />

      <Header />

      <main className="flex-1 relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-4">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Analytics</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Monitor your scanning activity and insights
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !hasData ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No scans yet
              </h3>
              <p className="text-muted-foreground">
                Upload a plant image to start building your dashboard insights.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={cn("h-5 w-5", stat.color)} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Weekly Activity</h3>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.weeklyScans}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="healthy" stackId="a" fill="hsl(142, 76%, 36%)" />
                        <Bar dataKey="diseased" stackId="a" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Disease Distribution</h3>
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-64 flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={analytics.diseaseDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {analytics.diseaseDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {analytics.diseaseDistribution.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-muted-foreground">{item.name}</span>
                          <span className="text-sm font-medium text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Monthly Trend</h3>
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.monthlyTrend}>
                        <defs>
                          <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(161, 93%, 30%)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(161, 93%, 30%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="scans"
                          stroke="hsl(161, 93%, 30%)"
                          strokeWidth={2}
                          fill="url(#scanGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Top Plants</h3>
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-4">
                    {analytics.plantStats.map((plant, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-foreground">{plant.plant}</span>
                          <span className="text-xs text-muted-foreground">{plant.scans} scans</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent-foreground rounded-full transition-all duration-500"
                            style={{ width: `${plant.healthyPct}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{plant.healthyPct}% healthy</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
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

export default Dashboard;
