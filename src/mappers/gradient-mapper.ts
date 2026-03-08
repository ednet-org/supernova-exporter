import { floatColorToDartHex, formatDouble } from '../helpers/dart-formatter';
import { tokenNameToDartIdentifier } from '../helpers/naming';

/** Gradient stop from Supernova SDK. */
export interface GradientStop {
  color: { r: number; g: number; b: number; a: number };
  position: number; // 0-1
}

/** Gradient token value from Supernova SDK. */
export interface GradientTokenValue {
  gradientType: 'linear' | 'radial' | 'angular';
  from: { x: number; y: number };
  to: { x: number; y: number };
  stops: GradientStop[];
  referencedTokenId?: string;
}

/** Mapped gradient field for Dart output. */
export interface MappedGradientField {
  name: string;
  dartValue: string;
  docComment?: string;
}

/** Map a Supernova gradient token to a Dart Gradient constant. */
export function mapGradientToken(token: {
  name: string;
  description?: string;
  value: GradientTokenValue;
}): MappedGradientField {
  const v = token.value;
  const colors = v.stops
    .map((s) => floatColorToDartHex(s.color.r, s.color.g, s.color.b, s.color.a))
    .join(', ');
  const stops = v.stops.map((s) => formatDouble(s.position)).join(', ');

  const gradientType = v.gradientType === 'radial' ? 'RadialGradient' : 'LinearGradient';
  const beginEnd =
    v.gradientType === 'radial'
      ? `center: Alignment(${formatDouble(v.from.x * 2 - 1)}, ${formatDouble(v.from.y * 2 - 1)})`
      : `begin: Alignment(${formatDouble(v.from.x * 2 - 1)}, ${formatDouble(v.from.y * 2 - 1)}),\n    end: Alignment(${formatDouble(v.to.x * 2 - 1)}, ${formatDouble(v.to.y * 2 - 1)})`;

  return {
    name: tokenNameToDartIdentifier(token.name),
    dartValue: `${gradientType}(\n    ${beginEnd},\n    colors: [${colors}],\n    stops: [${stops}],\n  )`,
    docComment: token.description ?? `${v.gradientType} gradient with ${v.stops.length} stops.`,
  };
}
