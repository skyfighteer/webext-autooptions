import { compareVersions } from "compare-versions";
import { manifest, autoOptionsConfig, isDebug } from "../config";
import { setItemInStorage, getItemFromStorage } from "./storage-handler";
import { type Configuration } from "./config-handler";
import { addedDiff, deletedDiff } from "deep-object-diff";
import { isObject } from "../utils/helper";

export async function onExtensionInstall() {
    await storeExtensionVersion();

    if (autoOptionsConfig.installAction === null) {
        closeTab();
    } else {
        autoOptionsConfig.installAction();
    }
}

export async function isExtensionUpdated() {
    const currentVersion = manifest.version;
    const storedVersion = await getStoredExtensionVersion();
    const isExtensionUpdated = compareVersions(currentVersion, storedVersion) === 1;
    
    if (isExtensionUpdated) {
        if (isDebug) {
            console.log(`Extension version updated: ${storedVersion} → ${currentVersion}`);
        }
    }
    
    return isExtensionUpdated;
}

function closeTab() {
    chrome.tabs.getCurrent(tab => {
        const tabId = tab?.id as number;
        chrome.tabs.remove(tabId);
    })
}

// migrate changes (if there were) between the 2 versions of the extension
// some ugly type-casting todo
export function getUpdatedConfig(_source: Configuration, _target: Configuration) {
    const source = structuredClone(_source);
    const target = structuredClone(_target);
    const result: Configuration = source;
    // diff
    const addedKeys = addedDiff(source, target);
    const deletedKeys = deletedDiff(source, target) as Record<string, any>;

    if (isDebug) {
        console.log('Extension has been updated, migrating settings...')
        console.log('Removing ', deletedKeys);
        console.log('Adding ', addedKeys)
    }

    // removals
    for (let key in deletedKeys) {
        const isInsideCategory = isObject(deletedKeys[key]);

        if (isInsideCategory) {
            // nested-key
            for (let deletedKey in deletedKeys[key]) {
                delete (result[key] as Record<string, any>)[deletedKey];
            }
        } else {
            // top-level key OR empty category (= every key removed)
            delete result[key];
        }
    }

    // additions
    Object.assign(result, addedKeys);

    return result;
}

async function getStoredExtensionVersion() {
    return await getItemFromStorage('extensionVersion') as string;
}

export async function storeExtensionVersion() {
    await setItemInStorage('extensionVersion', manifest.version);
}