const contentDir = 'contents/';
const configFile = 'config.yml';
const sectionNames = ['home', 'research', 'publications', 'news', 'awards'];

function setConfigValue(key, value) {
    if (key.endsWith('-href')) {
        const target = document.getElementById(key.replace(/-href$/, ''));
        if (target) {
            target.setAttribute('href', value);
        }
        return;
    }

    const target = document.getElementById(key);
    if (!target) {
        console.log(`Unknown config id and value: ${key}, ${value}`);
        return;
    }

    if (key === 'title') {
        document.title = value;
    }

    target.innerHTML = value;
}

function decorateExternalLinks(section) {
    section.querySelectorAll('a[href^="http"]').forEach((link) => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

function decorateListItems(section, className) {
    section.querySelectorAll('li').forEach((item) => {
        item.classList.add(className);
    });
}

function decorateMarkdownSection(name) {
    const section = document.getElementById(`${name}-md`);
    if (!section) return;

    decorateExternalLinks(section);

    if (name === 'publications') {
        decorateListItems(section, 'publication-item');
    }

    if (name === 'awards') {
        decorateListItems(section, 'award-item');
    }

    if (name === 'research') {
        decorateListItems(section, 'research-item');
    }

    if (name === 'news') {
        decorateListItems(section, 'news-item');
    }
}

function markdownHasMath(markdown) {
    return /(^|[^\\])\$\$|\\\[|\\\(|(^|[^\\])\$[^$\n]+\$/m.test(markdown);
}

function ensureMathJaxLoaded() {
    if (window.MathJax && MathJax.typesetPromise) {
        return Promise.resolve();
    }

    if (document.getElementById('MathJax-script')) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'MathJax-script';
        script.async = true;
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function typesetMath(markdown) {
    if (!markdownHasMath(markdown)) return;

    await ensureMathJaxLoaded();
    if (window.MathJax && MathJax.typesetPromise) {
        await MathJax.typesetPromise();
    }
}

async function loadConfig() {
    const response = await fetch(contentDir + configFile);
    if (!response.ok) throw new Error(`Cannot load ${configFile}: ${response.status}`);

    const text = await response.text();
    const yml = jsyaml.load(text);
    Object.keys(yml).forEach((key) => setConfigValue(key, yml[key]));
}

async function loadMarkdown(name) {
    const response = await fetch(`${contentDir}${name}.md`);
    if (!response.ok) throw new Error(`Cannot load ${name}.md: ${response.status}`);

    const markdown = await response.text();
    const target = document.getElementById(`${name}-md`);
    target.innerHTML = marked.parse(markdown);
    decorateMarkdownSection(name);
    await typesetMath(markdown);
}

window.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 90,
        });
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = Array.from(document.querySelectorAll('#navbarResponsive .nav-link'));
    responsiveNavItems.forEach((responsiveNavItem) => {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    marked.use({ mangle: false, headerIds: false });
    loadConfig().catch((error) => console.log(error));
    sectionNames.forEach((name) => loadMarkdown(name).catch((error) => console.log(error)));
});
