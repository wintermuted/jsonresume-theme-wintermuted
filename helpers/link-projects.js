import handlebars from 'handlebars';

/**
 * Slugify a project name into an HTML-safe id fragment.
 * "Deal Monitoring UI" → "deal-monitoring-ui"
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Scan text for known project names (and aliases) and wrap first occurrence
 * of each in an anchor link pointing to #project-<slug>.
 * Returns an HTML SafeString (triple-stash {{{...}}} required).
 */
export function linkProjects(text, projects) {
  if (!text || !projects || !projects.length) return text;

  let result = escapeHtml(text);

  for (const project of projects) {
    const slug = slugify(project.name);
    // Build list of names to match: canonical name first, then aliases
    const names = [project.name, ...(project._aliases || [])];

    for (const name of names) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Word-boundary match to avoid partial matches inside longer words
      const re = new RegExp(`\\b(${escaped})\\b`, 'i');
      if (re.test(result)) {
        result = result.replace(
          re,
          `<a href="#project-${slug}" class="project-ref">$1</a>`
        );
        break; // Only link first matching variant per project
      }
    }
  }

  return new handlebars.SafeString(result);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
