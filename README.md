# Vigna Purohit — GIS Portfolio

A geospatial & data analytics portfolio site built with **[Hugo](https://gohugo.io/)**, deployed to **GitHub Pages** via **GitHub Actions**.

Live at: https://vignapurohit.github.io/

---

## Prerequisites

- **Hugo (extended)**, v0.166.0 or newer — the "extended" build is required (it includes the SCSS/image-processing support some Hugo features rely on).
  - macOS: `brew install hugo`
  - Windows: `choco install hugo-extended` or `winget install Hugo.Hugo.Extended`
  - Linux: see the [official install docs](https://gohugo.io/installation/linux/)
  - Verify with `hugo version` — it should say `extended`.
- **Git**, and a GitHub account with push access to this repo.
- **Node.js** (optional) — only needed if you want to regenerate images from the original source photos via `scripts/build-images.js`. Not required to build or run the site itself.

## Running locally

```bash
hugo server -D
```

Open **http://localhost:1313/**. This live-reloads: edit a content file, template, or the stylesheet, save, and the browser refreshes automatically. `-D` includes draft content (pages with `draft: true` in their front matter, e.g. a project you're still writing) in the local preview — they're excluded from the real production build.

Stop the server with `Ctrl+C`.

## Project structure

```
hugo.toml                   Site config: title, nav menu, params (name, email, social links), SEO/markup settings
archetypes/project.md       Template used when scaffolding a new project with `hugo new`
content/
  education/_index.md       Degrees + skills, as front-matter data (no template editing needed to update)
  experience/_index.md      Jobs + publications, as front-matter data
  projects/
    _index.md                Projects page intro copy
    <slug>/index.md           One case-study file per project — see "Adding a new project" below
  workshops/
    _index.md                 Workshops page intro copy
    <slug>/index.md            One write-up per workshop/training event
layouts/
  _default/baseof.html       Base HTML shell every page is wrapped in
  index.html                 Homepage (hero + photo collage)
  404.html
  education/list.html        Renders content/education/_index.md's front matter
  experience/list.html       Renders content/experience/_index.md's front matter
  projects/list.html         Projects grid — auto-generates a card per file in content/projects/
  projects/single.html       Case-study page template
  workshops/list.html        Workshops grid — same auto-generation pattern
  workshops/single.html      Workshop write-up template
  partials/                  Reusable pieces: nav, footer, social-icons, head (SEO), picture
                              (WebP+JPEG image helper), button, project-card, workshop-card
static/
  css/style.css               The site's entire visual design (colors, layout, components)
  assets/                     CV, notebooks, and all photos (already optimized — see below)
scripts/build-images.js      Optional: regenerates static/assets/images/ from the original,
                              much larger source photos (kept outside this repo)
.github/workflows/
  deploy.yml                  Production build + deploy to GitHub Pages (on push to main)
  pr-build.yml                 Build validation + downloadable preview on pull requests
```

### Why Education/Experience aren't a content collection

Projects and Workshops are genuine Hugo collections — one Markdown file per item, because you'll add new ones over time. Education and Experience are short, mostly-fixed lists, so each lives as a single page whose entries are a **front-matter list** (see `content/education/_index.md`). You edit YAML, not HTML, either way — it's just that degrees/jobs don't need their own URLs.

## Adding a new project

```bash
hugo new content/projects/my-new-project/index.md
```

This scaffolds the file from `archetypes/project.md` with the right front matter fields and section headings already in place, and sets `draft: true` so it won't appear in the production build until you're ready.

Fill in the front matter:

```yaml
title: "My New Project"
description: "One sentence — this is what shows on the project card."
date: 2026-01-15
image: ""              # optional: "/assets/images/gallery/workshop-01" (no file extension)
tags: ["Tag One", "Tag Two"]
featured: false
github_url: "https://github.com/you/repo"
live_url: ""
project_status: "Completed"   # or "Ongoing", etc.
draft: true             # flip to false (or delete the line) when ready to publish
```

Write the case study underneath using the provided `## Question / Context / Data / Approach / Analysis / Results / Outcome / Technical Details / Links` headings — use the ones that make sense for the project and delete the rest. Code blocks (` ```sql `, ` ```python `, …) get automatic syntax highlighting.

**You never need to touch any `layouts/` file to add, edit, or remove a project** — the Projects page card grid and the case-study page are both generated from this one Markdown file.

Adding a workshop entry works the same way, under `content/workshops/`.

## Building the production site

```bash
hugo --minify
```

Outputs the static site to `public/`. You normally don't need to run this yourself — GitHub Actions does it on every push to `main` (see below). It's useful for a final local sanity check before pushing.

## Regenerating images

The large original photos live outside this repo, in `../portfolio_material/`, and `static/assets/images/` holds pre-cropped, resized, WebP+JPEG pairs generated from them. To regenerate after changing a crop or adding a new source photo:

```bash
npm install
npm run images
```

## How deployment works

`.github/workflows/deploy.yml` runs on every push to `main`:

1. Checks out the repo
2. Installs Hugo (extended, pinned version)
3. Builds the site with `hugo --minify`
4. Uploads the built `public/` folder as a Pages artifact
5. Deploys it via GitHub's native Pages deployment (`actions/deploy-pages`) — this is the current recommended method; it does **not** use an old-style `gh-pages` branch

A few minutes after merging to `main`, the live site at https://vignapurohit.github.io/ updates automatically. You can watch progress under the repo's **Actions** tab.

## How the PR preview workflow works

`.github/workflows/pr-build.yml` runs on every pull request targeting `main`:

1. Builds the site with Hugo
2. **Fails the check** if the build breaks (so you can't accidentally merge a broken site)
3. Uploads the full built site as a downloadable workflow artifact
4. Comments on the PR with a link to that artifact and instructions to preview it locally

**Why not a live preview URL per PR, like Netlify gives you?** GitHub Pages serves exactly one live deployment per repository — there's no first-party way to stand up a separate public URL for every open PR without either a third-party host (which this project intentionally avoids) or repurposing the branch-based Pages deploy mode in a way that would conflict with the modern Actions-based production deploy above. The artifact + PR comment above is the closest practical GitHub-native equivalent: you get automated build validation on every PR, and a one-click way to grab and inspect the exact built output before merging.

The full workflow in practice:

```
edit locally → hugo server (preview) → commit → push branch → open PR
  → pr-build.yml validates the build + comments with a preview artifact
  → review, merge to main
  → deploy.yml builds + deploys to GitHub Pages
```

## Manual GitHub settings (one-time)

These aren't in any file — they're repo settings:

1. **Settings → Pages → Build and deployment → Source**: set to **"GitHub Actions"** (not "Deploy from a branch"). This repo's Pages source was configured this way as part of the migration — confirm it's still set if Pages ever stops updating.
2. **Settings → Actions → General → Workflow permissions**: needs "Read and write permissions" (or at least read access + the `pull-requests: write` scope used above) for the PR-comment step in `pr-build.yml` to post comments.
3. A **custom domain** is intentionally not configured yet — when you're ready, it's **Settings → Pages → Custom domain**, plus updating `baseURL` in `hugo.toml`.

<!-- test: verifying PR build workflow -->
