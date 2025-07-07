# webext-autooptions

Zero-boilerplate wrapper for storing and retrieving user-settings in your Chrome Extension.

⚡ Built from scratch – fast, tree-shakeable, and bundler-friendly.\
🔌 Syncs HTML inputs to extension settings directly. Automatically created default settings.\
🧠 Supports categories, defaults, exclusions.\
🛠️ Compatible with both JavaScript and TypeScript projects.

## Installation

```bash
npm install webext-autooptions
```

## Usage

### Manifest
The library internally uses the chrome storage API, which requires permission in your manifest.json.

```json
{
 "permissions": ["storage"]
}
```

This library requires three components to function correctly:
1. A background script to load default configurations on install (and migrate settings on update).
2. An options page where the user can change the settings. You can have multiple option pages (e.g. an embedded and a popup).
3. A script, where you can retrieve the stored configuration, and react to any setting change in real-time.

### Background Script

A default config is automatically created when the extension is first installed, using the default `ao-` values from your inputs. Changes in your settings between extension versions are automatically migrated on update.

To set this up in the background script, specify:

- `optionsPageType` (Required, `fullPage` | `embedded` | `popup`): Type of options page you're using.
- `hasInstallAction` (Required, boolean): Set this option to `true` if your options page defines an `installAction` function, false otherwise.

```javascript
import { setDefaultConfig } from "webext-autooptions";

setDefaultConfig('embedded', false);
```

### Options HTML
The library automatically handles and validates HTML inputs.

- Inputs must have an `id`. Radio inputs require a `name`.
- Do NOT use the basic HTML attributes for inputs like `checked` or `value`. Instead, use `data-ao-` attributes for configuration:
  - `data-ao-default`: Marks an input as checked by default.
  - `data-ao-value=""`: Defines a default value for an input.
  - `data-ao-category=""`: Groups inputs under a category.
  - `data-ao-ignore`: Excludes an input from being saved.

### Options Script
Load the configuration in the options.

```javascript
import { AutoOptions } from "webext-autooptions";

const AO = new AutoOptions({
  storageName: 'storageName'
})

document.addEventListener('DOMContentLoaded', async () => {
  await AO.loadConfig();
});
```

- `storageName` (Required, string): A unique namespace for storing settings. Each AutoOptions instance in your extension must use a different name.
- `saveOnChange` (Optional, boolean): If set to `false`, changes will only be saved on user input. Defaults to `true`.
- `installAction` (Optional, function): A function to run once during the initial installation.

If `saveOnChange` is `false`, you can save manually by using:

```javascript
AO.saveAll();
```

Use this function to reset inputs to their default configuration:

```javascript
AO.resetToDefault();
```

### Content Script
Get the saved settings, and react to configuration changes dynamically in your scripts:

```javascript
import { StoredOptions } from "webext-autooptions";

const storedOptions = await StoredOptions.get(CONFIG_NAME);

storedOptions.onValueChange(settingDetails => {
  const { category, name, value } = settingDetails;

  if (category === "ui" && name === "background-color") {
    changeBackgroundColor(value);
  }
})

const storedBackgroundColor = storedOptions.getValue({
  category: "ui",
  name: "background-color"
})
```

## License
AutoOptions is released under the MIT License.