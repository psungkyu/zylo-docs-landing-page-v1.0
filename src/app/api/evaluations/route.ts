import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { crawlDocs } from "@/lib/docscore/crawler";
import { parsePages } from "@/lib/docscore/parser";
import { extractSignals } from "@/lib/docscore/signals";
import { computeScores } from "@/lib/docscore/scoring";
import { getPostHogClient } from "@/lib/posthog-server";

export const maxDuration = 60;

async function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  return new ConvexHttpClient(url);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const url = body?.url;
  if (!url || typeof url !== "string") {
    return Response.json(
      { error: 'Missing or invalid "url"' },
      { status: 400 }
    );
  }

  const client = await getConvexClient();

  let evaluationId: string;
  try {
    const createRef = makeFunctionReference<"mutation">(
      "evaluations:createEvaluation"
    );
    evaluationId = await client.mutation(createRef, { url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Convex create failed";
    return Response.json({ error: message }, { status: 503 });
  }

  const patch = async (
    step: string,
    progress: number,
    result?: unknown,
    error?: string
  ) => {
    const patchRef = (fn: string) => makeFunctionReference<"mutation">(fn);
    if (result !== undefined) {
      await client.mutation(patchRef("evaluations:setCompleted"), {
        evaluationId,
        result,
      });
    } else if (error !== undefined) {
      await client.mutation(patchRef("evaluations:setFailed"), {
        evaluationId,
        error,
      });
    } else {
      await client.mutation(patchRef("evaluations:updateProgress"), {
        evaluationId,
        step,
        progress,
      });
    }
  };

  const posthog = getPostHogClient();

  try {
    posthog.capture({
      distinctId: evaluationId,
      event: "doc_score_analysis_started",
      properties: { evaluation_id: evaluationId, docs_url: url },
    });

    await patch("crawling", 15);
    const pages = await crawlDocs(url, { maxPages: 10, maxDepth: 2 });
    await patch("crawling", 25);

    await patch("parsing", 35);
    const parsed = parsePages(pages);
    await patch("parsing", 50);

    await patch("signals", 60);
    const signals = extractSignals(parsed);
    await patch("signals", 75);

    await patch("scoring", 85);
    const scores = computeScores(signals);
    const result = {
      overallScore: scores.overallScore,
      aiVisibilityScore: scores.aiVisibilityScore,
      implementationAccuracyScore: scores.implementationAccuracyScore,
      signals: { ...signals } as Record<string, boolean>,
      strengths: scores.strengths,
      weaknesses: scores.weaknesses,
      recommendations: scores.recommendations,
    };
    await patch("completed", 100, result);

    posthog.capture({
      distinctId: evaluationId,
      event: "doc_score_analysis_completed",
      properties: {
        evaluation_id: evaluationId,
        docs_url: url,
        overall_score: scores.overallScore,
        ai_visibility_score: scores.aiVisibilityScore,
        implementation_accuracy_score: scores.implementationAccuracyScore,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await patch("failed", 0, undefined, message).catch(() => {});
    posthog.capture({
      distinctId: evaluationId,
      event: "doc_score_analysis_failed",
      properties: {
        evaluation_id: evaluationId,
        docs_url: url,
        error: message,
      },
    });
  } finally {
    await posthog.shutdown();
  }

  return Response.json({ evaluationId });
}
