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
    if (message) {
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
    // optional, accepts: function | undefined | null (default: true)
  });
  function parseAutoOptionsConfig(unknownConfig) {
    const result = /* @__PURE__ */ safeParse(AutoOptionsConfigSchema, unknownConfig);
    if (result.success) {
      autoOptionsConfig = result.output;
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
  var autoOptionsConfig;
  var OptionHandler = class {
    input;
    category;
    name;
    defaultValue;
    constructor(input) {
      this.input = input;
      this.category = this.getCategory;
      this.name = this.getName;
      this.defaultValue = this.input.getDefaultValue;
      this.init();
      supportedInputs.push(this);
    }
    // ----- INIT -------
    async init() {
      await this.setUI();
      this.addValueChangeEL();
    }
    get getCategory() {
      const category = this.input.getAOProperty("category");
      if (category !== null) {
        configHandler.addNewCategory(category);
      }
      return category;
    }
    get getName() {
      return this.input.isRadio ? this.input.el.name : this.input.el.id;
    }
    async setUI() {
      const isFirstTime = configHandler.isFirstTime;
      if (!isFirstTime) {
        this.input.setDisplayedValue = this.getStoredValue();
      } else {
        await this.setDefaultValue();
      }
    }
    addValueChangeEL() {
      if (!autoOptionsConfig.saveOnChange) return;
      this.input.el.addEventListener("change", async () => {
        await this.storeValue();
      });
    }
    // ------ CONFIG -------
    /**
     * Store the current value of the input.
    */
    async storeValue() {
      await configHandler.setOptionValue({
        category: this.category,
        name: this.name,
        value: this.getCurrentValue
      });
    }
    /**
     * Get the stored value of input.
     */
    getStoredValue() {
      return configHandler.getOptionValue({
        category: this.category,
        name: this.name
      });
    }
    /**
     * Set the value of the input to the default one.
     */
    async setDefaultValue() {
      if (this.input.isBoolean) {
        this.input.el.checked = this.defaultValue;
      } else {
        this.input.el.value = this.defaultValue;
        if (!this.isOnDefaultValue) {
          throw new AOError(`"${this.defaultValue}" is an invalid default value.`, this.input.el);
        }
      }
      await this.storeValue();
    }
    /**
     * Returns the current value of the input.
     */
    get getCurrentValue() {
      if (this.input.isCheckbox) {
        return this.input.el.checked;
      } else if (this.input.isRadio) {
        return this.input.el.id;
      } else {
        return this.input.el.value;
      }
    }
    /**
     * Returns true if the current value matches the default value.
     */
    get isOnDefaultValue() {
      return this.input.getCurrentValue === this.defaultValue;
    }
    /**
     * Returns true if the current value matches the stored value in storage.
     */
    get isOnStoredValue() {
      return this.input.getCurrentValue === this.getStoredValue();
    }
  };
  var supportedInputs = [];
  var isDate = (d) => d instanceof Date;
  var isEmpty = (o) => Object.keys(o).length === 0;
  var isObject = (o) => o != null && typeof o === "object";
  var hasOwnProperty = (o, ...args) => Object.prototype.hasOwnProperty.call(o, ...args);
  var isEmptyObject = (o) => isObject(o) && isEmpty(o);
  var makeObjectWithoutPrototype = () => /* @__PURE__ */ Object.create(null);
  var updatedDiff = (lhs, rhs) => {
    if (lhs === rhs) return {};
    if (!isObject(lhs) || !isObject(rhs)) return rhs;
    if (isDate(lhs) || isDate(rhs)) {
      if (lhs.valueOf() == rhs.valueOf()) return {};
      return rhs;
    }
    return Object.keys(rhs).reduce((acc, key) => {
      if (hasOwnProperty(lhs, key)) {
        const difference = updatedDiff(lhs[key], rhs[key]);
        if (isEmptyObject(difference) && !isDate(difference) && (isEmptyObject(lhs[key]) || !isEmptyObject(rhs[key])))
          return acc;
        acc[key] = difference;
        return acc;
      }
      return acc;
    }, makeObjectWithoutPrototype());
  };
  var updated_default = updatedDiff;
  function checkStoragePermission() {
    const isStorageAccessAllowed = chrome.storage !== void 0;
    if (!isStorageAccessAllowed) {
      throw new AOError(`Unable to access chrome storage. Try declaring the "storage" permission in the extension's manifest.`);
    }
  }
  async function setStoredConfig(storageName, config) {
    checkStoragePermission();
    await chrome.storage.sync.set({ [storageName]: config });
  }
  async function getFromStorage(storageName) {
    checkStoragePermission();
    const extensionStorageContent = await chrome.storage.sync.get();
    const storedConfig = extensionStorageContent[storageName];
    if (storedConfig !== void 0) {
      return storedConfig;
    } else {
      return null;
    }
  }
  function onSettingChange(storageName, callback) {
    return chrome.storage.onChanged.addListener((storage, storageType) => {
      const configuration = storage[storageName];
      if (storageType !== "sync" || !configuration) return;
      const diff = updated_default(configuration.oldValue, configuration.newValue);
      const hasCategory = typeof Object.values(diff)[0] === "object";
      const category = hasCategory ? Object.keys(diff)[0] : null;
      const [name] = category ? Object.keys(diff[category]) : Object.keys(diff);
      const [value] = category ? Object.values(diff[category]) : Object.values(diff);
      callback({
        category,
        name,
        value
      });
    });
  }
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
  function isEmpty2(value) {
    if (value.trim().length === 0) {
      return true;
    }
    return false;
  }
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
  function loadInputs() {
    const inputElements = Array.from(document.querySelectorAll("input"));
    inputElements.forEach((inputElement) => new InputBase(inputElement));
    validateInputs(supportedInputs);
  }
  function validateInputs(supportedInputs2) {
    const checkDuplicateIDs = () => {
      const IDs = supportedInputs2.map((inputElement) => inputElement.input.el.id);
      IDs.filter((item, index) => {
        if (IDs.indexOf(item) !== index) {
          throw new AOError(`'${item}' is a duplicate ID.`);
        }
      });
    };
    const checkNoInputs = () => {
      if (supportedInputs2.length === 0) {
        throw new AOError("No supported inputs were found in the document.");
      }
    };
    checkDuplicateIDs();
    checkNoInputs();
  }
  var InputBase = class {
    el;
    isCheckbox;
    isRadio;
    isBoolean;
    constructor(inputElement) {
      this.el = inputElement;
      this.isCheckbox = this.isType("checkbox");
      this.isRadio = this.isType("radio");
      this.isBoolean = this.isCheckbox || this.isRadio;
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
      if (!this.el.id) {
        throw new AOError("This input must have an ID set.", this.el);
      }
      if (this.isRadio && !this.el.name) {
        throw new AOError("All radio inputs must have a name set.", this.el);
      }
      return true;
    }
    get isIgnored() {
      const isTypeUnsupported = UNSUPPORTED_INPUT_TYPES.includes(this.el.type);
      const isIgnoredByDeveloper = this.hasAOProperty("ignore");
      const isIgnored = isTypeUnsupported || isIgnoredByDeveloper;
      return isIgnored;
    }
    // ********** PUBLIC ***************** //
    hasAOProperty(AOProperty2) {
      return this.el.hasAttribute(`${AOPropertyPrefix}-${AOProperty2}`);
    }
    getAOProperty(AOProperty2) {
      const AOPropertyValue = this.el.getAttribute(`${AOPropertyPrefix}-${AOProperty2}`);
      if (AOPropertyValue !== null && !isEmpty2(AOPropertyValue)) {
        return AOPropertyValue;
      }
      return null;
    }
    set setDisplayedValue(savedValue) {
      if (this.isCheckbox) {
        this.el.checked = savedValue;
      } else if (this.isRadio) {
        const isActiveRadio = this.el.id === savedValue;
        this.el.checked = isActiveRadio;
      } else {
        this.el.value = savedValue;
      }
    }
    get getCurrentValue() {
      if (this.isBoolean) {
        return this.el.checked;
      } else {
        return this.el.value;
      }
    }
    get getDefaultValue() {
      const defaultValue = getDefaultInputValue(this.el);
      if (this.isBoolean) {
        return this.hasAOProperty("default") ?? defaultValue;
      } else {
        return this.getAOProperty("value") ?? defaultValue;
      }
    }
  };
  var ConfigHandler = class {
    storageName;
    configuration;
    isFirstTime = false;
    /* ---- Loading / Saving Configuration ---- */
    async init() {
      this.storageName = autoOptionsConfig.storageName;
      this.configuration = await this.getConfig();
      loadInputs();
      this.handleFirstTime();
    }
    async getConfig() {
      const storedConfiguration = await getFromStorage(this.storageName);
      if (storedConfiguration !== null) {
        return storedConfiguration;
      } else {
        this.isFirstTime = true;
        return /* @__PURE__ */ Object.create(null);
      }
    }
    handleFirstTime() {
      if (this.isFirstTime) {
        if (autoOptionsConfig.installAction === null) {
          chrome.tabs.getCurrent((tab) => {
            const tabId = tab?.id;
            if (tabId) {
              chrome.tabs.remove(tabId);
            } else {
            }
          });
        } else {
          autoOptionsConfig.installAction();
        }
      }
    }
    async saveConfig() {
      await setStoredConfig(this.storageName, this.configuration);
    }
    // user does not need to give a category
    addNewCategory(category) {
      if (this.configuration[category] === void 0) {
        this.configuration[category] = /* @__PURE__ */ Object.create(null);
      }
    }
    /* ------------- Set / Get Option ---------------- */
    async setOptionValue(optionDetails) {
      const { category, name, value } = optionDetails;
      if (category !== null) {
        this.configuration[category][name] = value;
      } else {
        this.configuration[name] = value;
      }
      await this.saveConfig();
    }
    getOptionValue(optionDetails) {
      const { category, name } = optionDetails;
      if (category !== null) {
        return this.configuration[category][name];
      } else {
        return this.configuration[name];
      }
    }
    /* ------- API Stuff ------ */
    // checks are not strictly necessary, but an optimization
    // to avoid exceeding the MAX_WRITE_OPERATIONS_PER_MINUTE (120) quota
    async resetToDefault() {
      for (const input of supportedInputs) {
        if (!input.isOnDefaultValue) {
          await input.setDefaultValue();
        }
      }
    }
    async saveAll() {
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
  };
  var configHandler = /* @__PURE__ */ new ConfigHandler();
  var AutoOptions = class {
    constructor(autoOptionsConfig2) {
      parseAutoOptionsConfig(autoOptionsConfig2);
    }
    // load the configuration
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

  // src/script.ts
  (async () => {
  })();
  onSettingChange("a", (e) => {
    console.log(e);
  });

  // src/options.ts
  (async () => {
    const ao = new AutoOptions({
      "storageName": "page",
      installAction: function() {
        console.log("We need it to stay open !!!");
      }
    });
    await ao.loadConfig();
    document.querySelector("#reset")?.addEventListener("click", ao.resetToDefault);
    document.querySelector("#save")?.addEventListener("click", ao.saveAll);
  })();
})();
