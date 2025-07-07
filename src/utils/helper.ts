export function hasText(string: string) {
    return string.trim().length !== 0;
}

export function hasWhiteSpace(string: string) {
    return (/\s/).test(string);
}

export { isNull, isObject, isBoolean } from "../../../sky-helper/dist/index.mjs"