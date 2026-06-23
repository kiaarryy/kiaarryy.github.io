const test = require('node:test');
const assert = require('node:assert/strict');
const coding = require('../static/js/coding-activity.js');

test('normalizes only contributions from the selected year', () => {
    const map = coding.normalizeContributionPayload({
        contributions: [
            { date: '2026-01-02', count: 3 },
            { date: '2025-12-31', count: 9 },
            { date: '2026-01-03', contributionCount: 5 }
        ]
    }, 2026);

    assert.equal(map.get('2026-01-02'), 3);
    assert.equal(map.get('2026-01-03'), 5);
    assert.equal(map.has('2025-12-31'), false);
});

test('normalizes API responses that group contributions by year', () => {
    const map = coding.normalizeContributionPayload({
        years: [
            { year: 2025, contributions: [{ date: '2025-02-01', count: 2 }] },
            { year: 2026, contributions: [{ date: '2026-02-01', count: 7 }] }
        ]
    }, 2026);

    assert.deepEqual(Array.from(map.entries()), [['2026-02-01', 7]]);
});

test('maps counts to five GitHub intensity levels', () => {
    assert.deepEqual(
        [0, 1, 3, 7, 12].map(coding.contributionLevel),
        [0, 1, 2, 3, 4]
    );
});

test('builds full Sunday-to-Saturday weeks around a selected year', () => {
    const days = coding.buildYearDays(2026);
    assert.equal(days.length % 7, 0);
    assert.equal(days[0].getDay(), 0);
    assert.equal(days.at(-1).getDay(), 6);
    assert.ok(days.some((date) => date.getFullYear() === 2026 && date.getMonth() === 0 && date.getDate() === 1));
    assert.ok(days.some((date) => date.getFullYear() === 2026 && date.getMonth() === 11 && date.getDate() === 31));
});

test('selects the current rolling GitHub period including dates from the previous year', () => {
    const period = coding.selectContributionPeriod({
        periods: {
            2026: {
                mode: 'rolling-year',
                from: '2025-06-23',
                to: '2026-06-23',
                total: 125,
                contributions: [
                    { date: '2025-11-13', count: 5 },
                    { date: '2026-06-22', count: 30 }
                ]
            }
        }
    }, 2026);

    assert.equal(period.mode, 'rolling-year');
    assert.equal(period.from, '2025-06-23');
    assert.equal(period.to, '2026-06-23');
    assert.equal(period.total, 125);
    assert.equal(period.map.get('2025-11-13'), 5);
    assert.equal(period.map.get('2026-06-22'), 30);
});

test('builds complete Sunday-to-Saturday weeks around a rolling period', () => {
    const days = coding.buildPeriodDays('2025-06-23', '2026-06-23');

    assert.equal(days.length % 7, 0);
    assert.equal(days[0].getDay(), 0);
    assert.equal(days.at(-1).getDay(), 6);
    assert.equal(coding.toISO(days[0]), '2025-06-22');
    assert.equal(coding.toISO(days.at(-1)), '2026-06-27');
});

test('builds cache-busted official snapshot URLs', () => {
    assert.equal(
        coding.buildSnapshotUrl(2026, 299999),
        '/contents/github-contributions.json?year=2026&refresh=0'
    );
    assert.equal(
        coding.buildSnapshotUrl(2026, 300000),
        '/contents/github-contributions.json?year=2026&refresh=1'
    );
});

test('does not depend on the previous third-party contribution API', () => {
    const source = require('node:fs').readFileSync('static/js/coding-activity.js', 'utf8');
    assert.doesNotMatch(source, /jogruber\.de/);
});

test('expires in-memory contribution data after five minutes', () => {
    assert.equal(coding.isCacheFresh({ fetchedAt: 1000 }, 300999), true);
    assert.equal(coding.isCacheFresh({ fetchedAt: 1000 }, 301000), false);
    assert.equal(coding.isCacheFresh(null, 1000), false);
});

test('builds an animation queue containing each active cell exactly once', () => {
    const cells = ['2026-05-15', '2026-05-18', '2026-05-21', '2026-05-24'];
    const queue = coding.buildAnimationQueue(cells, () => 0.25);

    assert.deepEqual([...queue].sort(), cells);
    assert.equal(new Set(queue).size, cells.length);
    assert.deepEqual(cells, ['2026-05-15', '2026-05-18', '2026-05-21', '2026-05-24']);
});
