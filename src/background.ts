import { AOError } from "./utils/error";
type OptionType = 'fullPage' | 'embedded' | 'popup';

function isServiceWorker() {
    return 'serviceWorker' in self;
}

/**
 * Create the default configuration on the install of the extension.
 * @param optionType - set it to the option page of your extension that uses AutoOptions
 * @param hasInstallAction - optional. set it to true, if you have an "installAction" set
 * @public
 */
export function createDefaultConfig(optionType: OptionType, hasInstallAction: boolean) {
    if (!isServiceWorker()) {
        throw new AOError('The "createDefaultConfig" function must be initiated from the background script.');
    }
    
    return chrome.runtime.onInstalled.addListener((details) => {
        if (details.reason === "install") {
            const url = getOptionsPageUrl(optionType);

            if (!url) {
                throw new AOError('The given options page does not exist. Check your manifest.json file.')
            }

            // ACTUALLY embedded. extensions are weird
            const isEmbedded = optionType === 'embedded' && chrome.runtime.getManifest().options_ui?.open_in_tab === false;

            if (isEmbedded && hasInstallAction) {
                chrome.runtime.openOptionsPage();
            } else {
                createTab(url, hasInstallAction);
            }
            // ... the rest is handled in the JS file of the options tab
        }
    })
}

function createTab(url: string, active: boolean) {
    chrome.tabs.create({
        url: url,
        active: active
    });
}

// using a function for tree-shaking
function getOptionsPageUrl(optionType: OptionType) {
    const manifest = chrome.runtime.getManifest();

    const optionsPageUrl: Record<OptionType, string | undefined> = {
        fullPage: manifest.options_page, // always full tab
        embedded: manifest.options_ui?.page, // might be embedded / full tab
        popup: manifest.action?.default_popup // popup on the extension bar
    }

    return optionsPageUrl[optionType];
}