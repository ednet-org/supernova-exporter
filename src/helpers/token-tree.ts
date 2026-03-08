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
  /**
   * Optional name patterns for routing Dimension tokens.
   * When Dimension is in tokenTypes, only Dimension tokens whose name
   * (lowercased) starts with one of these prefixes are included.
   * Non-Dimension types are always included regardless.
   */
  dimensionNamePatterns?: string[];
}

/**
 * Name-based routing patterns for Dimension tokens.
 * A Dimension token's name (from Supernova) is matched against these
 * prefixes (case-insensitive) to determine which category it belongs to.
 */
const DIMENSION_ROUTING: Record<string, string[]> = {
  spacing: ['spacing', 'space', 'gap', 'padding', 'margin', 'inset'],
  borders: ['border', 'radius', 'corner', 'stroke'],
  elevation: ['elevation', 'shadow', 'depth', 'z-index'],
  animation: ['duration', 'delay', 'timing', 'transition', 'animation'],
  opacity: ['opacity', 'alpha', 'transparency'],
};

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
    tokenTypes: ['Space', 'Dimension'],
    dimensionNamePatterns: DIMENSION_ROUTING.spacing,
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
    tokenTypes: ['Shadow', 'Dimension'],
    dimensionNamePatterns: DIMENSION_ROUTING.elevation,
  },
  {
    name: 'borders',
    dartClassName: 'Borders',
    dartFileName: 'borders.g.dart',
    tokenTypes: ['Border', 'BorderWidth', 'BorderRadius', 'Dimension'],
    dimensionNamePatterns: DIMENSION_ROUTING.borders,
  },
  {
    name: 'animation',
    dartClassName: 'Animation',
    dartFileName: 'animation.g.dart',
    tokenTypes: ['Duration', 'Dimension'],
    dimensionNamePatterns: DIMENSION_ROUTING.animation,
  },
  {
    name: 'opacity',
    dartClassName: 'Opacity',
    dartFileName: 'opacity.g.dart',
    tokenTypes: ['Opacity', 'Dimension'],
    dimensionNamePatterns: DIMENSION_ROUTING.opacity,
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
  {
    name: 'dimensions',
    dartClassName: 'Dimensions',
    dartFileName: 'dimensions.g.dart',
    tokenTypes: ['Dimension', 'Size'],
    // No dimensionNamePatterns = catch-all for unrouted Dimension tokens
  },
];

/**
 * Filter tokens by type, with group-path-based routing for Dimension tokens.
 *
 * Tokens are expected to have `_groupPath` injected by index.ts (e.g.,
 * "spacing/scale" or "borders/radius"). When `dimensionNamePatterns` is
 * provided, only Dimension tokens whose group path or name matches one
 * of the patterns are included. When absent (catch-all dimensions), only
 * Dimension tokens NOT matched by any routed category are included.
 */
export function filterTokensByType(
  tokens: any[],
  types: SupportedTokenType[],
  dimensionNamePatterns?: string[],
): any[] {
  return tokens.filter((t) => {
    const tokenType = t.tokenType as SupportedTokenType;
    if (!types.includes(tokenType)) return false;

    // For Dimension tokens, apply group-path + name routing
    if (tokenType === 'Dimension') {
      const groupPath = ((t._groupPath ?? '') as string).toLowerCase();
      const nameLower = (t.name ?? '').toLowerCase();

      if (dimensionNamePatterns) {
        // Category with explicit patterns: include if group path or name matches
        return dimensionNamePatterns.some((prefix) =>
          groupPath.includes(prefix) || nameLower.startsWith(prefix),
        );
      }

      // Catch-all dimensions: exclude tokens that would be routed elsewhere
      const allRoutedPatterns = Object.values(DIMENSION_ROUTING).flat();
      return !allRoutedPatterns.some((prefix) =>
        groupPath.includes(prefix) || nameLower.startsWith(prefix),
      );
    }

    return true;
  });
}

/** Get the category for a given token type. */
export function getCategoryForTokenType(
  tokenType: string,
): TokenCategory | undefined {
  return TOKEN_CATEGORIES.find((c) =>
    c.tokenTypes.includes(tokenType as SupportedTokenType),
  );
}
