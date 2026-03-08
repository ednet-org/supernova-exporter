var _={outputPath:"lib/src/generated",packageName:"ednet_design_system",generateTokenFiles:!0,generateThemeData:!0,generateThemeExtension:!0,generateEdnetDsl:!1,classPrefix:"Ednet",includeDocComments:!0};function D(o){return{..._,...o}}function h(o,t,e){return{relativePath:o,fileName:t,content:e}}var R=[{name:"colors",dartClassName:"Colors",dartFileName:"colors.g.dart",tokenTypes:["color"]},{name:"spacing",dartClassName:"Spacing",dartFileName:"spacing.g.dart",tokenTypes:["space","size","dimension"]},{name:"typography",dartClassName:"Typography",dartFileName:"typography.g.dart",tokenTypes:["typography","fontSize"]},{name:"elevation",dartClassName:"Elevation",dartFileName:"elevation.g.dart",tokenTypes:["shadow"]},{name:"borders",dartClassName:"Borders",dartFileName:"borders.g.dart",tokenTypes:["border","borderWidth","radius"]},{name:"animation",dartClassName:"Animation",dartFileName:"animation.g.dart",tokenTypes:["duration"]},{name:"opacity",dartClassName:"Opacity",dartFileName:"opacity.g.dart",tokenTypes:["opacity"]},{name:"gradients",dartClassName:"Gradients",dartFileName:"gradients.g.dart",tokenTypes:["gradient"]},{name:"fontWeights",dartClassName:"FontWeights",dartFileName:"font_weights.g.dart",tokenTypes:["fontWeight"]}];function y(o,t){return o.filter(e=>t.includes(e.tokenType))}function f(o){let t=["// GENERATED CODE - DO NOT MODIFY BY HAND","// Source: Supernova EDNet Design System"];return o.version&&t.push(`// Version: ${o.version}`),o.brand&&t.push(`// Brand: ${o.brand}`),o.theme&&t.push(`// Theme: ${o.theme}`),t.push(`// Generated: ${new Date().toISOString()}`),t.push(""),t.join(`
`)}function G(o){let t=[];for(let e of o.imports)t.push(`import '${e}';`);o.imports.length>0&&t.push(""),o.docComment&&t.push(`/// ${o.docComment}`),t.push(`abstract final class ${o.className} {`);for(let e of o.sections){e.comment&&(t.push(""),t.push("  // ========================================================================="),t.push(`  // ${e.comment}`),t.push("  // =========================================================================")),t.push("");for(let n of e.fields)n.docComment&&t.push(`  /// ${n.docComment}`),t.push(`  static const ${n.type} ${n.name} = ${n.value};`)}return t.push("}"),t.push(""),t.join(`
`)}function j(o,t,e,n){let r=Math.round(n*255),i=Math.round(o),a=Math.round(t),s=Math.round(e);return`Color(0x${b(r)}${b(i)}${b(a)}${b(s)})`}function C(o,t,e,n){return j(Math.round(o*255),Math.round(t*255),Math.round(e*255),n)}function b(o){return Math.max(0,Math.min(255,o)).toString(16).padStart(2,"0").toUpperCase()}function l(o){return Number.isInteger(o)?`${o}.0`:o.toFixed(2).replace(/(\.\d*?)0+$/,"$1").replace(/\.$/,".0")}function T(o){return o.replace(/[-_/\s]+(.)?/g,(t,e)=>e?e.toUpperCase():"").replace(/^(.)/,t=>t.toLowerCase())}function F(o){return o.replace(/([a-z0-9])([A-Z])/g,"$1_$2").replace(/[-/\s]+/g,"_").toLowerCase()}function N(o){return o.charAt(0).toUpperCase()+o.slice(1)}function c(o){let t=o.split("/");return t.length<=1?T(o):T(t[t.length-1])}function M(o){let{r:t,g:e,b:n,a:r}=o.value.color;return{name:c(o.name),dartValue:C(t,e,n,r),docComment:o.description||void 0}}function E(o){return{name:c(o.name),dartValue:l(o.value.measure),docComment:o.description?`${o.description} (${o.value.measure}${o.value.unit})`:`${o.value.measure}${o.value.unit}`}}function z(o){return{thin:"FontWeight.w100",extralight:"FontWeight.w200",light:"FontWeight.w300",regular:"FontWeight.w400",medium:"FontWeight.w500",semibold:"FontWeight.w600",bold:"FontWeight.w700",extrabold:"FontWeight.w800",black:"FontWeight.w900"}[o.toLowerCase()]??"FontWeight.w400"}function q(o){return!o||o==="none"?void 0:{underline:"TextDecoration.underline","line-through":"TextDecoration.lineThrough",overline:"TextDecoration.overline"}[o.toLowerCase()]}function V(o){let t=o.value,e=["inherit: false",`fontSize: ${l(t.fontSize.measure)}`,`fontWeight: ${z(t.font.subfamily)}`];if(t.lineHeight&&t.lineHeight.measure>0){let r=t.lineHeight.unit==="px"?t.lineHeight.measure/t.fontSize.measure:t.lineHeight.measure/100;e.push(`height: ${l(r)}`)}t.letterSpacing&&t.letterSpacing.measure!==0&&e.push(`letterSpacing: ${l(t.letterSpacing.measure)}`);let n=q(t.textDecoration);return n&&e.push(`decoration: ${n}`),e.push("textBaseline: TextBaseline.alphabetic"),e.push("leadingDistribution: TextLeadingDistribution.even"),{name:c(o.name),dartValue:`TextStyle(
    ${e.join(`,
    `)},
  )`,docComment:o.description?`${o.description} (${t.fontSize.measure}px)`:`${c(o.name)} text style (${t.fontSize.measure}px)`}}function W(o){let t=Array.isArray(o.value)?o.value:[o.value];if(t.length===0||t.length===1&&t[0].radius.measure===0&&t[0].x.measure===0&&t[0].y.measure===0)return{name:c(o.name),dartValue:"0.0",docComment:o.description??"No elevation."};let e=t[0];return{name:c(o.name),dartValue:l(e.radius.measure),docComment:o.description??`Elevation level (${e.radius.measure}px blur).`}}function w(o){return{name:c(o.name),dartValue:l(o.value.measure),docComment:o.description??`Border width (${o.value.measure}${o.value.unit}).`}}function O(o){return{name:c(o.name),dartValue:l(o.value.measure),docComment:o.description??`Border radius (${o.value.measure}${o.value.unit}).`}}function P(o){return{name:c(o.name),dartValue:`Duration(milliseconds: ${Math.round(o.value.duration)})`,docComment:o.description??`Animation duration (${o.value.duration}ms).`}}function I(o){return{name:c(o.name),dartValue:l(o.value.measure),docComment:o.description??`Opacity value (${(o.value.measure*100).toFixed(0)}%).`}}function A(o){let t=o.value,e=t.stops.map(a=>C(a.color.r,a.color.g,a.color.b,a.color.a)).join(", "),n=t.stops.map(a=>l(a.position)).join(", "),r=t.gradientType==="radial"?"RadialGradient":"LinearGradient",i=t.gradientType==="radial"?`center: Alignment(${l(t.from.x*2-1)}, ${l(t.from.y*2-1)})`:`begin: Alignment(${l(t.from.x*2-1)}, ${l(t.from.y*2-1)}),
    end: Alignment(${l(t.to.x*2-1)}, ${l(t.to.y*2-1)})`;return{name:c(o.name),dartValue:`${r}(
    ${i},
    colors: [${e}],
    stops: [${n}],
  )`,docComment:o.description??`${t.gradientType} gradient with ${t.stops.length} stops.`}}var S=class{constructor(t,e){this.config=t;this.brandResolver=e}generate(t){let e=[];for(let n of R){let r=y(t,n.tokenTypes);if(r.length===0)continue;let i=this.generateCategoryFile(n,r);i&&e.push(i)}return e}generateCategoryFile(t,e){let n=`${this.config.classPrefix}${t.dartClassName}Gen`,r=f({brand:this.brandResolver.effectiveBrandName}),i,a;switch(t.name){case"colors":a=["package:flutter/material.dart"],i=this.buildColorSections(e);break;case"spacing":a=[],i=this.buildSpacingSections(e);break;case"typography":a=["package:flutter/material.dart"],i=this.buildTypographySections(e);break;case"elevation":a=[],i=this.buildElevationSections(e);break;case"borders":a=[],i=this.buildBorderSections(e);break;case"animation":a=[],i=this.buildAnimationSections(e);break;case"opacity":a=[],i=this.buildOpacitySections(e);break;case"gradients":a=["package:flutter/material.dart"],i=this.buildGradientSections(e);break;case"fontWeights":a=["package:flutter/material.dart"],i=this.buildFontWeightSections(e);break;default:return null}let s=G({className:n,docComment:`${this.config.classPrefix} design system ${t.name} tokens (generated).`,imports:a,sections:i}),p=r+s,g=`${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`;return h(g,t.dartFileName,p)}buildColorSections(t){let e=new Map;for(let n of t){let r=M(n),i=n.name.split("/"),a=i.length>1?i[0]:"General";e.has(a)||e.set(a,[]),e.get(a).push({name:r.name,type:"Color",value:r.dartValue,docComment:r.docComment})}return Array.from(e.entries()).map(([n,r])=>({comment:n.charAt(0).toUpperCase()+n.slice(1),fields:r}))}buildSpacingSections(t){return[{comment:"Spacing Scale",fields:t.map(n=>{let r=E(n);return{name:r.name,type:"double",value:r.dartValue,docComment:r.docComment}})}]}buildTypographySections(t){return[{comment:"Type Scale",fields:t.map(n=>{let r=V(n);return{name:r.name,type:"TextStyle",value:r.dartValue,docComment:r.docComment}})}]}buildElevationSections(t){return[{comment:"Elevation Levels",fields:t.map(n=>{let r=W(n);return{name:r.name,type:"double",value:r.dartValue,docComment:r.docComment}})}]}buildBorderSections(t){let e=[],n=[];for(let i of t)if(i.tokenType==="radius"){let a=O(i);e.push({name:a.name,type:"double",value:a.dartValue,docComment:a.docComment})}else{let a=w(i);n.push({name:a.name,type:"double",value:a.dartValue,docComment:a.docComment})}let r=[];return e.length>0&&r.push({comment:"Border Radius",fields:e}),n.length>0&&r.push({comment:"Border Width",fields:n}),r}buildAnimationSections(t){return[{comment:"Animation Durations",fields:t.map(n=>{let r=P(n);return{name:r.name,type:"Duration",value:r.dartValue,docComment:r.docComment}})}]}buildOpacitySections(t){return[{comment:"Opacity Levels",fields:t.map(n=>{let r=I(n);return{name:r.name,type:"double",value:r.dartValue,docComment:r.docComment}})}]}buildGradientSections(t){return[{comment:"Gradients",fields:t.map(n=>{let r=A(n);return{name:r.name,type:"Gradient",value:r.dartValue,docComment:r.docComment}})}]}buildFontWeightSections(t){return[{comment:"Font Weights",fields:t.map(n=>{let r=n.value.measure??400,i=n.name.split("/").pop()??n.name;return{name:i.charAt(0).toLowerCase()+i.slice(1),type:"FontWeight",value:`FontWeight.w${Math.round(r)}`,docComment:n.description??`Font weight ${r}.`}})}]}};var $=class{constructor(t,e){this.config=t;this.brandResolver=e}generate(t){let e=this.config.classPrefix,n=this.brandResolver.effectiveBrandName,r=`${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`,a=`${f({brand:n})}
import 'package:flutter/material.dart';
import 'colors.g.dart';
import 'typography.g.dart';
import 'elevation.g.dart';
import 'borders.g.dart';
import 'spacing.g.dart';
import 'opacity.g.dart';

/// Builds complete [ThemeData] from Supernova design tokens.
///
/// Generates a Material 3 theme with all component themes configured
/// from the ${n} brand tokens.
///
/// \`\`\`dart
/// final theme = build${e}Theme(Brightness.light);
/// MaterialApp(theme: theme);
/// \`\`\`
ThemeData build${e}Theme(
  Brightness brightness, {
  ColorScheme? baseScheme,
}) {
  final isDark = brightness == Brightness.dark;

  final colorScheme = baseScheme ?? ColorScheme(
    brightness: brightness,
    primary: ${e}ColorsGen.primary,
    onPrimary: ${e}ColorsGen.onPrimary,
    primaryContainer: ${e}ColorsGen.primaryContainer,
    onPrimaryContainer: ${e}ColorsGen.onPrimaryContainer,
    secondary: ${e}ColorsGen.secondary,
    onSecondary: ${e}ColorsGen.onSecondary,
    secondaryContainer: ${e}ColorsGen.secondaryContainer,
    onSecondaryContainer: ${e}ColorsGen.onSecondaryContainer,
    tertiary: ${e}ColorsGen.tertiary,
    onTertiary: ${e}ColorsGen.onTertiary,
    error: ${e}ColorsGen.error,
    onError: ${e}ColorsGen.onError,
    surface: ${e}ColorsGen.surface,
    onSurface: ${e}ColorsGen.onSurface,
    surfaceContainerHighest: ${e}ColorsGen.surfaceVariant,
    onSurfaceVariant: ${e}ColorsGen.onSurfaceVariant,
    outline: ${e}ColorsGen.outline,
    outlineVariant: ${e}ColorsGen.outlineVariant,
  );

  final textTheme = TextTheme(
    displayLarge: ${e}TypographyGen.displayLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    displayMedium: ${e}TypographyGen.displayMedium.copyWith(
      color: colorScheme.onSurface,
    ),
    displaySmall: ${e}TypographyGen.displaySmall.copyWith(
      color: colorScheme.onSurface,
    ),
    headlineLarge: ${e}TypographyGen.headlineLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    headlineMedium: ${e}TypographyGen.headlineMedium.copyWith(
      color: colorScheme.onSurface,
    ),
    headlineSmall: ${e}TypographyGen.headlineSmall.copyWith(
      color: colorScheme.onSurface,
    ),
    titleLarge: ${e}TypographyGen.titleLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    titleMedium: ${e}TypographyGen.titleMedium.copyWith(
      color: colorScheme.onSurface,
    ),
    titleSmall: ${e}TypographyGen.titleSmall.copyWith(
      color: colorScheme.onSurface,
    ),
    bodyLarge: ${e}TypographyGen.bodyLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    bodyMedium: ${e}TypographyGen.bodyMedium.copyWith(
      color: colorScheme.onSurface,
    ),
    bodySmall: ${e}TypographyGen.bodySmall.copyWith(
      color: colorScheme.onSurfaceVariant,
    ),
    labelLarge: ${e}TypographyGen.labelLarge.copyWith(
      color: colorScheme.onSurface,
    ),
    labelMedium: ${e}TypographyGen.labelMedium.copyWith(
      color: colorScheme.onSurfaceVariant,
    ),
    labelSmall: ${e}TypographyGen.labelSmall.copyWith(
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
      elevation: ${e}ElevationGen.level0,
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
      elevation: ${e}ElevationGen.level0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
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
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
        borderSide: BorderSide(
          color: colorScheme.outline.withValues(alpha: 0.3),
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
        borderSide: BorderSide(color: colorScheme.primary, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
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
          borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
        ),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // Elevated Button
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: colorScheme.surface,
        foregroundColor: colorScheme.primary,
        elevation: ${e}ElevationGen.level1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
        ),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // Outlined Button
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: colorScheme.primary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
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
          borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
        ),
        textStyle: textTheme.labelLarge,
      ),
    ),

    // FAB
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: colorScheme.primaryContainer,
      foregroundColor: colorScheme.onPrimaryContainer,
      elevation: ${e}ElevationGen.level2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusLg),
      ),
    ),

    // Dialog
    dialogTheme: DialogThemeData(
      backgroundColor: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${e}ElevationGen.level3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusXl),
      ),
    ),

    // Bottom Sheet
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${e}ElevationGen.level1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(${e}BordersGen.radiusXl),
        ),
      ),
    ),

    // Navigation Bar
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: colorScheme.surface,
      indicatorColor: colorScheme.secondaryContainer,
      elevation: ${e}ElevationGen.level0,
      surfaceTintColor: Colors.transparent,
    ),

    // Navigation Rail
    navigationRailTheme: NavigationRailThemeData(
      backgroundColor: colorScheme.surface,
      indicatorColor: colorScheme.secondaryContainer,
      elevation: ${e}ElevationGen.level0,
    ),

    // Chip
    chipTheme: ChipThemeData(
      backgroundColor: colorScheme.surfaceContainerHighest,
      selectedColor: colorScheme.secondaryContainer,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusSm),
      ),
    ),

    // Divider
    dividerTheme: DividerThemeData(
      color: colorScheme.outlineVariant,
      thickness: ${e}BordersGen.widthThin,
    ),

    // SnackBar
    snackBarTheme: SnackBarThemeData(
      backgroundColor: isDark ? colorScheme.surfaceContainerHighest : colorScheme.inverseSurface,
      actionTextColor: colorScheme.inversePrimary,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
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
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusSm),
      ),
      textStyle: textTheme.bodySmall?.copyWith(
        color: colorScheme.onInverseSurface,
      ),
    ),

    // ListTile
    listTileTheme: ListTileThemeData(
      contentPadding: EdgeInsets.symmetric(horizontal: ${e}SpacingGen.lg),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
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
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusXs),
      ),
    ),

    // PopupMenu
    popupMenuTheme: PopupMenuThemeData(
      color: colorScheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: ${e}ElevationGen.level2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(${e}BordersGen.radiusMd),
      ),
    ),
  );
}
`;return[h(r,"theme_data.g.dart",a)]}};var v=class{constructor(t,e){this.config=t;this.brandResolver=e}generate(t){if(!this.config.generateThemeExtension)return[];let e=this.buildWrappers(t),r=[f({brand:this.brandResolver.effectiveBrandName}),"import 'dart:ui';","","import 'package:flutter/material.dart';",""];for(let s of e)r.push(this.generateWrapperClass(s)),r.push("");r.push(this.generateThemeExtensionClass(e));let i=r.join(`
`),a=`${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`;return[h(a,"ednet_tokens.g.dart",i)]}buildWrappers(t){let e=[],n=this.config.classPrefix,r=y(t,["space","size","dimension"]);r.length>0&&e.push({className:`${n}SpacingTokensGen`,categoryFieldName:"spacing",lerpType:"double",fields:r.map(s=>({name:T(s.name.split("/").pop()??s.name),type:"double",defaultValue:`${s.value?.measure??s.value??0}.0`,docComment:s.description}))});let i=y(t,["radius","borderWidth"]);i.length>0&&e.push({className:`${n}BorderTokensGen`,categoryFieldName:"borders",lerpType:"double",fields:i.map(s=>({name:T(s.name.split("/").pop()??s.name),type:"double",defaultValue:`${s.value?.measure??s.value??0}.0`,docComment:s.description}))});let a=y(t,["color"]);return a.length>0&&e.push({className:`${n}ColorTokensGen`,categoryFieldName:"colors",lerpType:"color",fields:this.buildColorFields(a)}),e}buildColorFields(t){return t.slice(0,50).map(e=>{let{r:n,g:r,b:i,a}=e.value?.color??{r:0,g:0,b:0,a:1},s=Math.round(a*255),p=Math.round(n*255),g=Math.round(r*255),d=Math.round(i*255),u=m=>Math.max(0,Math.min(255,m)).toString(16).padStart(2,"0").toUpperCase();return{name:T(e.name.split("/").pop()??e.name),type:"Color",defaultValue:`Color(0x${u(s)}${u(p)}${u(g)}${u(d)})`,docComment:e.description}})}generateWrapperClass(t){let e=[],{className:n,fields:r,lerpType:i}=t;e.push("/// Generated token wrapper with lerp support."),e.push("@immutable"),e.push(`class ${n} {`),e.push(`  const ${n}({`);for(let a of r)e.push(`    this.${a.name} = const ${a.defaultValue},`);e.push("  });"),e.push("");for(let a of r)a.docComment&&e.push(`  /// ${a.docComment}`),e.push(`  final ${a.type} ${a.name};`),e.push("");e.push(`  ${n} copyWith({`);for(let a of r)e.push(`    ${a.type}? ${a.name},`);e.push("  }) {"),e.push(`    return ${n}(`);for(let a of r)e.push(`      ${a.name}: ${a.name} ?? this.${a.name},`);e.push("    );"),e.push("  }"),e.push(""),e.push("  // ignore: prefer_constructors_over_static_methods"),e.push(`  static ${n} lerp(`),e.push(`    ${n} a,`),e.push(`    ${n} b,`),e.push("    double t,"),e.push("  ) {"),e.push(`    return ${n}(`);for(let a of r)i==="color"?e.push(`      ${a.name}: Color.lerp(a.${a.name}, b.${a.name}, t) ?? a.${a.name},`):e.push(`      ${a.name}: lerpDouble(a.${a.name}, b.${a.name}, t) ?? a.${a.name},`);e.push("    );"),e.push("  }"),e.push(""),e.push("  @override"),e.push("  bool operator ==(Object other) =>"),e.push("      identical(this, other) ||"),e.push(`      other is ${n} &&`),e.push("          runtimeType == other.runtimeType &&");for(let a=0;a<r.length;a++){let s=a<r.length-1?" &&":";";e.push(`          ${r[a].name} == other.${r[a].name}${s}`)}if(e.push(""),e.push("  @override"),r.length<=20){e.push("  int get hashCode => Object.hash(");for(let a=0;a<r.length;a++){let s=(a<r.length-1,",");e.push(`    ${r[a].name}${s}`)}e.push("  );")}else{e.push("  int get hashCode => Object.hashAll([");for(let a of r)e.push(`    ${a.name},`);e.push("  ]);")}return e.push("}"),e.join(`
`)}generateThemeExtensionClass(t){let n=`${this.config.classPrefix}TokensGen`,r=[];r.push("/// Generated ThemeExtension composing all token wrappers."),r.push("///"),r.push("/// Access via:"),r.push("/// ```dart"),r.push(`/// final tokens = Theme.of(context).extension<${n}>()!;`),r.push("/// final spacing = tokens.spacing;"),r.push("/// ```"),r.push(`class ${n} extends ThemeExtension<${n}> {`),r.push(`  const ${n}({`);for(let i of t)r.push(`    required this.${i.categoryFieldName},`);r.push("  });"),r.push(""),r.push("  /// Default light theme tokens."),r.push(`  factory ${n}.light() => const ${n}(`);for(let i of t)r.push(`    ${i.categoryFieldName}: ${i.className}(),`);r.push("  );"),r.push(""),r.push("  /// Default dark theme tokens."),r.push(`  factory ${n}.dark() => const ${n}(`);for(let i of t)r.push(`    ${i.categoryFieldName}: ${i.className}(),`);r.push("  );"),r.push("");for(let i of t)r.push(`  /// ${N(i.categoryFieldName)} tokens.`),r.push(`  final ${i.className} ${i.categoryFieldName};`),r.push("");r.push("  @override"),r.push(`  ${n} copyWith({`);for(let i of t)r.push(`    ${i.className}? ${i.categoryFieldName},`);r.push("  }) {"),r.push(`    return ${n}(`);for(let i of t)r.push(`      ${i.categoryFieldName}: ${i.categoryFieldName} ?? this.${i.categoryFieldName},`);r.push("    );"),r.push("  }"),r.push(""),r.push("  @override"),r.push(`  ${n} lerp(${n}? other, double t) {`),r.push(`    if (other is! ${n}) return this;`),r.push(`    return ${n}(`);for(let i of t)r.push(`      ${i.categoryFieldName}: ${i.className}.lerp(${i.categoryFieldName}, other.${i.categoryFieldName}, t),`);return r.push("    );"),r.push("  }"),r.push("}"),r.push(""),r.join(`
`)}};var x=class{constructor(t,e){this.config=t;this.brandResolver=e}generate(t){let e=this.config.classPrefix,n=this.brandResolver.effectiveBrandName,r=`${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`,a=`${f({brand:n})}
import 'package:flutter/material.dart';
import 'theme_data.g.dart';

/// Brand-specific theme for ${n}.
///
/// Wraps the base [build${e}Theme] with brand identity overrides.
/// Use this as the entry point for brand-themed apps:
///
/// \`\`\`dart
/// MaterialApp(
///   theme: build${e}BrandTheme(Brightness.light),
///   darkTheme: build${e}BrandTheme(Brightness.dark),
/// );
/// \`\`\`
ThemeData build${e}BrandTheme(
  Brightness brightness, {
  ColorScheme? baseScheme,
}) {
  return build${e}Theme(brightness, baseScheme: baseScheme);
}
`;return[h(r,"brand_theme.g.dart",a)]}};var B=class{constructor(t){this.config=t}generate(t,e){let n=this.parseComponents(t);if(n.length===0)return[];let r=this.inferDomainName(e),i=this.inferModelName(e),a=this.buildYaml(r,i,n),s=["# GENERATED CODE - DO NOT MODIFY BY HAND","# Source: Supernova EDNet Design System",`# Generated: ${new Date().toISOString()}`,"#","# EDNet DSL v2 domain model generated from Supernova component metadata.","# Components with ednet:* custom properties are mapped to domain concepts.",""].join(`
`),p=`${F(r)}_${F(i)}.ednet.yaml`;return[h(this.config.outputPath,p,s+a)]}parseComponents(t){let e=[];for(let n of t){let r=n.propertyValues??n.properties??{};if(!this.getEdnetProperty(r,"entity"))continue;let a={name:n.name,entry:this.getEdnetProperty(r,"entry")==="true"||this.getEdnetProperty(r,"entry")===!0,description:n.description,attributes:[],children:[],neighbors:[]};for(let[s,p]of Object.entries(r)){if(typeof s!="string")continue;let g=s.match(/^ednet:attribute\.(\w+)$/);if(g){let m=g[1],H=String(p),L=this.getEdnetProperty(r,`attribute.${m}.required`)==="true"||this.getEdnetProperty(r,`attribute.${m}.required`)===!0;a.attributes.push({name:m,type:H,required:L,description:this.getEdnetProperty(r,`attribute.${m}.description`)})}let d=s.match(/^ednet:child\.(\w+)$/);d&&a.children.push({concept:d[1],relation:String(p)});let u=s.match(/^ednet:neighbor\.(\w+)$/);u&&a.neighbors.push({concept:u[1],relation:String(p)})}e.push(a)}return e}getEdnetProperty(t,e){return t[`ednet:${e}`]}inferDomainName(t){if(t&&t.length>0){let e=t.find(n=>n.isRoot);return e?e.name:t[0].name}return"GeneratedDomain"}inferModelName(t){if(t&&t.length>0){let e=t.find(n=>!n.isRoot);if(e)return e.name}return"DefaultModel"}buildYaml(t,e,n){let r=[];r.push(`domain: ${t}`),r.push(`  model: ${e}`),r.push("    concepts:");for(let i of n){if(r.push(`      - concept: ${i.name}`),i.entry&&r.push("        entry: true"),i.description&&r.push(`        description: "${i.description.replace(/"/g,'\\"')}"`),i.attributes.length>0){r.push("        attributes:");for(let a of i.attributes)r.push(`          - name: ${a.name}`),r.push(`            type: ${a.type}`),a.required&&r.push("            required: true"),a.description&&r.push(`            description: "${a.description.replace(/"/g,'\\"')}"`)}if(i.children.length>0){r.push("        children:");for(let a of i.children)r.push(`          - concept: ${a.concept}`),r.push(`            relation: ${a.relation}`)}if(i.neighbors.length>0){r.push("        neighbors:");for(let a of i.neighbors)r.push(`          - concept: ${a.concept}`),r.push(`            relation: ${a.relation}`)}}return r.join(`
`)+`
`}};var k=class{constructor(t,e){this.brandId=t;this.themeId=e}get effectiveBrandName(){return this.brandId??"ednet_ds"}get effectiveThemeName(){return this.themeId??"default"}getOutputSubdirectory(){return this.effectiveBrandName}};Pulsar.export(async(o,t)=>{let e=Pulsar.exportConfig(),n=D(e),r={designSystemId:t.dsId,versionId:t.versionId},i=new k(t.brandId,t.themeId),a=[],s=await o.tokens.getTokens(r),p=await o.tokens.getTokenGroups(r);if(t.themeId){let u=(await o.tokens.getTokenThemes(r)).find(m=>m.id===t.themeId);u&&(s=await o.tokens.computeTokensByApplyingThemes(s,[u]))}if(n.generateTokenFiles){let d=new S(n,i);a.push(...d.generate(s))}if(n.generateThemeData){let d=new $(n,i);a.push(...d.generate(s))}if(n.generateThemeExtension){let d=new v(n,i);a.push(...d.generate(s))}if(n.generateEdnetDsl){let d=await o.components.getComponents(r),u=await o.components.getComponentGroups(r),m=new B(n);a.push(...m.generate(d,u))}let g=new x(n,i);return a.push(...g.generate(s)),a.map(d=>FileHelper.createTextFile({relativePath:d.relativePath,fileName:d.fileName,content:d.content}))});
//# sourceMappingURL=index.js.map
