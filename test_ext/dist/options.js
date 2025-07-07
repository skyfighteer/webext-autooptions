(() => {
  // ../dist/index.mjs
  var AOError = class extends Error {
    constructor(message, element) {
      super(message);
      this.name = `AutoOptions Error`;
      if (element) console.log(element);
    }
  };
  var store;
  // @__NO_SIDE_EFFECTS__
  function getGlobalConfig(config2) {
    return {
      lang: config2?.lang ?? store?.lang,
      message: config2?.message,
      abortEarly: config2?.abortEarly ?? store?.abortEarly,
      abortPipeEarly: config2?.abortPipeEarly ?? store?.abortPipeEarly
    };
  }
  var store2;
  // @__NO_SIDE_EFFECTS__
  function getGlobalMessage(lang) {
    return store2?.get(lang);
  }
  var store3;
  // @__NO_SIDE_EFFECTS__
  function getSchemaMessage(lang) {
    return store3?.get(lang);
  }
  var store4;
  // @__NO_SIDE_EFFECTS__
  function getSpecificMessage(reference, lang) {
    return store4?.get(reference)?.get(lang);
  }
  // @__NO_SIDE_EFFECTS__
  function _stringify(input) {
    const type = typeof input;
    if (type === "string") {
      return `"${input}"`;
    }
    if (type === "number" || type === "bigint" || type === "boolean") {
      return `${input}`;
    }
    if (type === "object" || type === "function") {
      return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
    }
    return type;
  }
  function _addIssue(context, label, dataset, config2, other) {
    const input = other && "input" in other ? other.input : dataset.value;
    const expected = other?.expected ?? context.expects ?? null;
    const received = other?.received ?? /* @__PURE__ */ _stringify(input);
    const issue = {
      kind: context.kind,
      type: context.type,
      input,
      expected,
      received,
      message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
      requirement: context.requirement,
      path: other?.path,
      issues: other?.issues,
      lang: config2.lang,
      abortEarly: config2.abortEarly,
      abortPipeEarly: config2.abortPipeEarly
    };
    const isSchema = context.kind === "schema";
    const message = other?.message ?? context.message ?? /* @__PURE__ */ getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config2.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
    if (message !== void 0) {
      issue.message = typeof message === "function" ? (
        // @ts-expect-error
        message(issue)
      ) : message;
    }
    if (isSchema) {
      dataset.typed = false;
    }
    if (dataset.issues) {
      dataset.issues.push(issue);
    } else {
      dataset.issues = [issue];
    }
  }
  // @__NO_SIDE_EFFECTS__
  function _getStandardProps(context) {
    return {
      version: 1,
      vendor: "valibot",
      validate(value2) {
        return context["~run"]({ value: value2 }, /* @__PURE__ */ getGlobalConfig());
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function getFallback(schema, dataset, config2) {
    return typeof schema.fallback === "function" ? (
      // @ts-expect-error
      schema.fallback(dataset, config2)
    ) : (
      // @ts-expect-error
      schema.fallback
    );
  }
  // @__NO_SIDE_EFFECTS__
  function getDefault(schema, dataset, config2) {
    return typeof schema.default === "function" ? (
      // @ts-expect-error
      schema.default(dataset, config2)
    ) : (
      // @ts-expect-error
      schema.default
    );
  }
  // @__NO_SIDE_EFFECTS__
  function boolean(message) {
    return {
      kind: "schema",
      type: "boolean",
      reference: boolean,
      expects: "boolean",
      async: false,
      message,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (typeof dataset.value === "boolean") {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function function_(message) {
    return {
      kind: "schema",
      type: "function",
      reference: function_,
      expects: "Function",
      async: false,
      message,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (typeof dataset.value === "function") {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function nullish(wrapped, default_) {
    return {
      kind: "schema",
      type: "nullish",
      reference: nullish,
      expects: `(${wrapped.expects} | null | undefined)`,
      async: false,
      wrapped,
      default: default_,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (dataset.value === null || dataset.value === void 0) {
          if (this.default !== void 0) {
            dataset.value = /* @__PURE__ */ getDefault(this, dataset, config2);
          }
          if (dataset.value === null || dataset.value === void 0) {
            dataset.typed = true;
            return dataset;
          }
        }
        return this.wrapped["~run"](dataset, config2);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function optional(wrapped, default_) {
    return {
      kind: "schema",
      type: "optional",
      reference: optional,
      expects: `(${wrapped.expects} | undefined)`,
      async: false,
      wrapped,
      default: default_,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (dataset.value === void 0) {
          if (this.default !== void 0) {
            dataset.value = /* @__PURE__ */ getDefault(this, dataset, config2);
          }
          if (dataset.value === void 0) {
            dataset.typed = true;
            return dataset;
          }
        }
        return this.wrapped["~run"](dataset, config2);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function strictObject(entries, message) {
    return {
      kind: "schema",
      type: "strict_object",
      reference: strictObject,
      expects: "Object",
      async: false,
      entries,
      message,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        const input = dataset.value;
        if (input && typeof input === "object") {
          dataset.typed = true;
          dataset.value = {};
          for (const key in this.entries) {
            const valueSchema = this.entries[key];
            if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && // @ts-expect-error
            valueSchema.default !== void 0) {
              const value2 = key in input ? (
                // @ts-expect-error
                input[key]
              ) : /* @__PURE__ */ getDefault(valueSchema);
              const valueDataset = valueSchema["~run"]({ value: value2 }, config2);
              if (valueDataset.issues) {
                const pathItem = {
                  type: "object",
                  origin: "value",
                  input,
                  key,
                  value: value2
                };
                for (const issue of valueDataset.issues) {
                  if (issue.path) {
                    issue.path.unshift(pathItem);
                  } else {
                    issue.path = [pathItem];
                  }
                  dataset.issues?.push(issue);
                }
                if (!dataset.issues) {
                  dataset.issues = valueDataset.issues;
                }
                if (config2.abortEarly) {
                  dataset.typed = false;
                  break;
                }
              }
              if (!valueDataset.typed) {
                dataset.typed = false;
              }
              dataset.value[key] = valueDataset.value;
            } else if (valueSchema.fallback !== void 0) {
              dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
            } else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
              _addIssue(this, "key", dataset, config2, {
                input: void 0,
                expected: `"${key}"`,
                path: [
                  {
                    type: "object",
                    origin: "key",
                    input,
                    key,
                    // @ts-expect-error
                    value: input[key]
                  }
                ]
              });
              if (config2.abortEarly) {
                break;
              }
            }
          }
          if (!dataset.issues || !config2.abortEarly) {
            for (const key in input) {
              if (!(key in this.entries)) {
                _addIssue(this, "key", dataset, config2, {
                  input: key,
                  expected: "never",
                  path: [
                    {
                      type: "object",
                      origin: "key",
                      input,
                      key,
                      // @ts-expect-error
                      value: input[key]
                    }
                  ]
                });
                break;
              }
            }
          }
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function string(message) {
    return {
      kind: "schema",
      type: "string",
      reference: string,
      expects: "string",
      async: false,
      message,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config2) {
        if (typeof dataset.value === "string") {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function safeParse(schema, input, config2) {
    const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config2));
    return {
      typed: dataset.typed,
      success: !dataset.issues,
      output: dataset.value,
      issues: dataset.issues
    };
  }
  var AutoOptionsConfigSchema = /* @__PURE__ */ strictObject({
    storageName: /* @__PURE__ */ string(),
    // mandatory, accepts: string
    saveOnChange: /* @__PURE__ */ optional(/* @__PURE__ */ boolean(), true),
    // optional, accepts: boolean | undefined (default: true)
    installAction: /* @__PURE__ */ nullish(/* @__PURE__ */ function_(), null)
    // optional, accepts: function | undefined | null (default: null)
  });
  var autoOptionsConfig;
  function parseAutoOptionsConfig(unknownConfig) {
    const result = /* @__PURE__ */ safeParse(AutoOptionsConfigSchema, unknownConfig);
    if (result.success) {
      autoOptionsConfig = Object.freeze(result.output);
    } else {
      result.issues.forEach((issue) => {
        const errorMessage = issue.message;
        const path = issue?.path;
        if (!path) {
          console.error(errorMessage);
          return;
        }
        const key = path[0].key;
        if (issue.expected !== "never") {
          console.error(`Invalid value for '${key}': ${errorMessage}.`);
        } else {
          console.error(`'${key}' is an invalid key.`);
        }
      });
      throw new AOError("Invalid init parameters.");
    }
  }
  var isDebug = true;
  var manifest = chrome.runtime.getManifest();
  var isExtensionUnpacked = !("update_url" in manifest);
  function P(e) {
    return e !== null && typeof e == "object";
  }
  function hasText(string2) {
    return string2.trim().length !== 0;
  }
  function hasWhiteSpace(string2) {
    return /\s/.test(string2);
  }
  var OptionHandler = class {
    input;
    category;
    name;
    defaultOptionValue;
    constructor(input) {
      this.input = input;
      this.category = this.getCategory;
      this.name = this.getName;
      this.defaultOptionValue = this.getDefaultOptionValue;
      this.init();
      supportedOptions.push(this);
    }
    // ----- INIT -------
    get getCategory() {
      const category = this.input.getAOProperty("category");
      return category;
    }
    get getName() {
      return this.input.isRadio ? this.input.el.name : this.input.el.id;
    }
    get getDefaultOptionValue() {
      if (this.input.isRadio) {
        return this.input.hasAOProperty("default") ? this.getOptionValue : null;
      }
      return this.input.defaultValue;
    }
    async init() {
      this.addValueChangeEL();
    }
    async setUI() {
      this.input.setDisplayedValue = this.getStoredValue();
    }
    addValueChangeEL() {
      if (!autoOptionsConfig.saveOnChange) return;
      this.input.el.addEventListener("change", async () => {
        if (isDebug) {
          console.log("Storing", this.input.el);
        }
        await this.storeOptionValue();
      });
    }
    // ------ CONFIG -------
    /**
     * Store the current value of the input in the Chrome Storage.
    */
    async storeOptionValue() {
      await configHandler.setOptionValue({
        category: this.category,
        name: this.name,
        value: this.getOptionValue
      });
    }
    /**
     * Get the stored option-value of input.
     */
    getStoredValue() {
      return configHandler.getOptionValue({
        category: this.category,
        name: this.name
      });
    }
    /**
     * Returns the option-value of the input.
     */
    get getOptionValue() {
      if (this.input.isCheckbox) {
        return this.input.el.checked;
      } else if (this.input.isRadio) {
        return this.input.el.id;
      } else {
        return this.input.el.value;
      }
    }
    /**
     * Returns true if the current value matches the stored value in storage.
     */
    get isOnStoredOptionValue() {
      if (this.input.isRadio && !this.input.el.checked) {
        return true;
      }
      return this.getOptionValue === this.getStoredValue();
    }
  };
  async function loadUI() {
    for (const option of supportedOptions) {
      await option.setUI();
    }
  }
  function getDefaultConfig() {
    let defaultConfig = {};
    const categories = [...new Set(supportedOptions.filter((input) => input.category !== null).map((input) => input.category))];
    categories.map((category) => defaultConfig[category] = {});
    supportedOptions.forEach((option) => {
      const category = option.category;
      const name = option.name;
      const value = option.defaultOptionValue;
      if (value === null) return;
      if (category) {
        defaultConfig[category][name] = value;
      } else {
        defaultConfig[name] = value;
      }
    });
    return defaultConfig;
  }
  var supportedOptions = [];
  var isEmpty = (o) => Object.keys(o).length === 0;
  var isObject = (o) => o != null && typeof o === "object";
  var hasOwnProperty = (o, ...args) => Object.prototype.hasOwnProperty.call(o, ...args);
  var makeObjectWithoutPrototype = () => /* @__PURE__ */ Object.create(null);
  var addedDiff = (lhs, rhs) => {
    if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};
    return Object.keys(rhs).reduce((acc, key) => {
      if (hasOwnProperty(lhs, key)) {
        const difference = addedDiff(lhs[key], rhs[key]);
        if (isObject(difference) && isEmpty(difference)) return acc;
        acc[key] = difference;
        return acc;
      }
      acc[key] = rhs[key];
      return acc;
    }, makeObjectWithoutPrototype());
  };
  var added_default = addedDiff;
  var deletedDiff = (lhs, rhs) => {
    if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};
    return Object.keys(lhs).reduce((acc, key) => {
      if (hasOwnProperty(rhs, key)) {
        const difference = deletedDiff(lhs[key], rhs[key]);
        if (isObject(difference) && isEmpty(difference)) return acc;
        acc[key] = difference;
        return acc;
      }
      acc[key] = void 0;
      return acc;
    }, makeObjectWithoutPrototype());
  };
  var deleted_default = deletedDiff;
  async function setItemInStorage(storageName, item) {
    await chrome.storage.sync.set({ [storageName]: item });
  }
  async function getItemFromStorage(storageName) {
    const extensionStorageContent = await chrome.storage.sync.get();
    const storedConfig = extensionStorageContent[storageName];
    if (storedConfig !== void 0) {
      return storedConfig;
    } else {
      return null;
    }
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
  var AOPropertyPrefix = "data-ao";
  function getDefaultRange(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    let defaultValue;
    if (max < min) {
      defaultValue = min;
    } else {
      defaultValue = Math.round(min + (max - min) / 2);
    }
    return defaultValue.toString();
  }
  function getDefaultInputValue(inputEl) {
    const defaultInputValues = {
      "checkbox": false,
      "radio": false,
      "color": "#000000",
      "date": "",
      "datetime-local": "",
      "email": "",
      "month": "",
      "number": "",
      "range": getDefaultRange(inputEl),
      "tel": "",
      "text": "",
      "time": "",
      "url": "",
      "week": ""
    };
    return defaultInputValues[inputEl.type];
  }
  function handleInputs() {
    const inputElements = Array.from(document.querySelectorAll("input"));
    inputElements.forEach((inputElement) => new InputBase(inputElement));
    validateInputs(supportedOptions);
  }
  function validateInputs(supportedOptions2) {
    const checkDuplicateIDs = () => {
      const IDs = supportedOptions2.map((option) => option.input.el.id);
      IDs.filter((item, index) => {
        if (IDs.indexOf(item) !== index) {
          throw new AOError(`'${item}' is a duplicate ID.`);
        }
      });
    };
    const checkNoInputs = () => {
      if (supportedOptions2.length === 0) {
        throw new AOError("No supported inputs were found in the document.");
      }
    };
    const checkRadioGroups = () => {
      const radios = supportedOptions2.filter((option) => option.input.isRadio);
      const groups = radios.reduce((groupMap, radio) => {
        const groupName = radio.name;
        if (!groupMap[groupName]) {
          groupMap[groupName] = [];
        }
        groupMap[groupName].push(radio);
        return groupMap;
      }, {});
      const hasInvalidGroup = Object.values(groups).some((optionHandlers) => {
        const defaultCount = optionHandlers.filter(
          (optionHandler) => optionHandler.input.hasAOProperty("default")
        ).length;
        return defaultCount !== 1;
      });
      if (hasInvalidGroup) {
        throw new AOError('Every radio input group must have exactly one input with the property "ao-default"!');
      }
    };
    checkDuplicateIDs();
    checkNoInputs();
    checkRadioGroups();
  }
  var InputBase = class {
    el;
    isCheckbox;
    isRadio;
    isBoolean;
    defaultValue;
    constructor(inputElement) {
      this.el = inputElement;
      this.isCheckbox = this.isType("checkbox");
      this.isRadio = this.isType("radio");
      this.isBoolean = this.isCheckbox || this.isRadio;
      this.defaultValue = this.getDefaultValue;
      if (this.isSupported) {
        new OptionHandler(this);
      }
    }
    isType(type) {
      return this.el.type === type;
    }
    get isSupported() {
      if (this.isIgnored) {
        return false;
      }
      console.log(this.el.type);
      if (!INPUT_TYPES.includes(this.el.type)) {
        throw new AOError("This input must have a valid input type.", this.el);
      }
      if (!this.el.id) {
        throw new AOError("This input must have an ID set.", this.el);
      }
      if (this.isRadio && !this.el.name) {
        throw new AOError("All radio inputs must have a name set.", this.el);
      }
      if (!this.isBoolean && this.hasAOProperty("default")) {
        throw new AOError('Only boolean inputs can have a "default" ao-property.', this.el);
      }
      if (this.isBoolean && this.getAOProperty("value") !== null) {
        throw new AOError('Only non-boolean inputs can have a "value" ao-property.', this.el);
      }
      return true;
    }
    get isIgnored() {
      const isTypeUnsupported = UNSUPPORTED_INPUT_TYPES.includes(this.el.type);
      const isIgnoredByDeveloper = this.hasAOProperty("ignore");
      const isIgnored = isTypeUnsupported || isIgnoredByDeveloper;
      return isIgnored;
    }
    // ********** AO-PROPERTY ***************** //
    hasAOProperty(AOProperty) {
      return this.el.hasAttribute(`${AOPropertyPrefix}-${AOProperty}`);
    }
    getAOProperty(AOProperty) {
      const AOPropertyValue = this.el.getAttribute(`${AOPropertyPrefix}-${AOProperty}`);
      if (AOPropertyValue === null) {
        return null;
      }
      if (!hasText(AOPropertyValue)) {
        return null;
      }
      if (hasWhiteSpace(AOPropertyValue)) {
        throw new AOError("An ao-property might not contain whitespace.", this.el);
      }
      return AOPropertyValue;
    }
    // ********** CURRENT-VALUE ***************** //
    set setDisplayedValue(optionValue) {
      if (this.isCheckbox) {
        this.el.checked = optionValue;
      } else if (this.isRadio) {
        const isActive = this.el.id === optionValue;
        this.el.checked = isActive;
      } else {
        this.el.value = optionValue;
      }
    }
    get getCurrentValue() {
      if (this.isBoolean) {
        return this.el.checked;
      } else {
        return this.el.value;
      }
    }
    //**** DEFAULT VALUE OF INPUT ******/
    get getDefaultValue() {
      const defaultValue = getDefaultInputValue(this.el);
      if (this.isBoolean) {
        return this.hasAOProperty("default") ? true : defaultValue;
      } else {
        return this.getAOProperty("value") ?? defaultValue;
      }
    }
    /**
     * Returns true if the current value matches the default value.
     */
    get isOnDefaultValue() {
      return this.getCurrentValue === this.defaultValue;
    }
    /**
     * Set the value of the input to the default one. TODO save after
     */
    async setDefaultValue() {
      if (this.isBoolean) {
        this.el.checked = this.defaultValue;
      } else {
        this.el.value = this.defaultValue;
        if (!this.isOnDefaultValue) {
          throw new AOError(`"${this.defaultValue}" is an invalid default value.`, this.el);
        }
      }
    }
  };
  var semver = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
  var validateAndParse = (version) => {
    if (typeof version !== "string") {
      throw new TypeError("Invalid argument expected string");
    }
    const match = version.match(semver);
    if (!match) {
      throw new Error(`Invalid argument not valid semver ('${version}' received)`);
    }
    match.shift();
    return match;
  };
  var isWildcard = (s) => s === "*" || s === "x" || s === "X";
  var tryParse = (v) => {
    const n = parseInt(v, 10);
    return isNaN(n) ? v : n;
  };
  var forceType = (a, b2) => typeof a !== typeof b2 ? [String(a), String(b2)] : [a, b2];
  var compareStrings = (a, b2) => {
    if (isWildcard(a) || isWildcard(b2))
      return 0;
    const [ap, bp] = forceType(tryParse(a), tryParse(b2));
    if (ap > bp)
      return 1;
    if (ap < bp)
      return -1;
    return 0;
  };
  var compareSegments = (a, b2) => {
    for (let i = 0; i < Math.max(a.length, b2.length); i++) {
      const r = compareStrings(a[i] || "0", b2[i] || "0");
      if (r !== 0)
        return r;
    }
    return 0;
  };
  var compareVersions = (v1, v2) => {
    const n1 = validateAndParse(v1);
    const n2 = validateAndParse(v2);
    const p1 = n1.pop();
    const p2 = n2.pop();
    const r = compareSegments(n1, n2);
    if (r !== 0)
      return r;
    if (p1 && p2) {
      return compareSegments(p1.split("."), p2.split("."));
    } else if (p1 || p2) {
      return p1 ? -1 : 1;
    }
    return 0;
  };
  async function onExtensionInstall() {
    await storeExtensionVersion();
    if (autoOptionsConfig.installAction === null) {
      closeTab();
    } else {
      autoOptionsConfig.installAction();
    }
  }
  async function isExtensionUpdated() {
    const currentVersion = manifest.version;
    const storedVersion = await getStoredExtensionVersion();
    const isExtensionUpdated2 = compareVersions(currentVersion, storedVersion) === 1;
    if (isExtensionUpdated2) {
      if (isDebug) {
        console.log(`Extension version updated: ${storedVersion} \u2192 ${currentVersion}`);
      }
    }
    return isExtensionUpdated2;
  }
  function closeTab() {
    chrome.tabs.getCurrent((tab) => {
      const tabId = tab?.id;
      chrome.tabs.remove(tabId);
    });
  }
  function getUpdatedConfig(_source, _target) {
    const source = structuredClone(_source);
    const target = structuredClone(_target);
    const result = source;
    const addedKeys = added_default(source, target);
    const deletedKeys = deleted_default(source, target);
    if (isDebug) {
      console.log("Extension has been updated, migrating settings...");
      console.log("Removing ", deletedKeys);
      console.log("Adding ", addedKeys);
    }
    for (let key in deletedKeys) {
      const isInsideCategory = P(deletedKeys[key]);
      if (isInsideCategory) {
        for (let deletedKey in deletedKeys[key]) {
          delete result[key][deletedKey];
        }
      } else {
        delete result[key];
      }
    }
    Object.assign(result, addedKeys);
    return result;
  }
  async function getStoredExtensionVersion() {
    return await getItemFromStorage("extensionVersion");
  }
  async function storeExtensionVersion() {
    await setItemInStorage("extensionVersion", manifest.version);
  }
  var ConfigHandler = class {
    storageName;
    configuration;
    isFirstTime = false;
    /* ---- Loading / Saving Configuration ---- */
    async init() {
      this.storageName = autoOptionsConfig.storageName;
      handleInputs();
      await this.loadConfig();
      await this.handleExtensionLifecycle();
    }
    async loadConfig() {
      const storedConfig = await getItemFromStorage(this.storageName);
      if (storedConfig !== null) {
        await this.setConfig(storedConfig);
      } else {
        this.isFirstTime = true;
        await this.resetToDefault();
      }
    }
    async setConfig(config) {
      this.configuration = config;
      await this.storeConfig();
      await loadUI();
    }
    async storeConfig() {
      await setItemInStorage(this.storageName, this.configuration);
    }
    async handleExtensionLifecycle() {
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
    async setOptionValue(settingDetails) {
      const { category, name, value } = settingDetails;
      if (category !== null) {
        this.configuration[category][name] = value;
      } else {
        this.configuration[name] = value;
      }
      await this.storeConfig();
    }
    getOptionValue(settingDetails) {
      const { category, name } = settingDetails;
      if (category !== null) {
        return this.configuration[category][name];
      } else {
        return this.configuration[name];
      }
    }
    /* ------- API Stuff ------ */
    async resetToDefault() {
      const defaultConfig = getDefaultConfig();
      await this.setConfig(defaultConfig);
    }
    async saveAll() {
      if (autoOptionsConfig.saveOnChange === true) {
        console.warn("Calling 'saveAll()' on AutoOptions is redundant when 'saveOnChange' is enabled.");
        return;
      }
      for (const input of supportedOptions) {
        if (!input.isOnStoredOptionValue) {
          if (isDebug) {
            console.log("Manually saving", input);
          }
          await input.storeOptionValue();
        }
      }
    }
  };
  var configHandler = /* @__PURE__ */ new ConfigHandler();
  var AutoOptions = class {
    constructor(autoOptionsConfig2) {
      parseAutoOptionsConfig(autoOptionsConfig2);
    }
    // load the configuration (note: should only be ran after DOMContentLoaded)
    async loadConfig() {
      await configHandler.init();
    }
    // Reset AutoOptions to default configuration.
    async resetToDefault() {
      await configHandler.resetToDefault();
    }
    // Save all configurations to chrome storage.
    async saveAll() {
      await configHandler.saveAll();
    }
  };

  // src/options.ts
  (async () => {
    const ao = new AutoOptions({
      "storageName": "myStoredConfig",
      "saveOnChange": false,
      installAction: function() {
        console.log("Welcome message.");
      }
    });
    await ao.loadConfig();
    document.querySelector("#reset")?.addEventListener("click", ao.resetToDefault);
    document.querySelector("#save")?.addEventListener("click", ao.saveAll);
  })();
})();
