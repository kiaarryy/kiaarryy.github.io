const contentDir = 'contents/';
const configFile = 'config.yml';
const sectionNames = ['home', 'publications', 'awards'];

function setConfigValue(key, value) {
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

function decorateMarkdownSection(name) {
    const section = document.getElementById(`${name}-md`);
    if (!section) return;

    if (name === 'publications') {
        section.querySelectorAll('li').forEach((item) => {
            item.classList.add('publication-item');
        });
        section.querySelectorAll('a').forEach((link) => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    if (name === 'awards') {
        section.querySelectorAll('li').forEach((item) => {
            item.classList.add('award-item');
        });
    }
}

function typesetMath() {
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise().catch((error) => console.log(error));
        return;
    }

    if (window.MathJax && MathJax.typeset) {
        MathJax.typeset();
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
    typesetMath();
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
