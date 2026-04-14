import React from "react";
import { Database, Zap, TrendingUp } from "lucide-react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  accent: "blue" | "amber" | "green";
}

function SolutionStep({
  number,
  title,
  description,
  image,
  icon,
  accent,
}: StepProps) {
  const accentClasses = {
    blue: "border-blue-500/30 glow-blue",
    amber: "border-amber-500/30 glow-amber",
    green: "border-green-500/30 glow-green",
  };

  const accentTextClasses = {
    blue: "text-blue-400",
    amber: "text-amber-400",
    green: "text-green-400",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center mb-20">
      {number % 2 === 0 && (
        <div className="flex-1 order-2 lg:order-1 flex justify-center">
          <img
            src={image}
            alt={title}
            className="w-full max-w-2xl object-contain"
          />
        </div>
      )}

      <div className={`flex-1 ${number % 2 === 0 ? "order-1 lg:order-2" : ""}`}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-lg bg-${accent}-500/10 border border-${accent}-500/30 flex items-center justify-center ${accentTextClasses[accent]}`}
          >
            {icon}
          </div>
          <span
            className={`text-sm font-mono font-bold ${accentTextClasses[accent]}`}
          >
            Step {number}
          </span>
        </div>

        <h3 className="text-3xl lg:text-4xl font-bold font-mono mb-4 text-foreground">
          {title}
        </h3>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        <ul className="space-y-3">
          {number === 1 && (
            <>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Product data analyzed as entities in the graph
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  User activity modeled—what customers search and in what
                  context
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Foundation for step-by-step, trustworthy docs and solution
                  suggestions
                </span>
              </li>
            </>
          )}
          {number === 2 && (
            <>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Graph-based analysis of everything you connected
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Documentation and insights stay in sync with your product and
                  code
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Automatic sync with releases and changes—no manual updates
                </span>
              </li>
            </>
          )}
          {number === 3 && (
            <>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Product manuals for customers
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  RAG with MCP-connected LLM for search optimization
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Chatbots</span>
              </li>
            </>
          )}
        </ul>
      </div>

      {number % 2 === 1 && (
        <div className="flex-1 flex justify-center">
          <img
            src={image}
            alt={title}
            className="w-full max-w-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default function SolutionSection() {
  const steps = [
    {
      number: 1,
      title: "Connect",
      description:
        "This step brings product data and user activity into your knowledge graph.",
      image: "/howitworks/step-1.png",
      icon: <Database size={24} />,
      accent: "blue" as const,
    },
    {
      number: 2,
      title: "Analyze & Sync",
      description:
        "This step turns connected data into usable insights and keeps them in sync.",
      image: "/howitworks/step-2.png",
      icon: <Zap size={24} />,
      accent: "amber" as const,
    },
    {
      number: 3,
      title: "Apply",
      description: "This step puts the graph to work in your channels.",
      image: "/howitworks/step-3.png",
      icon: <TrendingUp size={24} />,
      accent: "green" as const,
    },
  ];

  return (
    <section
      id="solution"
      className="relative pt-9 lg:pt-24 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"
    >
      <div className="container">
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold font-mono text-foreground">
            How zylo-docs Works
          </h2>
        </div>

        {/* Steps */}
        {steps.map(step => (
          <SolutionStep key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}
