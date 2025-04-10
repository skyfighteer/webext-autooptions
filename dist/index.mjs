// src/utils/error.ts
var s = class extends Error {
  constructor(e, t) {
    super(e), this.name = "AutoOptions Error", t && console.log(t);
  }
};

// src/background.ts
function H() {
  return "serviceWorker" in self;
}
function J(n, e) {
  if (!H())
    throw new s('The "createDefaultConfig" function must be initiated from the background script.');
  return chrome.runtime.onInstalled.addListener((t) => {
    if (t.reason === "install") {
      let r = Z(n);
      if (!r)
        throw new s("The given options page does not exist. Check your manifest.json file.");
      n === "embedded" && chrome.runtime.getManifest().options_ui?.open_in_tab === !1 && e ? chrome.runtime.openOptionsPage() : K(r, e);
    }
  });
}
function K(n, e) {
  chrome.tabs.create({
    url: n,
    active: e
  });
}
function Z(n) {
  let e = chrome.runtime.getManifest();
  return {
    fullPage: e.options_page,
    // always full tab
    embedded: e.options_ui?.page,
    // might be embedded / full tab
    popup: e.action?.default_popup
    // popup on the extension bar
  }[n];
}

// node_modules/valibot/dist/index.js
var O;
// @__NO_SIDE_EFFECTS__
function R(n) {
  return {
    lang: n?.lang ?? O?.lang,
    message: n?.message,
    abortEarly: n?.abortEarly ?? O?.abortEarly,
    abortPipeEarly: n?.abortPipeEarly ?? O?.abortPipeEarly
  };
}
var Y;
// @__NO_SIDE_EFFECTS__
function Q(n) {
  return Y?.get(n);
}
var ee;
// @__NO_SIDE_EFFECTS__
function ne(n) {
  return ee?.get(n);
}
var te;
// @__NO_SIDE_EFFECTS__
function re(n, e) {
  return te?.get(n)?.get(e);
}
// @__NO_SIDE_EFFECTS__
function ie(n) {
  let e = typeof n;
  return e === "string" ? `"${n}"` : e === "number" || e === "bigint" || e === "boolean" ? `${n}` : e === "object" || e === "function" ? (n && Object.getPrototypeOf(n)?.constructor?.name) ?? "null" : e;
}
function v(n, e, t, r, i) {
  let u = i && "input" in i ? i.input : t.value, o = i?.expected ?? n.expects ?? null, f = i?.received ?? /* @__PURE__ */ ie(u), l = {
    kind: n.kind,
    type: n.type,
    input: u,
    expected: o,
    received: f,
    message: `Invalid ${e}: ${o ? `Expected ${o} but r` : "R"}eceived ${f}`,
    requirement: n.requirement,
    path: i?.path,
    issues: i?.issues,
    lang: r.lang,
    abortEarly: r.abortEarly,
    abortPipeEarly: r.abortPipeEarly
  }, y = n.kind === "schema", p = i?.message ?? n.message ?? /* @__PURE__ */ re(n.reference, l.lang) ?? (y ? /* @__PURE__ */ ne(l.lang) : null) ?? r.message ?? /* @__PURE__ */ Q(l.lang);
  p && (l.message = typeof p == "function" ? (
    // @ts-expect-error
    p(l)
  ) : p), y && (t.typed = !1), t.issues ? t.issues.push(l) : t.issues = [l];
}
// @__NO_SIDE_EFFECTS__
function m(n) {
  return {
    version: 1,
    vendor: "valibot",
    validate(e) {
      return n["~run"]({ value: e }, /* @__PURE__ */ R());
    }
  };
}
// @__NO_SIDE_EFFECTS__
function ue(n, e, t) {
  return typeof n.fallback == "function" ? (
    // @ts-expect-error
    n.fallback(e, t)
  ) : (
    // @ts-expect-error
    n.fallback
  );
}
// @__NO_SIDE_EFFECTS__
function _(n, e, t) {
  return typeof n.default == "function" ? (
    // @ts-expect-error
    n.default(e, t)
  ) : (
    // @ts-expect-error
    n.default
  );
}
// @__NO_SIDE_EFFECTS__
function D(n) {
  return {
    kind: "schema",
    type: "boolean",
    reference: D,
    expects: "boolean",
    async: !1,
    message: n,
    get "~standard"() {
      return /* @__PURE__ */ m(this);
    },
    "~run"(e, t) {
      return typeof e.value == "boolean" ? e.typed = !0 : v(this, "type", e, t), e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function A(n) {
  return {
    kind: "schema",
    type: "function",
    reference: A,
    expects: "Function",
    async: !1,
    message: n,
    get "~standard"() {
      return /* @__PURE__ */ m(this);
    },
    "~run"(e, t) {
      return typeof e.value == "function" ? e.typed = !0 : v(this, "type", e, t), e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function I(n, e) {
  return {
    kind: "schema",
    type: "nullish",
    reference: I,
    expects: `(${n.expects} | null | undefined)`,
    async: !1,
    wrapped: n,
    default: e,
    get "~standard"() {
      return /* @__PURE__ */ m(this);
    },
    "~run"(t, r) {
      return (t.value === null || t.value === void 0) && (this.default !== void 0 && (t.value = /* @__PURE__ */ _(this, t, r)), t.value === null || t.value === void 0) ? (t.typed = !0, t) : this.wrapped["~run"](t, r);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function $(n, e) {
  return {
    kind: "schema",
    type: "optional",
    reference: $,
    expects: `(${n.expects} | undefined)`,
    async: !1,
    wrapped: n,
    default: e,
    get "~standard"() {
      return /* @__PURE__ */ m(this);
    },
    "~run"(t, r) {
      return t.value === void 0 && (this.default !== void 0 && (t.value = /* @__PURE__ */ _(this, t, r)), t.value === void 0) ? (t.typed = !0, t) : this.wrapped["~run"](t, r);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function j(n, e) {
  return {
    kind: "schema",
    type: "strict_object",
    reference: j,
    expects: "Object",
    async: !1,
    entries: n,
    message: e,
    get "~standard"() {
      return /* @__PURE__ */ m(this);
    },
    "~run"(t, r) {
      let i = t.value;
      if (i && typeof i == "object") {
        t.typed = !0, t.value = {};
        for (let u in this.entries) {
          let o = this.entries[u];
          if (u in i || (o.type === "exact_optional" || o.type === "optional" || o.type === "nullish") && // @ts-expect-error
          o.default !== void 0) {
            let f = u in i ? (
              // @ts-expect-error
              i[u]
            ) : /* @__PURE__ */ _(o), l = o["~run"]({ value: f }, r);
            if (l.issues) {
              let y = {
                type: "object",
                origin: "value",
                input: i,
                key: u,
                value: f
              };
              for (let p of l.issues)
                p.path ? p.path.unshift(y) : p.path = [y], t.issues?.push(p);
              if (t.issues || (t.issues = l.issues), r.abortEarly) {
                t.typed = !1;
                break;
              }
            }
            l.typed || (t.typed = !1), t.value[u] = l.value;
          } else if (o.fallback !== void 0)
            t.value[u] = /* @__PURE__ */ ue(o);
          else if (o.type !== "exact_optional" && o.type !== "optional" && o.type !== "nullish" && (v(this, "key", t, r, {
            input: void 0,
            expected: `"${u}"`,
            path: [
              {
                type: "object",
                origin: "key",
                input: i,
                key: u,
                // @ts-expect-error
                value: i[u]
              }
            ]
          }), r.abortEarly))
            break;
        }
        if (!t.issues || !r.abortEarly) {
          for (let u in i)
            if (!(u in this.entries)) {
              v(this, "key", t, r, {
                input: u,
                expected: "never",
                path: [
                  {
                    type: "object",
                    origin: "key",
                    input: i,
                    key: u,
                    // @ts-expect-error
                    value: i[u]
                  }
                ]
              });
              break;
            }
        }
      } else
        v(this, "type", t, r);
      return t;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function S(n) {
  return {
    kind: "schema",
    type: "string",
    reference: S,
    expects: "string",
    async: !1,
    message: n,
    get "~standard"() {
      return /* @__PURE__ */ m(this);
    },
    "~run"(e, t) {
      return typeof e.value == "string" ? e.typed = !0 : v(this, "type", e, t), e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function M(n, e, t) {
  let r = n["~run"]({ value: e }, /* @__PURE__ */ R(t));
  return {
    typed: r.typed,
    success: !r.issues,
    output: r.value,
    issues: r.issues
  };
}

// src/config.ts
var oe = j({
  storageName: S(),
  // mandatory, accepts: string
  saveOnChange: $(D(), !0),
  // optional, accepts: boolean | undefined (default: true)
  installAction: I(A(), null)
  // optional, accepts: function | undefined | null (default: true)
});
function z(n) {
  let e = M(oe, n);
  if (e.success)
    a = e.output;
  else
    throw e.issues.forEach((t) => {
      let r = t.message, i = t?.path;
      if (!i) {
        console.error(r);
        return;
      }
      let u = i[0].key;
      t.expected !== "never" ? console.error(`Invalid value for '${u}': ${r}.`) : console.error(`'${u}' is an invalid key.`);
    }), new s("Invalid init parameters.");
}
var a;

// src/handlers/option-handler.ts
var E = class {
  input;
  category;
  name;
  defaultValue;
  constructor(e) {
    this.input = e, this.category = this.getCategory, this.name = this.getName, this.defaultValue = this.input.getDefaultValue, this.init(), d.push(this);
  }
  // ----- INIT -------
  async init() {
    await this.setUI(), this.addValueChangeEL();
  }
  get getCategory() {
    let e = this.input.getAOProperty("category");
    return e !== null && c.addNewCategory(e), e;
  }
  get getName() {
    return this.input.isRadio ? this.input.el.name : this.input.el.id;
  }
  async setUI() {
    c.isFirstTime ? await this.setDefaultValue() : this.input.setDisplayedValue = this.getStoredValue();
  }
  addValueChangeEL() {
    a.saveOnChange && this.input.el.addEventListener("change", async () => {
      await this.storeValue();
    });
  }
  // ------ CONFIG -------
  /**
   * Store the current value of the input.
  */
  async storeValue() {
    await c.setOptionValue({
      category: this.category,
      name: this.name,
      value: this.getCurrentValue
    });
  }
  /**
   * Get the stored value of input.
   */
  getStoredValue() {
    return c.getOptionValue({
      category: this.category,
      name: this.name
    });
  }
  /**
   * Set the value of the input to the default one.
   */
  async setDefaultValue() {
    if (this.input.isBoolean)
      this.input.el.checked = this.defaultValue;
    else if (this.input.el.value = this.defaultValue, !this.isOnDefaultValue)
      throw new s(`"${this.defaultValue}" is an invalid default value.`, this.input.el);
    await this.storeValue();
  }
  /**
   * Returns the current value of the input.
   */
  get getCurrentValue() {
    return this.input.isCheckbox ? this.input.el.checked : this.input.isRadio ? this.input.el.id : this.input.el.value;
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
}, d = [];

// node_modules/deep-object-diff/mjs/utils.js
var g = (n) => n instanceof Date, P = (n) => Object.keys(n).length === 0, h = (n) => n != null && typeof n == "object", b = (n, ...e) => Object.prototype.hasOwnProperty.call(n, ...e), k = (n) => h(n) && P(n), x = () => /* @__PURE__ */ Object.create(null);

// node_modules/deep-object-diff/mjs/updated.js
var G = (n, e) => n === e ? {} : !h(n) || !h(e) ? e : g(n) || g(e) ? n.valueOf() == e.valueOf() ? {} : e : Object.keys(e).reduce((t, r) => {
  if (b(n, r)) {
    let i = G(n[r], e[r]);
    return k(i) && !g(i) && (k(n[r]) || !k(e[r])) || (t[r] = i), t;
  }
  return t;
}, x()), w = G;

// src/handlers/storage-handler.ts
function U() {
  if (!(chrome.storage !== void 0))
    throw new s(`Unable to access chrome storage. Try declaring the "storage" permission in the extension's manifest.`);
}
async function F(n, e) {
  U(), await chrome.storage.sync.set({ [n]: e });
}
async function C(n) {
  U();
  let t = (await chrome.storage.sync.get())[n];
  return t !== void 0 ? t : null;
}
async function pe(n) {
  let e = await C(n);
  if (e !== null)
    return e;
  throw new s(`No stored configuration was found with the name of "${n}".`);
}
function ce(n, e) {
  return chrome.storage.onChanged.addListener((t, r) => {
    let i = t[n];
    if (r !== "sync" || !i) return;
    let u = w(i.oldValue, i.newValue), f = typeof Object.values(u)[0] == "object" ? Object.keys(u)[0] : null, [l] = Object.keys(f ? u[f] : u), [y] = Object.values(f ? u[f] : u);
    e({
      category: f,
      name: l,
      value: y
    });
  });
}

// src/inputs/input-types.ts
var L = [
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

// src/utils/helper.ts
function X(n) {
  return n.trim().length === 0;
}

// src/inputs/input-ao-properties.ts
var V = "data-ao";

// src/inputs/default-value.ts
function ae(n) {
  let e = Number(n.min), t = Number(n.max), r;
  return t < e ? r = e : r = Math.round(e + (t - e) / 2), r.toString();
}
function W(n) {
  return {
    checkbox: !1,
    radio: !1,
    color: "#000000",
    date: "",
    "datetime-local": "",
    email: "",
    month: "",
    number: "",
    range: ae(n),
    tel: "",
    text: "",
    time: "",
    url: "",
    week: ""
  }[n.type];
}

// src/inputs/input-base.ts
function B() {
  Array.from(document.querySelectorAll("input")).forEach((e) => new T(e)), ye(d);
}
function ye(n) {
  let e = () => {
    let r = n.map((i) => i.input.el.id);
    r.filter((i, u) => {
      if (r.indexOf(i) !== u)
        throw new s(`'${i}' is a duplicate ID.`);
    });
  }, t = () => {
    if (n.length === 0)
      throw new s("No supported inputs were found in the document.");
  };
  e(), t();
}
var T = class {
  el;
  isCheckbox;
  isRadio;
  isBoolean;
  constructor(e) {
    this.el = e, this.isCheckbox = this.isType("checkbox"), this.isRadio = this.isType("radio"), this.isBoolean = this.isCheckbox || this.isRadio, this.isSupported && new E(this);
  }
  isType(e) {
    return this.el.type === e;
  }
  get isSupported() {
    if (this.isIgnored)
      return !1;
    if (!this.el.id)
      throw new s("This input must have an ID set.", this.el);
    if (this.isRadio && !this.el.name)
      throw new s("All radio inputs must have a name set.", this.el);
    return !0;
  }
  get isIgnored() {
    let e = L.includes(this.el.type), t = this.hasAOProperty("ignore");
    return e || t;
  }
  // ********** PUBLIC ***************** //
  hasAOProperty(e) {
    return this.el.hasAttribute(`${V}-${e}`);
  }
  getAOProperty(e) {
    let t = this.el.getAttribute(`${V}-${e}`);
    return t !== null && !X(t) ? t : null;
  }
  set setDisplayedValue(e) {
    if (this.isCheckbox)
      this.el.checked = e;
    else if (this.isRadio) {
      let t = this.el.id === e;
      this.el.checked = t;
    } else
      this.el.value = e;
  }
  get getCurrentValue() {
    return this.isBoolean ? this.el.checked : this.el.value;
  }
  get getDefaultValue() {
    let e = W(this.el);
    return this.isBoolean ? this.hasAOProperty("default") ?? e : this.getAOProperty("value") ?? e;
  }
};

// src/handlers/config-handler.ts
var N = class {
  storageName;
  configuration;
  isFirstTime = !1;
  /* ---- Loading / Saving Configuration ---- */
  async init() {
    this.storageName = a.storageName, this.configuration = await this.getConfig(), B(), this.handleFirstTime();
  }
  async getConfig() {
    let e = await C(this.storageName);
    return e !== null ? e : (this.isFirstTime = !0, /* @__PURE__ */ Object.create(null));
  }
  handleFirstTime() {
    this.isFirstTime && (a.installAction === null ? chrome.tabs.getCurrent((e) => {
      let t = e?.id;
      chrome.tabs.remove(t);
    }) : a.installAction());
  }
  async saveConfig() {
    await F(this.storageName, this.configuration);
  }
  // user does not need to give a category
  addNewCategory(e) {
    this.configuration[e] === void 0 && (this.configuration[e] = /* @__PURE__ */ Object.create(null));
  }
  /* ------------- Set / Get Option ---------------- */
  async setOptionValue(e) {
    let { category: t, name: r, value: i } = e;
    t !== null ? this.configuration[t][r] = i : this.configuration[r] = i, await this.saveConfig();
  }
  getOptionValue(e) {
    let { category: t, name: r } = e;
    return t !== null ? this.configuration[t][r] : this.configuration[r];
  }
  /* ------- API Stuff ------ */
  // checks are not strictly necessary, but an optimization
  // to avoid exceeding the MAX_WRITE_OPERATIONS_PER_MINUTE (120) quota
  async resetToDefault() {
    for (let e of d)
      e.isOnDefaultValue || await e.setDefaultValue();
  }
  async saveAll() {
    if (a.saveOnChange === !0) {
      console.warn("Calling 'saveAll()' on AutoOptions is redundant when 'saveOnChange' is enabled.");
      return;
    }
    for (let e of d)
      e.isOnStoredValue || await e.storeValue();
  }
}, c = /* @__PURE__ */ new N();

// src/options.ts
var q = class {
  constructor(e) {
    z(e);
  }
  // load the configuration
  async loadConfig() {
    await c.init();
  }
  // Reset AutoOptions to default configuration.
  async resetToDefault() {
    await c.resetToDefault();
  }
  // Save all configurations to chrome storage.
  async saveAll() {
    await c.saveAll();
  }
};
export {
  q as AutoOptions,
  J as createDefaultConfig,
  pe as getConfiguration,
  ce as onSettingChange
};
