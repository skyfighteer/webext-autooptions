# webext-autooptions

Zero-boilerplate wrapper for storing and retrieving Chrome Extension Preferences.

⚡ Built from scratch – fast, tree-shakeable, and bundler-friendly.\
🔌 Syncs HTML inputs to extension settings directly.\
🧠 Supports categories, defaults, and exclusions.

## Installation

```bash
npm install webext-autooptions
```

## Usage

### Manifest
The library internally uses the chrome storage API, which requires permission in your manifest.json.

```json
{
 ...
 "permissions": ["storage"]
 ...
}
```

This library requires three components to function correctly:
1. A background script to load default configurations on install.
2. An options page to handle user changes.
3. (A script to retrieve and react to configuration changes dynamically.)

### Background Script

A default config will be automatically created on the install of the extension, based on the default `ao-` values of your inputs. To set up the default configuration in the background script, you need to pass the type of option page you want to save settings in, and whether the page has an `installAction` set.

```javascript
import { setDefaultConfig } from "webext-autooptions";

setDefaultConfig('popup', false);
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

Load configurations in `options.js`:

```javascript
const AO = new AutoOptions({
    storageName: 'storageName'
})
await AO.loadConfig();
```

- `storageName`: (Required) The namespace for the saved settings.
- `saveOnChange`: (Optional) Set this to false to disable auto-saving changes. 
- `installAction`: (Optional) Set this to run a function on install inside your options file.

If `saveOnChange` is `false`, you can save manually by using:

```javascript
AO.saveAll();
```

Reset inputs to their default configuration:

```javascript
AO.resetToDefault();
```

### Content Script

Get the saved settings, and react to configuration changes dynamically in your scripts:

```javascript
import { getConfiguration, onSettingChange } from "autooptions";

const configuration = await getConfiguration('storageName');

onSettingChange('storageName', ({ category, name, value }) => {
  // Handle changes...
});
```

## Contributing

Contributions are welcome! Please submit an issue or pull request on GitHub.

## License

AutoOptions is released under the MIT License.