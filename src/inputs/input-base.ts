import { OptionHandler, supportedInputs } from "../handlers/option-handler";
import { AOError } from "../utils/error";
import { OptionValue } from "../handlers/config-handler";
import { UnsupportedInputType, UNSUPPORTED_INPUT_TYPES, InputType } from "./input-types";
import { isEmpty } from "../utils/helper";
import { AOProperty, AOPropertyPrefix } from "./input-ao-properties";
import { getDefaultInputValue } from "./default-value";
import { SupportedInputs } from "../handlers/option-handler";

function loadInputs() {
    const inputElements = Array.from(document.querySelectorAll('input'));
    inputElements.forEach(inputElement => new InputBase(inputElement));
    validateInputs(supportedInputs);
}

function validateInputs(supportedInputs: SupportedInputs) {
    // Check for duplicate IDs among the inputs
    const checkDuplicateIDs = () => {
        const IDs = supportedInputs.map(inputElement => inputElement.input.el.id);

        IDs.filter((item, index) => {
            if (IDs.indexOf(item) !== index) {
                throw new AOError(`'${item}' is a duplicate ID.`);
            }
        });
    };

    // Handle the case when no supported inputs are found
    const checkNoInputs = () => {
        if (supportedInputs.length === 0) {
            throw new AOError('No supported inputs were found in the document.');
        }
    };

    checkDuplicateIDs();
    checkNoInputs();
}

class InputBase {
    readonly el: HTMLInputElement;
    readonly isCheckbox: boolean;
    readonly isRadio: boolean;
    readonly isBoolean: boolean;

    constructor(inputElement: HTMLInputElement) {
        this.el = inputElement;
        this.isCheckbox = this.isType('checkbox');
        this.isRadio = this.isType('radio');
        this.isBoolean = this.isCheckbox || this.isRadio;

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

        // no id
        if (!this.el.id) {
            throw new AOError('This input must have an ID set.', this.el);
        }

        // no name for radio
        if (this.isRadio && !this.el.name) {
            throw new AOError('All radio inputs must have a name set.', this.el);
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

    // ********** PUBLIC ***************** //

    public hasAOProperty(AOProperty: AOProperty) {
        return this.el.hasAttribute(`${AOPropertyPrefix}-${AOProperty}`);
    }

    public getAOProperty(AOProperty: AOProperty) {
        const AOPropertyValue = this.el.getAttribute(`${AOPropertyPrefix}-${AOProperty}`);

        // no attribute found
        if (AOPropertyValue !== null && !isEmpty(AOPropertyValue)) {
            return AOPropertyValue;
        }

        return null;
    }
    
    public set setDisplayedValue(savedValue: OptionValue) {
        if (this.isCheckbox) {
            this.el.checked = savedValue as boolean;
        } else if (this.isRadio) {
            const isActiveRadio = (this.el.id === savedValue);
            this.el.checked = isActiveRadio;
        } else {
            this.el.value = savedValue as string;
        }
    }

    public get getCurrentValue(): OptionValue {
        if (this.isBoolean) {
            return this.el.checked;
        } else {
            return this.el.value;
        }
    }

    public get getDefaultValue(): OptionValue {
        const defaultValue = getDefaultInputValue(this.el);

        if (this.isBoolean) {
            return this.hasAOProperty('default') ?? defaultValue;
        } else {
            return this.getAOProperty('value') ?? defaultValue;
        }
    }
}

export { loadInputs }
export type { InputBase }