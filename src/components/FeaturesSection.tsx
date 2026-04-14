import React from "react";
import { Shield, Zap, Lock, BarChart3, GitBranch, Brain } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: "blue" | "amber" | "green";
}

function FeatureCard({ icon, title, description, accent }: FeatureProps) {
  const accentClasses = {
    blue: "border-blue-500/30 hover:border-blue-500/60 glow-blue",
    amber: "border-amber-500/30 hover:border-amber-500/60 glow-amber",
    green: "border-green-500/30 hover:border-green-500/60 glow-green",
  };

  const accentIconClasses = {
    blue: "text-blue-400",
    amber: "text-amber-400",
    green: "text-green-400",
  };

  return (
    <div
      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${accentClasses[accent]}`}
    >
      <div
        className={`w-12 h-12 rounded-lg bg-${accent}-500/10 flex items-center justify-center mb-4 ${accentIconClasses[accent]}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold font-mono mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <Brain size={24} />,
      title: "GraphRAG Engine",
      description:
        "Graph-based knowledge graphs that understand relationships between code, users, and features. Domain-specific AI that gets smarter with every sync.",
      accent: "blue" as const,
    },
    {
      icon: <Zap size={24} />,
      title: "Real-Time Sync",
      description:
        "Triggered by code commits and releases. Your documentation updates automatically—no manual work, no delays, no stale content.",
      accent: "amber" as const,
    },
    {
      icon: <Lock size={24} />,
      title: "Enterprise Security",
      description:
        "Private data stays private. Self-hosted or cloud deployments with full control. SOC 2 compliance and data encryption built-in.",
      accent: "green" as const,
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Analytics & Insights",
      description:
        "Track documentation engagement, identify knowledge gaps, and measure the business impact of your docs on support and adoption.",
      accent: "blue" as const,
    },
    {
      icon: <GitBranch size={24} />,
      title: "Developer-First",
      description:
        "Integrates seamlessly with GitHub, GitLab, Bitbucket. Works with your existing CI/CD pipelines and development workflows.",
      accent: "amber" as const,
    },
    {
      icon: <Shield size={24} />,
      title: "AI Agent Framework",
      description:
        "Powered by Google ADK. Autonomous agents handle documentation generation, updates, and quality checks 24/7.",
      accent: "green" as const,
    },
  ];

  return (
    <section
      id="technology"
      className="relative pt-9 lg:pt-24 lg:pb-24 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"
    >
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-mono mb-6 text-foreground">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Built on cutting-edge AI technology. Designed for teams that demand
            both performance and security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Pricing Plans */}
        <div id="pricing" className="mt-20 pt-20 border-t border-blue-500/10">
          <h3 className="text-2xl lg:text-3xl font-bold font-mono mb-8 text-foreground">
            Pricing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Self-Serve Plan",
                price: "$39",
                period: "/month",
                desc: "AI agents handle documentation with Human-in-the-Loop (HITL)—you review and approve; no dedicated writer.",
                features: [
                  "AI agent–driven documentation",
                  "Human-in-the-Loop (HITL) review and approval",
                  "Real-time sync",
                  "Basic support",
                ],
              },
              {
                name: "Managed Plan",
                price: "$199",
                period: "/month",
                desc: "A real technical writer owns the process—no AI-only workflow. A dedicated human tech writer creates and maintains your docs.",
                features: [
                  "Dedicated technical writer (real person)",
                  "Human-led documentation—not agent-only",
                  "Everything in Self-Serve",
                  "Priority support",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "Pricing",
                desc: "For large organizations",
                features: [
                  "Custom solutions",
                  "Advanced security",
                  "Enterprise support",
                ],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 transition-all duration-300 hover:scale-105"
              >
                <div className="font-mono font-bold text-blue-400 mb-2">
                  {plan.name}
                </div>
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {plan.period}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {plan.desc}
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://tally.so/r/wgBlOO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors block text-center"
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground text-center max-w-xl mx-auto">
            Final cost may vary depending on token usage during AI analysis and
            documentation generation.
          </p>
        </div>
      </div>
    </section>
  );
}
