"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, X, Link2 } from "lucide-react";
import { toast } from "sonner";

interface DocScoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EvaluationStatus {
  _id: string;
  url: string;
  status: "running" | "completed" | "failed";
  step: string;
  progress: number;
  result?: {
    overallScore: number;
    aiVisibilityScore: number;
    implementationAccuracyScore: number;
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
  };
  error?: string;
}

const POLL_INTERVAL_MS = 1500;

export function DocScoreModal({ open, onOpenChange }: DocScoreModalProps) {
  const [url, setUrl] = useState("");
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [status, setStatus] = useState<EvaluationStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setUrl("");
      setEvaluationId(null);
      setStatus(null);
      setIsSubmitting(false);
      setError(null);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
  }, [open]);

  useEffect(() => {
    if (!evaluationId || !open) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/evaluations/${evaluationId}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error || "Failed to fetch status");
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          return;
        }
        setStatus(data);
        if (data.status === "completed" || data.status === "failed") {
          if (data.status === "failed") setError(data.error || "Analysis failed");
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          setIsSubmitting(false);
        }
      } catch {
        setError("Failed to fetch status");
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        setIsSubmitting(false);
      }
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [evaluationId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    setEvaluationId(null);

    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error((data?.error) || res.statusText || "Failed to start analysis");
      }

      setEvaluationId(data.evaluationId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start analysis");
      setIsSubmitting(false);
    }
  };

  const result = status?.status === "completed" ? status.result : null;
  const currentStep = status?.step ?? "queued";
  const currentProgress = status?.progress ?? 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg w-full">
        <AlertDialogHeader className="relative pr-8">
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 border border-blue-500/40">
              <Sparkles className="h-4 w-4 text-blue-400" />
            </span>
            <span>Get your docs score now!</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Submit a public technical documentation URL. We&apos;ll crawl up to 10 pages, extract rule-based signals,
            and compute two scores: <span className="font-medium text-foreground">AI Visibility</span> and{" "}
            <span className="font-medium text-foreground">Implementation Accuracy</span>.
          </AlertDialogDescription>
          <AlertDialogCancel
            type="button"
            className="absolute right-0 top-0 h-7 w-7 rounded-full border border-zinc-700/60 bg-background/80 text-zinc-400 hover:text-foreground hover:bg-zinc-800/80 flex items-center justify-center p-0"
          >
            <X className="h-3.5 w-3.5" />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Documentation URL
            </label>
            <Input
              type="url"
              placeholder="https://docs.example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting}
              className="text-sm"
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              <div className="font-mono uppercase tracking-wide text-[10px] text-zinc-400">
                Status
              </div>
              <div className="text-xs">
                {status
                  ? status.status === "completed"
                    ? "Completed"
                    : status.status === "failed"
                      ? "Failed"
                      : `${currentStep.replace(/_/g, " ")}`
                  : isSubmitting
                    ? "Starting…"
                    : error
                      ? "Error"
                      : "Idle"}
              </div>
            </div>
            <div className="flex-1 flex flex-col items-end gap-1">
              <div className="font-mono uppercase tracking-wide text-[10px] text-zinc-400">
                Progress
              </div>
              <div className="w-full max-w-[180px] h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{currentProgress}%</span>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          {result && (
            <div className="mt-2 rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-blue-300 uppercase tracking-wide">
                  Final scores
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {result.overallScore}
                  <span className="text-[11px] text-muted-foreground ml-1">/ 100</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-background/60 border border-blue-500/20 px-2 py-1.5">
                  <div className="text-[10px] uppercase tracking-wide text-blue-300 font-mono">
                    AI Visibility
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {result.aiVisibilityScore}
                  </div>
                </div>
                <div className="rounded-md bg-background/60 border border-emerald-500/20 px-2 py-1.5">
                  <div className="text-[10px] uppercase tracking-wide text-emerald-300 font-mono">
                    Implementation
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {result.implementationAccuracyScore}
                  </div>
                </div>
              </div>
              {result.strengths && result.strengths.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wide text-emerald-300 font-mono">
                    Strengths
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted-foreground max-h-20 overflow-auto">
                    {result.strengths.slice(0, 5).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wide text-amber-300 font-mono">
                    Recommendations
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted-foreground max-h-24 overflow-auto">
                    {result.recommendations.slice(0, 5).map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {evaluationId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs"
                  onClick={() => {
                    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/score/${evaluationId}`;
                    navigator.clipboard.writeText(shareUrl).then(
                      () => toast.success("Share link copied"),
                      () => toast.error("Failed to copy")
                    );
                  }}
                >
                  <Link2 className="h-3.5 w-3.5 mr-2" />
                  Copy share link
                </Button>
              )}
            </div>
          )}

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="text-sm" type="button">
              Close
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={isSubmitting || !url.trim()}
              className="text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing…
                </>
              ) : (
                "Analyze docs"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
