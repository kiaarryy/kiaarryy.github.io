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
