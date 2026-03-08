import { OutputFile, createOutputFile } from '../helpers/file-builder';
import { ExporterConfig } from '../config/config-types';
import { toSnakeCase } from '../helpers/naming';

/**
 * Supernova component structure that we expect.
 * Components should use custom properties with 'ednet:' prefix
 * to encode domain model semantics.
 */
export interface SupernovaComponent {
  id: string;
  name: string;
  description?: string;
  properties?: Record<string, any>;
  propertyValues?: Record<string, any>;
}

export interface SupernovaComponentGroup {
  id: string;
  name: string;
  childrenIds: string[];
  subgroupIds: string[];
  isRoot: boolean;
  parentGroupId?: string;
}

/** Parsed concept from component metadata. */
interface ParsedConcept {
  name: string;
  entry: boolean;
  description?: string;
  attributes: ParsedAttribute[];
  children: ParsedRelation[];
  neighbors: ParsedRelation[];
}

interface ParsedAttribute {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

interface ParsedRelation {
  concept: string;
  relation: string;
}

/**
 * Generates EDNet DSL v2 YAML from Supernova component metadata.
 *
 * Components encode domain semantics via custom properties:
 * - 'ednet:entity' = true -> this component is a domain concept
 * - 'ednet:entry' = true -> this is an entry concept (root aggregate)
 * - 'ednet:attribute.{name}' = '{type}' -> concept attribute
 * - 'ednet:attribute.{name}.required' = true -> required attribute
 * - 'ednet:child.{conceptName}' = '{relationName}' -> child relationship
 * - 'ednet:neighbor.{conceptName}' = '{relationName}' -> neighbor relationship
 *
 * Component groups map to domains/models.
 */
export class EdnetDslGenerator {
  constructor(private readonly config: ExporterConfig) {}

  /**
   * Generate EDNet DSL v2 YAML from Supernova components.
   *
   * @param components - Array of Supernova component objects
   * @param componentGroups - Optional component groups for domain/model structure
   */
  generate(
    components: SupernovaComponent[],
    componentGroups?: SupernovaComponentGroup[],
  ): OutputFile[] {
    const concepts = this.parseComponents(components);

    if (concepts.length === 0) {
      return [];
    }

    const domainName = this.inferDomainName(componentGroups);
    const modelName = this.inferModelName(componentGroups);

    const yaml = this.buildYaml(domainName, modelName, concepts);

    const header = [
      '# GENERATED CODE - DO NOT MODIFY BY HAND',
      '# Source: Supernova EDNet Design System',
      `# Generated: ${new Date().toISOString()}`,
      '#',
      '# EDNet DSL v2 domain model generated from Supernova component metadata.',
      '# Components with ednet:* custom properties are mapped to domain concepts.',
      '',
    ].join('\n');

    const fileName = `${toSnakeCase(domainName)}_${toSnakeCase(modelName)}.ednet.yaml`;

    return [
      createOutputFile(
        this.config.outputPath,
        fileName,
        header + yaml,
      ),
    ];
  }

  private parseComponents(components: SupernovaComponent[]): ParsedConcept[] {
    const concepts: ParsedConcept[] = [];

    for (const component of components) {
      const props = component.propertyValues ?? component.properties ?? {};

      const isEntity = this.getEdnetProperty(props, 'entity');
      if (!isEntity) continue;

      const concept: ParsedConcept = {
        name: component.name,
        entry:
          this.getEdnetProperty(props, 'entry') === 'true' ||
          this.getEdnetProperty(props, 'entry') === true,
        description: component.description,
        attributes: [],
        children: [],
        neighbors: [],
      };

      for (const [key, value] of Object.entries(props)) {
        if (typeof key !== 'string') continue;

        const attrMatch = key.match(/^ednet:attribute\.(\w+)$/);
        if (attrMatch) {
          const attrName = attrMatch[1];
          const attrType = String(value);
          const isRequired =
            this.getEdnetProperty(
              props,
              `attribute.${attrName}.required`,
            ) === 'true' ||
            this.getEdnetProperty(
              props,
              `attribute.${attrName}.required`,
            ) === true;

          concept.attributes.push({
            name: attrName,
            type: attrType,
            required: isRequired,
            description: this.getEdnetProperty(
              props,
              `attribute.${attrName}.description`,
            ) as string | undefined,
          });
        }

        const childMatch = key.match(/^ednet:child\.(\w+)$/);
        if (childMatch) {
          concept.children.push({
            concept: childMatch[1],
            relation: String(value),
          });
        }

        const neighborMatch = key.match(/^ednet:neighbor\.(\w+)$/);
        if (neighborMatch) {
          concept.neighbors.push({
            concept: neighborMatch[1],
            relation: String(value),
          });
        }
      }

      concepts.push(concept);
    }

    return concepts;
  }

  private getEdnetProperty(
    props: Record<string, any>,
    suffix: string,
  ): any {
    return props[`ednet:${suffix}`];
  }

  private inferDomainName(
    groups?: SupernovaComponentGroup[],
  ): string {
    if (groups && groups.length > 0) {
      const root = groups.find((g) => g.isRoot);
      if (root) return root.name;
      return groups[0].name;
    }
    return 'GeneratedDomain';
  }

  private inferModelName(
    groups?: SupernovaComponentGroup[],
  ): string {
    if (groups && groups.length > 0) {
      const nonRoot = groups.find((g) => !g.isRoot);
      if (nonRoot) return nonRoot.name;
    }
    return 'DefaultModel';
  }

  private buildYaml(
    domainName: string,
    modelName: string,
    concepts: ParsedConcept[],
  ): string {
    const lines: string[] = [];

    lines.push(`domain: ${domainName}`);
    lines.push(`  model: ${modelName}`);
    lines.push('    concepts:');

    for (const concept of concepts) {
      lines.push(`      - concept: ${concept.name}`);
      if (concept.entry) {
        lines.push('        entry: true');
      }
      if (concept.description) {
        lines.push(
          `        description: "${concept.description.replace(/"/g, '\\"')}"`,
        );
      }

      if (concept.attributes.length > 0) {
        lines.push('        attributes:');
        for (const attr of concept.attributes) {
          lines.push(`          - name: ${attr.name}`);
          lines.push(`            type: ${attr.type}`);
          if (attr.required) {
            lines.push('            required: true');
          }
          if (attr.description) {
            lines.push(
              `            description: "${attr.description.replace(/"/g, '\\"')}"`,
            );
          }
        }
      }

      if (concept.children.length > 0) {
        lines.push('        children:');
        for (const child of concept.children) {
          lines.push(`          - concept: ${child.concept}`);
          lines.push(`            relation: ${child.relation}`);
        }
      }

      if (concept.neighbors.length > 0) {
        lines.push('        neighbors:');
        for (const neighbor of concept.neighbors) {
          lines.push(`          - concept: ${neighbor.concept}`);
          lines.push(`            relation: ${neighbor.relation}`);
        }
      }
    }

    return lines.join('\n') + '\n';
  }
}
