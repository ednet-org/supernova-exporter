/** Convert a Supernova token path to a Dart identifier (camelCase). */
export function tokenPathToDartName(path: string[]): string {
  const name = path[path.length - 1];
  return toCamelCase(name);
}

/** Convert category name to Dart class suffix. */
export function categoryToDartClassName(
  prefix: string,
  category: string,
): string {
  return `${prefix}${capitalize(category)}Gen`;
}

/** Convert string to camelCase. */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_/\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

/** Convert string to snake_case. */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-/\s]+/g, '_')
    .toLowerCase();
}

/** Capitalize first letter. */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Convert token group path like 'brand/primary' to a flat Dart identifier.
 * Uses the last segment by default; if a seen-set is provided, falls back
 * to the full path to avoid duplicates. */
export function tokenNameToDartIdentifier(name: string): string {
  const parts = name.split('/');
  if (parts.length <= 1) return toCamelCase(name);
  // Use the last segment as the identifier
  return toCamelCase(parts[parts.length - 1]);
}

/** Convert full token path to a unique Dart identifier using all segments.
 * 'color/light/primary' -> 'lightPrimary'
 * 'color/dark/primary' -> 'darkPrimary'
 * Skips the first segment if it matches the category (e.g. 'color'). */
export function tokenPathToUniqueDartIdentifier(
  name: string,
  categoryName?: string,
): string {
  let parts = name.split('/');
  // Skip first part if it matches category
  if (categoryName && parts.length > 1 && parts[0].toLowerCase() === categoryName.toLowerCase()) {
    parts = parts.slice(1);
  }
  // Join all remaining parts into camelCase
  return toCamelCase(parts.join('/'));
}
