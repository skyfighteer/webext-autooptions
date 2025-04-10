import { configHandler, OptionValue, SettingDetails } from "./config-handler.ts";
import { AOError } from "../utils/error.ts";
import { InputBase } from "../inputs/input-base.ts";
import { autoOptionsConfig } from "../config.ts";

export class OptionHandler {
    readonly input: InputBase;
    readonly category: SettingDetails["category"];
    readonly name: HTMLInputElement['id'] | HTMLInputElement['name'];
    private readonly defaultValue: OptionValue;

    constructor(input: InputBase) {
        this.input = input;
        this.category = this.getCategory;
        this.name = this.getName;
        this.defaultValue = this.input.getDefaultValue;

        // async cannot be used inside constructors
        this.init();
        supportedInputs.push(this);
    }
    
    // ----- INIT -------

    private async init() {
        await this.setUI();
        this.addValueChangeEL();
    }

    private get getCategory() {
        const category = this.input.getAOProperty('category');

        if (category !== null) {
            configHandler.addNewCategory(category);
        }

        return category;
    }

    private get getName() {
        return this.input.isRadio ? this.input.el.name : this.input.el.id;
    }

    private async setUI() {
        const isFirstTime = configHandler.isFirstTime;

        // if it is not the first time, simply load the saved value
        if (!isFirstTime) {
            this.input.setDisplayedValue = this.getStoredValue();
        } else {           
            // set its value in config to default - this is the process of creating the default config
            await this.setDefaultValue();
        }
    }

    private addValueChangeEL() {
        if (!autoOptionsConfig.saveOnChange) return;

        // save new value upon change
        this.input.el.addEventListener('change', async () => {
            await this.storeValue();
        });
    }

    // ------ CONFIG -------

    /**
     * Store the current value of the input.
    */
    public async storeValue() {
        await configHandler.setOptionValue({
            category: this.category,
            name: this.name,
            value: this.getCurrentValue
        });
    }

    /**
     * Get the stored value of input.
     */
    private getStoredValue(): OptionValue {
        return configHandler.getOptionValue({
            category: this.category,
            name: this.name
        });
    }

    /**
     * Set the value of the input to the default one.
     */
    public async setDefaultValue() {
        if (this.input.isBoolean) {
            this.input.el.checked = this.defaultValue as boolean;
        } else {
            this.input.el.value = this.defaultValue as string;

            // after trying to set to the default value, if the html parser refused to set the value
            if (!this.isOnDefaultValue) {
                throw new AOError(`"${this.defaultValue}" is an invalid default value.`, this.input.el);
            }
        }

        // update configuration with new value
        await this.storeValue();
    }

    /**
     * Returns the current value of the input.
     */
    private get getCurrentValue(): OptionValue {
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
    public get isOnDefaultValue(): boolean {
        return this.input.getCurrentValue === this.defaultValue;
    }

    /**
     * Returns true if the current value matches the stored value in storage.
     */
    public get isOnStoredValue(): boolean {
        return this.input.getCurrentValue === this.getStoredValue();
    }
}

// every optionhandler is a supported "input"
export type SupportedInputs = OptionHandler[];

// all supported inputs in an array
export const supportedInputs: SupportedInputs = [];