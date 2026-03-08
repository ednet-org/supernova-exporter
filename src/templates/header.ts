/** Generate the standard file header for generated Dart files. */
export function generateHeader(options: {
  brand?: string;
  theme?: string;
  version?: string;
}): string {
  const parts = [
    '// GENERATED CODE - DO NOT MODIFY BY HAND',
    '// Source: Supernova EDNet Design System',
  ];
  if (options.version) {
    parts.push(`// Version: ${options.version}`);
  }
  if (options.brand) {
    parts.push(`// Brand: ${options.brand}`);
  }
  if (options.theme) {
    parts.push(`// Theme: ${options.theme}`);
  }
  parts.push(`// Generated: ${new Date().toISOString()}`);
  parts.push('');
  return parts.join('\n');
}
