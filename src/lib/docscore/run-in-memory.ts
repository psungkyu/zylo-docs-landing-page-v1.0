import { crawlDocs } from "./crawler";
import { parsePages } from "./parser";
import { extractSignals } from "./signals";
import { computeScores } from "./scoring";
import type { Signals } from "./types";

export interface DocScoreResult {
  overallScore: number;
  aiVisibilityScore: number;
  implementationAccuracyScore: number;
  signals: Signals;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export async function runPipelineInMemory(url: string): Promise<DocScoreResult> {
  const pages = await crawlDocs(url, { maxPages: 10, maxDepth: 2 });
  const parsed = parsePages(pages);
  const signals = extractSignals(parsed);
  const scores = computeScores(signals);

  return {
    overallScore: scores.overallScore,
    aiVisibilityScore: scores.aiVisibilityScore,
    implementationAccuracyScore: scores.implementationAccuracyScore,
    signals,
    strengths: scores.strengths,
    weaknesses: scores.weaknesses,
    recommendations: scores.recommendations,
  };
}
