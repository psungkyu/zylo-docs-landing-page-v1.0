import React from 'react';
import { ArrowRight, Zap, Link2, Network } from 'lucide-react';

/**
 * 히어로 섹션 (Clerk 없음): 그래프 카드만 플레이스홀더. Vercel 등에서 키가 없을 때 전체 페이지가 보이도록.
 */
export default function HeroSectionFallback() {
  const [scrollY, setScrollY] = React.useState(0);
  const [docPhase, setDocPhase] = React.useState<'initial' | 'typing'>('initial');
  const [stepIndex, setStepIndex] = React.useState(0);
  const [visibleLength, setVisibleLength] = React.useState(0);
  const stepPhrase: [string, string][] = [
    ['Living', 'Documentation'],
    ['Living', 'Product manual'],
    ['The Lovable of', 'Documentation'],
  ];
  const [headlinePrefix, currentPhrase] = stepPhrase[stepIndex];

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (docPhase !== 'initial') return;
    const t = setTimeout(() => {
      setDocPhase('typing');
      setStepIndex(1);
      setVisibleLength(0);
    }, 2200);
    return () => clearTimeout(t);
  }, [docPhase]);

  React.useEffect(() => {
    if (docPhase !== 'typing' || visibleLength < currentPhrase.length) return;
    const t = setTimeout(() => {
      setStepIndex((s) => (s + 1) % 3);
      setVisibleLength(0);
    }, 1200);
    return () => clearTimeout(t);
  }, [docPhase, visibleLength, currentPhrase.length, stepIndex]);

  React.useEffect(() => {
    if (docPhase !== 'typing') return;
    const id = setInterval(() => {
      setVisibleLength((prev) => Math.min(prev + 1, currentPhrase.length));
    }, 80);
    return () => clearInterval(id);
  }, [docPhase, currentPhrase, stepIndex]);

  const displayDocText = docPhase === 'initial' ? 'Documentation' : currentPhrase.slice(0, visibleLength);
  const showCursor = docPhase === 'typing' && visibleLength < currentPhrase.length;
  const displayPrefix = docPhase === 'initial' ? 'Living' : headlinePrefix;

  return (
    <section className="relative min-h-screen w-full pt-24 pb-20 overflow-hidden grid-overlay">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-amber-500/5 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[calc(100vh-120px)]">
        <div className="flex-1 max-w-2xl w-full">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Zap size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-300">AI-Powered Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-mono leading-tight mb-6 text-foreground animate-fade-in-up">
            {displayPrefix}
            <br />
            <span className="text-gradient-blue-amber inline-flex items-baseline">
              {displayDocText}
              {showCursor && (
                <span className="inline-block w-[0.15em] h-[0.9em] ml-0.5 bg-current animate-pulse align-baseline" aria-hidden />
              )}
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl animate-fade-in-up delay-100">
            Keeping your docs in sync is exhausting—development moves faster, and manual updates can't keep up. zylo-docs syncs your documentation automatically so you can focus on building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
            <a href="https://tally.so/r/wgBlOO" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 glow-blue">
              Start Free Trial
              <ArrowRight size={20} />
            </a>
            <a href="https://tally.so/r/wgBlOO" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-lg border border-blue-500/30 hover:border-blue-500/60 text-foreground font-semibold transition-all duration-300 hover:bg-blue-500/10 flex items-center justify-center">
              Watch Demo
            </a>
          </div>
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

        <div className="flex-1 relative w-full lg:max-w-[420px] min-w-0">
          <div className="relative" style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
            <div className="rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-amber-500/10 shadow-xl glow-blue p-5">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="size-4 text-blue-400 shrink-0" />
                <span className="text-sm font-medium text-foreground">Explore your docs as a graph</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Sign in with Clerk to visualize documentation as a graph. Set VITE_CLERK_PUBLISHABLE_KEY to enable.
              </p>
              <div className="aspect-square min-h-[200px] rounded-xl bg-background/40 border border-blue-500/10 flex items-center justify-center">
                <div className="text-center px-4">
                  <Network className="size-10 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Graph preview</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/80 mt-3 text-center">Powered by GraphRAG</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
