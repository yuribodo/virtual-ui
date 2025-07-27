import { getComponent, getAllComponents, getComponentNames, COMPONENTS_REGISTRY } from '../../src/utils/registry';

describe('Registry Utils', () => {
  describe('getComponent', () => {
    it('should return component info for existing component', () => {
      const component = getComponent('parallax-card');
      
      expect(component).toBeDefined();
      expect(component?.name).toBe('parallax-card');
      expect(component?.description).toBe('Interactive card component with 3D parallax effects');
      expect(component?.dependencies).toContain('motion');
      expect(component?.dependencies).toContain('clsx');
      expect(component?.files).toHaveLength(1);
      expect(component?.files[0].name).toBe('parallax-card.tsx');
      expect(component?.files[0].type).toBe('component');
    });

    it('should return null for non-existing component', () => {
      const component = getComponent('non-existing-component');
      expect(component).toBeNull();
    });
  });

  describe('getAllComponents', () => {
    it('should return all components', () => {
      const components = getAllComponents();
      
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);
      expect(components[0]).toHaveProperty('name');
      expect(components[0]).toHaveProperty('description');
      expect(components[0]).toHaveProperty('dependencies');
      expect(components[0]).toHaveProperty('files');
    });

    it('should return the same components as in registry', () => {
      const components = getAllComponents();
      const registryValues = Object.values(COMPONENTS_REGISTRY);
      
      expect(components).toEqual(registryValues);
    });
  });

  describe('getComponentNames', () => {
    it('should return array of component names', () => {
      const names = getComponentNames();
      
      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(0);
      expect(names).toContain('parallax-card');
    });

    it('should return the same names as registry keys', () => {
      const names = getComponentNames();
      const registryKeys = Object.keys(COMPONENTS_REGISTRY);
      
      expect(names).toEqual(registryKeys);
    });
  });

  describe('Component structure validation', () => {
    it('should have valid component structure', () => {
      const components = getAllComponents();
      
      components.forEach(component => {
        expect(component).toHaveProperty('name');
        expect(component).toHaveProperty('description');
        expect(component).toHaveProperty('dependencies');
        expect(component).toHaveProperty('files');
        
        expect(typeof component.name).toBe('string');
        expect(typeof component.description).toBe('string');
        expect(Array.isArray(component.dependencies)).toBe(true);
        expect(Array.isArray(component.files)).toBe(true);
        
        component.files.forEach(file => {
          expect(file).toHaveProperty('name');
          expect(file).toHaveProperty('content');
          expect(file).toHaveProperty('type');
          
          expect(typeof file.name).toBe('string');
          expect(typeof file.content).toBe('string');
          expect(['component', 'utils', 'types']).toContain(file.type);
        });
      });
    });
  });
});