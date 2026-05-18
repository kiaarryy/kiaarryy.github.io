# Academic Homepage Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Zhineng Jin's academic homepage with verified academic links, stronger content sections, SEO metadata, better performance, and updated visual artifacts.

**Architecture:** Keep the existing static GitHub Pages model. `index.html` owns page structure, `contents/*.md` owns editable academic content, `contents/config.yml` owns site metadata and profile links, and `static/js/scripts.js` loads and decorates Markdown content.

**Tech Stack:** Static HTML, CSS, JavaScript, Bootstrap Icons, Marked, js-yaml, MathJax, Python/Pillow for local image optimization, Playwright CLI for browser verification.

---

### Task 1: Academic Identity Links

**Files:**
- Modify: `contents/config.yml`
- Modify: `index.html`
- Modify: `static/js/scripts.js`

- [ ] Add ORCID, ResearchGate, Google Scholar search, GitHub, email, and CV links.
- [ ] Use ORCID public API result `0000-0001-6893-8319` as the verified ORCID source.
- [ ] Use `https://www.researchgate.net/profile/Zhineng-Jin` as the verified ResearchGate source.
- [ ] Use a Google Scholar author search URL unless a stable profile ID is confirmed.

### Task 2: Content Sections

**Files:**
- Create: `contents/news.md`
- Create: `contents/research.md`
- Modify: `index.html`
- Modify: `static/js/scripts.js`
- Modify: `static/css/main.css`

- [ ] Add News / Updates section.
- [ ] Add Research Highlights section.
- [ ] Add section navigation links.
- [ ] Style research and news items as compact, scannable academic cards.

### Task 3: Publications and CV

**Files:**
- Modify: `contents/publications.md`
- Create: `static/assets/Zhineng_Jin_CV.html`
- Modify: `index.html`

- [ ] Add ORCID-listed publications missing from the current page.
- [ ] Add a lightweight static CV page generated from existing homepage content.
- [ ] Link the CV from the hero and academic links.

### Task 4: SEO and Sharing Metadata

**Files:**
- Modify: `index.html`
- Modify: `contents/config.yml`

- [ ] Add canonical URL.
- [ ] Add Open Graph and Twitter card metadata.
- [ ] Add JSON-LD `Person` structured data.
- [ ] Use `screenshot_full.png` as the social preview image.

### Task 5: Performance Assets

**Files:**
- Create: `static/assets/img/background-optimized.jpg`
- Create: `static/assets/img/background-mobile.jpg`
- Modify: `index.html`
- Modify: `static/css/main.css`
- Modify: `screenshot_full.png`

- [ ] Compress the large hero background.
- [ ] Use responsive image sources for desktop and mobile.
- [ ] Generate a fresh full-page screenshot after the design update.

### Task 6: Validation and Publish

**Commands:**
- `git diff --check`
- `python -m http.server 8000`
- Playwright snapshot and screenshots at desktop/mobile widths
- `git status --short --branch`
- `git commit`
- `git push origin main`

- [ ] Confirm all dynamic Markdown content renders.
- [ ] Confirm console has no errors.
- [ ] Confirm responsive screenshots have no major overlap.
- [ ] Push to GitHub so GitHub Pages refreshes.

