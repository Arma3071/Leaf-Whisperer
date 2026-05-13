import React from "react";
import { Header } from "@/components/Header";
import { ParticleField } from "@/components/ParticleField";
import { FloatingLeaves } from "@/components/FloatingLeaves";
import { GlowOrb } from "@/components/GlowOrb";
import { 
  Brain, 
  Camera, 
  Cpu, 
  Leaf, 
  Target, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import shoaibPhoto from "@/assets/team-shoaib.png";
import armaghanPhoto from "@/assets/team-armaghan.png";
import abdullahPhoto from "@/assets/team-abdullah.png";

const steps = [
  {
    icon: Camera,
    title: "Upload",
    description: "Upload a photo of your plant's leaf."
  },
  {
    icon: Brain,
    title: "Analyze",
    description: "Our AI model processes the image using advanced computer vision and HSV color analysis."
  },
  {
    icon: Target,
    title: "Diagnose",
    description: "The system identifies the plant species, detects diseases, and determines severity levels."
  },
  {
    icon: Zap,
    title: "Act",
    description: "Receive actionable recommendations tailored to your plant's specific condition."
  }
];

const features = [
  "38+ plant species supported",
  "95% diagnostic accuracy",
  "Real-time HSV mask visualization",
  "Instant severity classification",
  "Personalized care recommendations",
  "Works offline after initial load"
];

const team = [
  { role: "Shoaib Raza", focus: "Supervisor", photo: shoaibPhoto },
  { role: "Abdullah Asif", focus: "Team Leader", photo: abdullahPhoto },
  { role: "Muhammad Armaghan Shahzad", focus: "AI Lead", photo: armaghanPhoto },
  { role: "Moiz Khan Jadoon", focus: "Documentation" }
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <ParticleField />
      <FloatingLeaves />
      <GlowOrb className="top-20 -left-32" color="primary" size="lg" />
      <GlowOrb className="bottom-40 -right-32" color="accent" size="xl" />
      
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-6">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Our Mission</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Empowering Farmers with</span>
              <br />
              <span className="text-gradient">Intelligent Crop Protection</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AgriGuard AI combines cutting-edge machine learning with practical agricultural 
              science to help farmers detect plant diseases early and take informed action.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              <span className="text-gradient">How It Works</span>
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="glass rounded-2xl p-6 h-full hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 mb-4">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 h-6 w-6 text-primary/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="glass rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-sm mb-4">
                    <Cpu className="h-4 w-4 text-primary" />
                    <span className="text-primary">The Technology</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Powered by Advanced AI
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Our system uses a convolutional neural network trained on thousands of 
                    annotated plant disease images. The HSV color segmentation provides 
                    visual evidence of the AI's decision-making process.
                  </p>
                  <div className="space-y-3">
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-severity-healthy flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                    <div className="relative h-32 w-32">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
                      <div className="absolute inset-2 rounded-full border-4 border-primary/50 animate-pulse" />
                      <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <Brain className="h-16 w-16 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-sm mb-4">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-primary">The Team</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Built by Passionate Innovators
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {team.map((member, i) => (
                <div key={i} className="glass rounded-xl p-4 hover:scale-105 transition-transform">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {member.photo ? (
                      <img src={member.photo} alt={member.role} className="h-full w-full object-cover" />
                    ) : (
                      <Users className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{member.role}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{member.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Try It?</h2>
            <p className="text-muted-foreground mb-6">
              Start diagnosing your plants now with our AI-powered system.
            </p>
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Leaf className="h-5 w-5" />
                Start Scanning
              </Button>
            </Link>
          </div>
        </section>
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

export default About;
