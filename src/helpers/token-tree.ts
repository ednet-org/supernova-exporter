/**
 * Token-related types for the exporter.
 * These are simplified versions of Supernova SDK types
 * that we use in our generators.
 */

/** Supernova token type enum values we support. */
export type SupportedTokenType =
  | 'color'
  | 'typography'
  | 'dimension'
  | 'size'
  | 'space'
  | 'opacity'
  | 'fontSize'
  | 'lineHeight'
  | 'letterSpacing'
  | 'borderWidth'
  | 'radius'
  | 'duration'
  | 'shadow'
  | 'border'
  | 'gradient'
  | 'fontFamily'
  | 'fontWeight';

/** Token categories that map to specific Dart output files. */
export interface TokenCategory {
  name: string;
  dartClassName: string;
  dartFileName: string;
  tokenTypes: SupportedTokenType[];
}

/** Define the token categories and their mappings. */
export const TOKEN_CATEGORIES: TokenCategory[] = [
  {
    name: 'colors',
    dartClassName: 'Colors',
    dartFileName: 'colors.g.dart',
    tokenTypes: ['color'],
  },
  {
    name: 'spacing',
    dartClassName: 'Spacing',
    dartFileName: 'spacing.g.dart',
    tokenTypes: ['space', 'size', 'dimension'],
  },
  {
    name: 'typography',
    dartClassName: 'Typography',
    dartFileName: 'typography.g.dart',
    tokenTypes: ['typography', 'fontSize'],
  },
  {
    name: 'elevation',
    dartClassName: 'Elevation',
    dartFileName: 'elevation.g.dart',
    tokenTypes: ['shadow'],
  },
  {
    name: 'borders',
    dartClassName: 'Borders',
    dartFileName: 'borders.g.dart',
    tokenTypes: ['border', 'borderWidth', 'radius'],
  },
  {
    name: 'animation',
    dartClassName: 'Animation',
    dartFileName: 'animation.g.dart',
    tokenTypes: ['duration'],
  },
  {
    name: 'opacity',
    dartClassName: 'Opacity',
    dartFileName: 'opacity.g.dart',
    tokenTypes: ['opacity'],
  },
  {
    name: 'gradients',
    dartClassName: 'Gradients',
    dartFileName: 'gradients.g.dart',
    tokenTypes: ['gradient'],
  },
  {
    name: 'fontWeights',
    dartClassName: 'FontWeights',
    dartFileName: 'font_weights.g.dart',
    tokenTypes: ['fontWeight'],
  },
];

/** Filter tokens by type. */
export function filterTokensByType(
  tokens: any[],
  types: SupportedTokenType[],
): any[] {
  return tokens.filter((t) => types.includes(t.tokenType));
}

/** Get the category for a given token type. */
export function getCategoryForTokenType(
  tokenType: string,
): TokenCategory | undefined {
  return TOKEN_CATEGORIES.find((c) =>
    c.tokenTypes.includes(tokenType as SupportedTokenType),
  );
}
