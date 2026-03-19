"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Copy, Link2, Network, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DocScoreModal } from '@/components/DocScoreModal';

interface HeroSectionFallbackProps {
  /** QR/행사용 URL(/?openDocScore=1) 진입 시 모달을 바로 열기 위해 사용 */
  defaultOpenDocScore?: boolean;
}

/**
 * 히어로 섹션 껍데기: 그래프 변환 기능 배포 홀드 시 사용. URL 입력 + View + 그래프 영역 UI만 표시 (동작 없음).
 */
export default function HeroSectionFallback({ defaultOpenDocScore }: HeroSectionFallbackProps) {
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
  const [docScoreOpen, setDocScoreOpen] = React.useState(!!defaultOpenDocScore);
  const [copiedInstallCmd, setCopiedInstallCmd] = React.useState(false);
  const router = useRouter();

  // QR/행사 URL(/?openDocScore=1) 진입 시 모달만 열고 주소창은 깔끔하게 / 로 유지
  React.useEffect(() => {
    if (!defaultOpenDocScore) return;
    setDocScoreOpen(true);
    if (typeof window !== 'undefined' && window.location.search) {
      router.replace('/', { scroll: false });
    }
  }, [defaultOpenDocScore, router]);

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
  const installCommand = 'npm i @zylosystems/zylo-floating-widget';

  const handleCopyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopiedInstallCmd(true);
      window.setTimeout(() => setCopiedInstallCmd(false), 1600);
    } catch {
      setCopiedInstallCmd(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full pt-24 pb-20 overflow-hidden grid-overlay">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-amber-500/5 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[calc(100vh-120px)]">
        <div className="flex-1 max-w-2xl w-full">
          <div className="mb-6 w-full max-w-[640px]">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-blue-500/30 bg-background/85 backdrop-blur-md px-3 py-2 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <code className="text-[11px] sm:text-sm font-mono text-blue-100/95 truncate">
                {installCommand}
              </code>
              <button
                type="button"
                onClick={handleCopyInstallCommand}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-200 transition-colors"
                aria-label="Copy install command"
                title="Copy install command"
              >
                {copiedInstallCmd ? <Check className="size-4 text-emerald-300" /> : <Copy className="size-4" />}
              </button>
            </div>
          </div>
          <DocScoreModal open={docScoreOpen} onOpenChange={setDocScoreOpen} />
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
            <div className="rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-amber-500/10 shadow-xl glow-blue">
              <div className="p-5 border-b border-blue-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="size-4 text-blue-400 shrink-0" />
                  <span className="text-sm font-medium text-foreground">Explore your docs as a graph</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://docs.example.com"
                    disabled
                    className="flex-1 h-10 bg-background/80 border-blue-500/20 text-muted-foreground placeholder:text-zinc-500"
                  />
                  <Button type="button" size="sm" disabled className="h-10 shrink-0 bg-blue-500/50 text-white border-0 cursor-not-allowed">
                    <Network className="size-4 mr-1.5" />
                    View
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Graph view coming soon. Get your doc score.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full h-9 border-amber-500/30 text-amber-200/90 hover:bg-amber-500/10"
                  onClick={() => setDocScoreOpen(true)}
                >
                  <Sparkles className="size-4 mr-1.5" />
                  Score my docs
                </Button>
              </div>
              <div className="aspect-square min-h-[280px] flex items-center justify-center rounded-b-2xl bg-gradient-to-b from-background/50 to-blue-500/5 border-t border-blue-500/10">
                <div className="text-center px-4 py-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-4">
                    <Network className="size-7 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm text-muted-foreground">Enter a URL and click View</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">to see the documentation graph</p>
                  <p className="text-xs text-muted-foreground/60 mt-3">(Graph feature coming soon)</p>
                </div>
              </div>
              <div className="flex justify-center pb-3">
                <span className="text-xs text-muted-foreground/80 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-500/10">
                  Powered by GraphRAG
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
