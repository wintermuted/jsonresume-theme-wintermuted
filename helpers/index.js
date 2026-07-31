import { formatMonthYear, formatYear } from './date-helpers.js';
import { nestedWork } from './nested-work.js';
import { slugify, linkProjects } from './link-projects.js';
import { projectsForRole, roleMetaSummary, positionsForProject, projectMetaSummary } from './projects-for-role.js';
import { projectsByCategory } from './projects-by-category.js';

export default {
  MY: formatMonthYear,
  Y: formatYear,
  nestedWork,
  slugify,
  linkProjects,
  projectsForRole,
  roleMetaSummary,
  positionsForProject,
  projectMetaSummary,
  projectsByCategory,
};
