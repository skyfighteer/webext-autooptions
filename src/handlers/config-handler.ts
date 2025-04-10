import { supportedInputs } from "./option-handler";
import { getFromStorage, setStoredConfig } from "./storage-handler";
import { loadInputs } from "../inputs/input-base";
import { autoOptionsConfig } from "../config"

type OptionCategory = string;
type OptionName = string;
type OptionValue = boolean | string;

type Setting = Record<OptionName, OptionValue>

type Configuration = Record<OptionCategory, Setting> & Setting;

interface SettingDetails {
    category: OptionCategory | null;
    name: OptionName;
    value: OptionValue;
}
type UpdatedSettingDetails = Omit<SettingDetails, 'value'>
type StorageName = string;

class ConfigHandler {
    public storageName!: StorageName;
    public configuration!: Configuration;
    public isFirstTime: boolean = false;

    /* ---- Loading / Saving Configuration ---- */

    public async init() {
        this.storageName = autoOptionsConfig.storageName;
        this.configuration = await this.getConfig();
        loadInputs();
        this.handleFirstTime();
    }

    private async getConfig() {
        const storedConfiguration = await getFromStorage(this.storageName);
        
        if (storedConfiguration !== null) {
            // caching the configuration
            return storedConfiguration;
        } else {
            this.isFirstTime = true;
            return Object.create(null); // create empty object
        }
    }

    private handleFirstTime() {
        if (this.isFirstTime) {
            if (autoOptionsConfig.installAction === null) {
                // close current tab, it was only opened to save config
                chrome.tabs.getCurrent(tab => {
                    const tabId = tab?.id as number;
                    chrome.tabs.remove(tabId);
                })
            } else {
                autoOptionsConfig.installAction();
            }
        }
    }

    public async saveConfig() {
        await setStoredConfig(this.storageName, this.configuration);
    }

    // user does not need to give a category
    public addNewCategory(category: OptionCategory) {
        // if a category does not exist yet in the config
        if (this.configuration[category] === undefined) {           
            this.configuration[category] = Object.create(null);
        }
    }

    /* ------------- Set / Get Option ---------------- */

    public async setOptionValue(optionDetails: SettingDetails) {
        const { category, name, value } = optionDetails;

        // change value of option in configuration
        if (category !== null) {
            this.configuration[category][name] = value;
        } else {
            (this.configuration[name] as OptionValue) = value;
        }

        // save entire configuration,
        await this.saveConfig();
    }

    public getOptionValue(optionDetails: UpdatedSettingDetails): OptionValue {
        const { category, name } = optionDetails;

        if (category !== null) {
            return this.configuration[category][name];
        } else {
            return this.configuration[name] as OptionValue;
        }
    }

    /* ------- API Stuff ------ */

    // checks are not strictly necessary, but an optimization
    // to avoid exceeding the MAX_WRITE_OPERATIONS_PER_MINUTE (120) quota

    public async resetToDefault() {
        // reset all inputs to default value
        for (const input of supportedInputs) {
            if (!input.isOnDefaultValue) {
               await input.setDefaultValue();
            }
        }
    }

    public async saveAll() {
        if (autoOptionsConfig.saveOnChange === true) {
            console.warn("Calling 'saveAll()' on AutoOptions is redundant when 'saveOnChange' is enabled.");
            return;
        }

        for (const input of supportedInputs) {
            if (!input.isOnStoredValue) {
                await input.storeValue();
            }
        }
    }
}

export const configHandler = /* @__PURE__ */ new ConfigHandler();
export type { OptionValue, Configuration, SettingDetails, StorageName }