/**
 * Create an AutoOptions instance to store the options of an extension.
 * @public
 */
export declare class AutoOptions {
    constructor(autoOptionsConfig: AutoOptionsConfig);
    loadConfig(): Promise<void>;
    resetToDefault(): Promise<void>;
    saveAll(): Promise<void>;
}

/**
 * Parameters for initializing AutoOptions.
 * @public
 */
declare interface AutoOptionsConfig {
    /**
     * The name of the storage instance.
     */
    storageName: string;
    /**
     * Set to false to save manually.
     * @defaultValue true
     */
    saveOnChange?: boolean;
    /**
     * Pass any function to run on first install.
     * @defaultValue undefined
     */
    installAction?: () => void;
}

declare interface Configuration {
    [key: string]: Setting | Option_2.Value;
}

/**
 * Create the default configuration on the install of the extension.
 * @param optionsPageType - the type of option-page your extension uses with AutoOptions
 * @param hasInstallAction - set to true if you have an "installAction" set inside the options script
 * @public
 */
export declare function createDefaultConfig(optionsPageType: OptionsPageType, hasInstallAction: boolean): Promise<void>;

declare interface GetValue {
    category?: Option_2.Category;
    name: Option_2.Name;
}

declare namespace Option_2 {
    type Category = string;
    type Name = string;
    type Value = boolean | string;
}

declare type OptionsPageType = typeof optionsPageTypes[number];

declare const optionsPageTypes: readonly ["fullPage", "embedded", "popup"];

declare type Setting = Record<Option_2.Name, Option_2.Value>;

declare interface SettingDetails {
    category: Option_2.Category | null;
    name: Option_2.Name;
    value: Option_2.Value;
}

declare type StorageName = string;

export declare class StoredOptions {
    storageName: StorageName;
    configuration: Configuration;
    private constructor();
    static get(storageName: StorageName): Promise<StoredOptions>;
    /**
     * Listens for changes in the storage and calls the callback function with the updated setting.
     *
     * @param storageName - The name of the AutoOptions storage set in the options of your extension.
     * @param callback - A function that is called with the updated setting's category, name, and value.
     */
    onValueChange(callback: (settingDetails: SettingDetails) => void): void;
    getValue<T = Option_2.Value>(settingDetails: GetValue): T;
    getAllOptionsFromCategory(category: string): string[];
    private updateConfiguration;
}

export { }
