import { AOError } from "./utils/error";
import { manifest } from "./config";
import { isBoolean } from "./utils/helper"
import { isExtensionUnpacked } from "./config";

const optionsPageTypes = ['fullPage', 'embedded', 'popup'] as const;
type OptionsPageType = typeof optionsPageTypes[number];

function isServiceWorker() {
    return 'serviceWorker' in self;
}

function isStorageAccessAllowed() {
    return chrome.storage !== undefined;
}

function createTab(url: string, active: boolean) {
    chrome.tabs.create({
        url: url,
        active: active
    });
}

// using a function for tree-shaking
function getOptionsPageUrl(optionType: OptionsPageType) {
    const optionsPageTypesUrl: Record<OptionsPageType, string | undefined> = {
        fullPage: manifest.options_page, // always full tab
        embedded: manifest.options_ui?.page, // might be embedded / full tab
        popup: manifest.action?.default_popup // popup on the extension bar
    }

    const optionPageTypeUrl = optionsPageTypesUrl[optionType];

    if (!optionPageTypeUrl) {
        throw new AOError('The given options page does not exist. Check your manifest.json file.')
    }

    return optionPageTypeUrl;
}

// *** PUBLIC **** //

// note: the "createDefaultConfig" function might not work under rare circumstances when failing to open a new window
// and finishing the script inside (like closing the browser right after install, before onInstall listener)
// the window is like 0.5s even on a slow pc. opening the options anytime after will fix the issue

// note: maybe should support multiple option-types at once

// note: "createDefaultConfig" also migrates config on update. it could be a separate function, but this library is as simple
// as possible. I see no future reasons, any config for the function that would require it

/**
 * Create the default configuration on the install of the extension.
 * @param optionsPageType - the type of option-page your extension uses with AutoOptions
 * @param hasInstallAction - set to true if you have an "installAction" set inside the options script
 * @public
 */
export async function createDefaultConfig(optionsPageType: OptionsPageType, hasInstallAction: boolean) {
    if (!isServiceWorker()) {
        throw new AOError('The "createDefaultConfig" function must be initiated from the background script.');
    }

    if (!isStorageAccessAllowed()) {
        throw new AOError(`Unable to access chrome storage. Try declaring the "storage" permission in the extension's manifest.`);
    }

    // manual typecheck for js support
    if (!optionsPageTypes.includes(optionsPageType)) {
        throw new AOError('"OptionsPageType" must be one of the following: "fullPage", "embedded", "popup".');
    }

    // manual typecheck for js support
    if (!isBoolean(hasInstallAction)) {
        throw new AOError('"hasInstallAction" must be a boolean.')
    }
    
    chrome.runtime.onInstalled.addListener(({ reason }) => {
        // default config
        if (reason === "install") {
            const url = getOptionsPageUrl(optionsPageType);
            const isEmbedded = optionsPageType === 'embedded' && manifest.options_ui?.open_in_tab === false;

            if (isEmbedded && hasInstallAction) {
                chrome.runtime.openOptionsPage();
            } else {
                createTab(url, hasInstallAction);
            }
            // ... the rest is handled in the JS file of the options tab
        }

        // --- migration ---
        // note: this function would be triggered when extension is manually updated by dev while testing locally
        if (isExtensionUnpacked) {
            return;
        }

        if (reason === "update") {
            const url = getOptionsPageUrl(optionsPageType);
            createTab(url, false);
        }
    })
}