export interface ComponentInfo {
    name: string;
    description: string;
    dependencies: string[];
    devDependencies?: string[];
    files: ComponentFile[];
    tailwindConfig?: TailwindConfig;
    globalCSS?: string[];
}
export interface ComponentFile {
    name: string;
    content: string;
    type: 'component' | 'utils' | 'types';
    target?: string;
}
export interface TailwindConfig {
    theme?: Record<string, any>;
    plugins?: string[];
}
export declare const COMPONENTS_REGISTRY: Record<string, ComponentInfo>;
export declare function getComponent(name: string): ComponentInfo | null;
export declare function getAllComponents(): ComponentInfo[];
export declare function getComponentNames(): string[];
