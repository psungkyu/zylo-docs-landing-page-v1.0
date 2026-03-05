import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Zap } from 'lucide-react';

const ROTATING_PHRASES = ['Documentation', 'Product manual'];
const INITIAL_DURATION_MS = 2200; // 첫 화면에서 "Documentation" 전체를 보여주는 시간
const TYPE_DELAY_MS = 80;
const PAUSE_BEFORE_NEXT_MS = 1200; // 한 문구 타이핑 끝난 후 다음 문구 전 대기

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  // 0 = Documentation, 1 = Product manual. 첫 타자 후에는 1 → 0 → 1 → 0 순서로 번갈아감
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [docPhase, setDocPhase] = useState<'initial' | 'typing'>('initial');
  const [visibleLength, setVisibleLength] = useState(0);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhrase = ROTATING_PHRASES[phraseIndex];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 첫 화면: "Documentation" 전체만 보여준 뒤, 타이핑 단계로 (첫 타자는 Product manual)
  useEffect(() => {
    if (docPhase !== 'initial') return;
    const t = setTimeout(() => {
      setDocPhase('typing');
      setPhraseIndex(1); // Product manual 먼저
      setVisibleLength(0);
    }, INITIAL_DURATION_MS);
    return () => clearTimeout(t);
  }, [docPhase]);

  // 타이핑이 끝나면 잠시 대기 후 다음 문구로 (Product manual ↔ Documentation 번갈아)
  useEffect(() => {
    if (docPhase !== 'typing' || visibleLength < currentPhrase.length) return;
    const t = setTimeout(() => {
      setPhraseIndex((i) => (i + 1) % ROTATING_PHRASES.length);
      setVisibleLength(0);
    }, PAUSE_BEFORE_NEXT_MS);
    return () => clearTimeout(t);
  }, [docPhase, visibleLength, currentPhrase.length]);

  // 타이핑 구간: 한 글자씩 추가
  useEffect(() => {
    if (docPhase !== 'typing') return;
    typingIntervalRef.current = setInterval(() => {
      setVisibleLength((prev) => {
        if (prev >= currentPhrase.length - 1) {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          return currentPhrase.length;
        }
        return prev + 1;
      });
    }, TYPE_DELAY_MS);
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [docPhase, currentPhrase]);

  const displayDocText =
    docPhase === 'initial'
      ? 'Documentation'
      : currentPhrase.slice(0, visibleLength);
  const showCursor = docPhase === 'typing' && visibleLength < currentPhrase.length;

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
            <span className="text-gradient-blue-amber inline-flex items-baseline">
              {displayDocText}
              {showCursor && (
                <span className="inline-block w-[0.15em] h-[0.9em] ml-0.5 bg-current animate-pulse align-baseline" aria-hidden />
              )}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl animate-fade-in-up delay-100">
            Keeping your docs in sync is exhausting—development moves faster, and manual updates can’t keep up. zylo-docs syncs your documentation automatically so you can focus on building.
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
            {/* Animated Knowledge Graph - organic layout, curved edges */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-amber-500/10 glow-blue">
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <svg
                  viewBox="0 0 280 280"
                  className="w-full h-full max-w-[320px] max-h-[320px] text-foreground/90"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="hero-edge-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="rgb(245 158 11)" stopOpacity="0.35" />
                    </linearGradient>
                    <linearGradient id="hero-node-center" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgb(59 130 246)" />
                      <stop offset="100%" stopColor="rgb(245 158 11)" />
                    </linearGradient>
                    <filter id="hero-glow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Edges - curved paths (Q = quadratic Bezier), subtle base line */}
                  <g fill="none" stroke="url(#hero-edge-blue)" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M 140 140 Q 128 90 132 58" pathLength={1} />
                    <path d="M 140 140 Q 185 135 218 138" pathLength={1} />
                    <path d="M 140 140 Q 148 195 142 228" pathLength={1} />
                    <path d="M 140 140 Q 98 142 58 138" pathLength={1} />
                    <path d="M 140 140 Q 168 108 192 88" pathLength={1} />
                    <path d="M 140 140 Q 108 172 88 202" pathLength={1} />
                    <path d="M 140 140 Q 172 172 200 198" pathLength={1} />
                    <path d="M 140 140 Q 108 108 82 90" pathLength={1} />
                    {/* Outer-to-outer for more natural network look */}
                    <path d="M 132 58 Q 162 72 192 88" pathLength={1} strokeOpacity="0.6" />
                    <path d="M 88 202 Q 118 218 142 228" pathLength={1} strokeOpacity="0.6" />
                    <path d="M 58 138 Q 72 168 88 202" pathLength={1} strokeOpacity="0.6" />
                  </g>
                  {/* Edges - animated flow (same paths) */}
                  <g fill="none" stroke="url(#hero-edge-blue)" strokeWidth="1.8" strokeLinecap="round" className="animate-graph-flow">
                    <path d="M 140 140 Q 128 90 132 58" pathLength={1} />
                    <path d="M 140 140 Q 185 135 218 138" pathLength={1} style={{ animationDelay: '0.15s' }} />
                    <path d="M 140 140 Q 148 195 142 228" pathLength={1} style={{ animationDelay: '0.3s' }} />
                    <path d="M 140 140 Q 98 142 58 138" pathLength={1} style={{ animationDelay: '0.08s' }} />
                    <path d="M 140 140 Q 168 108 192 88" pathLength={1} style={{ animationDelay: '0.22s' }} />
                    <path d="M 140 140 Q 108 172 88 202" pathLength={1} style={{ animationDelay: '0.38s' }} />
                    <path d="M 140 140 Q 172 172 200 198" pathLength={1} style={{ animationDelay: '0.12s' }} />
                    <path d="M 140 140 Q 108 108 82 90" pathLength={1} style={{ animationDelay: '0.25s' }} />
                    <path d="M 132 58 Q 162 72 192 88" pathLength={1} style={{ animationDelay: '0.4s' }} strokeOpacity="0.85" />
                    <path d="M 88 202 Q 118 218 142 228" pathLength={1} style={{ animationDelay: '0.45s' }} strokeOpacity="0.85" />
                    <path d="M 58 138 Q 72 168 88 202" pathLength={1} style={{ animationDelay: '0.2s' }} strokeOpacity="0.85" />
                  </g>
                  {/* Nodes - varied size & position for organic feel */}
                  <circle cx="132" cy="58" r="5" fill="rgb(59 130 246)" opacity="0.92" className="animate-node-pulse" />
                  <circle cx="218" cy="138" r="5.5" fill="rgb(59 130 246)" opacity="0.92" className="animate-node-pulse" style={{ animationDelay: '0.15s' }} />
                  <circle cx="142" cy="228" r="5" fill="rgb(245 158 11)" opacity="0.92" className="animate-node-pulse" style={{ animationDelay: '0.3s' }} />
                  <circle cx="58" cy="138" r="5.5" fill="rgb(59 130 246)" opacity="0.92" className="animate-node-pulse" style={{ animationDelay: '0.08s' }} />
                  <circle cx="192" cy="88" r="4.5" fill="rgb(245 158 11)" opacity="0.88" className="animate-node-pulse" style={{ animationDelay: '0.22s' }} />
                  <circle cx="88" cy="202" r="4.5" fill="rgb(245 158 11)" opacity="0.88" className="animate-node-pulse" style={{ animationDelay: '0.38s' }} />
                  <circle cx="200" cy="198" r="4" fill="rgb(59 130 246)" opacity="0.88" className="animate-node-pulse" style={{ animationDelay: '0.12s' }} />
                  <circle cx="82" cy="90" r="4" fill="rgb(59 130 246)" opacity="0.88" className="animate-node-pulse" style={{ animationDelay: '0.25s' }} />
                  {/* Center node */}
                  <circle cx="140" cy="140" r="10" fill="url(#hero-node-center)" filter="url(#hero-glow)" className="animate-pulse" />
                </svg>
              </div>
              <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">AI-Powered Knowledge Graph</p>
              {/* Decorative grid overlay */}
              <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
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
