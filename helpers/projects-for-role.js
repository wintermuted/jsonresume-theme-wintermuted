import { slugify } from './link-projects.js';

/**
 * Returns projects whose entity matches the work company name
 * and whose date range overlaps the role's date range.
 *
 * Usage (block helper):
 *   {{#projectsForRole companyName startDate endDate @root.resume.projects}}
 *     ... {{name}} {{slug}} ...
 *   {{/projectsForRole}}
 */
export function projectsForRole(companyName, roleStart, roleEnd, projects, options) {
  if (!projects || !projects.length || !companyName) return '';

  const rStart = roleStart ? new Date(roleStart) : new Date(0);
  const rEnd = roleEnd ? new Date(roleEnd) : new Date();

  const matching = projects.filter((p) => {
    if (p.entity !== companyName) return false;
    const pStart = p.startDate ? new Date(p.startDate) : new Date(0);
    const pEnd = p.endDate ? new Date(p.endDate) : new Date();
    // Check date overlap: project starts before role ends AND project ends after role starts
    return pStart <= rEnd && pEnd >= rStart;
  });

  if (!matching.length) return '';

  return options.fn(matching);
}

/**
 * Returns a formatted meta string like "4 projects · 16 skills" for a role.
 * Omits project count if zero, omits skills count if zero.
 */
export function roleMetaSummary(companyName, roleStart, roleEnd, projects, keywords) {
  const parts = [];

  if (projects && projects.length && companyName) {
    const rStart = roleStart ? new Date(roleStart) : new Date(0);
    const rEnd = roleEnd ? new Date(roleEnd) : new Date();
    const count = projects.filter((p) => {
      if (p.entity !== companyName) return false;
      const pStart = p.startDate ? new Date(p.startDate) : new Date(0);
      const pEnd = p.endDate ? new Date(p.endDate) : new Date();
      return pStart <= rEnd && pEnd >= rStart;
    }).length;
    if (count > 0) parts.push(count + (count === 1 ? ' project' : ' projects'));
  }

  if (keywords && keywords.length) {
    parts.push(keywords.length + (keywords.length === 1 ? ' skill' : ' skills'));
  }

  return parts.length ? ' · ' + parts.join(' · ') : '';
}

/**
 * Returns matching role anchors for a work-related project based on company/entity
 * and date overlap with resume work roles.
 */
export function positionsForProject(project, work) {
  if (!project || !Array.isArray(work) || !work.length || !project.entity) return [];

  const pStart = project.startDate ? new Date(project.startDate) : new Date(0);
  const pEnd = project.endDate ? new Date(project.endDate) : new Date();
  const matches = [];
  const groupedWork = work.reduce((acc, { location, description, name, url, ...rest }) => {
    const prev = acc[acc.length - 1];
    if (
      prev &&
      prev.name === name &&
      prev.location === location &&
      prev.description === description &&
      prev.url === url
    ) {
      prev.items.push(rest);
    } else {
      acc.push({ location, description, name, url, items: [rest] });
    }
    return acc;
  }, []);

  groupedWork.forEach((company) => {
    if (!company || company.name !== project.entity) return;
    if (!Array.isArray(company.items)) return;

    company.items.forEach((role, roleIndex) => {
      if (!role) return;

      const rStart = role.startDate ? new Date(role.startDate) : new Date(0);
      const rEnd = role.endDate ? new Date(role.endDate) : new Date();
      const overlaps = pStart <= rEnd && pEnd >= rStart;
      if (!overlaps) return;

      const roleName = role.position || 'Role';
      const companyName = company.name || 'Company';
      matches.push({
        id: 'role-' +
          slugify(companyName) +
          '-' +
          slugify(roleName) +
          '-' +
          roleIndex,
        label: roleName + ' (' + companyName + ')',
      });
    });
  });

  return matches;
}

/**
 * Returns a formatted meta string for project detail toggles, e.g.
 * " · 4 gallery items · 9 skills".
 */
export function projectMetaSummary(project) {
  if (!project) return '';

  const parts = [];
  const imageCount = Array.isArray(project.images) ? project.images.length : 0;
  const diagramCount = Array.isArray(project.diagrams) ? project.diagrams.length : 0;
  const galleryCount = imageCount + diagramCount;
  const skillCount = Array.isArray(project.keywords) ? project.keywords.length : 0;

  if (galleryCount > 0) {
    parts.push(galleryCount + (galleryCount === 1 ? ' gallery item' : ' gallery items'));
  }

  if (skillCount > 0) {
    parts.push(skillCount + (skillCount === 1 ? ' skill' : ' skills'));
  }

  return parts.length ? ' · ' + parts.join(' · ') : '';
}
