export interface CrawlPage {
  url: string;
  html: string;
  depth: number;
}

export interface ParsedPage {
  url: string;
  title: string;
  text: string;
  links: string[];
}

export interface Signals {
  categoryDescriptions: boolean;
  useCaseDescriptions: boolean;
  comparisonPages: boolean;
  integrationLists: boolean;
  customerProof: boolean;
  securityCompliance: boolean;
  faq: boolean;
  pricing: boolean;
  quickstart: boolean;
  gettingStarted: boolean;
  authentication: boolean;
  authInstructions: boolean;
  apiReference: boolean;
  examples: boolean;
  curlExamples: boolean;
  pythonExamples: boolean;
  jsExamples: boolean;
  jsonResponses: boolean;
  requestBodies: boolean;
  requestParams: boolean;
  responseSchemas: boolean;
  errorCodes: boolean;
}
