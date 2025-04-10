export function isEmpty(value: string) {
    if (value.trim().length === 0) {
        return true;
    }

    return false;
}

export { isNull } from "../../../sky-helper/dist/index.mjs"