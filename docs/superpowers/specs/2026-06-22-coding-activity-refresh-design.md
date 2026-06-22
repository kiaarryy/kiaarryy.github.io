# Coding Activity Refresh Design

## Goal

Keep the home-page GitHub contribution panel current without requiring a hard refresh, and animate every active contribution cell in a natural, non-repeating cycle.

## Root Causes

- Live API requests currently use `force-cache`, while the module cache never expires. A browser can therefore keep showing an older response for the full page session.
- The sparkle selector only includes level-4 cells. The current contribution set contains one level-4 date, so every animation pulse targets the same point.

## Data Refresh

- Request live GitHub data with `cache: "no-store"` and a five-minute time-slot query parameter.
- Cache successful responses in memory for five minutes to avoid unnecessary API traffic.
- Refresh the selected year every five minutes while the page is open and whenever the document becomes visible again.
- Protect rendering with a sequence token so a slower, older request cannot overwrite newer data.
- Show the successful live refresh time beside the data source label.
- Retain the checked-in JSON snapshot as an offline/API-failure fallback and update it when this change ships.

## Animation

- Build a shuffled queue containing every active contribution cell.
- Animate small overlapping batches from that queue. Refill and reshuffle only after every active cell has appeared once.
- Scale the pulse subtly by contribution level while preserving the current visual language.
- Stop animation for users who prefer reduced motion.

## Error Handling

- If the live API fails, render the bundled snapshot.
- If both sources fail, render an empty year without breaking the rest of the page.
- Periodic refresh failures keep the last successful data visible.

## Verification

- Unit tests cover cache freshness, cache-busting URLs, and full animation-queue coverage.
- Browser checks verify current contribution dates, multiple distinct animated cells, no console errors, and stable desktop/mobile layouts.
- After pushing, verify the GitHub Pages deployment and repeat the key checks against the public URL.
