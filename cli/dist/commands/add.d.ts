interface AddOptions {
    yes?: boolean;
    overwrite?: boolean;
    cwd?: string;
    path?: string;
}
export declare function addCommand(components: string[], options: AddOptions): Promise<void>;
export {};
