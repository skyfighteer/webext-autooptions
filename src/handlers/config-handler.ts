import { getDefaultConfig, loadUI, supportedOptions } from "./option-handler";
import { getItemFromStorage, setItemInStorage } from "./storage-handler";
import { handleInputs } from "../inputs/input-base";
import { autoOptionsConfig, isDebug } from "../config"
import { onExtensionInstall, isExtensionUpdated, storeExtensionVersion, getUpdatedConfig } from "./lifecycle-handler";

export namespace Option {
  export type Category = string;
  export type Name = string;
  export type Value = boolean | string;
}

export type Setting = Record<Option.Name, Option.Value>

export interface Configuration {
    [key: string]: Setting | Option.Value;
}

export interface SettingDetails {
    category: Option.Category | null;
    name: Option.Name;
    value: Option.Value;
}

type UpdatedSettingDetails = Omit<SettingDetails, 'value'>

export type StorageName = string;

class ConfigHandler {
    private storageName!: StorageName;
    private configuration!: Configuration;
    public isFirstTime: boolean = false;

    /* ---- Loading / Saving Configuration ---- */

    public async init() {
        this.storageName = autoOptionsConfig.storageName;
        handleInputs();
        await this.loadConfig();
        await this.handleExtensionLifecycle();
    }

    private async loadConfig() {
        const storedConfig = await getItemFromStorage(this.storageName) as Configuration | null;
        
        if (storedConfig !== null) {
            await this.setConfig(storedConfig);
        } else {
            this.isFirstTime = true;
            await this.resetToDefault();
        }
    }

    private async setConfig(config: Configuration) {
        this.configuration = config;
        await this.storeConfig();
        await loadUI();
    }

    private async storeConfig() {
        await setItemInStorage(this.storageName, this.configuration);
    }

    private async handleExtensionLifecycle() {
        if (this.isFirstTime) {
            await onExtensionInstall();
            return;
        }
        
        if (await isExtensionUpdated()) {
            await storeExtensionVersion();
            const newConfiguration = getDefaultConfig();
            const updatedConfiguration = getUpdatedConfig(this.configuration, newConfiguration);
            await this.setConfig(updatedConfiguration);
        }
    }

    /* ------------- Set / Get Option ---------------- */

    public async setOptionValue(settingDetails: SettingDetails) {
        const { category, name, value } = settingDetails;

        // change value of option in configuration
        if (category !== null) {
            (this.configuration[category] as Setting)[name] = value;
        } else {
            this.configuration[name] = value;
        }

        // save entire configuration
        await this.storeConfig();
    }

    public getOptionValue(settingDetails: UpdatedSettingDetails): Option.Value {
        const { category, name } = settingDetails;

        if (category !== null) {
            return (this.configuration[category] as Setting)[name];
        } else {
            return this.configuration[name] as Option.Value;
        }
    }

    /* ------- API Stuff ------ */

    public async resetToDefault() {
        const defaultConfig = getDefaultConfig();
        await this.setConfig(defaultConfig);
    }

    public async saveAll() {
        if (autoOptionsConfig.saveOnChange === true) {
            console.warn("Calling 'saveAll()' on AutoOptions is redundant when 'saveOnChange' is enabled.");
            return;
        }

        for (const input of supportedOptions) {
            // note: check is not strictly necessary, but an optimization
            // to avoid exceeding the MAX_WRITE_OPERATIONS_PER_MINUTE (120) quota
            if (!input.isOnStoredOptionValue) {
                if (isDebug) {
                    console.log('Manually saving', input)
                }
                await input.storeOptionValue();
            }
        }
    }
}

export const configHandler = /* @__PURE__ */ new ConfigHandler();