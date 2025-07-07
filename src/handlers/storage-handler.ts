import type { Configuration, StorageName, SettingDetails, Option, Setting } from "./config-handler";
import { updatedDiff } from "deep-object-diff";
import { AOError } from "../utils/error";
import { isObject } from "../utils/helper";

// ****** INTERNAL  ******** //

export async function setItemInStorage(storageName: StorageName, item: any) {
    await chrome.storage.sync.set({ [storageName]: item });
}

export async function removeItemFromStorage(storageName: StorageName) {
    await chrome.storage.sync.remove(storageName);
}

export async function getItemFromStorage(storageName: StorageName) {
    // gets the entire storage content
    const extensionStorageContent = await chrome.storage.sync.get();

    // get the stored config (a string or an object might be stored or nothing = undefined)
    const storedConfig: Record<string, any> | string | undefined = extensionStorageContent[storageName];
    
    // check if we have a stored config
    if (storedConfig !== undefined) {
        return storedConfig;
    } else {
        return null;
    }
}

/**
 * Retrieves the configuration from storage based on the provided storage name.
 *
 * @param storageName - The name of the storage from which to retrieve the configuration.
 * @returns A promise that resolves to the stored configuration if it exists.
 * @throws Error if no stored configuration is found with the provided storage name.
 * @public
 */
async function getConfiguration(storageName: StorageName): Promise<Configuration> {
    const storedConfiguration = await getItemFromStorage(storageName);
    const userHasConfiguration = storedConfiguration !== null;

    if (userHasConfiguration) {
        return storedConfiguration as Configuration;
    } else {
        throw new AOError(`No stored configuration was found with the name of "${storageName}".`);
    }
}

interface GetValue {
  category?: Option.Category;
  name: Option.Name;
}

// ****** PUBLIC  ******** //

export class StoredOptions {
    storageName: StorageName;
    configuration: Configuration;

    private constructor(storageName: StorageName, configuration: Configuration) {
        this.storageName = storageName;
        this.configuration = configuration;
    }

    static async get(storageName: StorageName) {
        const configuration = await getConfiguration(storageName);
        return new StoredOptions(storageName, configuration);
    }

    /**
     * Listens for changes in the storage and calls the callback function with the updated setting.
     * 
     * @param storageName - The name of the AutoOptions storage set in the options of your extension.
     * @param callback - A function that is called with the updated setting's category, name, and value.
     */
    public onValueChange(callback: (settingDetails: SettingDetails) => void): void {
        return chrome.storage.onChanged.addListener((storage, storageType) => {
            const configuration = storage[this.storageName];

            // important: this listener could be kicked by any change
            if (storageType !== 'sync') {
                return;
            }

            const diff = updatedDiff(configuration.oldValue, configuration.newValue) as Configuration;
            const hasCategory = typeof Object.values(diff)[0] === 'object';
            
            const category = hasCategory ? Object.keys(diff)[0] : null;
            const [name] = category ? Object.keys(diff[category]) : Object.keys(diff);
            const [value] = category ? Object.values(diff[category]) : Object.values(diff);

            // update cached config
            this.updateConfiguration({category, name, value});

            callback({
                category,
                name,
                value
            });
        })
    }

	public getValue<T = Option.Value>(settingDetails: GetValue) {
        const { category, name } = settingDetails;

        let settingValue;

        if (category) {
            settingValue = (this.configuration[category] as Setting)[name];
        } else {
            settingValue = this.configuration[name];
        }

		if (settingValue !== undefined) {
			return settingValue as T;
		} else {
			throw new AOError(`The option "${name}" is not saved in the "${this.storageName}" configuration.`);
		}
	}

    // ** INTERNAL ** //

	private updateConfiguration(settingDetails: SettingDetails) {
        const { category, name, value } = settingDetails;

        if (category !== null) {
            (this.configuration[category] as Setting)[name] = value;
        } else {
            this.configuration[name] = value;
        }
	}
}