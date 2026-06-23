const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const routes = [
    ['index.html', 'home', 'home-md'],
    ['research/index.html', 'research', 'research-md'],
    ['publications/index.html', 'publications', 'publications-md'],
    ['news/index.html', 'news', 'news-md'],
    ['awards/index.html', 'awards', 'awards-md']
];

test('every site route has fixed shared navigation and one active page', () => {
    for (const [route, page] of routes) {
        const html = fs.readFileSync(route, 'utf8');
        assert.match(html, /id="mainNav"/);
        assert.match(html, /href="\/publications\/"/);
        assert.match(html, new RegExp(`data-page="${page}"`));
        assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
        assert.match(html, /src="\/static\/js\/scripts\.js"/);
    }
});

test('each route owns only its intended Markdown target', () => {
    const allTargets = routes.map(([, , target]) => target);

    for (const [route, , expectedTarget] of routes) {
        const html = fs.readFileSync(route, 'utf8');
        assert.match(html, new RegExp(`id="${expectedTarget}"`));

        for (const target of allTargets.filter((value) => value !== expectedTarget)) {
            assert.doesNotMatch(html, new RegExp(`id="${target}"`));
        }
    }
});

test('homepage contains Coding and no interior long-scroll sections', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert.match(html, /data-coding-activity/);
    assert.doesNotMatch(html, /id="research"/);
    assert.doesNotMatch(html, /id="publications"/);
    assert.doesNotMatch(html, /id="news"/);
    assert.doesNotMatch(html, /id="awards"/);
});

test('shared script is route-aware and uses root-relative content paths', () => {
    const script = fs.readFileSync('static/js/scripts.js', 'utf8');
    assert.match(script, /const contentDir = '\/contents\/'/);
    assert.match(script, /const pageSectionMap =/);
    assert.match(script, /async function loadPageMarkdown\(\)/);
    assert.match(script, /new CustomEvent\('site-language-change'/);
    assert.doesNotMatch(script, /await loadAllMarkdown\(\)/);
    assert.match(script, /localStorage\.setItem\('site-language', requestedLang\)/);
});

test('shared styles define fixed active navigation and accessible Coding motion', () => {
    const css = fs.readFileSync('static/css/main.css', 'utf8');
    assert.match(css, /\.nav-link\[aria-current="page"\]/);
    assert.match(css, /\.coding-grid\s*\{/);
    assert.match(css, /@keyframes coding-sparkle/);
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.coding-cell\.is-sparkling/);
    assert.match(css, /\.header\s*\{[\s\S]*?padding: 0;/);
    assert.match(css, /#mainNav\.header\s*\{[\s\S]*?padding: 0;/);
    assert.match(css, /\.nav-link\[aria-current="page"\]\s*\{[\s\S]*?color: #fffaf1 !important;/);
});

test('site configuration quotes colon values and uses a root-relative CV path', () => {
    const config = fs.readFileSync('contents/config.yml', 'utf8');
    assert.match(config, /^last-updated: ['"]Last updated: June 2026['"]$/m);
    assert.match(config, /^cv-link-href: \/static\/assets\/Zhineng_Jin_CV\.pdf$/m);
});

test('research pages present four figure-led stories with progressive disclosure', () => {
    for (const file of ['contents/research.md', 'contents/research.zh.md']) {
        const content = fs.readFileSync(file, 'utf8');
        assert.equal((content.match(/class="research-story/g) || []).length, 4);
        assert.equal((content.match(/<details class="story-details">/g) || []).length, 4);
        assert.equal((content.match(/\/static\/assets\/img\/research\//g) || []).length, 5);
        assert.equal((content.match(/<img[^>]+alt="[^"]+"/g) || []).length, 5);
        assert.match(content, /doi\.org\/10\.1016\/j\.energy\.2026\.141700/);
        assert.match(content, /doi\.org\/10\.1016\/j\.energy\.2025\.137501/);
        assert.match(content, /doi\.org\/10\.1016\/j\.enbuild\.2024\.115175/);
        assert.match(content, /doi\.org\/10\.1016\/j\.scs\.2023\.104942/);
    }
});

test('news pages combine three publication stories with an academic timeline', () => {
    for (const file of ['contents/news.md', 'contents/news.zh.md']) {
        const content = fs.readFileSync(file, 'utf8');
        assert.equal((content.match(/class="news-feature"/g) || []).length, 3);
        assert.equal((content.match(/<details class="story-details">/g) || []).length, 3);
        assert.equal((content.match(/\/static\/assets\/img\/research\//g) || []).length, 3);
        assert.match(content, /class="news-timeline"/);
        assert.match(content, /BAS 2026/);
        assert.match(content, /HKUST/);
        assert.match(content, /National Scholarship|国家奖学金/);
    }
});
