# Research, News, and GitHub Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unreliable contribution source with an official GitHub-generated snapshot and turn Research/News into bilingual, figure-led editorial pages with a unified navigation type system.

**Architecture:** A dependency-free Node script queries GitHub GraphQL and writes the static contribution snapshot; GitHub Actions runs it on a schedule. The browser reads only that auditable snapshot. Research and News remain Markdown-driven, using semantic HTML modules and shared CSS, while optimized figures are cropped from local author PDFs.

**Tech Stack:** Static HTML/CSS, vanilla JavaScript, Node.js built-in test runner, GitHub GraphQL/Actions, Markdown/Marked, PyMuPDF for local figure extraction

---

### Task 1: Official GitHub Contribution Snapshot

**Files:**
- Create: `scripts/update-github-contributions.mjs`
- Create: `tests/update-github-contributions.test.mjs`
- Create: `.github/workflows/update-contributions.yml`
- Modify: `static/js/coding-activity.js`
- Modify: `tests/coding-activity.test.js`
- Modify: `contents/github-contributions.json`

- [ ] **Step 1: Write failing normalizer and browser-source tests**

Add tests that import `normalizeCalendar`, pass two GraphQL weeks containing 2025 and 2026 dates, and assert the generated object contains `source: "github-graphql"`, `generatedAt`, per-year totals, and normalized `count`/`level` rows. Replace the old third-party URL assertion with:

```js
test('builds cache-busted official snapshot URLs', () => {
    assert.equal(
        coding.buildSnapshotUrl(2026, 300000),
        '/contents/github-contributions.json?year=2026&refresh=1'
    );
});
```

Also assert `static/js/coding-activity.js` does not contain `jogruber.de`.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/update-github-contributions.test.mjs tests/coding-activity.test.js`

Expected: FAIL because `scripts/update-github-contributions.mjs` and `buildSnapshotUrl` do not exist.

- [ ] **Step 3: Implement the GraphQL updater**

Export `normalizeCalendar(payload, generatedAt)` and `updateSnapshot({ token, login, outputPath, from, to })`. Query:

```graphql
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}
```

Map GitHub levels `NONE`, `FIRST_QUARTILE`, `SECOND_QUARTILE`, `THIRD_QUARTILE`, and `FOURTH_QUARTILE` to 0-4. Preserve stable JSON formatting and write only when semantic calendar data changes; refresh `generatedAt` when contributions change.

- [ ] **Step 4: Make the browser snapshot-only**

Replace `API_BASE` and `buildLiveRequestUrl` with `buildSnapshotUrl(year, now)`. Fetch the repository JSON with `cache: "no-store"`, normalize the selected year, display `Official GitHub data · YEAR · Synced DATE/TIME`, and retain the last successful request when a refresh fails. Keep the five-minute browser revalidation and sparkle cycle.

- [ ] **Step 5: Add the scheduled workflow**

Create `.github/workflows/update-contributions.yml` with `workflow_dispatch`, a six-hour schedule, `contents: write`, Node 24, and:

```yaml
- name: Refresh official contribution snapshot
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    GITHUB_LOGIN: kiaarryy
  run: node scripts/update-github-contributions.mjs
- name: Commit updated snapshot
  run: |
    git config user.name "github-actions[bot]"
    git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
    git add contents/github-contributions.json
    git diff --cached --quiet || git commit -m "chore: refresh GitHub contributions"
    git push
```

- [ ] **Step 6: Generate and compare the current snapshot**

Run the updater with the authenticated local token, then independently query GraphQL with `gh api graphql`. Expected for 2026 at implementation time: both sources report the same total, active-day count, latest active date, and per-date counts.

- [ ] **Step 7: Verify GREEN and commit**

Run: `node --test tests/update-github-contributions.test.mjs tests/coding-activity.test.js`

Expected: all tests pass.

Commit: `fix: sync coding activity from GitHub GraphQL`

### Task 2: Extract and Optimize Paper Figures

**Files:**
- Create: `static/assets/img/research/automodelling-workflow.png`
- Create: `static/assets/img/research/meta-sampling-framework.png`
- Create: `static/assets/img/research/thermal-response-method.png`
- Create: `static/assets/img/research/atrium-thermal-response.png`
- Create: `static/assets/img/research/dehumidification-energy-saving.png`

- [ ] **Step 1: Render author-copy PDF pages**

Use PyMuPDF at 1.6x resolution for these zero-based pages: AutoModelling 5, meta-sampling 4, indoor-outdoor thermal response 6, atrium nonuniformity 15, and dehumidification 18.

- [ ] **Step 2: Crop the relevant figures**

Use the rendered page coordinate boxes verified visually:

```text
automodelling-workflow: x=65..900, y=70..455
meta-sampling-framework: x=145..810, y=70..690
thermal-response-method: x=160..800, y=70..900
atrium-thermal-response: x=145..735, y=70..875
dehumidification-energy-saving: x=50..430, y=70..880
```

Save RGB PNG files with stable names under `static/assets/img/research/` and strip metadata.

- [ ] **Step 3: Verify image quality**

Open all five outputs at original detail. Confirm labels are legible at desktop card size, crops contain the complete figure, and no unrelated paper body text remains.

- [ ] **Step 4: Commit**

Commit: `assets: add selected research figures`

### Task 3: Research Editorial Page

**Files:**
- Modify: `contents/research.md`
- Modify: `contents/research.zh.md`
- Modify: `tests/site-structure.test.js`

- [ ] **Step 1: Write failing structure tests**

Assert both research Markdown files contain four `.research-story` blocks, four `<details class="story-details">` controls, five `/static/assets/img/research/` image references across the page, descriptive `alt` attributes, and DOI links for the featured papers.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL because the existing Research files are bullet lists.

- [ ] **Step 3: Write the English Research stories**

Create four semantic `<article class="research-story">` modules for operational models, climate-responsive atria, thermal response, and HVAC energy-saving mechanisms. Each must contain `.story-meta`, an `h2`, `.story-lead`, `.evidence-list`, `<figure>`, DOI links, and a Learn More `<details>` section with methods, interpretation, limitations, and related papers.

- [ ] **Step 4: Write the Chinese Research stories**

Mirror the same structure and evidence in professional Chinese. Preserve journal titles, model names, metrics, and DOI URLs exactly.

- [ ] **Step 5: Verify GREEN and commit**

Run: `node --test tests/site-structure.test.js`

Expected: Research structure assertions pass.

Commit: `feat: turn research into figure-led stories`

### Task 4: News Feature Stories and Timeline

**Files:**
- Modify: `contents/news.md`
- Modify: `contents/news.zh.md`
- Modify: `tests/site-structure.test.js`

- [ ] **Step 1: Write failing News tests**

Assert both News files contain three `.news-feature` articles, three Learn More details, the AutoModelling/metadata/thermal-response images, a `.news-timeline`, BAS 2026, HKUST PhD, and National Scholarship entries.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL because the existing News files are simple list items.

- [ ] **Step 3: Implement bilingual publication stories**

Write figure-led stories for the 2026 *Energy* AutoModelling paper, 2025 *Energy* meta-sampling paper, and 2025 *Energy and Buildings* thermal-response paper. Each closed state shows date/journal/type, title, concise contribution, one key result, image, DOI, and Learn More control.

- [ ] **Step 4: Implement the bilingual timeline**

Add compact entries for the BAS 2026 oral presentation, 2025 HKUST PhD start, 2024 National Scholarship, and the 2024 atrium publication.

- [ ] **Step 5: Verify GREEN and commit**

Run: `node --test tests/site-structure.test.js`

Expected: News structure assertions pass.

Commit: `feat: add publication-led news timeline`

### Task 5: Unified Typography and Responsive Modules

**Files:**
- Modify: `static/css/main.css`
- Modify: `tests/site-structure.test.js`

- [ ] **Step 1: Write failing CSS contract tests**

Assert `.nav-link` explicitly uses `var(--body-font)` with weight 600, story titles use `var(--display-font)`, `.research-story` and `.news-feature` define two-column desktop grids, `summary` has a visible focus state, and mobile rules collapse both modules to one column.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/site-structure.test.js`

Expected: FAIL because the editorial module styles do not exist.

- [ ] **Step 3: Implement the typography and layout system**

Add explicit navigation type rules, refined inactive/active states, research alternating grids, evidence chips, paper figure treatment, News feature cards, timeline rails, disclosure transitions, and 991px/640px responsive rules. Use only existing CSS variables and font families.

- [ ] **Step 4: Verify GREEN and commit**

Run: `node --test tests/site-structure.test.js`

Expected: CSS contract assertions pass.

Commit: `style: unify navigation and editorial pages`

### Task 6: Full Validation and Browser QA

**Files:**
- Modify only files above if QA exposes a defect.

- [ ] **Step 1: Run all automated tests and syntax checks**

Run:

```powershell
node --test tests/*.test.js tests/*.test.mjs
node --check static/js/coding-activity.js
node --check static/js/scripts.js
node --check scripts/update-github-contributions.mjs
```

Expected: zero failures and zero syntax errors.

- [ ] **Step 2: Start the local static server**

Run: `python -m http.server 4173`

- [ ] **Step 3: Desktop QA**

At 1440x1000 verify `/`, `/research/`, and `/news/`: correct official contribution total/latest date, consistent navigation type, all figures loaded, all Learn More controls expand, both languages render, and the console has no errors.

- [ ] **Step 4: Mobile QA**

At 390x844 verify navigation collapse, no horizontal page overflow, story cards collapse to one column, figures retain legibility, and disclosure focus/keyboard behavior works.

- [ ] **Step 5: Final diff and scope review**

Run `rtk git status --short --branch` and `rtk git diff origin/main...HEAD`. Confirm only the design, plan, updater/workflow, snapshot, research assets/content, tests, and CSS are included.

### Task 7: Publish to GitHub

**Files:** No additional source changes expected.

- [ ] **Step 1: Verify GitHub authentication and current branch**

Run: `gh auth status`, `git branch --show-current`, and `git status -sb`.

- [ ] **Step 2: Push the feature branch**

Run: `git push -u origin codex/research-news-sync`.

- [ ] **Step 3: Open the GitHub change for review**

Create a PR titled `[codex] sync GitHub activity and redesign research news` with the root cause, implementation, research content, validation results, and screenshot summary. Use ready-for-review status because the user requested synchronization after completed QA.

- [ ] **Step 4: Report the published result**

Provide the branch, commit range, PR URL, validation evidence, and the limitation that GitHub Pages updates only after the change reaches `main`.
