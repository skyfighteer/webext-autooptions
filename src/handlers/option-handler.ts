import { configHandler, Option } from "./config-handler.ts";
import { InputBase } from "../inputs/input-base.ts";
import { autoOptionsConfig, isDebug } from "../config.ts";

export class OptionHandler {
    readonly input: InputBase;
    readonly category: Option.Category | null;
    readonly name: HTMLInputElement['id'] | HTMLInputElement['name'];
    readonly defaultOptionValue: Option.Value | null;

    constructor(input: InputBase) {
        this.input = input;
        this.category = this.getCategory;
        this.name = this.getName;
        this.defaultOptionValue = this.getDefaultOptionValue;

        // async cannot be used inside constructors
        this.init();
        supportedOptions.push(this);
    }
    
    // ----- INIT -------

    private get getCategory() {
        const category = this.input.getAOProperty('category');
        return category;
    }

    private get getName() {
        return this.input.isRadio ? this.input.el.name : this.input.el.id;
    }

    private get getDefaultOptionValue() {
        // special handling for radios here
        if (this.input.isRadio) {
            return this.input.hasAOProperty('default') ? this.getOptionValue : null;
        }
        return this.input.defaultValue;
    }

    private async init() {
        this.addValueChangeEL();
    }

    public async setUI() {
        this.input.setDisplayedValue = this.getStoredValue();
    }

    private addValueChangeEL() {
        if (!autoOptionsConfig.saveOnChange) return;

        // save new value upon change
        this.input.el.addEventListener('change', async () => {
            if (isDebug) {
                console.log('Storing', this.input.el);
            }
            await this.storeOptionValue();
        });
    }

    // ------ CONFIG -------

    /**
     * Store the current value of the input in the Chrome Storage.
    */
    public async storeOptionValue() {
        await configHandler.setOptionValue({
            category: this.category,
            name: this.name,
            value: this.getOptionValue
        });
    }

    /**
     * Get the stored option-value of input.
     */
    private getStoredValue(): Option.Value {
        return configHandler.getOptionValue({
            category: this.category,
            name: this.name
        });
    }

    /**
     * Returns the option-value of the input.
     */
    public get getOptionValue(): Option.Value {
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
    public get isOnStoredOptionValue(): boolean {
        // disregard unchecked radios
        if (this.input.isRadio && !this.input.el.checked) {
            return true;
        }

        return this.getOptionValue === this.getStoredValue();
    }
}

export async function loadUI() {
    for (const option of supportedOptions) {
        await option.setUI();
    }
}

export function getDefaultConfig() {
    let defaultConfig: Record<string, any> = {};

    // get the array of unique categories
    const categories = [...new Set(supportedOptions
        .filter(input => input.category !== null)
        .map(input => input.category))] as string[];

    // add categories to config
    categories.map(category => defaultConfig[category] = {})

    // add settings
    supportedOptions.forEach(option => {
        const category = option.category;
        const name = option.name;
        const value = option.defaultOptionValue;

        // return if it's a non-default radio
        if (value === null) return;

        if (category) {
            defaultConfig[category][name] = value;
        } else {
            defaultConfig[name] = value;
        }
    })

    return defaultConfig;
}

// every optionhandler is a supported "input"
export type SupportedOptions = OptionHandler[];

// all supported inputs in an array
export const supportedOptions: SupportedOptions = [];