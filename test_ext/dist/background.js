(() => {
  // ../dist/index.mjs
  var AOError = class extends Error {
    constructor(message, element) {
      super(message);
      this.name = `AutoOptions Error`;
      if (element) console.log(element);
    }
  };
  var manifest = chrome.runtime.getManifest();
  var isExtensionUnpacked = !("update_url" in manifest);
  function b(e) {
    return typeof e == "boolean";
  }
  var optionsPageTypes = ["fullPage", "embedded", "popup"];
  function isServiceWorker() {
    return "serviceWorker" in self;
  }
  function isStorageAccessAllowed() {
    return chrome.storage !== void 0;
  }
  function createTab(url, active) {
    chrome.tabs.create({
      url,
      active
    });
  }
  function getOptionsPageUrl(optionType) {
    const optionsPageTypesUrl = {
      fullPage: manifest.options_page,
      // always full tab
      embedded: manifest.options_ui?.page,
      // might be embedded / full tab
      popup: manifest.action?.default_popup
      // popup on the extension bar
    };
    const optionPageTypeUrl = optionsPageTypesUrl[optionType];
    if (!optionPageTypeUrl) {
      throw new AOError("The given options page does not exist. Check your manifest.json file.");
    }
    return optionPageTypeUrl;
  }
  async function createDefaultConfig(optionsPageType, hasInstallAction) {
    if (!isServiceWorker()) {
      throw new AOError('The "createDefaultConfig" function must be initiated from the background script.');
    }
    if (!isStorageAccessAllowed()) {
      throw new AOError(`Unable to access chrome storage. Try declaring the "storage" permission in the extension's manifest.`);
    }
    if (!optionsPageTypes.includes(optionsPageType)) {
      throw new AOError('"OptionsPageType" must be one of the following: "fullPage", "embedded", "popup".');
    }
    if (!b(hasInstallAction)) {
      throw new AOError('"hasInstallAction" must be a boolean.');
    }
    chrome.runtime.onInstalled.addListener(({ reason }) => {
      if (reason === "install") {
        const url = getOptionsPageUrl(optionsPageType);
        const isEmbedded = optionsPageType === "embedded" && manifest.options_ui?.open_in_tab === false;
        if (isEmbedded && hasInstallAction) {
          chrome.runtime.openOptionsPage();
        } else {
          createTab(url, hasInstallAction);
        }
      }
      if (isExtensionUnpacked) {
        return;
      }
      if (reason === "update") {
        const url = getOptionsPageUrl(optionsPageType);
        createTab(url, false);
      }
    });
  }
  var SUPPORTED_INPUT_TYPES = [
    "checkbox",
    "color",
    "date",
    "datetime-local",
    "email",
    "month",
    "number",
    "radio",
    "range",
    "tel",
    "text",
    "time",
    "url",
    "week"
  ];
  var UNSUPPORTED_INPUT_TYPES = [
    "button",
    // not actually an input
    "file",
    // can't save into chrome storage
    "hidden",
    // should not be saved 
    "submit",
    // not actually an input
    "image",
    // not actually an input
    "reset",
    // not actually an input
    "password",
    // confidential
    "search"
    // should not be saved
  ];
  var INPUT_TYPES = [
    ...SUPPORTED_INPUT_TYPES,
    ...UNSUPPORTED_INPUT_TYPES
  ];

  // src/background.ts
  createDefaultConfig("embedded", false);
})();
