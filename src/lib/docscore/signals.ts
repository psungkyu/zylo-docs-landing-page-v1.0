import type { ParsedPage } from "./types";
import type { Signals } from "./types";

const lower = (s: string) => s.toLowerCase();

function hasPhrase(text: string, phrases: string[]): boolean {
  const t = lower(text);
  return phrases.some((p) => t.includes(lower(p)));
}

export function extractSignals(pages: ParsedPage[]): Signals {
  const allText = pages.map((p) => p.title + " " + p.text).join(" ");
  const allLower = lower(allText);

  return {
    categoryDescriptions: hasPhrase(allText, ["overview", "about", "product", "category", "what is"]),
    useCaseDescriptions: hasPhrase(allText, ["use case", "use-case", "getting started", "scenario"]),
    comparisonPages: hasPhrase(allText, ["compare", "vs ", "alternative", "competitor", "migration from"]),
    integrationLists: hasPhrase(allText, ["integration", "connect", "api key", "webhook"]),
    customerProof: hasPhrase(allText, ["customer", "case study", "testimonial", "logo", "trusted by"]),
    securityCompliance: hasPhrase(allText, ["security", "compliance", "soc", "gdpr", "encryption"]),
    faq: hasPhrase(allText, ["faq", "frequently asked", "common question"]),
    pricing: hasPhrase(allText, ["pricing", "plan", "tier", "subscription", "free trial"]),
    quickstart: hasPhrase(allText, ["quickstart", "quick start", "5 minute", "in 5 min"]),
    gettingStarted: hasPhrase(allText, ["getting started", "getting-started", "introduction"]),
    authentication: hasPhrase(allText, ["auth", "login", "token", "api key", "bearer", "oauth"]),
    authInstructions: hasPhrase(allText, ["authenticate", "authorization", "header", "credentials"]),
    apiReference: hasPhrase(allText, ["api reference", "endpoint", "rest api", "graphql"]),
    examples: hasPhrase(allText, ["example", "sample", "code snippet"]),
    curlExamples: hasPhrase(allText, ["curl", "http request"]),
    pythonExamples: hasPhrase(allText, ["python", "pip install", "import "]),
    jsExamples: hasPhrase(allText, ["javascript", "node", "npm install", "require(", "import "]),
    jsonResponses: hasPhrase(allText, ["json", "response body", "200 ok"]),
    requestBodies: hasPhrase(allText, ["request body", "request body", "post body", "parameters"]),
    requestParams: hasPhrase(allText, ["parameter", "query string", "path variable"]),
    responseSchemas: hasPhrase(allText, ["response", "schema", "field", "property"]),
    errorCodes: hasPhrase(allText, ["error", "status code", "4xx", "5xx"]),
  };
}
