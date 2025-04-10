/**
 * Create an AutoOptions instance to save the options of an extension.
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

export declare type Configuration = Record<OptionCategory, Setting> & Setting;

/**
 * Create the default configuration on the install of the extension.
 * @param optionType - set it to the option page of your extension that uses AutoOptions
 * @param hasInstallAction - optional. set it to true, if you have an "installAction" set
 * @public
 */
export declare function createDefaultConfig(optionType: OptionType, hasInstallAction: boolean): void;

/**
 * Retrieves the configuration from storage based on the provided storage name.
 *
 * @param storageName - The name of the storage from which to retrieve the configuration.
 * @returns A promise that resolves to the stored configuration if it exists.
 * @throws Error if no stored configuration is found with the provided storage name.
 * @public
 */
export declare function getConfiguration(storageName: StorageName): Promise<Configuration>;

/**
 * Listens for changes in the storage and calls the callback function with the updated setting.
 *
 * @param storageName - The name of the AutoOptions storage set in the options of your extension.
 * @param callback - A function that is called with the updated setting's category, name, and value.
 * @public
 */
export declare function onSettingChange(storageName: StorageName, callback: (settingDetails: SettingDetails) => void): void;

declare type OptionCategory = string;

declare type OptionName = string;

declare type OptionType = 'fullPage' | 'embedded' | 'popup';

declare type OptionValue = boolean | string;

declare type Setting = Record<OptionName, OptionValue>;

declare interface SettingDetails {
    category: OptionCategory | null;
    name: OptionName;
    value: OptionValue;
}

declare type StorageName = string;

export { }
