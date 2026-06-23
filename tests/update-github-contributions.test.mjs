import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildPeriodSpec,
    createSnapshot,
    normalizeCalendar
} from '../scripts/update-github-contributions.mjs';

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

test('normalizes GitHub GraphQL contribution days for one period', () => {
    assert.deepEqual(normalizeCalendar(calendar2026, {
        key: 2026,
        mode: 'calendar-year',
        from: '2026-01-01',
        to: '2026-12-31'
    }, 2), {
        year: 2026,
        mode: 'calendar-year',
        from: '2026-01-01',
        to: '2026-12-31',
        total: 5,
        restricted: 2,
        contributions: [
            { date: '2026-01-01', count: 2, level: 2 },
            { date: '2026-01-02', count: 3, level: 4 }
        ]
    });
});

test('uses a rolling one-year period for the current GitHub view', () => {
    assert.deepEqual(
        buildPeriodSpec(2026, new Date('2026-06-23T12:00:00.000Z')),
        {
            key: 2026,
            mode: 'rolling-year',
            from: '2025-06-23',
            to: '2026-06-23'
        }
    );
});

test('uses a calendar year period for historical GitHub views', () => {
    assert.deepEqual(
        buildPeriodSpec(2025, new Date('2026-06-23T12:00:00.000Z')),
        {
            key: 2025,
            mode: 'calendar-year',
            from: '2025-01-01',
            to: '2025-12-31'
        }
    );
});

test('creates an auditable multi-year official snapshot', () => {
    const snapshot = createSnapshot({
        login: 'kiaarryy',
        generatedAt: '2026-06-23T12:00:00.000Z',
        calendars: [
            {
                year: 2025,
                mode: 'calendar-year',
                from: '2025-01-01',
                to: '2025-12-31',
                total: 1,
                restricted: 0,
                contributions: [{ date: '2025-02-01', count: 1, level: 1 }]
            },
            normalizeCalendar(calendar2026, {
                key: 2026,
                mode: 'rolling-year',
                from: '2025-06-23',
                to: '2026-06-23'
            }, 2)
        ]
    });

    assert.equal(snapshot.source, 'github-graphql');
    assert.equal(snapshot.schemaVersion, 2);
    assert.equal(snapshot.login, 'kiaarryy');
    assert.equal(snapshot.generatedAt, '2026-06-23T12:00:00.000Z');
    assert.deepEqual(snapshot.total, { 2025: 1, 2026: 5 });
    assert.equal(snapshot.periods['2026'].mode, 'rolling-year');
    assert.equal(snapshot.periods['2026'].restricted, 2);
    assert.equal('contributions' in snapshot, false);
});
