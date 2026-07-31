/**
 * Groups consecutive work entries sharing the same company into nested objects.
 * Each group has { name, location, url, description, items: [...roles] }.
 *
 * @param {Array} workArray
 * @param {object} options - Handlebars block options
 * @returns {string}
 */
export function nestedWork(workArray, options) {
  const groups = workArray.reduce((acc, { location, description, name, url, ...rest }) => {
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

  return options.fn(groups);
}
