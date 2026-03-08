import { OutputFile, createOutputFile } from '../helpers/file-builder';
import { ExporterConfig } from '../config/config-types';
import { BrandResolver } from '../helpers/brand-resolver';
import { generateHeader } from '../templates/header';

/**
 * Generates a complete Flutter ThemeData builder function from
 * Supernova design tokens.
 *
 * Produces `theme_data.g.dart` with a `buildXxxTheme(Brightness)` function
 * that returns a fully configured Material 3 ThemeData. The generated code
 * references the generated token constant classes (ColorsGen, TypographyGen,
 * ElevationGen, BordersGen, SpacingGen, OpacityGen) rather than inlining
 * resolved values.
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

    // Detect which token types exist to conditionally import
    const tokenTypes = new Set(tokens.map((t: any) => t.tokenType));
    const hasColors = tokenTypes.has('Color');
    const hasTypography = tokenTypes.has('Typography');
    const hasShadows = tokenTypes.has('Shadow');
    const hasDimensions = tokenTypes.has('Dimension');
    const hasElevation = hasShadows || hasDimensions;
    const hasBorders = tokenTypes.has('Border') || tokenTypes.has('BorderWidth') ||
      tokenTypes.has('BorderRadius') || hasDimensions;
    const hasSpacing = tokenTypes.has('Space') || hasDimensions;

    const imports: string[] = ["import 'package:flutter/material.dart';"];
    if (hasColors) imports.push("import 'colors.g.dart';");
    if (hasTypography) imports.push("import 'typography.g.dart';");
    if (hasElevation) imports.push("import 'elevation.g.dart';");
    if (hasBorders) imports.push("import 'borders.g.dart';");
    if (hasSpacing) imports.push("import 'spacing.g.dart';");
    if (hasDimensions) imports.push("import 'dimensions.g.dart';");

    const content = `${header}
${imports.join('\n')}

/// Builds complete [ThemeData] from Supernova design tokens.
///
/// Generates a Material 3 theme with all component themes configured
/// from the ${brandName} brand tokens.
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
    primary: ${prefix}ColorsGen.primary,
    onPrimary: ${prefix}ColorsGen.onPrimary,
    primaryContainer: ${prefix}ColorsGen.primaryContainer,
    onPrimaryContainer: ${prefix}ColorsGen.onPrimaryContainer,
    secondary: ${prefix}ColorsGen.secondary,
    onSecondary: ${prefix}ColorsGen.onSecondary,
    secondaryContainer: ${prefix}ColorsGen.secondaryContainer,
    onSecondaryContainer: ${prefix}ColorsGen.onSecondaryContainer,
    tertiary: ${prefix}ColorsGen.tertiary,
    onTertiary: ${prefix}ColorsGen.onTertiary,
    error: ${prefix}ColorsGen.error,
    onError: ${prefix}ColorsGen.onError,
    surface: ${prefix}ColorsGen.surface,
    onSurface: ${prefix}ColorsGen.onSurface,
    surfaceContainerHighest: ${prefix}ColorsGen.surfaceVariant,
    onSurfaceVariant: ${prefix}ColorsGen.onSurfaceVariant,
    outline: ${prefix}ColorsGen.outline,
    outlineVariant: ${prefix}ColorsGen.outlineVariant,
  );

  final textTheme = TextTheme(
    displayLarge: ${prefix}TypographyGen.displayLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    displayMedium: ${prefix}TypographyGen.displayMedium.copyWith(
      color: colorScheme.onSurface,
    ),
    displaySmall: ${prefix}TypographyGen.displaySmall.copyWith(
      color: colorScheme.onSurface,
    ),
    headlineLarge: ${prefix}TypographyGen.headlineLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    headlineMedium: ${prefix}TypographyGen.headlineMedium.copyWith(
      color: colorScheme.onSurface,
    ),
    headlineSmall: ${prefix}TypographyGen.headlineSmall.copyWith(
      color: colorScheme.onSurface,
    ),
    titleLarge: ${prefix}TypographyGen.titleLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    titleMedium: ${prefix}TypographyGen.titleMedium.copyWith(
      color: colorScheme.onSurface,
    ),
    titleSmall: ${prefix}TypographyGen.titleSmall.copyWith(
      color: colorScheme.onSurface,
    ),
    bodyLarge: ${prefix}TypographyGen.bodyLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    bodyMedium: ${prefix}TypographyGen.bodyMedium.copyWith(
      color: colorScheme.onSurface,
    ),
    bodySmall: ${prefix}TypographyGen.bodySmall.copyWith(
      color: colorScheme.onSurfaceVariant,
    ),
    labelLarge: ${prefix}TypographyGen.labelLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    labelMedium: ${prefix}TypographyGen.labelMedium.copyWith(
      color: colorScheme.onSurfaceVariant,
    ),
    labelSmall: ${prefix}TypographyGen.labelSmall.copyWith(
      color: colorScheme.onSurfaceVariant,
    ),
  );

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
      elevation: ${prefix}ElevationGen.level0,
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
      elevation: ${prefix}ElevationGen.level0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
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
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
        borderSide: BorderSide(
          color: colorScheme.outline.withValues(alpha: 0.3),
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
        borderSide: BorderSide(color: colorScheme.primary, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
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
          borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
        ),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // Elevated Button
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: colorScheme.surface,
        foregroundColor: colorScheme.primary,
        elevation: ${prefix}ElevationGen.level1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
        ),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // Outlined Button
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: colorScheme.primary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
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
          borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
        ),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // FAB
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: colorScheme.primaryContainer,
      foregroundColor: colorScheme.onPrimaryContainer,
      elevation: ${prefix}ElevationGen.level2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusLg),
      ),
    ),

    // Dialog
    dialogTheme: DialogThemeData(
      backgroundColor: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${prefix}ElevationGen.level3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusXl),
      ),
    ),

    // Bottom Sheet
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${prefix}ElevationGen.level1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(${prefix}BordersGen.radiusXl),
        ),
      ),
    ),

    // Navigation Bar
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: colorScheme.surface,
      indicatorColor: colorScheme.secondaryContainer,
      elevation: ${prefix}ElevationGen.level0,
      surfaceTintColor: Colors.transparent,
    ),

    // Navigation Rail
    navigationRailTheme: NavigationRailThemeData(
      backgroundColor: colorScheme.surface,
      indicatorColor: colorScheme.secondaryContainer,
      elevation: ${prefix}ElevationGen.level0,
    ),

    // Chip
    chipTheme: ChipThemeData(
      backgroundColor: colorScheme.surfaceContainerHighest,
      selectedColor: colorScheme.secondaryContainer,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusSm),
      ),
    ),

    // Divider
    dividerTheme: DividerThemeData(
      color: colorScheme.outlineVariant,
      thickness: ${prefix}BordersGen.widthThin,
    ),

    // SnackBar
    snackBarTheme: SnackBarThemeData(
      backgroundColor: isDark ? colorScheme.surfaceContainerHighest : colorScheme.inverseSurface,
      actionTextColor: colorScheme.inversePrimary,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
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
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusSm),
      ),
      textStyle: textTheme.bodySmall?.copyWith(
        color: colorScheme.onInverseSurface,
      ),
    ),

    // ListTile
    listTileTheme: ListTileThemeData(
      contentPadding: EdgeInsets.symmetric(horizontal: ${prefix}SpacingGen.lg),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
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
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusXs),
      ),
    ),

    // PopupMenu
    popupMenuTheme: PopupMenuThemeData(
      color: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${prefix}ElevationGen.level2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${prefix}BordersGen.radiusMd),
      ),
    ),
  );
}
`;

    return [createOutputFile(outputDir, 'theme_data.g.dart', content)];
  }
}
