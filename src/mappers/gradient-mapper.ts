import { floatColorToDartHex, formatDouble } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/**
 * Gradient token value from Supernova SDK.
 * SDK type: GradientTokenValue[] (array of layers) where each:
 * {
 *   to: { x, y }, from: { x, y }, type: GradientType,
 *   aspectRatio: number, stops: GradientStopValue[], referencedTokenId
 * }
 * GradientStopValue = { position: number, color: ColorTokenValue }
 * ColorTokenValue = { color: { r, g, b }, opacity: { measure } }
 */
export interface GradientStop {
  position: number; // 0-1
  color: {
    color: { r: number; g: number; b: number };
    opacity: { measure: number };
  };
}

export interface GradientTokenValue {
  type: string; // 'Linear', 'Radial', 'Angular'
  from: { x: number; y: number };
  to: { x: number; y: number };
  aspectRatio: number;
  stops: GradientStop[];
  referencedTokenId?: string | null;
}

/** Mapped gradient field for Dart output. */
export interface MappedGradientField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Extract r/g/b/a from SDK ColorTokenValue. */
function colorToDartHex(c: GradientStop['color']): string {
  const r = (c.color?.r ?? 0) / 255;
  const g = (c.color?.g ?? 0) / 255;
  const b = (c.color?.b ?? 0) / 255;
  const a = c.opacity?.measure ?? 1;
  return floatColorToDartHex(r, g, b, a);
}

/** Map a Supernova gradient token to a Dart Gradient constant. */
export function mapGradientToken(token: {
  name: string;
  description?: string;
  value: GradientTokenValue | GradientTokenValue[];
}): MappedGradientField {
  // Gradient value is always an array of layers; use first layer
  const layers = Array.isArray(token.value) ? token.value : [token.value];
  const v = layers[0];

  if (!v || !v.stops || v.stops.length === 0) {
    return {
      name: tokenNameToDartIdentifier(token.name),
      dartValue: 'LinearGradient(colors: [Color(0x00000000), Color(0x00000000)])',
      docComment: token.description ?? 'Empty gradient.',
    };
  }

  const colors = v.stops.map((s) => colorToDartHex(s.color)).join(', ');
  const stops = v.stops.map((s) => formatDouble(s.position)).join(', ');

  const isRadial = v.type?.toLowerCase() === 'radial';
  const gradientType = isRadial ? 'RadialGradient' : 'LinearGradient';
  const beginEnd = isRadial
    ? `center: Alignment(${formatDouble(v.from.x * 2 - 1)}, ${formatDouble(v.from.y * 2 - 1)})`
    : `begin: Alignment(${formatDouble(v.from.x * 2 - 1)}, ${formatDouble(v.from.y * 2 - 1)}),\n    end: Alignment(${formatDouble(v.to.x * 2 - 1)}, ${formatDouble(v.to.y * 2 - 1)})`;

  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: `${gradientType}(\n    ${beginEnd},\n    colors: [${colors}],\n    stops: [${stops}],\n  )`,
    docComment: token.description ?? `${v.type ?? 'linear'} gradient with ${v.stops.length} stops.`,
  };
}
