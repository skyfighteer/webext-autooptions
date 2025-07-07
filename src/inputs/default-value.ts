import { SupportedInputType } from "./input-types"
import { Option } from "../handlers/config-handler";

// get the default range of an HTMLInputElement (type="range")
function getDefaultRange(input: HTMLInputElement) {
    const min = Number(input.min);
    const max = Number(input.max);

    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#:~:text=min%20attribute.%20The-,algorithm,-for%20determining%20the
    let defaultValue;
    if (max < min) {
        defaultValue = min;
    } else {
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#:~:text=value%2C%20preferring%20to-,round%20numbers%20up,-when%20there%20are
        defaultValue = Math.round(min + (max - min) / 2)
    }

    return defaultValue.toString();
}

// get the default value of supported html input elements
export function getDefaultInputValue(inputEl: HTMLInputElement) {   
    const defaultInputValues: Record<SupportedInputType, Option.Value> = {
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

    return defaultInputValues[inputEl.type as SupportedInputType];
}