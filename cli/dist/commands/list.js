"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = listCommand;
const chalk_1 = __importDefault(require("chalk"));
const registry_1 = require("../utils/registry");
async function listCommand() {
    const components = (0, registry_1.getAllComponents)();
    console.log(chalk_1.default.blue('Available Virtual UI Components:\n'));
    if (components.length === 0) {
        console.log(chalk_1.default.gray('No components available.'));
        return;
    }
    components.forEach((component, index) => {
        const isLast = index === components.length - 1;
        const prefix = isLast ? '└─' : '├─';
        console.log(chalk_1.default.gray(prefix), chalk_1.default.white(component.name));
        console.log(chalk_1.default.gray(isLast ? '   ' : '│  '), chalk_1.default.gray(component.description));
        if (component.dependencies.length > 0) {
            console.log(chalk_1.default.gray(isLast ? '   ' : '│  '), chalk_1.default.dim(`Dependencies: ${component.dependencies.join(', ')}`));
        }
        if (!isLast) {
            console.log(chalk_1.default.gray('│'));
        }
    });
    console.log(chalk_1.default.gray('\nUsage:'));
    console.log(chalk_1.default.gray('  npx virtual-ui add [component-name]'));
    console.log(chalk_1.default.gray('\nExample:'));
    console.log(chalk_1.default.gray('  npx virtual-ui add parallax-card'));
}
