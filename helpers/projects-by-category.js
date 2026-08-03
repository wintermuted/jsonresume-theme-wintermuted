export function projectsByCategory(projects, category) {
  if (!Array.isArray(projects) || !category) {
    return [];
  }

  var normalizedCategory = String(category).toLowerCase();

  return projects.filter(function (project) {
    var explicitCategory = null;
    if (project && project.projectCategory) {
      explicitCategory = String(project.projectCategory).toLowerCase();
    } else if (project && project.category) {
      explicitCategory = String(project.category).toLowerCase();
    }

    if (explicitCategory) {
      return explicitCategory === normalizedCategory;
    }

    // Backward-compatible fallback for older project entries.
    var entity = project && project.entity ? String(project.entity).toLowerCase() : '';
    var inferredCategory = entity === 'personal' ? 'open-source' : 'work';
    return inferredCategory === normalizedCategory;
  });
}
