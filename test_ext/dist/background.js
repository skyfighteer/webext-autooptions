(() => {
  // ../dist/index.mjs
  var AOError = class extends Error {
    constructor(message, element) {
      super(message);
      this.name = `AutoOptions Error`;
      if (element) console.log(element);
    }
  };
  function isServiceWorker() {
    return "serviceWorker" in self;
  }
  function createDefaultConfig(optionType, isEmbeddedWithInstallAction = false) {
    if (!isServiceWorker()) {
      throw new AOError('The "createDefaultConfig" function must be initiated from the background script.');
    }
    return chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === "install") {
        const url = getOptionsPageUrl(optionType);
        if (!url) {
          throw new AOError("The given options page does not exist. Check your manifest.json file.");
        }
        const isEmbedded = optionType === "embedded" && chrome.runtime.getManifest().options_ui?.open_in_tab === false;
        if (!isEmbedded && isEmbeddedWithInstallAction) {
          throw new AOError('You only need to set "isEmbeddedWithInstallAction" to "true" if your options page is embedded.');
        }
        if (isEmbedded && isEmbeddedWithInstallAction) {
          chrome.runtime.openOptionsPage();
        } else {
          createTab(url);
        }
      }
    });
  }
  function createTab(url) {
    chrome.tabs.create({
      url,
      active: false
    });
  }
  function getOptionsPageUrl(optionType) {
    const manifest = chrome.runtime.getManifest();
    const optionsPageUrl = {
      fullPage: manifest.options_page,
      // always full tab
      embedded: manifest.options_ui?.page,
      // might be embedded / full tab
      popup: manifest.action?.default_popup
      // popup on the extension bar
    };
    return optionsPageUrl[optionType];
  }

  // src/background.ts
  createDefaultConfig("embedded", true);
})();
