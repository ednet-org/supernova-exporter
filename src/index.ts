/**
 * EDNet Design System Supernova Exporter
 *
 * Generates Dart token files, Flutter ThemeData, and EDNet DSL v2 YAML
 * from Supernova design tokens. Runs inside Supernova's secure sandbox.
 */

import {
  Supernova,
  PulsarContext,
  RemoteVersionIdentifier,
  AnyOutputFile,
} from '@supernovaio/sdk-exporters';
import { FileHelper } from '@supernovaio/export-helpers';
import { ExporterConfig } from './config/config-types';
import { resolveConfig } from './config/config-defaults';
import { TokenGenerator } from './generators/token-generator';
import { ThemeDataGenerator } from './generators/theme-data-generator';
import { ThemeExtensionGenerator } from './generators/theme-extension-generator';
import { BrandThemeGenerator } from './generators/brand-theme-generator';
import { EdnetDslGenerator } from './generators/ednet-dsl-generator';
import { BrandResolver } from './helpers/brand-resolver';
import { OutputFile } from './helpers/file-builder';

/** Resolved exporter configuration */
export const exportConfiguration =
  Pulsar.exportConfig<ExporterConfig>();

Pulsar.export(
  async (
    sdk: Supernova,
    context: PulsarContext,
  ): Promise<Array<AnyOutputFile>> => {
    const config = resolveConfig(exportConfiguration);

    // Build remote version identifier per Supernova SDK
    const remoteVersionIdentifier: RemoteVersionIdentifier =
      {
        designSystemId: context.dsId,
        versionId: context.versionId,
      };

    // Resolve brand/theme from pipeline context
    const brandResolver = new BrandResolver(
      context.brandId ?? undefined,
      context.themeIds
        ? context.themeIds[0]
        : undefined,
    );

    // Fetch all tokens (unfiltered — needed for theme reference resolution)
    const fullTokenSet = await sdk.tokens.getTokens(
      remoteVersionIdentifier,
    );
    const tokenGroups = await sdk.tokens.getTokenGroups(
      remoteVersionIdentifier,
    );

    // Build group path lookup: groupId -> full path
    const groupPathMap = new Map<string, string>();
    const groupById = new Map<string, any>();
    for (const g of tokenGroups) {
      groupById.set(g.id, g);
    }
    function resolveGroupPath(groupId: string): string {
      if (groupPathMap.has(groupId)) return groupPathMap.get(groupId)!;
      const group = groupById.get(groupId);
      if (!group) return '';
      const parentPath = group.parentGroupId
        ? resolveGroupPath(group.parentGroupId)
        : '';
      const path = parentPath
        ? `${parentPath}/${group.name}`
        : group.name;
      groupPathMap.set(groupId, path);
      return path;
    }

    // Enrich tokens with their group path for routing
    for (const token of fullTokenSet) {
      const groupPath = (token as any).parentGroupId
        ? resolveGroupPath((token as any).parentGroupId)
        : '';
      (token as any)._groupPath = groupPath;
    }

    // Start with full set, apply brand filter and themes
    let tokens = [...fullTokenSet];

    // Filter by brand if specified
    if (context.brandId) {
      const brands = await sdk.brands.getBrands(
        remoteVersionIdentifier,
      );
      const brand = brands.find(
        (b) =>
          b.id === context.brandId ||
          b.idInVersion === context.brandId,
      );
      if (brand) {
        tokens = tokens.filter(
          (t) => t.brandId === brand.id,
        );
      }
    }

    // Apply theme overrides if themes are selected
    if (context.themeIds && context.themeIds.length > 0) {
      try {
        const themes = await sdk.tokens.getTokenThemes(
          remoteVersionIdentifier,
        );
        const themesToApply = context.themeIds
          .map((tid) =>
            themes.find(
              (t) =>
                t.id === tid || t.idInVersion === tid,
            ),
          )
          .filter(
            (t): t is NonNullable<typeof t> => t != null,
          );
        if (themesToApply.length > 0) {
          // First arg = full unfiltered set (for reference resolution)
          // Second arg = tokens to transform
          // Third arg = themes to apply
          tokens =
            sdk.tokens.computeTokensByApplyingThemes(
              fullTokenSet,
              tokens,
              themesToApply,
            );
        }
      } catch (e) {
        // Theme application failed — continue with base tokens
        console.warn(
          `[EDNet Exporter] Theme application failed, using base tokens: ${e}`,
        );
      }
    }

    // Collect all output files
    const outputFiles: OutputFile[] = [];

    // Phase 1: Token files
    if (config.generateTokenFiles) {
      const tokenGen = new TokenGenerator(
        config,
        brandResolver,
      );
      outputFiles.push(...tokenGen.generate(tokens));
    }

    // Phase 2: ThemeData
    if (config.generateThemeData) {
      const themeGen = new ThemeDataGenerator(
        config,
        brandResolver,
      );
      outputFiles.push(...themeGen.generate(tokens));
    }

    // Phase 2b: ThemeExtension with lerp/copyWith
    if (config.generateThemeExtension) {
      const extGen = new ThemeExtensionGenerator(
        config,
        brandResolver,
      );
      outputFiles.push(...extGen.generate(tokens));
    }

    // Phase 3: EDNet DSL v2 YAML from components
    if (config.generateEdnetDsl) {
      const components =
        await sdk.components.getComponents(
          remoteVersionIdentifier,
        );
      const componentGroups =
        await sdk.components.getComponentGroups(
          remoteVersionIdentifier,
        );

      const dslGen = new EdnetDslGenerator(config);
      outputFiles.push(
        ...dslGen.generate(
          components,
          componentGroups as any[],
        ),
      );
    }

    // Brand-specific theme wrapper
    const brandThemeGen = new BrandThemeGenerator(
      config,
      brandResolver,
    );
    outputFiles.push(
      ...brandThemeGen.generate(tokens),
    );

    // Convert OutputFile[] to Supernova AnyOutputFile[]
    return outputFiles.map((f) =>
      FileHelper.createTextFile({
        relativePath: f.relativePath,
        fileName: f.fileName,
        content: f.content,
      }),
    );
  },
);
