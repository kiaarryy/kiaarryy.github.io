# Research, News, and GitHub Sync Design

## Goal

Make the academic homepage trustworthy and publication-led: the Coding panel must mirror GitHub's official contribution calendar, the navigation must use the same typographic system as the rest of the site, and the Research and News pages must explain selected peer-reviewed work through real paper figures, concise findings, and optional detail.

## Confirmed Product Decisions

- GitHub activity uses GitHub's official contribution calendar rather than an independently reconstructed commit count.
- Research is organized by research themes, not as a second publication list.
- News combines prominent publication stories with a compact timeline for conferences, awards, and academic milestones.
- The visual direction is an editorial research narrative: warm paper, forest green, serif display type, restrained data accents, and generous whitespace.
- English and Chinese remain first-class and use the existing language switch.

## GitHub Activity: Root Cause and Architecture

The current browser module calls `github-contributions-api.jogruber.de` and falls back to a checked-in JSON file. On 23 June 2026, the live third-party total matched GitHub GraphQL at 55 contributions and 17 active days, but four dates differed and the repository snapshot was stale at 50 contributions. The page therefore labels a non-official, timezone-shifted source as live GitHub data and can silently regress to an older snapshot.

GitHub Pages cannot safely call GraphQL from the browser because an API token would be exposed. A scheduled GitHub Actions workflow will query `user.contributionsCollection.contributionCalendar` with an authenticated token, normalize the calendar into the existing static JSON shape, and commit the file only when data changes. It will run on a schedule and support manual dispatch. The page will fetch this official snapshot with cache revalidation, show its generated timestamp, and retain the last rendered data if refresh fails.

The checked-in snapshot is the production data source, not a fallback pretending to be live. This makes the source auditable and removes the third-party service from the critical rendering path.

## Typography and Navigation

The existing type pairing remains because it already fits an academic editorial site:

- `Cormorant Garamond` / `Noto Serif SC`: name, page titles, research titles, and major metrics.
- `IBM Plex Sans` / `Noto Sans SC`: navigation, labels, metadata, summaries, and controls.

Navigation will explicitly use the body family, a consistent 600 weight, quieter letter spacing, and less visually heavy inactive borders. Active navigation remains a forest-green filled state. The brand stays in the display family so identity and controls are visibly distinct but coherent.

## Research Page

The page presents four connected research themes:

1. **Operational models from real building data** - AutoModelling turns heterogeneous BMS data into validated executable Modelica chiller models. Featured evidence: 22 chillers screened, 15 modelled, and up to 98.5% lower modelling effort.
2. **Climate-responsive atrium design** - Meta-sampling links automated parametric simulation with early-stage design decisions. Featured evidence: 39,202 configurations, 87.6% computational savings, and up to 40.29% lower annual energy use.
3. **Indoor-outdoor thermal response** - CAMLR reveals distinct thermal drivers in large public atria. Featured evidence: R2 of 0.9555 for the transitional atrium, 33.8% higher R2 than conventional analysis, and 62.11% lower residual sum of squares.
4. **HVAC energy-saving mechanisms** - Thermodynamic perfection and dehumidification-load analysis explain climate-sensitive cooling potential and connect physical diagnostics with actionable operation.

Each theme has a paper-derived figure, journal/year metadata, a short problem-method-result summary, two or three evidence chips, a source link, and a native `<details>` disclosure labelled “Learn more”. The closed state remains concise; the open state adds method, result interpretation, limitations, and related papers.

Figures are rendered from the local author copies in `E:\GITHUB\PERSONAL_INFORMATION\paper`, cropped to the relevant figure, optimized for the web, and stored under `static/assets/img/research/`. Every image has descriptive alt text and an adjacent source/figure caption.

## News Page

The first section uses large editorial cards for the newest publication stories:

- AutoModelling in *Energy* (2026).
- Meta-sampling for smart building design in *Energy* (2025).
- Indoor-outdoor thermal response in *Energy and Buildings* (2025).

Each card includes publication metadata, a one-paragraph contribution statement, one key result, a paper figure, DOI link, and “Learn more” disclosure. A following timeline covers BAS 2026 oral presentation, PhD study at HKUST, the National Scholarship, and earlier publication milestones. This preserves a current-news function without forcing every event into an oversized card.

## Content Model and Rendering

The static, Markdown-driven architecture is preserved. `contents/research.md`, `contents/research.zh.md`, `contents/news.md`, and `contents/news.zh.md` contain semantic HTML blocks inside Markdown so the existing `marked` pipeline can render the new modules without a framework or build step. Shared styling lives in `static/css/main.css`.

No paper PDFs are copied into the public repository. Public links point to DOI pages already listed in Publications.

## Responsive and Accessible Behavior

- Featured research rows alternate text and media on desktop and collapse to one column on mobile.
- News cards use a two-column layout on desktop and place the figure after metadata on mobile.
- `<details>/<summary>` provides keyboard-accessible progressive disclosure without JavaScript.
- Focus states remain visible, images have meaningful alt text, and decorative accents are hidden from assistive technology.
- Motion remains disabled under `prefers-reduced-motion: reduce`.

## Error Handling

- GitHub Actions failure leaves the last committed official snapshot intact.
- Browser snapshot refresh failure preserves the last successful calendar and reports that data is temporarily unavailable only when no snapshot has ever loaded.
- Missing research images do not hide the paper title or summary; dimensions are reserved to avoid layout shifts.
- Markdown load failures continue to use the existing localized inline error state.

## Verification

- Unit tests validate GraphQL normalization, year filtering, generated totals, and snapshot timestamp handling.
- Existing Coding tests are updated to prove the browser uses the official snapshot URL and no third-party API.
- Structure tests assert Research/News modules, Learn More controls, image alt text, DOI links, font roles, and workflow presence.
- Browser QA covers English and Chinese pages at desktop and mobile widths, disclosure interaction, navigation hierarchy, image loading, calendar accuracy, and console errors.
- Before publishing, the generated snapshot is compared with a fresh authenticated GitHub GraphQL response.
