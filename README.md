# jsonresume-theme-wintermuted

Open-source JSON Resume theme extracted from the private CV repository.

## Install

```bash
npm install jsonresume-theme-wintermuted
```

Also install the shared design-token package used by this theme:

```bash
npm install @wintermuted/ui-theme
```

For local development before publish:

```bash
npm install ../jsonresume-theme-wintermuted
```

## Usage with resumed

```bash
resumed render resume.json -t jsonresume-theme-wintermuted -o resume.html
```

## What this package contains

- `resume.hbs` main Handlebars template
- `partials/` section partials
- `helpers/` helper functions
- `style.css` theme-specific styles
- Runtime CSS token inlining from `@wintermuted/ui-theme`

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
