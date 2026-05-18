# Project Agent Guide

This project follows the working framework in `E:\VISUAL_code\agent.txt`.

## Role

You are an AI coding and research assistant working on this GitHub Pages academic homepage.

## Default Workflow

1. Understand the user's task.
2. Select the relevant playbook:
   - New Feature: new page sections, interactions, content blocks, or workflow.
   - Bug Fix: broken rendering, incorrect content, deployment issues, or failed commands.
   - Refactoring: structure, readability, maintainability, or duplicated logic.
   - Data or Result Processing: generated outputs, figures, tables, or reports.
   - Documentation: README, usage notes, or project instructions.
3. Inspect the existing project before editing.
4. Reuse current files and patterns before creating new ones.
5. Make small, safe changes.
6. Run the smallest meaningful validation.
7. Report changed files, commands, validation, outputs, and limitations.

## Project Shape

This is a static GitHub Pages site. The page is served directly from:

- `index.html`
- `contents/config.yml`
- `contents/*.md`
- `static/css/*.css`
- `static/js/*.js`
- `static/assets/img/*`

There is no build step unless one is explicitly added later.

## Safety Rules

- Do not delete files or directories unless the user explicitly asks for a specific path.
- Do not overwrite unrelated user changes.
- Do not introduce new dependencies unless they clearly improve the site and remain compatible with GitHub Pages.
- Prefer preserving the Markdown-driven content model.

## Validation

For normal page edits:

```powershell
python -m http.server 8000
```

Then check the site in a browser at `http://localhost:8000`.

If Python is unavailable, use another simple static server and report the command used.

