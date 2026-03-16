import type { Signals } from "./types";

export interface Scores {
  aiVisibilityScore: number;
  implementationAccuracyScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

function normalize(count: number, max: number): number {
  if (max <= 0) return 0;
  const raw = (count / max) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function computeScores(signals: Signals): Scores {
  const visibilityFeatures: [boolean, string, string][] = [
    [signals.categoryDescriptions, "Category explanation", "Add a clear product/category overview page."],
    [signals.useCaseDescriptions, "Use-case clarity", "Describe concrete use-cases and scenarios."],
    [signals.comparisonPages, "Comparison pages", "Add comparison pages vs alternatives/competitors."],
    [signals.integrationLists, "Integrations", "List supported integrations and how to connect them."],
    [signals.customerProof, "Customer proof", "Add customer logos, case studies or testimonials."],
    [signals.securityCompliance, "Security/compliance", "Document security and compliance posture clearly."],
    [signals.faq, "FAQ", "Provide FAQ for common questions and objections."],
    [signals.pricing, "Pricing clarity", "Expose transparent pricing for developers."],
  ];

  const implFeatures: [boolean, string, string][] = [
    [signals.quickstart || signals.gettingStarted, "Quickstart flow", 'Add a "5 minutes" quickstart flow.'],
    [signals.authentication && signals.authInstructions, "Auth flow docs", "Document auth tokens, headers and flows precisely."],
    [signals.apiReference, "API reference", "Provide a structured, navigable API reference."],
    [signals.examples, "Code examples", "Include end-to-end examples per key use-case."],
    [signals.curlExamples, "cURL examples", "Provide minimal cURL examples for quick testing."],
    [signals.pythonExamples, "Python examples", "Add idiomatic Python examples if Python is a target."],
    [signals.jsExamples, "JS/TS examples", "Add Node.js / browser JS examples."],
    [signals.jsonResponses, "JSON response examples", "Show realistic JSON responses for main endpoints."],
    [signals.requestBodies && signals.requestParams, "Request docs", "Document request bodies and parameters clearly."],
    [signals.responseSchemas, "Response schema docs", "Describe response fields and types."],
    [signals.errorCodes, "Error codes", "List typical error codes and how to handle them."],
  ];

  const visibilityCount = visibilityFeatures.filter(([v]) => v).length;
  const implCount = implFeatures.filter(([v]) => v).length;
  const aiVisibilityScore = normalize(visibilityCount, visibilityFeatures.length);
  const implementationAccuracyScore = normalize(implCount, implFeatures.length);
  const overallScore = Math.round((aiVisibilityScore + implementationAccuracyScore) / 2);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  for (const [present, label, rec] of visibilityFeatures.concat(implFeatures)) {
    if (present) strengths.push(label);
    else {
      weaknesses.push(label);
      recommendations.push(rec);
    }
  }

  return {
    aiVisibilityScore,
    implementationAccuracyScore,
    overallScore,
    strengths,
    weaknesses,
    recommendations,
  };
}
