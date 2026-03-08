import { describe, it, expect } from 'vitest';
import { EdnetDslGenerator } from '../../src/generators/ednet-dsl-generator';
import { DEFAULT_CONFIG } from '../../src/config/config-defaults';

describe('EdnetDslGenerator', () => {
  const generator = new EdnetDslGenerator(DEFAULT_CONFIG);

  it('returns empty array when no ednet components', () => {
    const components = [
      { id: '1', name: 'Button', properties: {} },
      { id: '2', name: 'Card', properties: {} },
    ];
    expect(generator.generate(components)).toHaveLength(0);
  });

  it('generates YAML from ednet-annotated components', () => {
    const components = [
      {
        id: '1',
        name: 'Product',
        description: 'A product entity',
        propertyValues: {
          'ednet:entity': 'true',
          'ednet:entry': 'true',
          'ednet:attribute.title': 'String',
          'ednet:attribute.title.required': 'true',
          'ednet:attribute.price': 'double',
          'ednet:child.Review': 'reviews',
          'ednet:neighbor.Category': 'category',
        },
      },
      {
        id: '2',
        name: 'Review',
        propertyValues: {
          'ednet:entity': 'true',
          'ednet:attribute.rating': 'int',
          'ednet:attribute.comment': 'String',
        },
      },
    ];

    const files = generator.generate(components);
    expect(files).toHaveLength(1);
    expect(files[0].fileName).toContain('.ednet.yaml');

    const yaml = files[0].content;
    expect(yaml).toContain('domain: GeneratedDomain');
    expect(yaml).toContain('model: DefaultModel');
    expect(yaml).toContain('- concept: Product');
    expect(yaml).toContain('entry: true');
    expect(yaml).toContain('- name: title');
    expect(yaml).toContain('type: String');
    expect(yaml).toContain('required: true');
    expect(yaml).toContain('- name: price');
    expect(yaml).toContain('type: double');
    expect(yaml).toContain('- concept: Review');
    expect(yaml).toContain('relation: reviews');
    expect(yaml).toContain('- concept: Category');
    expect(yaml).toContain('relation: category');
  });

  it('uses component group names for domain and model', () => {
    const components = [
      {
        id: '1',
        name: 'Task',
        propertyValues: { 'ednet:entity': 'true', 'ednet:entry': 'true' },
      },
    ];
    const groups = [
      { id: 'g1', name: 'ProjectManagement', childrenIds: ['g2'], subgroupIds: ['g2'], isRoot: true },
      { id: 'g2', name: 'TaskTracking', childrenIds: ['1'], subgroupIds: [], isRoot: false, parentGroupId: 'g1' },
    ];

    const files = generator.generate(components, groups);
    const yaml = files[0].content;
    expect(yaml).toContain('domain: ProjectManagement');
    expect(yaml).toContain('model: TaskTracking');
  });
});
