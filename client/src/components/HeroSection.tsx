import React, { useEffect, useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen w-full pt-24 pb-20 overflow-hidden grid-overlay">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-amber-500/5 pointer-events-none" />

      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[calc(100vh-120px)]">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Zap size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-300">AI-Powered Documentation</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-mono leading-tight mb-6 text-foreground animate-fade-in-up">
            Living
            <br />
            <span className="text-gradient-blue-amber">Documentation</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl animate-fade-in-up delay-100">
            Documentation that evolves with your product. Powered by GraphRAG and AI Agents, zylo-docs automatically syncs with your development cycles—keeping docs fresh, accurate, and always in sync.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
            <a href="https://tally.so/r/wgBlOO" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 glow-blue">
              Start Free Trial
              <ArrowRight size={20} />
            </a>
            <a href="https://tally.so/r/wgBlOO" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-lg border border-blue-500/30 hover:border-blue-500/60 text-foreground font-semibold transition-all duration-300 hover:bg-blue-500/10 flex items-center justify-center">
              Watch Demo
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-blue-500/10 animate-fade-in-up delay-300">
            <p className="text-sm text-muted-foreground mb-4">Proven results</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>40% fewer support tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>2x faster onboarding</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="flex-1 relative hidden lg:block w-full">
          {/* Floating card with parallax */}
          <div
            className="relative"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            {/* Main visual placeholder - will be replaced with actual graphic */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-amber-500/10 glow-blue">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-amber-400 rounded-lg opacity-20" />
                  <p className="text-muted-foreground">AI-Powered Knowledge Graph</p>
                </div>
              </div>

              {/* Decorative grid overlay */}
              <div className="absolute inset-0 grid-overlay opacity-30" />
            </div>

            {/* Floating metric cards */}
            <div className="absolute -bottom-6 -left-6 px-4 py-3 rounded-lg bg-card border border-blue-500/20 shadow-lg glow-blue animate-pulse-glow">
              <div className="text-sm font-mono text-blue-400">GraphRAG</div>
              <div className="text-xs text-muted-foreground">Neo4j-Powered</div>
            </div>

            <div className="absolute -top-6 -right-6 px-4 py-3 rounded-lg bg-card border border-amber-500/20 shadow-lg glow-amber animate-pulse-glow delay-1000">
              <div className="text-sm font-mono text-amber-400">Real-Time Sync</div>
              <div className="text-xs text-muted-foreground">Live Updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
