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
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount contributionLevel }
        }
      }
    }
  }
}`;

export function normalizeCalendar(calendar, year) {
    const contributions = (calendar?.weeks || [])
        .flatMap((week) => week.contributionDays || [])
        .filter((day) => Number(day.date?.slice(0, 4)) === Number(year))
        .map((day) => ({
            date: day.date,
            count: Number(day.contributionCount) || 0,
            level: LEVELS[day.contributionLevel] ?? 0
        }))
        .sort((left, right) => left.date.localeCompare(right.date));

    return {
        year: Number(year),
        total: Number(calendar?.totalContributions) || 0,
        contributions
    };
}

export function createSnapshot({ login, generatedAt, calendars }) {
    const ordered = [...calendars].sort((left, right) => left.year - right.year);
    return {
        source: 'github-graphql',
        login,
        generatedAt,
        total: Object.fromEntries(ordered.map((calendar) => [calendar.year, calendar.total])),
        contributions: ordered.flatMap((calendar) => calendar.contributions)
    };
}

async function fetchCalendar({ token, login, year, now }) {
    const currentYear = now.getUTCFullYear();
    const from = new Date(Date.UTC(year, 0, 1)).toISOString();
    const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
    const to = (year === currentYear && now < endOfYear ? now : endOfYear).toISOString();
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
    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) throw new Error(`No contribution calendar returned for ${login}`);
    return normalizeCalendar(calendar, year);
}

function semanticSignature(snapshot) {
    return JSON.stringify({
        source: snapshot?.source,
        login: snapshot?.login,
        total: snapshot?.total,
        contributions: snapshot?.contributions
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
    const activeDays = result.snapshot.contributions.filter((day) => day.count > 0).length;
    console.log(JSON.stringify({ changed: result.changed, total: result.snapshot.total, activeDays }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
}
