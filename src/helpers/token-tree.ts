/**
 * Token-related types for the exporter.
 * These are simplified versions of Supernova SDK types
 * that we use in our generators.
 */

/**
 * Supernova SDK TokenType enum values (PascalCase strings).
 * Must match the runtime values from @supernovaio/sdk-exporters TokenType enum.
 */
export type SupportedTokenType =
  | 'Color'
  | 'Typography'
  | 'Dimension'
  | 'Size'
  | 'Space'
  | 'Opacity'
  | 'FontSize'
  | 'LineHeight'
  | 'LetterSpacing'
  | 'BorderWidth'
  | 'BorderRadius'
  | 'Duration'
  | 'Shadow'
  | 'Border'
  | 'Gradient'
  | 'FontFamily'
  | 'FontWeight';

/** Token categories that map to specific Dart output files. */
export interface TokenCategory {
  name: string;
  dartClassName: string;
  dartFileName: string;
  tokenTypes: SupportedTokenType[];
}

/** Define the token categories and their mappings to SDK TokenType enum values. */
export const TOKEN_CATEGORIES: TokenCategory[] = [
  {
    name: 'colors',
    dartClassName: 'Colors',
    dartFileName: 'colors.g.dart',
    tokenTypes: ['Color'],
  },
  {
    name: 'spacing',
    dartClassName: 'Spacing',
    dartFileName: 'spacing.g.dart',
    tokenTypes: ['Space'],
  },
  {
    name: 'typography',
    dartClassName: 'Typography',
    dartFileName: 'typography.g.dart',
    tokenTypes: ['Typography', 'FontSize'],
  },
  {
    name: 'elevation',
    dartClassName: 'Elevation',
    dartFileName: 'elevation.g.dart',
    tokenTypes: ['Shadow'],
  },
  {
    name: 'borders',
    dartClassName: 'Borders',
    dartFileName: 'borders.g.dart',
    tokenTypes: ['Border', 'BorderWidth', 'BorderRadius'],
  },
  {
    name: 'animation',
    dartClassName: 'Animation',
    dartFileName: 'animation.g.dart',
    tokenTypes: ['Duration'],
  },
  {
    name: 'opacity',
    dartClassName: 'Opacity',
    dartFileName: 'opacity.g.dart',
    tokenTypes: ['Opacity'],
  },
  {
    name: 'gradients',
    dartClassName: 'Gradients',
    dartFileName: 'gradients.g.dart',
    tokenTypes: ['Gradient'],
  },
  {
    name: 'fontWeights',
    dartClassName: 'FontWeights',
    dartFileName: 'font_weights.g.dart',
    tokenTypes: ['FontWeight'],
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
