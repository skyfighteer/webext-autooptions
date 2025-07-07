// src/utils/error.ts
var l = class extends Error {
  constructor(e, t) {
    super(e), this.name = "AutoOptions Error", t && console.log(t);
  }
};

// node_modules/valibot/dist/index.js
var j;
// @__NO_SIDE_EFFECTS__
function Y(n) {
  return {
    lang: n?.lang ?? j?.lang,
    message: n?.message,
    abortEarly: n?.abortEarly ?? j?.abortEarly,
    abortPipeEarly: n?.abortPipeEarly ?? j?.abortPipeEarly
  };
}
var de;
// @__NO_SIDE_EFFECTS__
function ge(n) {
  return de?.get(n);
}
var be;
// @__NO_SIDE_EFFECTS__
function ke(n) {
  return be?.get(n);
}
var xe;
// @__NO_SIDE_EFFECTS__
function Ee(n, e) {
  return xe?.get(n)?.get(e);
}
// @__NO_SIDE_EFFECTS__
function we(n) {
  let e = typeof n;
  return e === "string" ? `"${n}"` : e === "number" || e === "bigint" || e === "boolean" ? `${n}` : e === "object" || e === "function" ? (n && Object.getPrototypeOf(n)?.constructor?.name) ?? "null" : e;
}
function k(n, e, t, r, i) {
  let s = i && "input" in i ? i.input : t.value, u = i?.expected ?? n.expects ?? null, o = i?.received ?? /* @__PURE__ */ we(s), a = {
    kind: n.kind,
    type: n.type,
    input: s,
    expected: u,
    received: o,
    message: `Invalid ${e}: ${u ? `Expected ${u} but r` : "R"}eceived ${o}`,
    requirement: n.requirement,
    path: i?.path,
    issues: i?.issues,
    lang: r.lang,
    abortEarly: r.abortEarly,
    abortPipeEarly: r.abortPipeEarly
  }, f = n.kind === "schema", p = i?.message ?? n.message ?? /* @__PURE__ */ Ee(n.reference, a.lang) ?? (f ? /* @__PURE__ */ ke(a.lang) : null) ?? r.message ?? /* @__PURE__ */ ge(a.lang);
  p !== void 0 && (a.message = typeof p == "function" ? (
    // @ts-expect-error
    p(a)
  ) : p), f && (t.typed = !1), t.issues ? t.issues.push(a) : t.issues = [a];
}
// @__NO_SIDE_EFFECTS__
function x(n) {
  return {
    version: 1,
    vendor: "valibot",
    validate(e) {
      return n["~run"]({ value: e }, /* @__PURE__ */ Y());
    }
  };
}
// @__NO_SIDE_EFFECTS__
function Oe(n, e, t) {
  return typeof n.fallback == "function" ? (
    // @ts-expect-error
    n.fallback(e, t)
  ) : (
    // @ts-expect-error
    n.fallback
  );
}
// @__NO_SIDE_EFFECTS__
function P(n, e, t) {
  return typeof n.default == "function" ? (
    // @ts-expect-error
    n.default(e, t)
  ) : (
    // @ts-expect-error
    n.default
  );
}
// @__NO_SIDE_EFFECTS__
function C(n) {
  return {
    kind: "schema",
    type: "boolean",
    reference: C,
    expects: "boolean",
    async: !1,
    message: n,
    get "~standard"() {
      return /* @__PURE__ */ x(this);
    },
    "~run"(e, t) {
      return typeof e.value == "boolean" ? e.typed = !0 : k(this, "type", e, t), e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function V(n) {
  return {
    kind: "schema",
    type: "function",
    reference: V,
    expects: "Function",
    async: !1,
    message: n,
    get "~standard"() {
      return /* @__PURE__ */ x(this);
    },
    "~run"(e, t) {
      return typeof e.value == "function" ? e.typed = !0 : k(this, "type", e, t), e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function T(n, e) {
  return {
    kind: "schema",
    type: "nullish",
    reference: T,
    expects: `(${n.expects} | null | undefined)`,
    async: !1,
    wrapped: n,
    default: e,
    get "~standard"() {
      return /* @__PURE__ */ x(this);
    },
    "~run"(t, r) {
      return (t.value === null || t.value === void 0) && (this.default !== void 0 && (t.value = /* @__PURE__ */ P(this, t, r)), t.value === null || t.value === void 0) ? (t.typed = !0, t) : this.wrapped["~run"](t, r);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function N(n, e) {
  return {
    kind: "schema",
    type: "optional",
    reference: N,
    expects: `(${n.expects} | undefined)`,
    async: !1,
    wrapped: n,
    default: e,
    get "~standard"() {
      return /* @__PURE__ */ x(this);
    },
    "~run"(t, r) {
      return t.value === void 0 && (this.default !== void 0 && (t.value = /* @__PURE__ */ P(this, t, r)), t.value === void 0) ? (t.typed = !0, t) : this.wrapped["~run"](t, r);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function R(n, e) {
  return {
    kind: "schema",
    type: "strict_object",
    reference: R,
    expects: "Object",
    async: !1,
    entries: n,
    message: e,
    get "~standard"() {
      return /* @__PURE__ */ x(this);
    },
    "~run"(t, r) {
      let i = t.value;
      if (i && typeof i == "object") {
        t.typed = !0, t.value = {};
        for (let s in this.entries) {
          let u = this.entries[s];
          if (s in i || (u.type === "exact_optional" || u.type === "optional" || u.type === "nullish") && // @ts-expect-error
          u.default !== void 0) {
            let o = s in i ? (
              // @ts-expect-error
              i[s]
            ) : /* @__PURE__ */ P(u), a = u["~run"]({ value: o }, r);
            if (a.issues) {
              let f = {
                type: "object",
                origin: "value",
                input: i,
                key: s,
                value: o
              };
              for (let p of a.issues)
                p.path ? p.path.unshift(f) : p.path = [f], t.issues?.push(p);
              if (t.issues || (t.issues = a.issues), r.abortEarly) {
                t.typed = !1;
                break;
              }
            }
            a.typed || (t.typed = !1), t.value[s] = a.value;
          } else if (u.fallback !== void 0)
            t.value[s] = /* @__PURE__ */ Oe(u);
          else if (u.type !== "exact_optional" && u.type !== "optional" && u.type !== "nullish" && (k(this, "key", t, r, {
            input: void 0,
            expected: `"${s}"`,
            path: [
              {
                type: "object",
                origin: "key",
                input: i,
                key: s,
                // @ts-expect-error
                value: i[s]
              }
            ]
          }), r.abortEarly))
            break;
        }
        if (!t.issues || !r.abortEarly) {
          for (let s in i)
            if (!(s in this.entries)) {
              k(this, "key", t, r, {
                input: s,
                expected: "never",
                path: [
                  {
                    type: "object",
                    origin: "key",
                    input: i,
                    key: s,
                    // @ts-expect-error
                    value: i[s]
                  }
                ]
              });
              break;
            }
        }
      } else
        k(this, "type", t, r);
      return t;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function q(n) {
  return {
    kind: "schema",
    type: "string",
    reference: q,
    expects: "string",
    async: !1,
    message: n,
    get "~standard"() {
      return /* @__PURE__ */ x(this);
    },
    "~run"(e, t) {
      return typeof e.value == "string" ? e.typed = !0 : k(this, "type", e, t), e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function Q(n, e, t) {
  let r = n["~run"]({ value: e }, /* @__PURE__ */ Y(t));
  return {
    typed: r.typed,
    success: !r.issues,
    output: r.value,
    issues: r.issues
  };
}

// src/config.ts
var Ae = R({
  storageName: q(),
  // mandatory, accepts: string
  saveOnChange: N(C(), !0),
  // optional, accepts: boolean | undefined (default: true)
  installAction: T(V(), null)
  // optional, accepts: function | undefined | null (default: null)
}), y;
function ee(n) {
  let e = Q(Ae, n);
  if (e.success)
    y = Object.freeze(e.output);
  else
    throw e.issues.forEach((t) => {
      let r = t.message, i = t?.path;
      if (!i) {
        console.error(r);
        return;
      }
      let s = i[0].key;
      t.expected !== "never" ? console.error(`Invalid value for '${s}': ${r}.`) : console.error(`'${s}' is an invalid key.`);
    }), new l("Invalid init parameters.");
}
var m = !0, h = chrome.runtime.getManifest(), ne = !("update_url" in h);

// ../sky-helper/dist/index.mjs
function M(n) {
  return typeof n == "boolean";
}
function z(n) {
  return n !== null && typeof n == "object";
}

// src/utils/helper.ts
function te(n) {
  return n.trim().length !== 0;
}
function re(n) {
  return /\s/.test(n);
}

// src/background.ts
var De = ["fullPage", "embedded", "popup"];
function Ie() {
  return "serviceWorker" in self;
}
function $e() {
  return chrome.storage !== void 0;
}
function ie(n, e) {
  chrome.tabs.create({
    url: n,
    active: e
  });
}
function se(n) {
  let t = {
    fullPage: h.options_page,
    // always full tab
    embedded: h.options_ui?.page,
    // might be embedded / full tab
    popup: h.action?.default_popup
    // popup on the extension bar
  }[n];
  if (!t)
    throw new l("The given options page does not exist. Check your manifest.json file.");
  return t;
}
async function Se(n, e) {
  if (!Ie())
    throw new l('The "createDefaultConfig" function must be initiated from the background script.');
  if (!$e())
    throw new l(`Unable to access chrome storage. Try declaring the "storage" permission in the extension's manifest.`);
  if (!De.includes(n))
    throw new l('"OptionsPageType" must be one of the following: "fullPage", "embedded", "popup".');
  if (!M(e))
    throw new l('"hasInstallAction" must be a boolean.');
  chrome.runtime.onInstalled.addListener(({ reason: t }) => {
    if (t === "install") {
      let r = se(n);
      n === "embedded" && h.options_ui?.open_in_tab === !1 && e ? chrome.runtime.openOptionsPage() : ie(r, e);
    }
    if (!ne && t === "update") {
      let r = se(n);
      ie(r, !1);
    }
  });
}

// src/handlers/option-handler.ts
var A = class {
  input;
  category;
  name;
  defaultOptionValue;
  constructor(e) {
    this.input = e, this.category = this.getCategory, this.name = this.getName, this.defaultOptionValue = this.getDefaultOptionValue, this.init(), v.push(this);
  }
  // ----- INIT -------
  get getCategory() {
    return this.input.getAOProperty("category");
  }
  get getName() {
    return this.input.isRadio ? this.input.el.name : this.input.el.id;
  }
  get getDefaultOptionValue() {
    return this.input.isRadio ? this.input.hasAOProperty("default") ? this.getOptionValue : null : this.input.defaultValue;
  }
  async init() {
    this.addValueChangeEL();
  }
  async setUI() {
    this.input.setDisplayedValue = this.getStoredValue();
  }
  addValueChangeEL() {
    y.saveOnChange && this.input.el.addEventListener("change", async () => {
      m && console.log("Storing", this.input.el), await this.storeOptionValue();
    });
  }
  // ------ CONFIG -------
  /**
   * Store the current value of the input in the Chrome Storage.
  */
  async storeOptionValue() {
    await d.setOptionValue({
      category: this.category,
      name: this.name,
      value: this.getOptionValue
    });
  }
  /**
   * Get the stored option-value of input.
   */
  getStoredValue() {
    return d.getOptionValue({
      category: this.category,
      name: this.name
    });
  }
  /**
   * Returns the option-value of the input.
   */
  get getOptionValue() {
    return this.input.isCheckbox ? this.input.el.checked : this.input.isRadio ? this.input.el.id : this.input.el.value;
  }
  /**
   * Returns true if the current value matches the stored value in storage.
   */
  get isOnStoredOptionValue() {
    return this.input.isRadio && !this.input.el.checked ? !0 : this.getOptionValue === this.getStoredValue();
  }
};
async function ue() {
  for (let n of v)
    await n.setUI();
}
function U() {
  let n = {};
  return [...new Set(v.filter((t) => t.category !== null).map((t) => t.category))].map((t) => n[t] = {}), v.forEach((t) => {
    let r = t.category, i = t.name, s = t.defaultOptionValue;
    s !== null && (r ? n[r][i] = s : n[i] = s);
  }), n;
}
var v = [];

// node_modules/deep-object-diff/mjs/utils.js
var E = (n) => n instanceof Date, w = (n) => Object.keys(n).length === 0, c = (n) => n != null && typeof n == "object", g = (n, ...e) => Object.prototype.hasOwnProperty.call(n, ...e), O = (n) => c(n) && w(n), b = () => /* @__PURE__ */ Object.create(null);

// node_modules/deep-object-diff/mjs/added.js
var oe = (n, e) => n === e || !c(n) || !c(e) ? {} : Object.keys(e).reduce((t, r) => {
  if (g(n, r)) {
    let i = oe(n[r], e[r]);
    return c(i) && w(i) || (t[r] = i), t;
  }
  return t[r] = e[r], t;
}, b()), D = oe;

// node_modules/deep-object-diff/mjs/deleted.js
var le = (n, e) => n === e || !c(n) || !c(e) ? {} : Object.keys(n).reduce((t, r) => {
  if (g(e, r)) {
    let i = le(n[r], e[r]);
    return c(i) && w(i) || (t[r] = i), t;
  }
  return t[r] = void 0, t;
}, b()), I = le;

// node_modules/deep-object-diff/mjs/updated.js
var ae = (n, e) => n === e ? {} : !c(n) || !c(e) ? e : E(n) || E(e) ? n.valueOf() == e.valueOf() ? {} : e : Object.keys(e).reduce((t, r) => {
  if (g(n, r)) {
    let i = ae(n[r], e[r]);
    return O(i) && !E(i) && (O(n[r]) || !O(e[r])) || (t[r] = i), t;
  }
  return t;
}, b()), $ = ae;

// src/handlers/storage-handler.ts
async function S(n, e) {
  await chrome.storage.sync.set({ [n]: e });
}
async function _(n) {
  let t = (await chrome.storage.sync.get())[n];
  return t !== void 0 ? t : null;
}
async function je(n) {
  let e = await _(n);
  if (e !== null)
    return e;
  throw new l(`No stored configuration was found with the name of "${n}".`);
}
var G = class n {
  storageName;
  configuration;
  constructor(e, t) {
    this.storageName = e, this.configuration = t;
  }
  static async get(e) {
    let t = await je(e);
    return new n(e, t);
  }
  /**
   * Listens for changes in the storage and calls the callback function with the updated setting.
   * 
   * @param storageName - The name of the AutoOptions storage set in the options of your extension.
   * @param callback - A function that is called with the updated setting's category, name, and value.
   */
  onValueChange(e) {
    return chrome.storage.onChanged.addListener((t, r) => {
      let i = t[this.storageName];
      if (r !== "sync")
        return;
      let s = $(i.oldValue, i.newValue), o = typeof Object.values(s)[0] == "object" ? Object.keys(s)[0] : null, [a] = Object.keys(o ? s[o] : s), [f] = Object.values(o ? s[o] : s);
      this.updateConfiguration({ category: o, name: a, value: f }), e({
        category: o,
        name: a,
        value: f
      });
    });
  }
  getValue(e) {
    let { category: t, name: r } = e, i;
    if (t ? i = this.configuration[t][r] : i = this.configuration[r], i !== void 0)
      return i;
    throw new l(`The option "${r}" is not saved in the "${this.storageName}" configuration.`);
  }
  // ** INTERNAL ** //
  updateConfiguration(e) {
    let { category: t, name: r, value: i } = e;
    t !== null ? this.configuration[t][r] = i : this.configuration[r] = i;
  }
};

// src/inputs/input-types.ts
var Pe = [
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
], F = [
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
], Dn = [
  ...Pe,
  ...F
];

// src/inputs/input-ao-properties.ts
var L = "data-ao";

// src/inputs/default-value.ts
function Ce(n) {
  let e = Number(n.min), t = Number(n.max), r;
  return t < e ? r = e : r = Math.round(e + (t - e) / 2), r.toString();
}
function fe(n) {
  return {
    checkbox: !1,
    radio: !1,
    color: "#000000",
    date: "",
    "datetime-local": "",
    email: "",
    month: "",
    number: "",
    range: Ce(n),
    tel: "",
    text: "",
    time: "",
    url: "",
    week: ""
  }[n.type];
}

// src/inputs/input-base.ts
function ce() {
  Array.from(document.querySelectorAll("input")).forEach((e) => new X(e)), Ve(v);
}
function Ve(n) {
  let e = () => {
    let i = n.map((s) => s.input.el.id);
    i.filter((s, u) => {
      if (i.indexOf(s) !== u)
        throw new l(`'${s}' is a duplicate ID.`);
    });
  }, t = () => {
    if (n.length === 0)
      throw new l("No supported inputs were found in the document.");
  }, r = () => {
    let s = n.filter((o) => o.input.isRadio).reduce((o, a) => {
      let f = a.name;
      return o[f] || (o[f] = []), o[f].push(a), o;
    }, {});
    if (Object.values(s).some((o) => o.filter(
      (f) => f.input.hasAOProperty("default")
    ).length !== 1))
      throw new l('Every radio input group must have exactly one input with the property "ao-default"!');
  };
  e(), t(), r();
}
var X = class {
  el;
  isCheckbox;
  isRadio;
  isBoolean;
  defaultValue;
  constructor(e) {
    this.el = e, this.isCheckbox = this.isType("checkbox"), this.isRadio = this.isType("radio"), this.isBoolean = this.isCheckbox || this.isRadio, this.defaultValue = this.getDefaultValue, this.isSupported && new A(this);
  }
  isType(e) {
    return this.el.type === e;
  }
  get isSupported() {
    if (this.isIgnored)
      return !1;
    if (!this.el.id)
      throw new l("This input must have an ID set.", this.el);
    if (this.isRadio && !this.el.name)
      throw new l("All radio inputs must have a name set.", this.el);
    if (!this.isBoolean && this.hasAOProperty("default"))
      throw new l('Only boolean inputs can have a "default" ao-property.', this.el);
    if (this.isBoolean && this.getAOProperty("value") !== null)
      throw new l('Only non-boolean inputs can have a "value" ao-property.', this.el);
    return !0;
  }
  get isIgnored() {
    let e = F.includes(this.el.type), t = this.hasAOProperty("ignore");
    return e || t;
  }
  // ********** AO-PROPERTY ***************** //
  hasAOProperty(e) {
    return this.el.hasAttribute(`${L}-${e}`);
  }
  getAOProperty(e) {
    let t = this.el.getAttribute(`${L}-${e}`);
    if (t === null || !te(t))
      return null;
    if (re(t))
      throw new l("An ao-property might not contain whitespace.", this.el);
    return t;
  }
  // ********** CURRENT-VALUE ***************** //
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
  //**** DEFAULT VALUE OF INPUT ******/
  get getDefaultValue() {
    let e = fe(this.el);
    return this.isBoolean ? this.hasAOProperty("default") ? !0 : e : this.getAOProperty("value") ?? e;
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
    if (this.isBoolean)
      this.el.checked = this.defaultValue;
    else if (this.el.value = this.defaultValue, !this.isOnDefaultValue)
      throw new l(`"${this.defaultValue}" is an invalid default value.`, this.el);
  }
};

// node_modules/compare-versions/lib/esm/utils.js
var Te = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i, W = (n) => {
  if (typeof n != "string")
    throw new TypeError("Invalid argument expected string");
  let e = n.match(Te);
  if (!e)
    throw new Error(`Invalid argument not valid semver ('${n}' received)`);
  return e.shift(), e;
}, pe = (n) => n === "*" || n === "x" || n === "X", ye = (n) => {
  let e = parseInt(n, 10);
  return isNaN(e) ? n : e;
}, Ne = (n, e) => typeof n != typeof e ? [String(n), String(e)] : [n, e], Re = (n, e) => {
  if (pe(n) || pe(e))
    return 0;
  let [t, r] = Ne(ye(n), ye(e));
  return t > r ? 1 : t < r ? -1 : 0;
}, B = (n, e) => {
  for (let t = 0; t < Math.max(n.length, e.length); t++) {
    let r = Re(n[t] || "0", e[t] || "0");
    if (r !== 0)
      return r;
  }
  return 0;
};

// node_modules/compare-versions/lib/esm/compareVersions.js
var H = (n, e) => {
  let t = W(n), r = W(e), i = t.pop(), s = r.pop(), u = B(t, r);
  return u !== 0 ? u : i && s ? B(i.split("."), s.split(".")) : i || s ? i ? -1 : 1 : 0;
};

// src/handlers/lifecycle-handler.ts
async function he() {
  await J(), y.installAction === null ? qe() : y.installAction();
}
async function ve() {
  let n = h.version, e = await Me(), t = H(n, e) === 1;
  return t && m && console.log(`Extension version updated: ${e} \u2192 ${n}`), t;
}
function qe() {
  chrome.tabs.getCurrent((n) => {
    let e = n?.id;
    chrome.tabs.remove(e);
  });
}
function me(n, e) {
  let t = structuredClone(n), r = structuredClone(e), i = t, s = D(t, r), u = I(t, r);
  m && (console.log("Extension has been updated, migrating settings..."), console.log("Removing ", u), console.log("Adding ", s));
  for (let o in u)
    if (z(u[o]))
      for (let f in u[o])
        delete i[o][f];
    else
      delete i[o];
  return Object.assign(i, s), i;
}
async function Me() {
  return await _("extensionVersion");
}
async function J() {
  await S("extensionVersion", h.version);
}

// src/handlers/config-handler.ts
var Z = class {
  storageName;
  configuration;
  isFirstTime = !1;
  /* ---- Loading / Saving Configuration ---- */
  async init() {
    this.storageName = y.storageName, ce(), await this.loadConfig(), await this.handleExtensionLifecycle();
  }
  async loadConfig() {
    let e = await _(this.storageName);
    e !== null ? await this.setConfig(e) : (this.isFirstTime = !0, await this.resetToDefault());
  }
  async setConfig(e) {
    this.configuration = e, await this.storeConfig(), await ue();
  }
  async storeConfig() {
    await S(this.storageName, this.configuration);
  }
  async handleExtensionLifecycle() {
    if (this.isFirstTime) {
      await he();
      return;
    }
    if (await ve()) {
      await J();
      let e = U(), t = me(this.configuration, e);
      await this.setConfig(t);
    }
  }
  /* ------------- Set / Get Option ---------------- */
  async setOptionValue(e) {
    let { category: t, name: r, value: i } = e;
    t !== null ? this.configuration[t][r] = i : this.configuration[r] = i, await this.storeConfig();
  }
  getOptionValue(e) {
    let { category: t, name: r } = e;
    return t !== null ? this.configuration[t][r] : this.configuration[r];
  }
  /* ------- API Stuff ------ */
  async resetToDefault() {
    let e = U();
    await this.setConfig(e);
  }
  async saveAll() {
    if (y.saveOnChange === !0) {
      console.warn("Calling 'saveAll()' on AutoOptions is redundant when 'saveOnChange' is enabled.");
      return;
    }
    for (let e of v)
      e.isOnStoredOptionValue || (m && console.log("Manually saving", e), await e.storeOptionValue());
  }
}, d = /* @__PURE__ */ new Z();

// src/options.ts
var K = class {
  constructor(e) {
    ee(e);
  }
  // load the configuration (note: should only be ran after DOMContentLoaded)
  async loadConfig() {
    await d.init();
  }
  // Reset AutoOptions to default configuration.
  async resetToDefault() {
    await d.resetToDefault();
  }
  // Save all configurations to chrome storage.
  async saveAll() {
    await d.saveAll();
  }
};
export {
  K as AutoOptions,
  G as StoredOptions,
  Se as createDefaultConfig
};
