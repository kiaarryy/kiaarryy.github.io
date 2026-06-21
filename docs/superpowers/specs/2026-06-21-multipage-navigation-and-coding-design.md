# Multipage Navigation and Coding Animation Design

## Goal

Convert the academic homepage from one long scrolling document into a true static multipage site, keep the top navigation fixed, and add an animated GitHub contribution calendar inspired by the Coding panel on `ziyan0825.github.io`.

## Scope

- `/`: hero, profile, academic links, and Coding activity.
- `/research/`: research interests and topics.
- `/publications/`: journal and conference papers.
- `/news/`: news and recent activity.
- `/awards/`: awards and honors.
- `/static/assets/Zhineng_Jin_CV.pdf`: CV navigation target.
- English and Chinese content remain available on every HTML page.

The existing Markdown content model, publication metadata, visual assets, CV files, and static GitHub Pages deployment are preserved. No site generator or build dependency is introduced.

## Architecture

Each route is a real directory containing an `index.html`. Pages use root-relative asset and navigation URLs so nested routes work both on GitHub Pages and under the repository's local HTTP server. A `data-page` attribute identifies the active route.

The shared browser script becomes page-aware: it initializes only modules whose target elements are present. Common responsibilities remain centralized in `static/js/scripts.js`, while the contribution calendar is isolated in `static/js/coding-activity.js`.

Navigation markup is present in every HTML document for reliable first paint and keyboard access. Styling and behavior are shared, and the active page is indicated with `aria-current="page"`.

## Navigation and Layout

The desktop header is a fixed, 72-pixel, lightly translucent surface with the site name on the left and compact button-style route links on the right. The active route uses a dark filled state; inactive routes use restrained borders and hover movement. The language control remains visible.

On small screens, the fixed header uses the existing Bootstrap collapse behavior. The menu closes after internal navigation. Every page reserves the header height so content is never covered.

The homepage retains the current hero and profile identity. The old standalone GitHub section is replaced by a focused Coding panel. Interior pages use a compact page intro instead of repeating the full homepage hero.

## Coding Activity

The Coding panel contains:

- current coding-day count;
- year selector for the current and previous year;
- month labels and a seven-row contribution grid;
- GitHub-style five-level color legend;
- accessible date and contribution-count labels for every cell;
- a random sparkle animation on level-four cells.

The animation matches the reference behavior: a cell scales to approximately 1.4, brightens, and emits a green glow over 720 ms. Animation is disabled when `prefers-reduced-motion: reduce` is active.

The client requests contribution data from `https://github-contributions-api.jogruber.de/v4/kiaarryy?y=YEAR`. Successful responses are cached in memory. A repository snapshot provides a truthful fallback if the API is unavailable; the source label changes from live data to cached data instead of fabricating contributions.

## Content and Language Flow

The selected language remains in `localStorage` and applies across routes. Each page loads only the Markdown file needed for that route. Shared labels, navigation text, page titles, and accessibility copy update from the same language state.

The language gateway appears only on a visitor's first entry when no language preference exists. It must not reappear on every page navigation.

Publication enhancement logic runs only on the Publications page. GitHub/Coding logic runs only on the homepage. Missing optional elements are treated as normal page variation, not errors.

## Failure Handling

- Markdown fetch failure: show a localized inline error within the relevant content region.
- GitHub API failure: load the checked-in contribution snapshot and mark it as cached.
- Snapshot failure: render an empty calendar with an unavailable status, without blocking the rest of the page.
- Unsupported or malformed language state: fall back to English.
- JavaScript disabled: navigation and static page structure remain usable; dynamically loaded Markdown content follows the site's existing JavaScript requirement.

## Accessibility and Responsive Behavior

- Fixed navigation remains reachable by keyboard and exposes the current page.
- Contribution cells have `title` and `aria-label` descriptions.
- Year selection uses a native labeled `select`.
- Focus states remain visible.
- The contribution grid scrolls horizontally on narrow screens without widening the page.
- No animation runs for reduced-motion users.

## Verification

Run the site with `python -m http.server` and verify with a real browser at desktop and mobile widths:

1. Every navigation button opens a distinct URL and refreshes without 404 errors.
2. The header remains fixed while each page scrolls and does not cover content.
3. English and Chinese switch correctly and persist across pages.
4. Coding renders live or cached contribution data, supports year changes, and animates active cells.
5. Publications retain journal/conference grouping, images, and expandable details.
6. Browser console has no uncaught errors on any route.
7. JavaScript syntax checks pass and all internal asset/content requests return successfully.

## Delivery

After focused validation, commit the implementation and push `main` to `origin` so GitHub Pages publishes the updated site. Verify the remote commit and then smoke-test the live URLs.
