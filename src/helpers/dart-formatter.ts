/** Indent a block of Dart code. */
export function indent(code: string, level: number = 1): string {
  const spaces = '  '.repeat(level);
  return code
    .split('\n')
    .map((line) => (line.trim() ? `${spaces}${line}` : line))
    .join('\n');
}

/** Convert a Color value to Dart Color hex literal. */
export function colorToDartHex(r: number, g: number, b: number, a: number): string {
  // Supernova colors: r/g/b are 0-255, a is 0-1
  const alpha = Math.round(a * 255);
  const red = Math.round(r);
  const green = Math.round(g);
  const blue = Math.round(b);
  return `Color(0x${toHex(alpha)}${toHex(red)}${toHex(green)}${toHex(blue)})`;
}

/** Convert a float color component (0-1) to 0-255 Dart Color hex. */
export function floatColorToDartHex(r: number, g: number, b: number, a: number): string {
  return colorToDartHex(
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
    a,
  );
}

function toHex(value: number): string {
  return Math.max(0, Math.min(255, value))
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
}

/** Format a double value for Dart (no trailing zeros). */
export function formatDouble(value: number): string {
  if (Number.isInteger(value)) return `${value}.0`;
  // Limit to 2 decimal places
  const formatted = value.toFixed(2);
  // Remove trailing zeros after decimal
  return formatted.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '.0');
}

/** Format a Duration in milliseconds for Dart. */
export function formatDuration(ms: number): string {
  return `Duration(milliseconds: ${Math.round(ms)})`;
}
