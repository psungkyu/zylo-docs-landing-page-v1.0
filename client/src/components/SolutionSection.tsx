import React from 'react';
import { Database, Zap, TrendingUp } from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  accent: 'blue' | 'amber' | 'green';
}

function SolutionStep({ number, title, description, image, icon, accent }: StepProps) {
  const accentClasses = {
    blue: 'border-blue-500/30 glow-blue',
    amber: 'border-amber-500/30 glow-amber',
    green: 'border-green-500/30 glow-green',
  };

  const accentTextClasses = {
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    green: 'text-green-400',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center mb-20">
      {number % 2 === 0 && (
        <div className="flex-1 order-2 lg:order-1">
          <img
            src={image}
            alt={title}
            className="w-full rounded-xl border border-blue-500/20 shadow-lg"
          />
        </div>
      )}

      <div className={`flex-1 ${number % 2 === 0 ? 'order-1 lg:order-2' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-lg bg-${accent}-500/10 border border-${accent}-500/30 flex items-center justify-center ${accentTextClasses[accent]}`}>
            {icon}
          </div>
          <span className={`text-sm font-mono font-bold ${accentTextClasses[accent]}`}>
            Step {number}
          </span>
        </div>

        <h3 className="text-3xl lg:text-4xl font-bold font-mono mb-4 text-foreground">
          {title}
        </h3>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        {/* Key benefits */}
        <ul className="space-y-3 mb-6">
          {number === 1 && (
            <>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Connect GitHub, Slack, Jira, and custom data sources</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Build domain-specific knowledge graphs automatically</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Capture both product structure and user context</span>
              </li>
            </>
          )}
          {number === 2 && (
            <>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">AI Agents autonomously generate documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Sync automatically with every code commit and release</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">No manual updates needed—documentation stays fresh</span>
              </li>
            </>
          )}
          {number === 3 && (
            <>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Deliver interactive, searchable documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">40% fewer support tickets, 2x faster onboarding</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Measure adoption and engagement in real-time</span>
              </li>
            </>
          )}
        </ul>

        {/* CTA Button */}
        <a href="https://tally.so/r/wgBlOO" target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
          Get Started
        </a>
      </div>

      {number % 2 === 1 && (
        <div className="flex-1">
          <img
            src={image}
            alt={title}
            className="w-full rounded-xl border border-blue-500/20 shadow-lg"
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
      title: 'Ingest & Map',
      description:
        'Connect your entire tech stack. zylo-docs pulls real-time data from GitHub, Slack, Jira, and more to build a unified knowledge graph.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663133935411/cjL5fR4bHdyG5Ua4ZewFre/xylo_step1_ingest_bc5a369f.png',
      icon: <Database size={24} />,
      accent: 'blue' as const,
    },
    {
      number: 2,
      title: 'Generate & Sync',
      description:
        'AI Agents generate documentation from your knowledge graph. Every code commit triggers live updates—your docs evolve automatically.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663133935411/cjL5fR4bHdyG5Ua4ZewFre/xylo_step2_sync_a4efc240.png',
      icon: <Zap size={24} />,
      accent: 'amber' as const,
    },
    {
      number: 3,
      title: 'Deploy & Engage',
      description:
        'Launch interactive documentation that users want to read. Track engagement and watch support tickets drop.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663133935411/cjL5fR4bHdyG5Ua4ZewFre/xylo_step3_engage_a82f9f77.png',
      icon: <TrendingUp size={24} />,
      accent: 'green' as const,
    },
  ];

  return (
    <section id="solution" className="relative pt-9 lg:pt-24 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold font-mono mb-6 text-foreground">
            How zylo-docs Works
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Three simple steps to transform your documentation from a maintenance burden into a competitive advantage. Watch your docs evolve with your product.
          </p>
        </div>

        {/* Steps */}
        {steps.map((step) => (
          <SolutionStep key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}
