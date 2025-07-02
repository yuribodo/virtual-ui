import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    style: z.ZodOptional<z.ZodEnum<["default", "new-york"]>>;
    rsc: z.ZodOptional<z.ZodBoolean>;
    tsx: z.ZodOptional<z.ZodBoolean>;
    tailwind: z.ZodOptional<z.ZodObject<{
        config: z.ZodString;
        css: z.ZodString;
        baseColor: z.ZodOptional<z.ZodString>;
        cssVariables: z.ZodOptional<z.ZodBoolean>;
        prefix: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        config: string;
        css: string;
        baseColor?: string | undefined;
        cssVariables?: boolean | undefined;
        prefix?: string | undefined;
    }, {
        config: string;
        css: string;
        baseColor?: string | undefined;
        cssVariables?: boolean | undefined;
        prefix?: string | undefined;
    }>>;
    aliases: z.ZodObject<{
        components: z.ZodString;
        utils: z.ZodOptional<z.ZodString>;
        ui: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        components: string;
        utils?: string | undefined;
        ui?: string | undefined;
    }, {
        components: string;
        utils?: string | undefined;
        ui?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    aliases: {
        components: string;
        utils?: string | undefined;
        ui?: string | undefined;
    };
    style?: "default" | "new-york" | undefined;
    rsc?: boolean | undefined;
    tsx?: boolean | undefined;
    tailwind?: {
        config: string;
        css: string;
        baseColor?: string | undefined;
        cssVariables?: boolean | undefined;
        prefix?: string | undefined;
    } | undefined;
}, {
    aliases: {
        components: string;
        utils?: string | undefined;
        ui?: string | undefined;
    };
    style?: "default" | "new-york" | undefined;
    rsc?: boolean | undefined;
    tsx?: boolean | undefined;
    tailwind?: {
        config: string;
        css: string;
        baseColor?: string | undefined;
        cssVariables?: boolean | undefined;
        prefix?: string | undefined;
    } | undefined;
}>;
export type Config = z.infer<typeof configSchema>;
export declare function getConfig(cwd: string): Promise<Config | null>;
export declare function saveConfig(config: Config, cwd: string): Promise<void>;
export declare function getDefaultConfig(): Config;
export declare function resolveConfigPaths(cwd: string, config: Config): {
    tailwindConfig: string;
    tailwindCSS: string;
    components: string;
    utils: string;
    ui: string;
};
export {};
