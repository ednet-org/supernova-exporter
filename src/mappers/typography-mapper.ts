import { formatDouble } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/**
 * Typography composite token value from Supernova SDK.
 * SDK type: TypographyTokenValue = {
 *   fontFamily: FontFamilyTokenValue,   // { text, referencedTokenId }
 *   fontWeight: FontWeightTokenValue,   // { text, referencedTokenId }
 *   fontSize: FontSizeTokenValue,       // { unit, measure, referencedTokenId }
 *   textDecoration: TextDecorationTokenValue,
 *   textCase: TextCaseTokenValue,
 *   letterSpacing: LetterSpacingTokenValue,
 *   lineHeight: LineHeightTokenValue | null,
 *   paragraphIndent: ParagraphSpacingTokenValue,
 *   paragraphSpacing: ParagraphSpacingTokenValue,
 *   referencedTokenId
 * }
 */
export interface TypographyTokenValue {
  fontFamily: { text: string; referencedTokenId?: string | null };
  fontWeight: { text: string; referencedTokenId?: string | null };
  fontSize: { unit: string; measure: number; referencedTokenId?: string | null };
  lineHeight?: { unit: string; measure: number; referencedTokenId?: string | null } | null;
  letterSpacing?: { unit: string; measure: number; referencedTokenId?: string | null };
  textDecoration?: { value: string; referencedTokenId?: string | null };
  textCase?: { value: string; referencedTokenId?: string | null };
  paragraphSpacing?: { unit: string; measure: number; referencedTokenId?: string | null };
  referencedTokenId?: string | null;
}

/** Mapped typography field for Dart output. */
export interface MappedTypographyField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map font weight text to Flutter FontWeight. */
function mapFontWeight(weightText: string): string {
  const weightMap: Record<string, string> = {
    thin: 'FontWeight.w100',
    hairline: 'FontWeight.w100',
    extralight: 'FontWeight.w200',
    ultralight: 'FontWeight.w200',
    light: 'FontWeight.w300',
    regular: 'FontWeight.w400',
    normal: 'FontWeight.w400',
    medium: 'FontWeight.w500',
    semibold: 'FontWeight.w600',
    demibold: 'FontWeight.w600',
    bold: 'FontWeight.w700',
    extrabold: 'FontWeight.w800',
    ultrabold: 'FontWeight.w800',
    black: 'FontWeight.w900',
    heavy: 'FontWeight.w900',
  };
  // Try direct match
  const lower = weightText.toLowerCase().replace(/[\s-_]/g, '');
  if (weightMap[lower]) return weightMap[lower];
  // Try numeric weight (e.g. "400", "700")
  const num = parseInt(weightText, 10);
  if (!isNaN(num) && num >= 100 && num <= 900) {
    return `FontWeight.w${Math.round(num / 100) * 100}`;
  }
  return 'FontWeight.w400';
}

/** Map text decoration value to Dart TextDecoration. */
function mapTextDecoration(decoration?: { value: string }): string | undefined {
  if (!decoration || !decoration.value || decoration.value === 'none' || decoration.value === 'None') return undefined;
  const decorMap: Record<string, string> = {
    underline: 'TextDecoration.underline',
    'line-through': 'TextDecoration.lineThrough',
    linethrough: 'TextDecoration.lineThrough',
    overline: 'TextDecoration.overline',
  };
  return decorMap[decoration.value.toLowerCase()];
}

/** Map a Supernova typography token to a Dart TextStyle constant. */
export function mapTypographyToken(token: {
  name: string;
  description?: string;
  value: TypographyTokenValue;
}): MappedTypographyField {
  const v = token.value;
  const parts: string[] = [
    'inherit: false',
    `fontSize: ${formatDouble(v.fontSize.measure)}`,
    `fontWeight: ${mapFontWeight(v.fontWeight.text)}`,
  ];

  if (v.fontFamily?.text) {
    parts.push(`fontFamily: '${v.fontFamily.text}'`);
  }

  if (v.lineHeight && v.lineHeight.measure > 0) {
    const ratio = v.lineHeight.unit === 'Pixels'
      ? v.lineHeight.measure / v.fontSize.measure
      : v.lineHeight.measure / 100;
    parts.push(`height: ${formatDouble(ratio)}`);
  }

  if (v.letterSpacing && v.letterSpacing.measure !== 0) {
    parts.push(`letterSpacing: ${formatDouble(v.letterSpacing.measure)}`);
  }

  const decoration = mapTextDecoration(v.textDecoration as any);
  if (decoration) {
    parts.push(`decoration: ${decoration}`);
  }

  parts.push('textBaseline: TextBaseline.alphabetic');
  parts.push('leadingDistribution: TextLeadingDistribution.even');

  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: `TextStyle(\n    ${parts.join(',\n    ')},\n  )`,
    docComment: token.description
      ? `${token.description} (${v.fontSize.measure}px)`
      : `${tokenNameToDartIdentifier(token.name)} text style (${v.fontSize.measure}px)`,
  };
}
