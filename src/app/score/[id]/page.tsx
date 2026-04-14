"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Home, ExternalLink } from "lucide-react";
import posthog from "posthog-js";

interface EvaluationDoc {
  _id: string;
  url: string;
  status: string;
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

export default function ScorePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const [data, setData] = useState<EvaluationDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let cancelled = false;
    fetch(`/api/evaluations/${id}`)
      .then(res => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then(json => {
        if (cancelled) return;
        setData(json);
        if (json?.status === "completed" && json?.result) {
          posthog.capture("doc_score_share_page_viewed", {
            evaluation_id: id,
            overall_score: json.result.overallScore,
            ai_visibility_score: json.result.aiVisibilityScore,
            implementation_accuracy_score:
              json.result.implementationAccuracyScore,
            docs_url: json.url,
          });
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-10 w-10 text-amber-400 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading score…</p>
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-muted-foreground mb-6">
            This score link doesn’t exist or has expired.
          </p>
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const result = data.status === "completed" ? data.result : null;
  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-muted-foreground mb-6">
            {data.status === "failed"
              ? (data.error ?? "Analysis failed.")
              : "This evaluation isn’t complete yet."}
          </p>
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-lg mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-foreground">Doc score</h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>

        {data.url && (
          <p
            className="text-sm text-muted-foreground mb-4 truncate"
            title={data.url}
          >
            <ExternalLink className="inline h-3.5 w-3.5 mr-1 align-middle" />
            {data.url}
          </p>
        )}

        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-blue-300 uppercase tracking-wide">
              Overall score
            </span>
            <span className="text-2xl font-bold text-foreground">
              {result.overallScore}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / 100
              </span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-background/60 border border-blue-500/20 px-3 py-3">
              <div className="text-[10px] uppercase tracking-wide text-blue-300 font-mono">
                AI Visibility
              </div>
              <div className="text-lg font-semibold text-foreground">
                {result.aiVisibilityScore}
              </div>
            </div>
            <div className="rounded-lg bg-background/60 border border-emerald-500/20 px-3 py-3">
              <div className="text-[10px] uppercase tracking-wide text-emerald-300 font-mono">
                Implementation
              </div>
              <div className="text-lg font-semibold text-foreground">
                {result.implementationAccuracyScore}
              </div>
            </div>
          </div>
          {result.strengths && result.strengths.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wide text-emerald-300 font-mono">
                Strengths
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {result.strengths.slice(0, 6).map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wide text-amber-300 font-mono">
                Recommendations
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {result.recommendations.slice(0, 6).map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="underline hover:text-foreground">
            What’s your doc score?
          </Link>
        </p>
      </div>
    </div>
  );
}
