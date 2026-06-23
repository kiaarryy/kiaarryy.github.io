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

    const SNAPSHOT_URL = '/contents/github-contributions.json';
    const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
    const cache = new Map();
    let sparkleTimer = null;
    let refreshTimer = null;
    let renderSequence = 0;

    function buildSnapshotUrl(year, now = Date.now()) {
        const refreshSlot = Math.floor(now / REFRESH_INTERVAL_MS);
        return `${SNAPSHOT_URL}?year=${year}&refresh=${refreshSlot}`;
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
                official: 'GitHub 官方数据',
                unavailable: '贡献数据暂不可用',
                contribution: ' 次贡献',
                synced: '同步于'
            }
            : {
                loading: 'Loading GitHub ',
                official: 'Official GitHub data',
                unavailable: 'Contribution data unavailable',
                contribution: ' contributions',
                synced: 'Synced'
            };
    }

    async function fetchJson(url, fresh = false) {
        const response = await fetch(url, { cache: fresh ? 'no-store' : 'no-cache' });
        if (!response.ok) throw new Error(`Contribution request failed: ${response.status}`);
        return response.json();
    }

    async function loadContributionData(year, options = {}) {
        const now = options.now ?? Date.now();
        const force = Boolean(options.force);
        const existing = cache.get(year);
        if (!force && isCacheFresh(existing, now)) return existing.request;

        const request = fetchJson(buildSnapshotUrl(year, now), true)
            .then((payload) => ({
                map: normalizeContributionPayload(payload, year),
                source: 'official',
                syncedAt: payload.generatedAt
            }))
            .catch(() => existing?.request || Promise.reject(new Error('No contribution snapshot available')))
            .catch(() => ({ map: new Map(), source: 'unavailable' }));

        cache.set(year, { fetchedAt: now, request });
        return request;
    }

    function formatSyncTime(timestamp) {
        return new Date(timestamp).toLocaleString(isChinese() ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            cell.dataset.contributionDate = iso;
            cell.dataset.contributionLevel = String(level);
            if (count > 0) {
                cell.style.setProperty('--coding-sparkle-scale', (1.08 + (level * 0.07)).toFixed(2));
                cell.style.setProperty('--coding-sparkle-glow', `${6 + (level * 3)}px`);
            }
            grid.appendChild(cell);
        });

        const daysNode = root.querySelector('[data-coding-days]');
        const sourceNode = root.querySelector('[data-coding-source]');
        if (daysNode) daysNode.textContent = String(codingDays);
        if (sourceNode) {
            const refreshed = data.source === 'official' && data.syncedAt
                ? ` · ${copy().synced} ${formatSyncTime(data.syncedAt)}`
                : '';
            sourceNode.textContent = `${copy()[data.source]} · ${year}${refreshed}`;
        }
    }

    async function renderSelectedYear(root, options = {}) {
        const sequence = ++renderSequence;
        const select = root.querySelector('[data-coding-year]');
        const year = Number(select && select.value) || new Date().getFullYear();
        const sourceNode = root.querySelector('[data-coding-source]');
        if (sourceNode) sourceNode.textContent = `${copy().loading}${year}`;
        const data = await loadContributionData(year, options);
        if (sequence !== renderSequence) return;
        renderGrid(root, year, data);
        startSparkles(root);
    }

    function startSparkles(root) {
        if (sparkleTimer) clearTimeout(sparkleTimer);
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

        const activeCells = Array.from(root.querySelectorAll('.coding-cell.is-active'));
        let queue = buildAnimationQueue(activeCells);

        function sparkleCell(cell) {
            if (!cell.isConnected) return;
            cell.classList.add('is-sparkling');
            setTimeout(() => {
                if (cell.isConnected) cell.classList.remove('is-sparkling');
            }, 900);
        }

        const sparkle = () => {
            if (!queue.length) queue = buildAnimationQueue(activeCells);
            const batchSize = activeCells.length > 10 && Math.random() > 0.45 ? 2 : 1;
            queue.splice(0, batchSize).forEach(sparkleCell);
            sparkleTimer = setTimeout(sparkle, 320 + Math.random() * 280);
        };

        if (activeCells.length) sparkleTimer = setTimeout(sparkle, 450);
    }

    function initialize(scope) {
        const root = scope.querySelector('[data-coding-activity]');
        if (!root || root.dataset.codingReady === 'true') return;
        root.dataset.codingReady = 'true';

        root.querySelector('[data-coding-year]')?.addEventListener('change', () => renderSelectedYear(root));
        window.addEventListener('site-language-change', () => renderSelectedYear(root));
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) renderSelectedYear(root, { force: true });
        });
        if (refreshTimer) clearInterval(refreshTimer);
        refreshTimer = setInterval(() => {
            if (!document.hidden) renderSelectedYear(root, { force: true });
        }, REFRESH_INTERVAL_MS);
        renderSelectedYear(root);
    }

    return {
        buildAnimationQueue,
        buildSnapshotUrl,
        buildYearDays,
        contributionLevel,
        initialize,
        isCacheFresh,
        normalizeContributionPayload
    };
}));
