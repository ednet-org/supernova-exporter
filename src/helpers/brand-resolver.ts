/**
 * Resolves token values considering brand and theme context.
 *
 * Resolution order (most specific wins):
 * 1. Brand-specific + Theme-specific override
 * 2. Brand-specific default
 * 3. Base brand + Theme override
 * 4. Base brand default
 */
export class BrandResolver {
  constructor(
    private readonly brandId: string | undefined,
    private readonly themeId: string | undefined,
  ) {}

  /** Get the effective brand identifier for output naming. */
  get effectiveBrandName(): string {
    return this.brandId ?? 'ednet_ds';
  }

  /** Get the effective theme name for output naming. */
  get effectiveThemeName(): string {
    return this.themeId ?? 'default';
  }

  /**
   * Resolve a token's value considering brand and theme overrides.
   * In the Supernova exporter context, the SDK already resolves
   * brand/theme based on the PulsarContext, so we primarily use
   * this for output path and naming decisions.
   */
  getOutputSubdirectory(): string {
    return this.effectiveBrandName;
  }
}
