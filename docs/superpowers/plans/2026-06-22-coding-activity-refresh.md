# Coding Activity Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the home-page GitHub contribution panel current and animate every active contribution cell once per randomized cycle.

**Architecture:** Extend the existing dependency-free `coding-activity.js` module with testable URL, TTL, and queue helpers. The browser keeps a five-minute in-memory cache, forces live network validation at refresh boundaries and visibility changes, and falls back to the bundled contribution snapshot.

**Tech Stack:** Vanilla JavaScript, CSS, Node.js built-in test runner, GitHub Pages

---

### Task 1: Specify Refresh and Animation Helpers

**Files:**
- Modify: `tests/coding-activity.test.js`
- Modify: `static/js/coding-activity.js`

- [ ] **Step 1: Write failing helper tests**

Add tests that assert a live request URL contains the selected year plus a stable five-minute `refresh` slot, cache entries expire at the five-minute boundary, and `buildAnimationQueue` returns every input cell exactly once without mutating the source array.

```js
test('buildLiveRequestUrl changes only at refresh boundaries', () => {
  assert.equal(buildLiveRequestUrl(2026, 299999), `${API}?y=2026&refresh=0`);
  assert.equal(buildLiveRequestUrl(2026, 300000), `${API}?y=2026&refresh=1`);
});

test('isCacheFresh expires entries after five minutes', () => {
  assert.equal(isCacheFresh({ fetchedAt: 1000 }, 300999), true);
  assert.equal(isCacheFresh({ fetchedAt: 1000 }, 301000), false);
});

test('buildAnimationQueue covers each cell without mutation', () => {
  const cells = ['a', 'b', 'c', 'd'];
  const queue = buildAnimationQueue(cells, () => 0.25);
  assert.deepEqual([...queue].sort(), cells);
  assert.deepEqual(cells, ['a', 'b', 'c', 'd']);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/coding-activity.test.js`

Expected: FAIL because the new helper exports do not exist.

- [ ] **Step 3: Implement the pure helpers**

Export `buildLiveRequestUrl`, `isCacheFresh`, and `buildAnimationQueue`. Use Fisher-Yates shuffling on a copied array so animation cycles never duplicate or omit active cells.

```js
function buildLiveRequestUrl(year, now = Date.now()) {
  const slot = Math.floor(now / REFRESH_INTERVAL_MS);
  return `${API_BASE}?y=${year}&refresh=${slot}`;
}

function isCacheFresh(entry, now = Date.now()) {
  return Boolean(entry && now - entry.fetchedAt < REFRESH_INTERVAL_MS);
}
```

- [ ] **Step 4: Run the tests and verify GREEN**

Run: `node --test tests/coding-activity.test.js`

Expected: all tests pass.

- [ ] **Step 5: Commit the helper contract**

```bash
git add tests/coding-activity.test.js static/js/coding-activity.js
git commit -m "test: specify coding activity refresh behavior"
```

### Task 2: Implement Live Refresh and Full-Grid Animation

**Files:**
- Modify: `static/js/coding-activity.js`
- Modify: `static/css/main.css`
- Modify: `contents/github-contributions.json`

- [ ] **Step 1: Replace permanent caching with expiring live requests**

Fetch live URLs with `cache: 'no-store'`, store `{ data, fetchedAt }` entries, refresh every five minutes and on `visibilitychange`, and guard renders with a sequence number.

```js
async function fetchJson(url, fresh = false) {
  const response = await fetch(url, fresh ? { cache: 'no-store' } : { cache: 'no-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

- [ ] **Step 2: Add visible refresh metadata**

Store `refreshedAt` on successful live data and format it in the source label as `Live GitHub data · 2026 · Updated HH:MM`, with the existing Chinese translation equivalent.

- [ ] **Step 3: Animate every active cell by shuffled cycles**

Select `.coding-cell.is-active`, consume one or two entries per tick from `buildAnimationQueue`, and refill only when the queue is empty. Set a CSS custom property from each cell's contribution level so stronger days have a slightly stronger pulse.

```js
if (!queue.length) queue = buildAnimationQueue(activeCells);
const batchSize = activeCells.length > 8 ? 2 : 1;
queue.splice(0, batchSize).forEach(sparkleCell);
```

- [ ] **Step 4: Preserve reduced-motion behavior**

Keep animation disabled under `prefers-reduced-motion: reduce` and update the keyframes to use per-cell scale and glow variables without changing grid dimensions.

- [ ] **Step 5: Refresh the bundled snapshot**

Download the current contribution response for 2026 into `contents/github-contributions.json` and confirm it includes the latest contribution date.

- [ ] **Step 6: Run focused tests**

Run: `node --test tests/coding-activity.test.js`

Expected: all tests pass.

- [ ] **Step 7: Commit the implementation**

```bash
git add static/js/coding-activity.js static/css/main.css contents/github-contributions.json
git commit -m "fix: keep GitHub activity current"
```

### Task 3: Browser QA and Publish

**Files:**
- Modify only if QA finds a defect in the files above.

- [ ] **Step 1: Start a local HTTP server**

Run: `python -m http.server 4173`

Expected: the site responds at `http://127.0.0.1:4173/`.

- [ ] **Step 2: Verify current data and animation on desktop**

Open the home page at 1440x1000, confirm the contribution source reports a recent update time, the latest active date matches the live API, and sampling `.is-sparkling` cells across one full cycle observes every active date.

- [ ] **Step 3: Verify mobile layout and accessibility behavior**

Open the home page at 390x844, confirm navigation and the contribution grid do not overlap or resize unexpectedly, inspect console errors, and verify reduced-motion CSS still disables sparkle animation.

- [ ] **Step 4: Run final validation**

Run: `node --test tests/*.test.js`

Expected: all tests pass.

- [ ] **Step 5: Push and verify GitHub Pages**

```bash
git push origin main
gh run list --limit 5
```

Expected: the Pages workflow for the pushed commit succeeds and the public home page passes the same current-data and multi-cell animation checks.
