/**
 * @overview handle the storage API of chrome
 */

import type { Configuration, StorageName, SettingDetails } from "./config-handler";
import { updatedDiff } from "deep-object-diff";
import { AOError } from "../utils/error";

function checkStoragePermission() {
    // check if storage can be accessed
    const isStorageAccessAllowed = (chrome.storage !== undefined);

    if (!isStorageAccessAllowed) {
        throw new AOError(`Unable to access chrome storage. Try declaring the "storage" permission in the extension's manifest.`)
    }
}

export async function setStoredConfig(storageName: StorageName, config: Configuration) {
    checkStoragePermission();
    await chrome.storage.sync.set({ [storageName]: config });
}

export async function removeStoredConfig(storageName: StorageName) {
    checkStoragePermission();
    await chrome.storage.sync.remove(storageName);
}

export async function getFromStorage(storageName: StorageName) {
    checkStoragePermission();

    // gets the entire storage content
    const extensionStorageContent = await chrome.storage.sync.get();

    // get the stored config
    const storedConfig: Configuration | undefined = extensionStorageContent[storageName];
    
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
export async function getConfiguration(storageName: StorageName): Promise<Configuration> {
    const storedConfiguration = await getFromStorage(storageName);
    const userHasConfiguration = storedConfiguration !== null;

    if (userHasConfiguration) {
        return storedConfiguration;
    } else {
        throw new AOError(`No stored configuration was found with the name of "${storageName}".`);
    }
}

/**
 * Listens for changes in the storage and calls the callback function with the updated setting.
 * 
 * @param storageName - The name of the AutoOptions storage set in the options of your extension.
 * @param callback - A function that is called with the updated setting's category, name, and value.
 * @public
 */
export function onSettingChange(storageName: StorageName, callback: (settingDetails: SettingDetails) => void): void {
    return chrome.storage.onChanged.addListener((storage, storageType) => {
        const configuration = storage[storageName];

        // this listener could be kicked by any change. if it's not autooptions, return
        if (storageType !== 'sync' || !configuration) return;

        const diff = updatedDiff(configuration.oldValue, configuration.newValue) as Configuration;
        const hasCategory = typeof Object.values(diff)[0] === 'object';
        
        const category = hasCategory ? Object.keys(diff)[0] : null;
        const [name] = category ? Object.keys(diff[category]) : Object.keys(diff);
        const [value] = category ? Object.values(diff[category]) : Object.values(diff);

        callback({
            category: category,
            name: name,
            value: value
        });
    })
}