import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const GRAPHQL_URL = 'https://api.github.com/graphql';
const LEVELS = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4
};

const QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount contributionLevel }
        }
      }
    }
  }
}`;

export function buildPeriodSpec(year, now = new Date()) {
    const currentYear = now.getUTCFullYear();
    if (Number(year) === currentYear) {
        const from = new Date(Date.UTC(
            currentYear - 1,
            now.getUTCMonth(),
            now.getUTCDate()
        ));
        return {
            key: currentYear,
            mode: 'rolling-year',
            from: from.toISOString().slice(0, 10),
            to: now.toISOString().slice(0, 10)
        };
    }

    return {
        key: Number(year),
        mode: 'calendar-year',
        from: `${year}-01-01`,
        to: `${year}-12-31`
    };
}

export function normalizeCalendar(calendar, period, restricted = 0) {
    const contributions = (calendar?.weeks || [])
        .flatMap((week) => week.contributionDays || [])
        .filter((day) => day.date >= period.from && day.date <= period.to)
        .map((day) => ({
            date: day.date,
            count: Number(day.contributionCount) || 0,
            level: LEVELS[day.contributionLevel] ?? 0
        }))
        .sort((left, right) => left.date.localeCompare(right.date));

    return {
        year: Number(period.key),
        mode: period.mode,
        from: period.from,
        to: period.to,
        total: Number(calendar?.totalContributions) || 0,
        restricted: Number(restricted) || 0,
        contributions
    };
}

export function createSnapshot({ login, generatedAt, calendars }) {
    const ordered = [...calendars].sort((left, right) => left.year - right.year);
    return {
        schemaVersion: 2,
        source: 'github-graphql',
        login,
        generatedAt,
        total: Object.fromEntries(ordered.map((calendar) => [calendar.year, calendar.total])),
        periods: Object.fromEntries(ordered.map((calendar) => [calendar.year, calendar]))
    };
}

async function fetchCalendar({ token, login, year, now }) {
    const period = buildPeriodSpec(year, now);
    const from = `${period.from}T00:00:00.000Z`;
    const to = year === now.getUTCFullYear()
        ? now.toISOString()
        : `${period.to}T23:59:59.999Z`;
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
            accept: 'application/vnd.github+json',
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
            'user-agent': 'kiaarryy-github-pages-contribution-sync'
        },
        body: JSON.stringify({ query: QUERY, variables: { login, from, to } })
    });

    if (!response.ok) {
        throw new Error(`GitHub GraphQL request failed with HTTP ${response.status}`);
    }
    const payload = await response.json();
    if (payload.errors?.length) {
        throw new Error(`GitHub GraphQL error: ${payload.errors.map((error) => error.message).join('; ')}`);
    }
    const collection = payload.data?.user?.contributionsCollection;
    const calendar = collection?.contributionCalendar;
    if (!calendar) throw new Error(`No contribution calendar returned for ${login}`);
    return normalizeCalendar(calendar, period, collection.restrictedContributionsCount);
}

function semanticSignature(snapshot) {
    return JSON.stringify({
        schemaVersion: snapshot?.schemaVersion,
        source: snapshot?.source,
        login: snapshot?.login,
        total: snapshot?.total,
        periods: snapshot?.periods
    });
}

export async function updateSnapshot({
    token,
    login,
    outputPath,
    years,
    now = new Date()
}) {
    if (!token) throw new Error('GH_TOKEN or GITHUB_TOKEN is required');
    if (!login) throw new Error('GITHUB_LOGIN is required');

    const calendars = [];
    for (const year of years) {
        calendars.push(await fetchCalendar({ token, login, year, now }));
    }

    const snapshot = createSnapshot({ login, generatedAt: now.toISOString(), calendars });
    let existing = null;
    try {
        existing = JSON.parse(await fs.readFile(outputPath, 'utf8'));
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }

    if (existing && semanticSignature(existing) === semanticSignature(snapshot)) {
        return { changed: false, snapshot: existing };
    }

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    return { changed: true, snapshot };
}

async function main() {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const outputPath = process.env.CONTRIBUTIONS_OUTPUT
        || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'contents', 'github-contributions.json');
    const result = await updateSnapshot({
        token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
        login: process.env.GITHUB_LOGIN || 'kiaarryy',
        outputPath,
        years: [currentYear - 1, currentYear],
        now
    });
    const current = result.snapshot.periods[String(currentYear)];
    const activeDays = current.contributions.filter((day) => day.count > 0).length;
    console.log(JSON.stringify({
        changed: result.changed,
        total: result.snapshot.total,
        activeDays,
        restricted: current.restricted
    }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
}
