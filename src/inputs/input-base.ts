import { OptionHandler, supportedOptions, type SupportedOptions } from "../handlers/option-handler";
import { Option } from "../handlers/config-handler";
import { UnsupportedInputType, UNSUPPORTED_INPUT_TYPES, InputType, INPUT_TYPES } from "./input-types";
import { AOFlagProperty, AOValueProperty, AOPropertyPrefix } from "./input-ao-properties";
import { getDefaultInputValue } from "./default-value";
import { AOError } from "../utils/error";
import { hasWhiteSpace, hasText } from "../utils/helper";

type InputValue = string | boolean;

function handleInputs() {
    const inputElements = Array.from(document.querySelectorAll('input'));
    inputElements.forEach(inputElement => new InputBase(inputElement));
    validateInputs(supportedOptions);
}

function validateInputs(supportedOptions: SupportedOptions) {
    // Check for duplicate IDs among the inputs
    const checkDuplicateIDs = () => {
        const IDs = supportedOptions.map(option => option.input.el.id);

        IDs.filter((item, index) => {
            if (IDs.indexOf(item) !== index) {
                throw new AOError(`'${item}' is a duplicate ID.`);
            }
        });
    };

    // Handle the case when no supported inputs are found
    const checkNoInputs = () => {
        if (supportedOptions.length === 0) {
            throw new AOError('No supported inputs were found in the document.');
        }
    };

    // Exactly ne must be checked by default in every radio group
    const checkRadioGroups = () => {
        const radios = supportedOptions.filter(option => option.input.isRadio);
        const groups = radios.reduce<Record<string, OptionHandler[]>>((groupMap, radio) => {
            const groupName = radio.name;
          
            if (!groupMap[groupName]) {
              groupMap[groupName] = [];
            }
          
            groupMap[groupName].push(radio);
          
            return groupMap;
          }, {});

        const hasInvalidGroup = Object.values(groups).some(optionHandlers => {
            const defaultCount = optionHandlers.filter(
                optionHandler => optionHandler.input.hasAOProperty('default')
            ).length;
            return defaultCount !== 1;
        });
        
        if (hasInvalidGroup) {
            throw new AOError('Every radio input group must have exactly one input with the property "ao-default"!');
        }
    }

    checkDuplicateIDs();
    checkNoInputs();
    checkRadioGroups();
}

class InputBase {
    readonly el: HTMLInputElement;
    readonly isCheckbox: boolean;
    readonly isRadio: boolean;
    readonly isBoolean: boolean;
    readonly defaultValue: InputValue;

    constructor(inputElement: HTMLInputElement) {
        this.el = inputElement;
        this.isCheckbox = this.isType('checkbox');
        this.isRadio = this.isType('radio');
        this.isBoolean = this.isCheckbox || this.isRadio;
        this.defaultValue = this.getDefaultValue;

        if (this.isSupported) {
            new OptionHandler(this);
        }
    }

    private isType(type: InputType) {
        return this.el.type === type;
    }

    private get isSupported() {
        if (this.isIgnored) {
            return false;
        }

        // note: invalid types are returned as text internally

        // no id
        if (!this.el.id) {
            throw new AOError('This input must have an ID set.', this.el);
        }

        // no name for radio
        if (this.isRadio && !this.el.name) {
            throw new AOError('All radio inputs must have a name set.', this.el);
        }

        // wrong default
        if (!this.isBoolean && this.hasAOProperty('default')) {
            throw new AOError('Only boolean inputs can have a "default" ao-property.', this.el);
        }

        // wrong value
        if (this.isBoolean && this.getAOProperty('value') !== null) {
            throw new AOError('Only non-boolean inputs can have a "value" ao-property.', this.el);
        }

        return true;
    }

    private get isIgnored() {
        // is excluded because of its type
        const isTypeUnsupported = UNSUPPORTED_INPUT_TYPES.includes(this.el.type as UnsupportedInputType);

        // is excluded because of dev request
        const isIgnoredByDeveloper = this.hasAOProperty('ignore');

        const isIgnored = isTypeUnsupported || isIgnoredByDeveloper;
        return isIgnored;
    }

    // ********** AO-PROPERTY ***************** //

    public hasAOProperty(AOProperty: AOFlagProperty) {
        return this.el.hasAttribute(`${AOPropertyPrefix}-${AOProperty}`);
    }

    public getAOProperty(AOProperty: AOValueProperty) {
        const AOPropertyValue = this.el.getAttribute(`${AOPropertyPrefix}-${AOProperty}`);
    
        if (AOPropertyValue === null) {
            return null; // No attribute found
        }
    
        if (!hasText(AOPropertyValue)) {
            return null; // Empty or whitespace-only string
        }
    
        if (hasWhiteSpace(AOPropertyValue)) {
            throw new AOError('An ao-property might not contain whitespace.', this.el);
        }
    
        return AOPropertyValue;
    }

    // ********** CURRENT-VALUE ***************** //
    
    public set setDisplayedValue(optionValue: Option.Value) {
        if (this.isCheckbox) {
            this.el.checked = optionValue as boolean;
        } else if (this.isRadio) {
            const isActive = this.el.id === optionValue;
            this.el.checked = isActive;
        } else {
            this.el.value = optionValue as string;
        }
    }

    public get getCurrentValue(): InputValue {
        if (this.isBoolean) {
            return this.el.checked;
        } else {
            return this.el.value;
        }
    }

    //**** DEFAULT VALUE OF INPUT ******/

    private get getDefaultValue(): InputValue {
        const defaultValue = getDefaultInputValue(this.el);

        if (this.isBoolean) {
            return this.hasAOProperty('default') ? true : defaultValue; // defaultValue = false
        } else {
            return this.getAOProperty('value') ?? defaultValue;
        }
    }

    /**
     * Returns true if the current value matches the default value.
     */
    public get isOnDefaultValue(): boolean {
        return this.getCurrentValue === this.defaultValue;
    }

    /**
     * Set the value of the input to the default one. TODO save after
     */
    public async setDefaultValue() {
        if (this.isBoolean) {
            this.el.checked = this.defaultValue as boolean;
        } else {
            this.el.value = this.defaultValue as string;

            // after trying to set to the default value, if the html parser refused to set the value
            if (!this.isOnDefaultValue) {
                throw new AOError(`"${this.defaultValue}" is an invalid default value.`, this.el);
            }
        }
    }

}

export { handleInputs }
export type { InputBase }