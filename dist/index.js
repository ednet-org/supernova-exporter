var L={outputPath:"lib/src/generated",packageName:"ednet_design_system",generateTokenFiles:!0,generateThemeData:!0,generateThemeExtension:!0,generateEdnetDsl:!1,classPrefix:"Ednet",includeDocComments:!0};function B(t){return{...L,...t}}function m(t,r,e){return{relativePath:t,fileName:r,content:e}}var F=[{name:"colors",dartClassName:"Colors",dartFileName:"colors.g.dart",tokenTypes:["color"]},{name:"spacing",dartClassName:"Spacing",dartFileName:"spacing.g.dart",tokenTypes:["space","size","dimension"]},{name:"typography",dartClassName:"Typography",dartFileName:"typography.g.dart",tokenTypes:["typography","fontSize"]},{name:"elevation",dartClassName:"Elevation",dartFileName:"elevation.g.dart",tokenTypes:["shadow"]},{name:"borders",dartClassName:"Borders",dartFileName:"borders.g.dart",tokenTypes:["border","borderWidth","radius"]},{name:"animation",dartClassName:"Animation",dartFileName:"animation.g.dart",tokenTypes:["duration"]},{name:"opacity",dartClassName:"Opacity",dartFileName:"opacity.g.dart",tokenTypes:["opacity"]},{name:"gradients",dartClassName:"Gradients",dartFileName:"gradients.g.dart",tokenTypes:["gradient"]},{name:"fontWeights",dartClassName:"FontWeights",dartFileName:"font_weights.g.dart",tokenTypes:["fontWeight"]}];function D(t,r){return t.filter(e=>r.includes(e.tokenType))}function p(t){let r=["// GENERATED CODE - DO NOT MODIFY BY HAND","// Source: Supernova EDNet Design System"];return t.version&&r.push(`// Version: ${t.version}`),t.brand&&r.push(`// Brand: ${t.brand}`),t.theme&&r.push(`// Theme: ${t.theme}`),r.push(`// Generated: ${new Date().toISOString()}`),r.push(""),r.join(`
`)}function k(t){let r=[];for(let e of t.imports)r.push(`import '${e}';`);t.imports.length>0&&r.push(""),t.docComment&&r.push(`/// ${t.docComment}`),r.push(`abstract final class ${t.className} {`);for(let e of t.sections){e.comment&&(r.push(""),r.push("  // ========================================================================="),r.push(`  // ${e.comment}`),r.push("  // =========================================================================")),r.push("");for(let n of e.fields)n.docComment&&r.push(`  /// ${n.docComment}`),r.push(`  static const ${n.type} ${n.name} = ${n.value};`)}return r.push("}"),r.push(""),r.join(`
`)}function H(t,r,e,n){let o=Math.round(n*255),i=Math.round(t),a=Math.round(r),d=Math.round(e);return`Color(0x${f(o)}${f(i)}${f(a)}${f(d)})`}function y(t,r,e,n){return H(Math.round(t*255),Math.round(r*255),Math.round(e*255),n)}function f(t){return Math.max(0,Math.min(255,t)).toString(16).padStart(2,"0").toUpperCase()}function s(t){return Number.isInteger(t)?`${t}.0`:t.toFixed(2).replace(/(\.\d*?)0+$/,"$1").replace(/\.$/,".0")}function R(t){return t.replace(/[-_/\s]+(.)?/g,(r,e)=>e?e.toUpperCase():"").replace(/^(.)/,r=>r.toLowerCase())}function $(t){return t.replace(/([a-z0-9])([A-Z])/g,"$1_$2").replace(/[-/\s]+/g,"_").toLowerCase()}function l(t){let r=t.split("/");return r.length<=1?R(t):R(r[r.length-1])}function G(t){let{r,g:e,b:n,a:o}=t.value.color;return{name:l(t.name),dartValue:y(r,e,n,o),docComment:t.description||void 0}}function M(t){return{name:l(t.name),dartValue:s(t.value.measure),docComment:t.description?`${t.description} (${t.value.measure}${t.value.unit})`:`${t.value.measure}${t.value.unit}`}}function _(t){return{thin:"FontWeight.w100",extralight:"FontWeight.w200",light:"FontWeight.w300",regular:"FontWeight.w400",medium:"FontWeight.w500",semibold:"FontWeight.w600",bold:"FontWeight.w700",extrabold:"FontWeight.w800",black:"FontWeight.w900"}[t.toLowerCase()]??"FontWeight.w400"}function z(t){return!t||t==="none"?void 0:{underline:"TextDecoration.underline","line-through":"TextDecoration.lineThrough",overline:"TextDecoration.overline"}[t.toLowerCase()]}function V(t){let r=t.value,e=["inherit: false",`fontSize: ${s(r.fontSize.measure)}`,`fontWeight: ${_(r.font.subfamily)}`];if(r.lineHeight&&r.lineHeight.measure>0){let o=r.lineHeight.unit==="px"?r.lineHeight.measure/r.fontSize.measure:r.lineHeight.measure/100;e.push(`height: ${s(o)}`)}r.letterSpacing&&r.letterSpacing.measure!==0&&e.push(`letterSpacing: ${s(r.letterSpacing.measure)}`);let n=z(r.textDecoration);return n&&e.push(`decoration: ${n}`),e.push("textBaseline: TextBaseline.alphabetic"),e.push("leadingDistribution: TextLeadingDistribution.even"),{name:l(t.name),dartValue:`TextStyle(
    ${e.join(`,
    `)},
  )`,docComment:t.description?`${t.description} (${r.fontSize.measure}px)`:`${l(t.name)} text style (${r.fontSize.measure}px)`}}function N(t){let r=Array.isArray(t.value)?t.value:[t.value];if(r.length===0||r.length===1&&r[0].radius.measure===0&&r[0].x.measure===0&&r[0].y.measure===0)return{name:l(t.name),dartValue:"0.0",docComment:t.description??"No elevation."};let e=r[0];return{name:l(t.name),dartValue:s(e.radius.measure),docComment:t.description??`Elevation level (${e.radius.measure}px blur).`}}function E(t){return{name:l(t.name),dartValue:s(t.value.measure),docComment:t.description??`Border width (${t.value.measure}${t.value.unit}).`}}function W(t){return{name:l(t.name),dartValue:s(t.value.measure),docComment:t.description??`Border radius (${t.value.measure}${t.value.unit}).`}}function w(t){return{name:l(t.name),dartValue:`Duration(milliseconds: ${Math.round(t.value.duration)})`,docComment:t.description??`Animation duration (${t.value.duration}ms).`}}function O(t){return{name:l(t.name),dartValue:s(t.value.measure),docComment:t.description??`Opacity value (${(t.value.measure*100).toFixed(0)}%).`}}function P(t){let r=t.value,e=r.stops.map(a=>y(a.color.r,a.color.g,a.color.b,a.color.a)).join(", "),n=r.stops.map(a=>s(a.position)).join(", "),o=r.gradientType==="radial"?"RadialGradient":"LinearGradient",i=r.gradientType==="radial"?`center: Alignment(${s(r.from.x*2-1)}, ${s(r.from.y*2-1)})`:`begin: Alignment(${s(r.from.x*2-1)}, ${s(r.from.y*2-1)}),
    end: Alignment(${s(r.to.x*2-1)}, ${s(r.to.y*2-1)})`;return{name:l(t.name),dartValue:`${o}(
    ${i},
    colors: [${e}],
    stops: [${n}],
  )`,docComment:t.description??`${r.gradientType} gradient with ${r.stops.length} stops.`}}var T=class{constructor(r,e){this.config=r;this.brandResolver=e}generate(r){let e=[];for(let n of F){let o=D(r,n.tokenTypes);if(o.length===0)continue;let i=this.generateCategoryFile(n,o);i&&e.push(i)}return e}generateCategoryFile(r,e){let n=`${this.config.classPrefix}${r.dartClassName}Gen`,o=p({brand:this.brandResolver.effectiveBrandName}),i,a;switch(r.name){case"colors":a=["package:flutter/material.dart"],i=this.buildColorSections(e);break;case"spacing":a=[],i=this.buildSpacingSections(e);break;case"typography":a=["package:flutter/material.dart"],i=this.buildTypographySections(e);break;case"elevation":a=[],i=this.buildElevationSections(e);break;case"borders":a=[],i=this.buildBorderSections(e);break;case"animation":a=[],i=this.buildAnimationSections(e);break;case"opacity":a=[],i=this.buildOpacitySections(e);break;case"gradients":a=["package:flutter/material.dart"],i=this.buildGradientSections(e);break;case"fontWeights":a=["package:flutter/material.dart"],i=this.buildFontWeightSections(e);break;default:return null}let d=k({className:n,docComment:`${this.config.classPrefix} design system ${r.name} tokens (generated).`,imports:a,sections:i}),c=o+d,u=`${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`;return m(u,r.dartFileName,c)}buildColorSections(r){let e=new Map;for(let n of r){let o=G(n),i=n.name.split("/"),a=i.length>1?i[0]:"General";e.has(a)||e.set(a,[]),e.get(a).push({name:o.name,type:"Color",value:o.dartValue,docComment:o.docComment})}return Array.from(e.entries()).map(([n,o])=>({comment:n.charAt(0).toUpperCase()+n.slice(1),fields:o}))}buildSpacingSections(r){return[{comment:"Spacing Scale",fields:r.map(n=>{let o=M(n);return{name:o.name,type:"double",value:o.dartValue,docComment:o.docComment}})}]}buildTypographySections(r){return[{comment:"Type Scale",fields:r.map(n=>{let o=V(n);return{name:o.name,type:"TextStyle",value:o.dartValue,docComment:o.docComment}})}]}buildElevationSections(r){return[{comment:"Elevation Levels",fields:r.map(n=>{let o=N(n);return{name:o.name,type:"double",value:o.dartValue,docComment:o.docComment}})}]}buildBorderSections(r){let e=[],n=[];for(let i of r)if(i.tokenType==="radius"){let a=W(i);e.push({name:a.name,type:"double",value:a.dartValue,docComment:a.docComment})}else{let a=E(i);n.push({name:a.name,type:"double",value:a.dartValue,docComment:a.docComment})}let o=[];return e.length>0&&o.push({comment:"Border Radius",fields:e}),n.length>0&&o.push({comment:"Border Width",fields:n}),o}buildAnimationSections(r){return[{comment:"Animation Durations",fields:r.map(n=>{let o=w(n);return{name:o.name,type:"Duration",value:o.dartValue,docComment:o.docComment}})}]}buildOpacitySections(r){return[{comment:"Opacity Levels",fields:r.map(n=>{let o=O(n);return{name:o.name,type:"double",value:o.dartValue,docComment:o.docComment}})}]}buildGradientSections(r){return[{comment:"Gradients",fields:r.map(n=>{let o=P(n);return{name:o.name,type:"Gradient",value:o.dartValue,docComment:o.docComment}})}]}buildFontWeightSections(r){return[{comment:"Font Weights",fields:r.map(n=>{let o=n.value.measure??400,i=n.name.split("/").pop()??n.name;return{name:i.charAt(0).toLowerCase()+i.slice(1),type:"FontWeight",value:`FontWeight.w${Math.round(o)}`,docComment:n.description??`Font weight ${o}.`}})}]}};var b=class{constructor(r,e){this.config=r;this.brandResolver=e}generate(r){let e=this.config.classPrefix,n=this.brandResolver.effectiveBrandName,o=`${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`,a=`${p({brand:n})}
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
`;return[m(o,"theme_data.g.dart",a)]}};var C=class{constructor(r,e){this.config=r;this.brandResolver=e}generate(r){let e=this.config.classPrefix,n=this.brandResolver.effectiveBrandName,o=`${this.config.outputPath}/${this.brandResolver.getOutputSubdirectory()}`,a=`${p({brand:n})}
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
`;return[m(o,"brand_theme.g.dart",a)]}};var S=class{constructor(r){this.config=r}generate(r,e){let n=this.parseComponents(r);if(n.length===0)return[];let o=this.inferDomainName(e),i=this.inferModelName(e),a=this.buildYaml(o,i,n),d=["# GENERATED CODE - DO NOT MODIFY BY HAND","# Source: Supernova EDNet Design System",`# Generated: ${new Date().toISOString()}`,"#","# EDNet DSL v2 domain model generated from Supernova component metadata.","# Components with ednet:* custom properties are mapped to domain concepts.",""].join(`
`),c=`${$(o)}_${$(i)}.ednet.yaml`;return[m(this.config.outputPath,c,d+a)]}parseComponents(r){let e=[];for(let n of r){let o=n.propertyValues??n.properties??{};if(!this.getEdnetProperty(o,"entity"))continue;let a={name:n.name,entry:this.getEdnetProperty(o,"entry")==="true"||this.getEdnetProperty(o,"entry")===!0,description:n.description,attributes:[],children:[],neighbors:[]};for(let[d,c]of Object.entries(o)){if(typeof d!="string")continue;let u=d.match(/^ednet:attribute\.(\w+)$/);if(u){let g=u[1],I=String(c),A=this.getEdnetProperty(o,`attribute.${g}.required`)==="true"||this.getEdnetProperty(o,`attribute.${g}.required`)===!0;a.attributes.push({name:g,type:I,required:A,description:this.getEdnetProperty(o,`attribute.${g}.description`)})}let h=d.match(/^ednet:child\.(\w+)$/);h&&a.children.push({concept:h[1],relation:String(c)});let x=d.match(/^ednet:neighbor\.(\w+)$/);x&&a.neighbors.push({concept:x[1],relation:String(c)})}e.push(a)}return e}getEdnetProperty(r,e){return r[`ednet:${e}`]}inferDomainName(r){if(r&&r.length>0){let e=r.find(n=>n.isRoot);return e?e.name:r[0].name}return"GeneratedDomain"}inferModelName(r){if(r&&r.length>0){let e=r.find(n=>!n.isRoot);if(e)return e.name}return"DefaultModel"}buildYaml(r,e,n){let o=[];o.push(`domain: ${r}`),o.push(`  model: ${e}`),o.push("    concepts:");for(let i of n){if(o.push(`      - concept: ${i.name}`),i.entry&&o.push("        entry: true"),i.description&&o.push(`        description: "${i.description.replace(/"/g,'\\"')}"`),i.attributes.length>0){o.push("        attributes:");for(let a of i.attributes)o.push(`          - name: ${a.name}`),o.push(`            type: ${a.type}`),a.required&&o.push("            required: true"),a.description&&o.push(`            description: "${a.description.replace(/"/g,'\\"')}"`)}if(i.children.length>0){o.push("        children:");for(let a of i.children)o.push(`          - concept: ${a.concept}`),o.push(`            relation: ${a.relation}`)}if(i.neighbors.length>0){o.push("        neighbors:");for(let a of i.neighbors)o.push(`          - concept: ${a.concept}`),o.push(`            relation: ${a.relation}`)}}return o.join(`
`)+`
`}};var v=class{constructor(r,e){this.brandId=r;this.themeId=e}get effectiveBrandName(){return this.brandId??"ednet_ds"}get effectiveThemeName(){return this.themeId??"default"}getOutputSubdirectory(){return this.effectiveBrandName}};Pulsar.export(async(t,r)=>{let e=Pulsar.exportConfig(),n=B(e),o=new v(r.brand,r.theme),i=[],a=await t.tokens.getTokens({versionId:r.designSystemVersion});if(n.generateTokenFiles){let c=new T(n,o);i.push(...c.generate(a))}if(n.generateThemeData){let c=new b(n,o);i.push(...c.generate(a))}if(n.generateEdnetDsl){let c=await t.components.getComponents({versionId:r.designSystemVersion}),u=await t.components.getComponentGroups({versionId:r.designSystemVersion}),h=new S(n);i.push(...h.generate(c,u))}let d=new C(n,o);return i.push(...d.generate(a)),i.map(c=>FileHelper.createTextFile({relativePath:c.relativePath,fileName:c.fileName,content:c.content}))});
//# sourceMappingURL=index.js.map
