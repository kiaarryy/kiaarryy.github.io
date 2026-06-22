(function (root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root && root.document) {
        root.CodingActivity = api;
        const start = () => api.initialize(root.document);
        if (root.document.readyState === 'loading') {
            root.document.addEventListener('DOMContentLoaded', start, { once: true });
        } else {
            start();
        }
    }
}(typeof window !== 'undefined' ? window : null, function () {
    'use strict';

    const API_BASE = 'https://github-contributions-api.jogruber.de/v4';
    const USERNAME = 'kiaarryy';
    const SNAPSHOT_URL = '/contents/github-contributions.json';
    const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
    const cache = new Map();
    let sparkleTimer = null;

    function buildLiveRequestUrl(year, now = Date.now()) {
        const refreshSlot = Math.floor(now / REFRESH_INTERVAL_MS);
        return `${API_BASE}/${encodeURIComponent(USERNAME)}?y=${year}&refresh=${refreshSlot}`;
    }

    function isCacheFresh(entry, now = Date.now()) {
        return Boolean(entry && now - entry.fetchedAt < REFRESH_INTERVAL_MS);
    }

    function buildAnimationQueue(items, random = Math.random) {
        const queue = Array.from(items);
        for (let index = queue.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(random() * (index + 1));
            [queue[index], queue[swapIndex]] = [queue[swapIndex], queue[index]];
        }
        return queue;
    }

    function buildYearDays(year) {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() + (6 - end.getDay()));

        const days = [];
        const cursor = new Date(start);
        while (cursor <= end) {
            days.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }
        return days;
    }

    function toISO(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function normalizeContributionPayload(payload, year) {
        let rows = [];
        if (payload && Array.isArray(payload.contributions)) {
            rows = payload.contributions;
        } else if (payload && Array.isArray(payload.years)) {
            payload.years.forEach((record) => {
                if (Array.isArray(record.contributions)) rows.push(...record.contributions);
            });
        }

        const map = new Map();
        rows.forEach((item) => {
            const date = item && item.date;
            const count = Number(item && (item.count ?? item.contributionCount) || 0);
            if (date && Number(date.slice(0, 4)) === Number(year)) {
                map.set(date, Number.isFinite(count) ? count : 0);
            }
        });
        return map;
    }

    function contributionLevel(count) {
        if (count <= 0) return 0;
        if (count <= 2) return 1;
        if (count <= 5) return 2;
        if (count <= 9) return 3;
        return 4;
    }

    function isChinese() {
        return typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('zh');
    }

    function copy() {
        return isChinese()
            ? {
                loading: '正在加载 GitHub ',
                live: 'GitHub 实时数据',
                cached: 'GitHub 缓存数据',
                unavailable: '贡献数据暂不可用',
                contribution: ' 次贡献'
            }
            : {
                loading: 'Loading GitHub ',
                live: 'Live GitHub data',
                cached: 'Cached GitHub data',
                unavailable: 'Contribution data unavailable',
                contribution: ' contributions'
            };
    }

    async function fetchJson(url) {
        const response = await fetch(url, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`Contribution request failed: ${response.status}`);
        return response.json();
    }

    async function loadContributionData(year) {
        if (cache.has(year)) return cache.get(year);

        const request = fetchJson(`${API_BASE}/${encodeURIComponent(USERNAME)}?y=${year}`)
            .then((payload) => ({ map: normalizeContributionPayload(payload, year), source: 'live' }))
            .catch(() => fetchJson(SNAPSHOT_URL)
                .then((payload) => ({ map: normalizeContributionPayload(payload, year), source: 'cached' })))
            .catch(() => ({ map: new Map(), source: 'unavailable' }));

        cache.set(year, request);
        return request;
    }

    function renderMonths(root, days, year) {
        const row = root.querySelector('[data-coding-months]');
        if (!row) return;

        const weekCount = Math.ceil(days.length / 7);
        row.innerHTML = '';
        row.style.gridTemplateColumns = `repeat(${weekCount}, var(--coding-cell-size))`;

        days.forEach((date, index) => {
            if (date.getFullYear() !== year || date.getDate() !== 1) return;
            const label = document.createElement('span');
            label.textContent = date.toLocaleString(isChinese() ? 'zh-CN' : 'en-US', { month: 'short' });
            label.style.gridColumn = `${Math.floor(index / 7) + 1} / span 4`;
            row.appendChild(label);
        });
    }

    function renderGrid(root, year, data) {
        const grid = root.querySelector('[data-coding-grid]');
        if (!grid) return;

        const days = buildYearDays(year);
        const weekCount = Math.ceil(days.length / 7);
        let codingDays = 0;
        renderMonths(root, days, year);
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${weekCount}, var(--coding-cell-size))`;

        days.forEach((date) => {
            const iso = toISO(date);
            const inYear = date.getFullYear() === year;
            const count = inYear ? data.map.get(iso) || 0 : 0;
            const level = contributionLevel(count);
            if (count > 0) codingDays += 1;

            const cell = document.createElement('span');
            const formattedDate = date.toLocaleDateString(isChinese() ? 'zh-CN' : 'en-US');
            const label = `${formattedDate}: ${count}${copy().contribution}`;
            cell.className = `coding-cell coding-level-${level}${count > 0 ? ' is-active' : ''}${inYear ? '' : ' outside-year'}`;
            cell.title = label;
            cell.setAttribute('aria-label', label);
            grid.appendChild(cell);
        });

        const daysNode = root.querySelector('[data-coding-days]');
        const sourceNode = root.querySelector('[data-coding-source]');
        if (daysNode) daysNode.textContent = String(codingDays);
        if (sourceNode) sourceNode.textContent = `${copy()[data.source]} · ${year}`;
    }

    async function renderSelectedYear(root) {
        const select = root.querySelector('[data-coding-year]');
        const year = Number(select && select.value) || new Date().getFullYear();
        const sourceNode = root.querySelector('[data-coding-source]');
        if (sourceNode) sourceNode.textContent = `${copy().loading}${year}`;
        renderGrid(root, year, await loadContributionData(year));
    }

    function startSparkles(root) {
        if (sparkleTimer) clearTimeout(sparkleTimer);

        const sparkle = () => {
            const cells = root.querySelectorAll('.coding-level-4.is-active');
            if (cells.length) {
                const cell = cells[Math.floor(Math.random() * cells.length)];
                cell.classList.add('is-sparkling');
                setTimeout(() => cell.classList.remove('is-sparkling'), 720);
            }
            sparkleTimer = setTimeout(sparkle, 180 + Math.random() * 420);
        };

        sparkleTimer = setTimeout(sparkle, 650);
    }

    function initialize(scope) {
        const root = scope.querySelector('[data-coding-activity]');
        if (!root || root.dataset.codingReady === 'true') return;
        root.dataset.codingReady = 'true';

        root.querySelector('[data-coding-year]')?.addEventListener('change', () => renderSelectedYear(root));
        window.addEventListener('site-language-change', () => renderSelectedYear(root));
        renderSelectedYear(root);
        startSparkles(root);
    }

    return {
        buildAnimationQueue,
        buildLiveRequestUrl,
        buildYearDays,
        contributionLevel,
        initialize,
        isCacheFresh,
        normalizeContributionPayload
    };
}));
