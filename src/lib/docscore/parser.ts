import * as cheerio from "cheerio";
import type { CrawlPage } from "./types";
import type { ParsedPage } from "./types";

export function parsePages(pages: CrawlPage[]): ParsedPage[] {
  return pages.map((p) => {
    const $ = cheerio.load(p.html);
    const title = $("title").first().text().trim() || "";
    const body = $("body").first();
    const text = body.text().replace(/\s+/g, " ").trim().slice(0, 50000);
    const links: string[] = [];
    body.find("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.startsWith("http")) links.push(href);
    });
    return { url: p.url, title, text, links };
  });
}
