import handlebars from 'handlebars';
import fs from 'node:fs';
import path from 'node:path';
import helpers from './helpers/index.js';

/**
 * @param {object} resume
 * @returns {string}
 */
export function render(resume) {
  const css = fs.readFileSync(
    path.join(import.meta.dirname, 'style.css'),
    'utf-8'
  );

  // Prepend the shared wintermuted UI theme (CSS variables + component classes).
  // We inline nested @import directives so the exported HTML is fully self-contained.
  let wmCss = '';
  try {
    const wmCssUrl = import.meta.resolve('@wintermuted/ui-theme/index.css');
    wmCss = inlineCssImports(new URL(wmCssUrl)) + '\n';
  } catch {
    // import.meta.resolve can fail when the theme is loaded via a file: symlink chain
    // (e.g. file:./themes/jsonresume-theme-local). Walk up the directory tree as fallback.
    let dir = import.meta.dirname;
    for (let i = 0; i < 6; i++) {
      const candidate = path.join(dir, 'node_modules', '@wintermuted', 'ui-theme', 'index.css');
      if (fs.existsSync(candidate)) {
        wmCss = inlineCssImports(candidate) + '\n';
        break;
      }
      const parent = path.dirname(dir);
      if (parent === dir) break; // reached filesystem root
      dir = parent;
    }

    // Local sibling fallback for workspace-style checkouts:
    // /code/jsonresume-theme-wintermuted next to /code/wintermuted-ui-theme
    if (!wmCss) {
      const siblingCandidate = path.resolve(import.meta.dirname, '..', 'wintermuted-ui-theme', 'index.css');
      if (fs.existsSync(siblingCandidate)) {
        wmCss = inlineCssImports(siblingCandidate) + '\n';
      }
    }
  }

  const template = fs.readFileSync(
    path.join(import.meta.dirname, 'resume.hbs'),
    'utf-8'
  );

  // Register partials
  const partialsDir = path.join(import.meta.dirname, 'partials');
  for (const filename of fs.readdirSync(partialsDir)) {
    const match = /^([^.]+)\.hbs$/.exec(filename);
    if (!match) continue;
    const partial = fs.readFileSync(
      path.join(partialsDir, filename),
      'utf-8'
    );
    handlebars.registerPartial(match[1], partial);
  }

  // Register helpers
  for (const [name, helper] of Object.entries(helpers)) {
    handlebars.registerHelper(name, helper);
  }

  // Build sections visibility map from resume.meta.hiddenSections
  const allSections = [
    'summary', 'work', 'skills', 'projects',
    'education', 'volunteer', 'awards', 'languages', 'interests',
  ];
  const hidden = new Set(
    (resume.meta && resume.meta.hiddenSections) || []
  );
  const sections = Object.fromEntries(
    allSections.map((s) => [s, !hidden.has(s)])
  );

  return handlebars.compile(template)({ css: wmCss + css, resume, sections });
}

function inlineCssImports(entry, visited = new Set()) {
  const entryPath = entry instanceof URL ? new URL(entry).pathname : path.resolve(entry);
  if (visited.has(entryPath)) return '';
  visited.add(entryPath);

  const source = fs.readFileSync(entryPath, 'utf-8');
  const importRegex = /^\s*@import\s+url\(["']([^"']+)["']\)\s*;\s*$/gm;

  return source.replace(importRegex, (_full, importPath) => {
    if (/^https?:\/\//i.test(importPath)) return '';
    const nextPath = path.resolve(path.dirname(entryPath), importPath);
    if (!fs.existsSync(nextPath)) return '';
    return inlineCssImports(nextPath, visited);
  });
}
