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

If you publish through GitHub Actions, configure the workflow to run `npm publish` on tags.
