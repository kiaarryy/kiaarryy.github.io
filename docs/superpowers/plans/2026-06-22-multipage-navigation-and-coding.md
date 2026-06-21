# Multipage Navigation and Coding Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the long-scroll homepage with real static pages, a persistent fixed navigation bar, and an animated live GitHub contribution calendar on the homepage.

**Architecture:** Keep the current Markdown-driven, no-build GitHub Pages model. Each route owns a small HTML document, shared styles and page-aware content loading remain centralized, and a separate tested `coding-activity.js` module renders live or cached GitHub contribution data.

**Tech Stack:** Static HTML5, CSS, vanilla JavaScript, Bootstrap collapse, Marked, js-yaml, Node built-in test runner, Playwright CLI, GitHub Pages.

---

## File Structure

- Modify `index.html`: retain hero/profile, replace the long page with the Coding panel.
- Create `research/index.html`, `publications/index.html`, `news/index.html`, `awards/index.html`: real route documents.
- Modify `static/js/scripts.js`: page-aware Markdown loading, shared translations, persistent language choice.
- Create `static/js/coding-activity.js`: contribution data normalization, fallback loading, grid rendering, sparkle animation.
- Create `contents/github-contributions.json`: cached truthful API response for offline fallback.
- Modify `static/css/main.css`: fixed button navigation, interior-page layout, Coding panel, responsive states.
- Create `tests/site-structure.test.js`: route, navigation, and asset contract tests.
- Create `tests/coding-activity.test.js`: pure contribution-data behavior tests.

### Task 1: Lock the multipage route contract

**Files:**
- Create: `tests/site-structure.test.js`
- Modify: `index.html`
- Create: `research/index.html`
- Create: `publications/index.html`
- Create: `news/index.html`
- Create: `awards/index.html`

- [x] **Step 1: Write the failing route test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const routes = ['index.html', 'research/index.html', 'publications/index.html', 'news/index.html', 'awards/index.html'];

test('every site route has fixed shared navigation and one active page', () => {
  for (const route of routes) {
    const html = fs.readFileSync(route, 'utf8');
    assert.match(html, /id="mainNav"/);
    assert.match(html, /href="\/publications\/"/);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
  }
});

test('homepage contains Coding and no interior long-scroll sections', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.match(html, /data-coding-activity/);
  assert.doesNotMatch(html, /id="research"/);
  assert.doesNotMatch(html, /id="publications"/);
});
```

- [x] **Step 2: Run the test and verify RED**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL because route files and the Coding panel do not exist.

- [x] **Step 3: Implement the route documents**

Use root-relative links (`/`, `/research/`, `/publications/`, `/news/`, `/awards/`, `/static/assets/Zhineng_Jin_CV.pdf`) and mark exactly one route with `aria-current="page"`. Interior pages contain their matching `*-md` target and a compact `.page-intro`.

- [x] **Step 4: Run the route test and verify GREEN**

Run: `node --test tests/site-structure.test.js`

Expected: 2 tests pass.

### Task 2: Build contribution data behavior with TDD

**Files:**
- Create: `tests/coding-activity.test.js`
- Create: `static/js/coding-activity.js`
- Create: `contents/github-contributions.json`

- [x] **Step 1: Write failing pure-function tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const coding = require('../static/js/coding-activity.js');

test('normalizes only contributions from the selected year', () => {
  const map = coding.normalizeContributionPayload({ contributions: [
    { date: '2026-01-02', count: 3 },
    { date: '2025-12-31', count: 9 }
  ]}, 2026);
  assert.equal(map.get('2026-01-02'), 3);
  assert.equal(map.has('2025-12-31'), false);
});

test('maps counts to five GitHub intensity levels', () => {
  assert.deepEqual([0, 1, 3, 7, 12].map(coding.contributionLevel), [0, 1, 2, 3, 4]);
});
```

- [x] **Step 2: Run the test and verify RED**

Run: `node --test tests/coding-activity.test.js`

Expected: FAIL because `coding-activity.js` does not exist.

- [x] **Step 3: Implement the minimal data module**

Export `normalizeContributionPayload`, `contributionLevel`, and `buildYearDays` under CommonJS while initializing the browser component only when `document` exists. Fetch the live API first, then `/contents/github-contributions.json`, and label the source accurately.

- [x] **Step 4: Fetch and store the current contribution snapshot**

Request `https://github-contributions-api.jogruber.de/v4/kiaarryy?y=all` and store its JSON response without fabricating dates or counts.

- [x] **Step 5: Run contribution tests and verify GREEN**

Run: `node --test tests/coding-activity.test.js`

Expected: all contribution tests pass.

### Task 3: Make shared site behavior page-aware

**Files:**
- Modify: `static/js/scripts.js`
- Modify: `contents/config.yml`
- Test: `tests/site-structure.test.js`

- [x] **Step 1: Extend the failing structure test**

Assert that every route includes `/static/js/scripts.js`, uses a valid `data-page`, and contains only the Markdown target appropriate to that route.

- [x] **Step 2: Run the structure test and verify RED**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL until all route contracts are present.

- [x] **Step 3: Refactor initialization**

Replace unconditional `loadAllMarkdown()` behavior with a map from `body.dataset.page` to required Markdown names. Guard GitHub, spotlight, reveal, MathJax, and publication setup by element presence. Store language under one stable localStorage key and suppress the gateway after the first selection.

- [x] **Step 4: Run structure and syntax checks**

Run: `node --test tests/site-structure.test.js && node --check static/js/scripts.js`

Expected: route tests pass and syntax check exits 0.

### Task 4: Implement the approved visual system

**Files:**
- Modify: `static/css/main.css`
- Test: `tests/site-structure.test.js`

- [x] **Step 1: Extend the failing CSS contract test**

Read `static/css/main.css` and assert it contains `.nav-link[aria-current="page"]`, `.coding-grid`, `@keyframes coding-sparkle`, and a reduced-motion override.

- [x] **Step 2: Run the test and verify RED**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL because the new selectors do not exist.

- [x] **Step 3: Add fixed navigation, page intro, and Coding styles**

Implement the approved restrained editorial layout: 72px fixed translucent navigation, compact button states, one-level page compositions, stable contribution-cell dimensions, horizontal mobile scrolling, visible focus, and reduced-motion behavior.

- [x] **Step 4: Run all automated checks**

Run: `node --test tests/*.test.js && node --check static/js/scripts.js && node --check static/js/coding-activity.js`

Expected: all tests pass and both syntax checks exit 0.

### Task 5: Browser QA and publication

**Files:**
- Inspect: all route documents and assets
- Update: implementation plan checkboxes

- [x] **Step 1: Start the local server**

Run: `python -m http.server 8765`

- [x] **Step 2: Verify desktop and mobile routes with Playwright CLI**

Check `/`, `/research/`, `/publications/`, `/news/`, `/awards/`, direct route refresh, fixed header position, active navigation, Coding cells/year selector, English/Chinese persistence, publication panels, console errors, and overflow at desktop and mobile widths.

- [x] **Step 3: Inspect the final diff and rerun full checks**

Run: `rtk git diff`, `node --test tests/*.test.js`, and both `node --check` commands.

- [ ] **Step 4: Commit and push**

Stage only the planned files, commit with `Build multipage academic homepage`, and push `main` to `origin` for GitHub Pages deployment.

- [ ] **Step 5: Verify remote and live deployment**

Confirm `origin/main` matches local HEAD and smoke-test `https://kiaarryy.github.io/` plus each new route after GitHub Pages updates.
