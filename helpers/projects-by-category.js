export function projectsByCategory(projects, category) {
  if (!Array.isArray(projects) || !category) {
    return [];
  }

  var normalizedCategory = String(category).toLowerCase();

  return projects.filter(function (project) {
    var explicitCategory = project && project.projectCategory
      ? String(project.projectCategory).toLowerCase()
      : null;

    if (explicitCategory) {
      return explicitCategory === normalizedCategory;
    }

    // Backward-compatible fallback for older project entries.
    var entity = project && project.entity ? String(project.entity).toLowerCase() : '';
    var inferredCategory = entity === 'personal' ? 'open-source' : 'work';
    return inferredCategory === normalizedCategory;
  });
}
