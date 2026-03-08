import { OutputFile, createOutputFile } from '../helpers/file-builder';
import { ExporterConfig } from '../config/config-types';
import { BrandResolver } from '../helpers/brand-resolver';
import { generateHeader } from '../templates/header';
import { filterTokensByType } from '../helpers/token-tree';
import { toCamelCase } from '../helpers/naming';

/**
 * Generates a complete Flutter ThemeData builder function from
 * Supernova design tokens.
 *
 * Dynamically resolves token names to Material theme fields.
 * Uses generated constant class references where tokens exist,
 * falls back to inline Color/double values where they don't.
 */
export class ThemeDataGenerator {
  constructor(
    private readonly config: ExporterConfig,
    private readonly brandResolver: BrandResolver,
  ) {}

  /** Generate the ThemeData builder file. */
  generate(tokens: any[]): OutputFile[] {
    const prefix = this.config.classPrefix;
    const brandName = this.brandResolver.effectiveBrandName;
    const outputDir = `${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`;
    const header = generateHeader({ brand: brandName });

    // Build token lookups by name
    const colorTokens = filterTokensByType(tokens, ['Color']);
    const typographyTokens = filterTokensByType(tokens, ['Typography']);
    const shadowTokens = filterTokensByType(tokens, ['Shadow']);
    const dimensionTokens = filterTokensByType(tokens, ['Dimension']);

    const colorNames = new Set(colorTokens.map((t: any) =>
      toCamelCase(t.name.split('/').pop() ?? t.name),
    ));
    const typographyNames = new Set(typographyTokens.map((t: any) =>
      toCamelCase(t.name.split('/').pop() ?? t.name),
    ));

    // Build dimension token lookup (name -> value)
    const dimLookup = new Map<string, number>();
    for (const t of dimensionTokens) {
      const name = toCamelCase(t.name.split('/').pop() ?? t.name);
      dimLookup.set(name, t.value?.measure ?? 0);
    }

    // Helper: resolve color reference or inline fallback
    const colorRef = (name: string, fallback: string) =>
      colorNames.has(name) ? `${prefix}ColorsGen.${name}` : fallback;

    // Helper: resolve dimension for border radius
    const radiusVal = (name: string, fallback: number) =>
      dimLookup.has(name) ? `${prefix}DimensionsGen.${name}` : `${fallback}.0`;

    // Helper: resolve elevation
    const elevVal = (name: string, fallback: number) => {
      if (shadowTokens.some((t: any) => toCamelCase(t.name.split('/').pop() ?? t.name) === name)) {
        return `${prefix}ElevationGen.${name}`;
      }
      if (dimLookup.has(name)) return `${prefix}DimensionsGen.${name}`;
      return `${fallback}.0`;
    };

    // Helper: resolve spacing
    const spacingVal = (name: string, fallback: number) =>
      dimLookup.has(name) ? `${prefix}DimensionsGen.${name}` : `${fallback}.0`;

    // Build imports based on what's actually used
    const imports: string[] = ["import 'package:flutter/material.dart';"];
    if (colorNames.size > 0) imports.push("import 'colors.g.dart';");
    if (typographyNames.size > 0) imports.push("import 'typography.g.dart';");
    if (shadowTokens.length > 0) imports.push("import 'elevation.g.dart';");
    if (dimLookup.size > 0) imports.push("import 'dimensions.g.dart';");

    // Build TextTheme entries dynamically
    const textThemeEntries = [
      'displayLarge', 'displayMedium', 'displaySmall',
      'headlineLarge', 'headlineMedium', 'headlineSmall',
      'titleLarge', 'titleMedium', 'titleSmall',
      'bodyLarge', 'bodyMedium', 'bodySmall',
      'labelLarge', 'labelMedium', 'labelSmall',
    ];

    const textThemeLines = textThemeEntries
      .filter((name) => typographyNames.has(name))
      .map((name) => {
        const colorField = name.includes('Small') || name.includes('label')
          ? 'colorScheme.onSurfaceVariant'
          : 'colorScheme.onSurface';
        return `    ${name}: ${prefix}TypographyGen.${name}.copyWith(\n      color: ${colorField},\n    ),`;
      });

    const content = `${header}
${imports.join('\n')}

/// Builds complete [ThemeData] from Supernova design tokens.
///
/// Dynamically maps token constants to Material 3 theme fields.
/// Falls back to sensible defaults when specific tokens are absent.
///
/// \`\`\`dart
/// final theme = build${prefix}Theme(Brightness.light);
/// MaterialApp(theme: theme);
/// \`\`\`
ThemeData build${prefix}Theme(
  Brightness brightness, {
  ColorScheme? baseScheme,
}) {
  final isDark = brightness == Brightness.dark;

  final colorScheme = baseScheme ?? ColorScheme(
    brightness: brightness,
    primary: ${colorRef('primary', "Color(0xFF0891B2)")},
    onPrimary: ${colorRef('onPrimary', "Color(0xFFFFFFFF)")},
    primaryContainer: ${colorRef('primaryContainer', "Color(0xFFD3E3FD)")},
    onPrimaryContainer: ${colorRef('onPrimaryContainer', "Color(0xFF001D36)")},
    secondary: ${colorRef('secondary', "Color(0xFF4B6B77)")},
    onSecondary: ${colorRef('onSecondary', "Color(0xFFFFFFFF)")},
    secondaryContainer: ${colorRef('secondaryContainer', "Color(0xFFE8EAED)")},
    onSecondaryContainer: ${colorRef('onSecondaryContainer', "Color(0xFF1D1D1D)")},
    tertiary: ${colorRef('tertiary', "Color(0xFF9C6D3E)")},
    onTertiary: ${colorRef('onTertiary', "Color(0xFFFFFFFF)")},
    error: ${colorRef('error', "Color(0xFFD32F2F)")},
    onError: ${colorRef('onError', "Color(0xFFFFFFFF)")},
    surface: ${colorRef('surface', "Color(0xFFF6FAFE)")},
    onSurface: ${colorRef('onSurface', "Color(0xFF202124)")},
    surfaceContainerHighest: ${colorRef('surfaceVariant', "Color(0xFFF1F3F4)")},
    onSurfaceVariant: ${colorRef('onSurfaceVariant', "Color(0xFF5F6368)")},
    outline: ${colorRef('outline', "Color(0xFFDADCE0)")},
    outlineVariant: ${colorRef('outlineVariant', "Color(0xFFE8EAED)")},
  );

${textThemeLines.length > 0 ? `  final textTheme = TextTheme(
${textThemeLines.join('\n')}
  );` : '  final textTheme = ThemeData.light().textTheme;'}

  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: colorScheme,
    textTheme: textTheme,
    scaffoldBackgroundColor: colorScheme.surface,

    // AppBar
    appBarTheme: AppBarTheme(
      backgroundColor: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${elevVal('level0', 0)},
      scrolledUnderElevation: 0.5,
      centerTitle: false,
      titleTextStyle: textTheme.titleLarge?.copyWith(
        fontWeight: FontWeight.w600,
        color: colorScheme.onSurface,
      ),
      iconTheme: IconThemeData(color: colorScheme.onSurface),
    ),

    // Card
    cardTheme: CardThemeData(
      elevation: ${elevVal('level0', 0)},
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
        side: BorderSide(
          color: colorScheme.outline.withValues(alpha: isDark ? 0.3 : 0.2),
        ),
      ),
      color: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
    ),

    // Input Decoration
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: colorScheme.surfaceContainerHighest,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
        borderSide: BorderSide(
          color: colorScheme.outline.withValues(alpha: 0.3),
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
        borderSide: BorderSide(color: colorScheme.primary, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
        borderSide: BorderSide(color: colorScheme.error),
      ),
      labelStyle: textTheme.bodyMedium?.copyWith(
        color: colorScheme.onSurfaceVariant,
      ),
      hintStyle: textTheme.bodyMedium?.copyWith(
        color: colorScheme.onSurfaceVariant.withValues(alpha: 0.7),
      ),
    ),

    // Filled Button
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
        ),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // Elevated Button
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: colorScheme.surface,
        foregroundColor: colorScheme.primary,
        elevation: ${elevVal('level1', 1)},
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
        ),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // Outlined Button
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: colorScheme.primary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
        ),
        side: BorderSide(color: colorScheme.outline),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // Text Button
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: colorScheme.primary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
        ),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // FAB
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: colorScheme.primaryContainer,
      foregroundColor: colorScheme.onPrimaryContainer,
      elevation: ${elevVal('level2', 3)},
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${radiusVal('lg', 16)}),
      ),
    ),

    // Dialog
    dialogTheme: DialogThemeData(
      backgroundColor: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${elevVal('level3', 6)},
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${radiusVal('xl', 24)}),
      ),
    ),

    // Bottom Sheet
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${elevVal('level1', 1)},
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(${radiusVal('xl', 24)}),
        ),
      ),
    ),

    // Navigation Bar
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: colorScheme.surface,
      indicatorColor: colorScheme.secondaryContainer,
      elevation: ${elevVal('level0', 0)},
      surfaceTintColor: Colors.transparent,
    ),

    // Navigation Rail
    navigationRailTheme: NavigationRailThemeData(
      backgroundColor: colorScheme.surface,
      indicatorColor: colorScheme.secondaryContainer,
      elevation: ${elevVal('level0', 0)},
    ),

    // Chip
    chipTheme: ChipThemeData(
      backgroundColor: colorScheme.surfaceContainerHighest,
      selectedColor: colorScheme.secondaryContainer,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${radiusVal('sm', 8)}),
      ),
    ),

    // Divider
    dividerTheme: DividerThemeData(
      color: colorScheme.outlineVariant,
      thickness: ${dimLookup.has('thin') ? `${prefix}DimensionsGen.thin` : '0.5'},
    ),

    // SnackBar
    snackBarTheme: SnackBarThemeData(
      backgroundColor: isDark ? colorScheme.surfaceContainerHighest : colorScheme.inverseSurface,
      actionTextColor: colorScheme.inversePrimary,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
      ),
      behavior: SnackBarBehavior.floating,
    ),

    // Switch
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return colorScheme.onPrimary;
        }
        return colorScheme.outline;
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return colorScheme.primary;
        }
        return colorScheme.surfaceContainerHighest;
      }),
    ),

    // TabBar
    tabBarTheme: TabBarThemeData(
      labelColor: colorScheme.primary,
      unselectedLabelColor: colorScheme.onSurfaceVariant,
      indicatorColor: colorScheme.primary,
    ),

    // Tooltip
    tooltipTheme: TooltipThemeData(
      decoration: BoxDecoration(
        color: colorScheme.inverseSurface,
        borderRadius: BorderRadius.circular(${radiusVal('sm', 8)}),
      ),
      textStyle: textTheme.bodySmall?.copyWith(
        color: colorScheme.onInverseSurface,
      ),
    ),

    // ListTile
    listTileTheme: ListTileThemeData(
      contentPadding: EdgeInsets.symmetric(horizontal: ${spacingVal('lg', 16)}),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
      ),
    ),

    // ProgressIndicator
    progressIndicatorTheme: ProgressIndicatorThemeData(
      color: colorScheme.primary,
      linearTrackColor: colorScheme.surfaceContainerHighest,
    ),

    // Checkbox
    checkboxTheme: CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return colorScheme.primary;
        }
        return Colors.transparent;
      }),
      checkColor: WidgetStatePropertyAll(colorScheme.onPrimary),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${radiusVal('xs', 4)}),
      ),
    ),

    // PopupMenu
    popupMenuTheme: PopupMenuThemeData(
      color: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${elevVal('level2', 3)},
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${radiusVal('md', 12)}),
      ),
    ),
  );
}
`;

    return [createOutputFile(outputDir, 'theme_data.g.dart', content)];
  }
}
