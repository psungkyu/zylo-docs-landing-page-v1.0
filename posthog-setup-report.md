<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics has been added to the Zylosystems landing page (Next.js 15 App Router). The integration covers client-side event tracking across key conversion touchpoints, server-side analytics for the DocScore API route, a reverse proxy configuration to reduce ad-blocker interference, and exception capture for error tracking.

**Files created:**
- `src/app/posthog-init.tsx` — Client-side PostHog initialization component (mounted in root layout)
- `src/lib/posthog-server.ts` — Server-side PostHog client factory using `posthog-node`

**Files modified:**
- `src/app/layout.tsx` — Added `<PostHogInit />` component
- `next.config.ts` — Added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect`
- `src/components/HeroSectionFallback.tsx` — `install_command_copied`, `doc_score_modal_opened`, `cta_clicked`
- `src/components/DocScoreModal.tsx` — `doc_score_submitted`, `doc_score_completed`, `doc_score_failed`, `doc_score_share_link_copied`
- `src/components/CTASection.tsx` — `cta_clicked` (Start Free Trial, Schedule Demo)
- `src/components/Navigation.tsx` — `nav_get_started_clicked` (desktop + mobile)
- `src/app/score/[id]/page.tsx` — `doc_score_share_page_viewed`
- `src/app/api/evaluations/route.ts` — Server-side: `doc_score_analysis_started`, `doc_score_analysis_completed`, `doc_score_analysis_failed`

| Event Name | Description | File |
|---|---|---|
| `install_command_copied` | User copied the npm install command from hero section | `src/components/HeroSectionFallback.tsx` |
| `doc_score_modal_opened` | User opened the DocScore modal (top of conversion funnel) | `src/components/HeroSectionFallback.tsx` |
| `doc_score_submitted` | User submitted a documentation URL for analysis | `src/components/DocScoreModal.tsx` |
| `doc_score_completed` | Documentation analysis completed successfully with scores | `src/components/DocScoreModal.tsx` |
| `doc_score_failed` | Documentation analysis failed with an error | `src/components/DocScoreModal.tsx` |
| `doc_score_share_link_copied` | User copied the shareable link to their doc score results | `src/components/DocScoreModal.tsx` |
| `cta_clicked` | User clicked a CTA button (Start Free Trial, Schedule Demo, Watch Demo) | `src/components/CTASection.tsx`, `src/components/HeroSectionFallback.tsx` |
| `nav_get_started_clicked` | User clicked the Get Started button in the navigation | `src/components/Navigation.tsx` |
| `doc_score_share_page_viewed` | User viewed a shared documentation score page | `src/app/score/[id]/page.tsx` |
| `doc_score_analysis_started` | Server: doc score analysis job began | `src/app/api/evaluations/route.ts` |
| `doc_score_analysis_completed` | Server: doc score analysis completed successfully | `src/app/api/evaluations/route.ts` |
| `doc_score_analysis_failed` | Server: doc score analysis failed | `src/app/api/evaluations/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/382421/dashboard/1468529
- **DocScore Conversion Funnel** (modal open → submitted → completed): https://us.posthog.com/project/382421/insights/POlUnJe9
- **CTA Click Trends** (Start Free Trial, Schedule Demo, Get Started): https://us.posthog.com/project/382421/insights/ADat1nrq
- **DocScore Analysis Success Rate** (completed vs failed): https://us.posthog.com/project/382421/insights/r30zgh3y
- **Install Command Copy & Share Link Engagement:** https://us.posthog.com/project/382421/insights/CqoN33QK
- **Full Acquisition Funnel** (DocScore → completed → CTA click): https://us.posthog.com/project/382421/insights/HV9J7UgG

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
