# Climate-Responsive Atrium Publication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the under-review atrium record with its final publication and add bilingual, figure-led Research and News introductions that match the existing academic homepage.

**Architecture:** Preserve the static Markdown content pipeline and existing editorial components. Add one optimized paper figure asset, insert one story in each localized Research and News file, update the localized publication lists and footer date, and extend the existing structural tests.

**Tech Stack:** Static HTML, Markdown with embedded semantic HTML, CSS already present in `static/css/main.css`, Node.js built-in test runner, Python with `pdfplumber` and Pillow for PDF figure extraction.

---

### Task 1: Specify the Published-Paper State

**Files:**
- Modify: `tests/site-structure.test.js`
- Test: `tests/site-structure.test.js`

- [ ] **Step 1: Update the Research and News structure expectations**

Change the Research counts to five stories, five disclosures, six paper images, and six alt-bearing images. Change the News counts to four features, four disclosures, and four paper images. Add the new DOI assertion to both loops:

```js
assert.equal((content.match(/class="research-story/g) || []).length, 5);
assert.equal((content.match(/<details class="story-details">/g) || []).length, 5);
assert.equal((content.match(/\/static\/assets\/img\/research\//g) || []).length, 6);
assert.equal((content.match(/<img[^>]+alt="[^"]+"/g) || []).length, 6);
assert.match(content, /doi\.org\/10\.1016\/j\.enbuild\.2026\.117980/);
```

```js
assert.equal((content.match(/class="news-feature"/g) || []).length, 4);
assert.equal((content.match(/<details class="story-details">/g) || []).length, 4);
assert.equal((content.match(/\/static\/assets\/img\/research\//g) || []).length, 4);
assert.match(content, /doi\.org\/10\.1016\/j\.enbuild\.2026\.117980/);
```

- [ ] **Step 2: Add a bibliographic regression test**

Add this test:

```js
test('final atrium paper replaces the submitted record in both languages', () => {
    for (const file of ['contents/publications.md', 'contents/publications.zh.md']) {
        const content = fs.readFileSync(file, 'utf8');
        assert.doesNotMatch(content, /Towards Climate-Responsive Atrium Design/);
        assert.doesNotMatch(content, /Under Review/);
        assert.match(content, /Climate-responsive atrium geometry in large public buildings/);
        assert.match(content, /Energy & Buildings<\/strong> 369 \(2026\): 117980/);
        assert.match(content, /doi\.org\/10\.1016\/j\.enbuild\.2026\.117980/);
    }
});
```

- [ ] **Step 3: Update the site date expectation**

Change the configuration assertion to:

```js
assert.match(config, /^last-updated: ['"]Last updated: July 2026['"]$/m);
```

- [ ] **Step 4: Run the test and verify the intended failure**

Run:

```powershell
node --test tests/site-structure.test.js
```

Expected: failures report the old story counts, missing final DOI, remaining submitted title, and June 2026 update date.

### Task 2: Extract the Paper Figure

**Files:**
- Read: `E:\GITHUB\PERSONAL_INFORMATION\paper\Climate-responsive atrium geometry in large public buildings meta-sample modelling and robust energy-saving ranges across five climates.pdf`
- Create: `static/assets/img/research/climate-responsive-atrium-five-climates.png`

- [ ] **Step 1: Render and crop Figure 1**

Run the bundled Python interpreter with this extraction code:

```python
from pathlib import Path
import pdfplumber

source = Path(r"E:\GITHUB\PERSONAL_INFORMATION\paper\Climate-responsive atrium geometry in large public buildings meta-sample modelling and robust energy-saving ranges across five climates.pdf")
target = Path(r"static/assets/img/research/climate-responsive-atrium-five-climates.png")

with pdfplumber.open(source) as pdf:
    figure = pdf.pages[2].crop((84, 238, 510, 735))
    image = figure.to_image(resolution=160, antialias=True)
    image.save(target, format="PNG", optimize=True)
```

- [ ] **Step 2: Verify the asset**

Open the PNG and confirm that it contains the full Figure 1 workflow without surrounding body text, page headers, or the printed figure caption. Confirm a width of at least 900 pixels and readable city labels.

### Task 3: Publish the Final Citation

**Files:**
- Modify: `contents/publications.md`
- Modify: `contents/publications.zh.md`
- Modify: `contents/config.yml`

- [ ] **Step 1: Remove the submitted section**

Delete the `Submitted` / `投稿中` heading and the obsolete working-title list item from both publication files.

- [ ] **Step 2: Add the final citation first under Published**

Insert this item in both localized files:

```markdown
- <strong>Jin, Zhineng</strong>, Hongli Sun*, Junkang Song, Wenke Zhong, Zishuang Xia, Hanjie Zheng, Changqi Wen, Bin Xu, and Borong Lin. "Climate-responsive atrium geometry in large public buildings: meta-sample modelling and robust energy-saving ranges across five climates." <strong>Energy & Buildings</strong> 369 (2026): 117980. [[Paper]](https://doi.org/10.1016/j.enbuild.2026.117980)
```

- [ ] **Step 3: Refresh the footer date**

Set:

```yaml
last-updated: 'Last updated: July 2026'
```

### Task 4: Add the Bilingual Research Story

**Files:**
- Modify: `contents/research.md`
- Modify: `contents/research.zh.md`

- [ ] **Step 1: Insert the English story at the top of `.research-stories`**

Use the existing `research-story`, `story-copy`, `evidence-list`, `story-details`, and `story-figure` structure. The story must contain:

```html
<p class="story-meta">Climate-responsive design · Energy &amp; Buildings · 2026</p>
<h2>Robust atrium geometry across five climates</h2>
<p class="story-lead">A measurement-informed benchmark and 39,202 simulated atrium configurations per climate reveal design ranges that remain energy-efficient from Guangzhou to Harbin, while distribution-preserving meta-sampling keeps the analysis practical.</p>
```

The evidence list must show `5` climates, `75%` fewer simulations, and `240–360 m²` robust atrium area. The disclosure must explain the calibrated EnergyPlus benchmark, the control triad of area/external facade/east-facing openings, the one-to-three atria and 500–1500 m² external-facade guidance, the typology-level limitation, and the final DOI.

- [ ] **Step 2: Insert the equivalent Chinese story**

Use:

```html
<p class="story-meta">气候响应设计 · Energy &amp; Buildings · 2026</p>
<h2>跨越五种气候的稳健中庭几何设计</h2>
<p class="story-lead">基于实测信息构建的基准模型与每种气候 39,202 组中庭仿真揭示了从广州到哈尔滨均保持节能稳健性的设计范围；保留分布特征的元样本方法则让这一跨气候分析具备实际可行性。</p>
```

Translate the same evidence, method, finding, design guidance, limitation, DOI link, figure alt text, and caption without dropping quantitative ranges.

### Task 5: Add the Bilingual News Story

**Files:**
- Modify: `contents/news.md`
- Modify: `contents/news.zh.md`

- [ ] **Step 1: Insert the English feature first**

Use:

```html
<p class="story-meta">July 2026 · Energy &amp; Buildings · Publication</p>
<h2>Five climates, one robust atrium design window</h2>
<p class="feature-lead">The newly published study turns a 196,010-case cross-climate simulation campaign into practical guidance for sizing, grouping, and exposing atria in large public buildings.</p>
<p class="feature-result"><strong>240–360 m²</strong> atrium area · <strong>1–3</strong> atria · <strong>500–1500 m²</strong> external atrium facade.</p>
```

The disclosure must mention the five cities, 39,202 cases per climate, 75% reduction in simulation demand, the climate-robust control triad, the typology-level boundary, and the DOI.

- [ ] **Step 2: Insert the equivalent Chinese feature**

Use:

```html
<p class="story-meta">2026 年 7 月 · Energy &amp; Buildings · 论文发表</p>
<h2>五种气候，共享一个稳健的中庭设计窗口</h2>
<p class="feature-lead">新发表的研究把覆盖五种气候、共 196,010 个案例的仿真分析转化为大型公共建筑中庭尺度、数量与外部暴露程度的可操作指导。</p>
<p class="feature-result">中庭面积 <strong>240–360 m²</strong> · 中庭数量 <strong>1–3</strong> · 外部中庭立面 <strong>500–1500 m²</strong>。</p>
```

- [ ] **Step 3: Add the publication milestone**

Insert July 2026 as the first timeline item in English and Chinese. Link its description to the final DOI and identify *Energy & Buildings* 369 (2026), 117980.

### Task 6: Validate and Publish

**Files:**
- Verify: all modified content, test, and image files

- [ ] **Step 1: Run the full test suite**

Run:

```powershell
node --test tests/*.test.js tests/*.test.mjs
```

Expected: all tests pass.

- [ ] **Step 2: Run static and bibliographic checks**

Run searches that confirm the old title and `Under Review` no longer appear, the new DOI appears in six localized content placements, and all four localized story files reference the new image.

- [ ] **Step 3: Perform browser QA**

Serve with:

```powershell
python -m http.server 8000
```

Inspect `/publications/`, `/research/`, and `/news/` at desktop and mobile widths in English and Chinese. Open each new disclosure, verify image loading, confirm the DOI target, and confirm zero browser-console errors.

- [ ] **Step 4: Commit the implementation**

```powershell
git add contents/publications.md contents/publications.zh.md contents/research.md contents/research.zh.md contents/news.md contents/news.zh.md contents/config.yml static/assets/img/research/climate-responsive-atrium-five-climates.png tests/site-structure.test.js docs/superpowers/plans/2026-07-29-climate-responsive-atrium-publication.md
git commit -m "feat: publish climate-responsive atrium study"
```

- [ ] **Step 5: Push and verify GitHub Pages**

```powershell
git push origin main
```

Confirm `origin/main` contains the implementation commit. Poll the public Publications Markdown and the three public routes until the new DOI and July 2026 story are live.

