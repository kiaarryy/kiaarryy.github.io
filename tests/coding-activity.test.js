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
