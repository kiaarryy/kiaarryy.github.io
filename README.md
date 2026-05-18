# Zhineng Jin Academic Homepage

![License](https://img.shields.io/github/license/kiaarryy/kiaarryy.github.io)
![Last Commit](https://img.shields.io/github/last-commit/kiaarryy/kiaarryy.github.io)

This repository hosts the personal academic homepage at:

https://kiaarryy.github.io

The site is a static GitHub Pages page. It keeps academic content in Markdown and configuration in YAML, so no build step is required.

## Structure

```text
.
|-- contents
|   |-- awards.md
|   |-- config.yml
|   |-- home.md
|   |-- news.md
|   |-- research.md
|   `-- publications.md
|-- static
|   |-- assets
|   |-- css
|   `-- js
`-- index.html
```

## Edit Content

- Update profile text in `contents/home.md`.
- Update publication records in `contents/publications.md`.
- Update awards in `contents/awards.md`.
- Update news in `contents/news.md`.
- Update research highlights in `contents/research.md`.
- Update site title, hero text, and labels in `contents/config.yml`.
- Replace portrait and background files in `static/assets/img/` if needed.
- Update CV content in `static/assets/Zhineng_Jin_CV.html` and export `static/assets/Zhineng_Jin_CV.pdf`.

## Preview Locally

Run a static server from the repository root:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment

GitHub Pages serves this repository directly from the `main` branch. After committing and pushing changes, the public site may take several minutes to refresh.

## License

This project is based on an MIT-licensed academic homepage template.
