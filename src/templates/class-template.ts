/**
 * Build an `abstract final class` with static const fields.
 * Matches the existing EdnetColors/EdnetSpacing pattern.
 */
export function buildAbstractFinalClass(options: {
  className: string;
  docComment?: string;
  imports: string[];
  sections: ClassSection[];
}): string {
  const lines: string[] = [];

  // Imports
  for (const imp of options.imports) {
    lines.push(`import '${imp}';`);
  }
  if (options.imports.length > 0) lines.push('');

  // Doc comment
  if (options.docComment) {
    lines.push(`/// ${options.docComment}`);
  }
  lines.push(`abstract final class ${options.className} {`);

  for (const section of options.sections) {
    if (section.comment) {
      lines.push('');
      lines.push('  // =========================================================================');
      lines.push(`  // ${section.comment}`);
      lines.push('  // =========================================================================');
    }
    lines.push('');
    for (const field of section.fields) {
      if (field.docComment) {
        lines.push(`  /// ${field.docComment}`);
      }
      lines.push(`  static const ${field.type} ${field.name} = ${field.value};`);
    }
  }

  lines.push('}');
  lines.push('');
  return lines.join('\n');
}

export interface ClassSection {
  comment?: string;
  fields: ClassField[];
}

export interface ClassField {
  name: string;
  type: string;
  value: string;
  docComment?: string;
}
