// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input

const SUPPORTED_INPUT_TYPES = [
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
] as const;

export const UNSUPPORTED_INPUT_TYPES = [
    "button", // not actually an input
    "file",   // can't save into chrome storage
    "hidden", // should not be saved 
    "submit", // not actually an input
    "image",  // not actually an input
    "reset",  // not actually an input
    "password", // confidential
    "search" // should not be saved
] as const;

export type SupportedInputType = typeof SUPPORTED_INPUT_TYPES[number]

export type UnsupportedInputType = typeof UNSUPPORTED_INPUT_TYPES[number];

export type InputType = UnsupportedInputType | SupportedInputType;