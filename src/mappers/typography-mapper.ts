import { formatDouble } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/** Typography composite token value from Supernova SDK. */
export interface TypographyTokenValue {
  font: {
    family: string;
    subfamily: string;
  };
  fontSize: { measure: number; unit: string };
  lineHeight?: { measure: number; unit: string };
  letterSpacing?: { measure: number; unit: string };
  textDecoration?: string;
  textCase?: string;
  referencedTokenId?: string;
}

/** Mapped typography field for Dart output. */
export interface MappedTypographyField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map font weight string to Flutter FontWeight. */
function mapFontWeight(subfamily: string): string {
  const weightMap: Record<string, string> = {
    thin: 'FontWeight.w100',
    extralight: 'FontWeight.w200',
    light: 'FontWeight.w300',
    regular: 'FontWeight.w400',
    medium: 'FontWeight.w500',
    semibold: 'FontWeight.w600',
    bold: 'FontWeight.w700',
    extrabold: 'FontWeight.w800',
    black: 'FontWeight.w900',
  };
  return weightMap[subfamily.toLowerCase()] ?? 'FontWeight.w400';
}

/** Map text decoration string to Dart TextDecoration. */
function mapTextDecoration(decoration?: string): string | undefined {
  if (!decoration || decoration === 'none') return undefined;
  const decorMap: Record<string, string> = {
    underline: 'TextDecoration.underline',
    'line-through': 'TextDecoration.lineThrough',
    overline: 'TextDecoration.overline',
  };
  return decorMap[decoration.toLowerCase()];
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
    `fontWeight: ${mapFontWeight(v.font.subfamily)}`,
  ];

  if (v.lineHeight && v.lineHeight.measure > 0) {
    const ratio = v.lineHeight.unit === 'px'
      ? v.lineHeight.measure / v.fontSize.measure
      : v.lineHeight.measure / 100;
    parts.push(`height: ${formatDouble(ratio)}`);
  }

  if (v.letterSpacing && v.letterSpacing.measure !== 0) {
    parts.push(`letterSpacing: ${formatDouble(v.letterSpacing.measure)}`);
  }

  const decoration = mapTextDecoration(v.textDecoration);
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
