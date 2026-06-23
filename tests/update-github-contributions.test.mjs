import test from 'node:test';
import assert from 'node:assert/strict';
import { createSnapshot, normalizeCalendar } from '../scripts/update-github-contributions.mjs';

const calendar2026 = {
    totalContributions: 5,
    weeks: [
        {
            contributionDays: [
                { date: '2025-12-31', contributionCount: 0, contributionLevel: 'NONE' },
                { date: '2026-01-01', contributionCount: 2, contributionLevel: 'SECOND_QUARTILE' },
                { date: '2026-01-02', contributionCount: 3, contributionLevel: 'FOURTH_QUARTILE' }
            ]
        }
    ]
};

test('normalizes GitHub GraphQL contribution days for one year', () => {
    assert.deepEqual(normalizeCalendar(calendar2026, 2026), {
        year: 2026,
        total: 5,
        contributions: [
            { date: '2026-01-01', count: 2, level: 2 },
            { date: '2026-01-02', count: 3, level: 4 }
        ]
    });
});

test('creates an auditable multi-year official snapshot', () => {
    const snapshot = createSnapshot({
        login: 'kiaarryy',
        generatedAt: '2026-06-23T12:00:00.000Z',
        calendars: [
            { year: 2025, total: 1, contributions: [{ date: '2025-02-01', count: 1, level: 1 }] },
            normalizeCalendar(calendar2026, 2026)
        ]
    });

    assert.equal(snapshot.source, 'github-graphql');
    assert.equal(snapshot.login, 'kiaarryy');
    assert.equal(snapshot.generatedAt, '2026-06-23T12:00:00.000Z');
    assert.deepEqual(snapshot.total, { 2025: 1, 2026: 5 });
    assert.equal(snapshot.contributions.length, 3);
});
