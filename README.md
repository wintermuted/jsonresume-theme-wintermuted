# jsonresume-theme-wintermuted

Open-source JSON Resume theme extracted from the private CV repository.

## Install

```bash
npm install jsonresume-theme-wintermuted
```

Also install the shared design-token package used by this theme:

```bash
npm install @wintermuted/wintermuted-ui-library
```

For local development before publish:

```bash
npm install ../jsonresume-theme-wintermuted
```

## Usage with resumed

```bash
resumed render resume.json -t jsonresume-theme-wintermuted -o resume.html
```

## Local Viewing

This repository includes a sample resume payload for quickly previewing theme changes.

```bash
npm run preview:render
npm run preview:serve
npm run preview:open
```

`preview:render` uses the local theme renderer (`index.js`) directly, so it works in this repository without publishing or npm linking.

Files:

- `examples/resume.sample.json`
- `examples/preview.html` (generated)

You can also run:

```bash
npm run preview:view
```

This renders the sample and starts a local server on `http://localhost:4175/`.
If a preview server is already running on that port, the script reuses it and opens the preview page.

## GitHub Pages Publishing

This repository publishes a live preview of the sample resume through GitHub Pages using Actions.

- Pushes to `main` publish production content to the root Pages site.
- Pull requests to `main` publish isolated previews under `previews/pr-<number>/`.
- Closing a pull request removes its preview directory from `gh-pages`.

Workflows:

- `.github/workflows/deploy-pages.yml`
- `.github/workflows/cleanup-pr-preview.yml`

## What this package contains

- `resume.hbs` main Handlebars template
- `partials/` section partials
- `helpers/` helper functions
- `style.css` theme-specific styles
- Runtime CSS token inlining from `@wintermuted/wintermuted-ui-library`

## Publish

```bash
npm publish --access public
```

For automated publishing, this repo is configured for npm trusted publishing from GitHub Actions.

Release flow:

1. Bump `package.json` version.
2. Merge or push that change to `main`.
3. The `Publish And Release` workflow publishes the package to npm.
4. The workflow creates a matching GitHub release tagged `v<version>`.

Because trusted publishing is enabled, no long-lived `NPM_TOKEN` secret is required for the GitHub Actions publish step.
