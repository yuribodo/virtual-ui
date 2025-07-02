"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.saveConfig = saveConfig;
exports.getDefaultConfig = getDefaultConfig;
exports.resolveConfigPaths = resolveConfigPaths;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const cosmiconfig_1 = require("cosmiconfig");
const zod_1 = require("zod");
const chalk_1 = __importDefault(require("chalk"));
const configSchema = zod_1.z.object({
    style: zod_1.z.enum(['default', 'new-york']).optional(),
    rsc: zod_1.z.boolean().optional(),
    tsx: zod_1.z.boolean().optional(),
    tailwind: zod_1.z.object({
        config: zod_1.z.string(),
        css: zod_1.z.string(),
        baseColor: zod_1.z.string().optional(),
        cssVariables: zod_1.z.boolean().optional(),
        prefix: zod_1.z.string().optional(),
    }).optional(),
    aliases: zod_1.z.object({
        components: zod_1.z.string(),
        utils: zod_1.z.string().optional(),
        ui: zod_1.z.string().optional(),
    }),
});
const DEFAULT_CONFIG = {
    style: 'default',
    rsc: true,
    tsx: true,
    tailwind: {
        config: 'tailwind.config.js',
        css: 'app/globals.css',
        baseColor: 'slate',
        cssVariables: true,
    },
    aliases: {
        components: '@/components',
        utils: '@/lib/utils',
        ui: '@/components/ui',
    },
};
async function getConfig(cwd) {
    const explorer = (0, cosmiconfig_1.cosmiconfig)('virtual-ui', {
        searchPlaces: [
            'virtual-ui.json',
            'virtual-ui.config.json',
            'virtual-ui.config.js',
            'virtual-ui.config.ts',
            'package.json',
        ],
    });
    try {
        const result = await explorer.search(cwd);
        if (!result)
            return null;
        const config = configSchema.parse(result.config);
        return config;
    }
    catch (error) {
        console.error(chalk_1.default.red('Error reading config:'), error);
        return null;
    }
}
async function saveConfig(config, cwd) {
    const configPath = path_1.default.resolve(cwd, 'virtual-ui.json');
    await fs_extra_1.default.writeJSON(configPath, config, { spaces: 2 });
}
function getDefaultConfig() {
    return DEFAULT_CONFIG;
}
function resolveConfigPaths(cwd, config) {
    const tailwindConfigPath = path_1.default.resolve(cwd, config.tailwind?.config || 'tailwind.config.js');
    const tailwindCssPath = path_1.default.resolve(cwd, config.tailwind?.css || 'app/globals.css');
    // Convert aliases to actual paths
    const componentsPath = config.aliases.components.replace(/^@\//, '');
    const utilsPath = config.aliases.utils?.replace(/^@\//, '') || 'lib/utils';
    const uiPath = config.aliases.ui?.replace(/^@\//, '') || 'components/ui';
    return {
        tailwindConfig: tailwindConfigPath,
        tailwindCSS: tailwindCssPath,
        components: path_1.default.resolve(cwd, componentsPath),
        utils: path_1.default.resolve(cwd, utilsPath),
        ui: path_1.default.resolve(cwd, uiPath),
    };
}
