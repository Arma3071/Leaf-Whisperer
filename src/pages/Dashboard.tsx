import React from "react";
import { Header } from "@/components/Header";
import { ParticleField } from "@/components/ParticleField";
import { GlowOrb } from "@/components/GlowOrb";
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Activity,
  Target,
  Calendar,
  PieChart,
  ArrowUp,
  ArrowDown
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
  Legend
} from "recharts";

// Mock data for charts
const weeklyScans = [
  { day: "Mon", scans: 12, healthy: 8, diseased: 4 },
  { day: "Tue", scans: 19, healthy: 14, diseased: 5 },
  { day: "Wed", scans: 8, healthy: 5, diseased: 3 },
  { day: "Thu", scans: 25, healthy: 18, diseased: 7 },
  { day: "Fri", scans: 32, healthy: 22, diseased: 10 },
  { day: "Sat", scans: 15, healthy: 10, diseased: 5 },
  { day: "Sun", scans: 22, healthy: 16, diseased: 6 }
];

const diseaseDistribution = [
  { name: "Healthy", value: 65, color: "hsl(142, 76%, 36%)" },
  { name: "Mild", value: 25, color: "hsl(38, 92%, 50%)" },
  { name: "Severe", value: 10, color: "hsl(0, 84%, 50%)" }
];

const plantStats = [
  { plant: "Tomato", scans: 45, accuracy: 96 },
  { plant: "Potato", scans: 32, accuracy: 94 },
  { plant: "Apple", scans: 28, accuracy: 97 },
  { plant: "Grape", scans: 21, accuracy: 93 },
  { plant: "Corn", scans: 18, accuracy: 95 }
];

const monthlyTrend = [
  { month: "Jan", scans: 120 },
  { month: "Feb", scans: 180 },
  { month: "Mar", scans: 240 },
  { month: "Apr", scans: 310 },
  { month: "May", scans: 420 },
  { month: "Jun", scans: 380 }
];

const stats = [
  { 
    label: "Total Scans", 
    value: "1,847", 
    change: "+12.5%", 
    trend: "up",
    icon: Activity,
    color: "text-primary"
  },
  { 
    label: "Accuracy Rate", 
    value: "95.2%", 
    change: "+2.3%", 
    trend: "up",
    icon: Target,
    color: "text-severity-healthy"
  },
  { 
    label: "Diseases Found", 
    value: "423", 
    change: "-8.1%", 
    trend: "down",
    icon: Leaf,
    color: "text-severity-mild"
  },
  { 
    label: "This Week", 
    value: "133", 
    change: "+18.7%", 
    trend: "up",
    icon: Calendar,
    color: "text-accent-foreground"
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <ParticleField />
      <GlowOrb className="top-20 -left-32" color="primary" size="lg" />
      <GlowOrb className="bottom-40 -right-32" color="accent" size="xl" />
      
      <Header />
      
      <main className="flex-1 relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    stat.trend === "up" ? "text-severity-healthy" : "text-severity-severe"
                  )}>
                    {stat.trend === "up" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Weekly Activity */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Weekly Activity</h3>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyScans}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="healthy" stackId="a" fill="hsl(142, 76%, 36%)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="diseased" stackId="a" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Disease Distribution */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Disease Distribution</h3>
                <PieChart className="h-5 w-5 text-primary" />
              </div>
              <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={diseaseDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {diseaseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {diseaseDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Monthly Trend */}
            <div className="md:col-span-2 glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Monthly Trend</h3>
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(161, 93%, 30%)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(161, 93%, 30%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
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

            {/* Top Plants */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Top Plants</h3>
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-4">
                {plantStats.map((plant, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{plant.plant}</span>
                      <span className="text-xs text-muted-foreground">{plant.scans} scans</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent-foreground rounded-full transition-all duration-500"
                        style={{ width: `${plant.accuracy}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{plant.accuracy}% accuracy</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
