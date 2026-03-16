/**
 * 히어로 섹션 (그래프 변환 기능 포함).
 * 현재 배포는 홀드 상태 → Home에서 HeroSectionFallback 사용 중.
 * 그래프 재개 시 Home.tsx에서 ClerkProvider + HeroSection 주석 해제.
 */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth, useClerk, useUser, SignOutButton } from '@clerk/react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeProps,
  type EdgeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowRight, Zap, Link2, Network, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PENDING_GRAPH_URL_KEY = 'pendingGraphUrl';

/** Clerk JWT template name for Zylo Engine Backend (env: VITE_ZYLO_ENGINE_JWT_TEMPLATE) */
const ZYLO_ENGINE_JWT_TEMPLATE =
  process.env.NEXT_PUBLIC_ZYLO_ENGINE_JWT_TEMPLATE ?? 'zylo-engine-backend';

const GRAPH_API_URL = process.env.NEXT_PUBLIC_GRAPH_API_URL ?? 'http://localhost:8000';

async function callGraphUpsert(url: string, token: string): Promise<Response> {
  const res = await fetch(`${GRAPH_API_URL}/graph/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  });
  return res;
}

async function callGraphFlow(
  url: string,
  token: string
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const res = await fetch(
    `${GRAPH_API_URL}/graph/flow?url=${encodeURIComponent(url)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json();
}

/** 노드/엣지 라벨에서 "Node :", "Relationship :" 등 접두어 제거 */
function cleanLabel(raw: string | undefined | null): string {
  if (raw == null) return '';
  const s = String(raw).trim();
  return s.replace(/^(?:Node|Relationship|Edge|Relation)\s*:\s*/i, '').trim() || s;
}

/** 노드 표시 이름: label이 비거나 'Node' 같은 기본값이면 name/title/url/id 순으로 사용 */
function getNodeDisplayLabel(data: NodeProps['data'], id: string): string {
  const raw = data?.label != null ? String(data.label) : '';
  const cleaned = cleanLabel(raw);
  if (cleaned && cleaned.toLowerCase() !== 'node') return cleaned;
  const d = data as Record<string, unknown> | undefined;
  if (d?.name != null && String(d.name).trim()) return String(d.name).trim();
  if (d?.title != null && String(d.title).trim()) return String(d.title).trim();
  if (d?.url != null) {
    const u = String(d.url);
    try {
      const path = new URL(u).pathname;
      const segment = path.split('/').filter(Boolean).pop();
      if (segment) return decodeURIComponent(segment);
    } catch {
      return u;
    }
    return u;
  }
  return id;
}

/** dagre로 계층 레이아웃 적용 (노드 위치만 재계산) */
async function getLayoutedNodes<N extends Node>(nodes: N[], edges: Edge[]): Promise<N[]> {
  if (nodes.length === 0) return nodes;
  const dagre = await import('dagre');
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 80 });

  const nodeWidth = 72;
  const nodeHeight = 52;
  nodes.forEach((n) => g.setNode(n.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    if (!pos) return n;
    return {
      ...n,
      position: { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 },
    };
  });
}
const NODE_COLORS = [
  'rgb(59, 130, 246)',   // blue-500
  'rgb(245, 158, 11)',   // amber-500
  'rgb(34, 197, 94)',    // green-500
  'rgb(168, 85, 247)',   // violet-500
  'rgb(236, 72, 153)',   // pink-500
  'rgb(20, 184, 166)',   // teal-500
  'rgb(251, 146, 60)',   // orange-400
  'rgb(99, 102, 241)',   // indigo-500
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i) | 0;
  return Math.abs(h);
}

function CircleNode({ data, id }: NodeProps) {
  const label = getNodeDisplayLabel(data, id);
  const color = NODE_COLORS[hashId(label) % NODE_COLORS.length];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-medium text-foreground text-center max-w-[100px] truncate px-1" title={label}>
        {label}
      </span>
      <div
        className="rounded-full border-2 border-white/20 shadow-md shrink-0 w-9 h-9"
        style={{ backgroundColor: color }}
      >
        <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border-2 !border-white !-top-1" />
        <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !border-2 !border-white !-bottom-1" />
      </div>
    </div>
  );
}

function LabeledEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const rawLabel = data?.label ?? (data as { label?: string })?.label;
  const label = cleanLabel(rawLabel != null ? String(rawLabel) : '');
  const edgeData = data as Record<string, unknown> | undefined;
  const tooltipParts: string[] = [];
  if (label) tooltipParts.push(label);
  if (edgeData?.type != null) tooltipParts.push(`Type: ${String(edgeData.type)}`);
  if (edgeData?.name != null && String(edgeData.name) !== label) tooltipParts.push(String(edgeData.name));
  const tooltip = tooltipParts.length > 0 ? tooltipParts.join(' · ') : undefined;
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute rounded px-1.5 py-0.5 text-[10px] font-medium bg-background/95 border border-blue-500/20 text-foreground shadow-sm min-w-[20px] text-center cursor-default"
          style={{ transform: `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)` }}
          title={tooltip}
        >
          {label || '—'}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = { circleNode: CircleNode };
const edgeTypes = { labeled: LabeledEdge };

// 고정 3단계 순서: 0 Living Documentation → 1 Living Product manual → 2 The Lovable of Documentation → 반복
const STEP_PHRASE: [string, string][] = [
  ['Living', 'Documentation'],
  ['Living', 'Product manual'],
  ['The Lovable of', 'Documentation'],
];
const INITIAL_DURATION_MS = 2200;
const TYPE_DELAY_MS = 80;
const PAUSE_BEFORE_NEXT_MS = 1200;

export default function HeroSection() {
  const { isSignedIn, isLoaded: authLoaded, getToken } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const [scrollY, setScrollY] = useState(0);
  const [docPhase, setDocPhase] = useState<'initial' | 'typing'>('initial');
  const [stepIndex, setStepIndex] = useState(0); // 0, 1, 2 반복
  const [visibleLength, setVisibleLength] = useState(0);
  const scheduledNextRef = useRef(false);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [headlinePrefix, currentPhrase] = STEP_PHRASE[stepIndex];
  const [graphUrl, setGraphUrl] = useState('');
  const [graphRequested, setGraphRequested] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [flowForUrl, setFlowForUrl] = useState<string | null>(null);
  const [flowLoading, setFlowLoading] = useState(false);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setFlowNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setFlowEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect: OnConnect = useCallback(
    (params) => setFlowEdges((eds) => addEdge(params, eds)),
    []
  );

  // 로그인 직후 저장해 둔 URL로 바로 분석 트리거 (Zylo Engine용 JWT 발급 후 프로세싱 표시)
  useEffect(() => {
    if (!authLoaded || !isSignedIn || !getToken) return;
    const pending = sessionStorage.getItem(PENDING_GRAPH_URL_KEY);
    if (!pending) return;
    sessionStorage.removeItem(PENDING_GRAPH_URL_KEY);

    setIsProcessing(true);
    setFlowForUrl(null);
    setFlowLoading(false);
    (async () => {
      try {
        const token = await getToken({ template: ZYLO_ENGINE_JWT_TEMPLATE });
        if (token) {
          const res = await callGraphUpsert(pending, token);
          if (!res.ok) {
            const errText = await res.text();
            toast.error(`업서트 실패 (${res.status}): ${errText || res.statusText}`);
          } else {
            toast.success('처리가 완료되었습니다.');
            setFlowLoading(true);
            try {
              const flow = await callGraphFlow(pending, token);
              const nodesWithType = flow.nodes.map((n) => ({ ...n, type: 'circleNode' }));
              const edgesWithType = flow.edges.map((e) => ({
                ...e,
                type: 'labeled',
                data: { ...e.data, label: (e.data as { label?: string })?.label ?? (e as { label?: string }).label ?? '' },
              }));
              const layoutedNodes = await getLayoutedNodes(nodesWithType, edgesWithType);
              setFlowNodes(layoutedNodes);
              setFlowEdges(edgesWithType);
              setFlowForUrl(pending);
            } catch (e) {
              toast.error(`그래프 로드 실패: ${e instanceof Error ? e.message : String(e)}`);
            } finally {
              setFlowLoading(false);
            }
          }
        }
      } catch (e) {
        toast.error(`요청 실패: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setIsProcessing(false);
      }
      setGraphUrl(pending);
      setGraphRequested(true);
    })();
  }, [authLoaded, isSignedIn, getToken]);

  const handleViewClick = () => {
    const url = graphUrl.trim();
    if (!url) return;

    // 비로그인: 로그인 유도 후 돌아오면 해당 URL로 분석
    if (authLoaded && !isSignedIn) {
      sessionStorage.setItem(PENDING_GRAPH_URL_KEY, url);
      clerk.openSignIn({});
      return;
    }

    // 로그인됐거나 auth 아직 로드 전: 그래프 요청 표시 후, JWT 발급 및 프로세싱 알림
    setGraphRequested(true);
    setIsProcessing(true);
    setFlowForUrl(null);
    setFlowLoading(false);
    (async () => {
      try {
        const token = getToken
          ? await getToken({ template: ZYLO_ENGINE_JWT_TEMPLATE })
          : null;
        if (token) {
          const res = await callGraphUpsert(url, token);
          if (!res.ok) {
            const errText = await res.text();
            toast.error(`업서트 실패 (${res.status}): ${errText || res.statusText}`);
          } else {
            toast.success('처리가 완료되었습니다.');
            setFlowLoading(true);
            try {
              const flow = await callGraphFlow(url, token);
              const nodesWithType = flow.nodes.map((n) => ({ ...n, type: 'circleNode' }));
              const edgesWithType = flow.edges.map((e) => ({
                ...e,
                type: 'labeled',
                data: { ...e.data, label: (e.data as { label?: string })?.label ?? (e as { label?: string }).label ?? '' },
              }));
              const layoutedNodes = await getLayoutedNodes(nodesWithType, edgesWithType);
              setFlowNodes(layoutedNodes);
              setFlowEdges(edgesWithType);
              setFlowForUrl(url);
            } catch (e) {
              toast.error(`그래프 로드 실패: ${e instanceof Error ? e.message : String(e)}`);
            } finally {
              setFlowLoading(false);
            }
          }
        }
      } catch (e) {
        toast.error(`요청 실패: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setIsProcessing(false);
      }
    })();
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 첫 화면: Living Documentation 전체만 보여준 뒤, 다음 단계(1. Product manual)로
  useEffect(() => {
    if (docPhase !== 'initial') return;
    const t = setTimeout(() => {
      setDocPhase('typing');
      setStepIndex(1); // Living Product manual
      setVisibleLength(0);
    }, INITIAL_DURATION_MS);
    return () => clearTimeout(t);
  }, [docPhase]);

  // 타이핑이 끝나면 잠시 대기 후 다음 단계로 (1 → 2 → 0 → 1 → 2 → 0 ...)
  useEffect(() => {
    if (docPhase !== 'typing' || visibleLength < currentPhrase.length) {
      scheduledNextRef.current = false;
      return;
    }
    if (scheduledNextRef.current) return;
    scheduledNextRef.current = true;
    const t = setTimeout(() => {
      scheduledNextRef.current = false;
      setStepIndex((s) => (s + 1) % 3);
      setVisibleLength(0);
    }, PAUSE_BEFORE_NEXT_MS);
    return () => clearTimeout(t);
  }, [docPhase, visibleLength, currentPhrase.length, stepIndex]);

  // 타이핑 구간: 한 글자씩 추가. stepIndex 포함해 단계가 바뀔 때마다(2→0처럼 문구가 같아도) 새로 시작
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
  }, [docPhase, currentPhrase, stepIndex]);

  const displayDocText =
    docPhase === 'initial'
      ? 'Documentation'
      : currentPhrase.slice(0, visibleLength);
  const showCursor = docPhase === 'typing' && visibleLength < currentPhrase.length;
  const displayPrefix = docPhase === 'initial' ? 'Living' : headlinePrefix;

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
            {displayPrefix}
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

        {/* Right: URL input + Graph (React Flow placeholder) - 모든 breakpoint에서 표시 */}
        <div className="flex-1 relative w-full lg:max-w-[420px] min-w-0">
          <div
            className="relative"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
            }}
          >
            <div
              className={`rounded-2xl overflow-visible border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-amber-500/10 shadow-xl glow-blue transition-opacity ${isProcessing ? 'pointer-events-none opacity-70' : ''}`}
            >
              {/* URL input block */}
              <div className="p-5 border-b border-blue-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="size-4 text-blue-400 shrink-0" />
                  <span className="text-sm font-medium text-foreground">Explore your docs as a graph</span>
                </div>
                {authLoaded && isSignedIn && user && (
                  <div className="flex items-center justify-between gap-2 mb-3 min-h-[28px] overflow-visible">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground min-w-0 overflow-visible">
                      <span className="shrink-0 overflow-visible p-1.5 -m-1.5" aria-hidden>
                        <span className="size-2 rounded-full bg-green-400 block animate-status-dot-glow" />
                      </span>
                      <span className="truncate">
                        Signed in as {user.primaryEmailAddress?.emailAddress ?? user.firstName ?? 'Signed in'}
                      </span>
                    </span>
                    <SignOutButton>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
                      >
                        <LogOut className="size-3.5 mr-1" />
                        Sign out
                      </Button>
                    </SignOutButton>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://docs.example.com"
                    value={graphUrl}
                    onChange={(e) => setGraphUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleViewClick()}
                    disabled={isProcessing}
                    className="flex-1 h-10 bg-background/80 border-blue-500/20 text-foreground placeholder:text-zinc-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/40 disabled:opacity-70"
                  />
                  {isProcessing ? (
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <Loader2 className="size-5 text-blue-400 animate-spin" aria-hidden />
                    </div>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleViewClick}
                      className="h-10 shrink-0 bg-blue-500 hover:bg-blue-600 text-white border-0 glow-blue"
                    >
                      <Network className="size-4 mr-1.5" />
                      View
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Enter a documentation URL to visualize its structure.</p>
              </div>

              {/* Graph area (React Flow or placeholder) */}
              <div className="aspect-square min-h-[280px] flex items-center justify-center relative overflow-hidden rounded-b-2xl bg-gradient-to-b from-background/50 to-blue-500/5 border-t border-blue-500/10">
                {graphRequested && graphUrl.trim() ? (
                  flowForUrl === graphUrl.trim() &&
                  (flowNodes.length > 0 || flowEdges.length > 0) ? (
                    <div className="graph-flow-zylo w-full h-full min-h-[280px] rounded-b-2xl overflow-hidden">
                      <ReactFlow
                        nodes={flowNodes}
                        edges={flowEdges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
                        minZoom={0.2}
                        maxZoom={1.5}
                        defaultEdgeOptions={{ type: 'labeled' }}
                        className="!bg-transparent"
                      />
                    </div>
                  ) : flowLoading ? (
                    <div className="text-center px-4 py-8">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
                        <Loader2 className="size-7 text-blue-400 animate-spin" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">그래프 불러오는 중</p>
                      <p className="text-xs text-muted-foreground">문서 구조를 분석하고 있어요</p>
                    </div>
                  ) : (
                    <div className="text-center px-4 py-6">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-3">
                        <Network className="size-7 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">Graph view</p>
                      <p className="text-xs text-muted-foreground max-w-[220px] mx-auto break-all">
                        {graphUrl.trim()}
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center px-4 py-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-4">
                      <Network className="size-7 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm text-muted-foreground">Enter a URL and click View</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">to see the documentation graph</p>
                  </div>
                )}
                <div className="absolute inset-0 grid-overlay opacity-[0.06] pointer-events-none rounded-b-2xl" />
              </div>
            </div>

            {/* Floating hint */}
            <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
              <span className="text-xs text-muted-foreground/80 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-500/10">
                Powered by GraphRAG
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
