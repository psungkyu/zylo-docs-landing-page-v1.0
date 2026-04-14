import type { CrawlPage } from "./types";

function resolveUrl(base: string, href: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return "";
  }
}

function sameOrigin(baseUrl: string, targetUrl: string): boolean {
  try {
    const b = new URL(baseUrl);
    const t = new URL(targetUrl);
    return b.origin === t.origin;
  } catch {
    return false;
  }
}

export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
}

export async function crawlDocs(
  startUrl: string,
  options: CrawlOptions = {}
): Promise<CrawlPage[]> {
  const { maxPages = 10, maxDepth = 2 } = options;
  const base = new URL(startUrl).origin;
  const seen = new Set<string>();
  const result: CrawlPage[] = [];
  const queue: { url: string; depth: number }[] = [{ url: startUrl, depth: 0 }];

  while (queue.length > 0 && result.length < maxPages) {
    const { url, depth } = queue.shift()!;
    const norm = url.replace(/#.*$/, "").replace(/\?.*$/, q => (q ? "?" : ""));
    if (seen.has(norm) || depth > maxDepth) continue;
    seen.add(norm);

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "ZyloDocScore/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;
      const html = await res.text();
      result.push({ url: norm, html, depth });

      if (depth >= maxDepth) continue;

      const linkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["']/gi;
      let m: RegExpExecArray | null;
      while ((m = linkRegex.exec(html)) !== null) {
        const resolved = resolveUrl(url, m[1].trim());
        if (!resolved || !sameOrigin(base, resolved)) continue;
        const clean = resolved.replace(/#.*$/, "").split("?")[0];
        if (!seen.has(clean)) queue.push({ url: resolved, depth: depth + 1 });
      }
    } catch {
      // skip failed pages
    }
  }

  return result;
}
