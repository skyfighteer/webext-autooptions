import { AOError } from "./utils/error";
import * as v from 'valibot';

const AutoOptionsConfigSchema = v.strictObject({
    storageName: v.string(), // mandatory, accepts: string
    saveOnChange: v.optional(v.boolean(), true), // optional, accepts: boolean | undefined (default: true)
    installAction: v.nullish(v.function(), null) // optional, accepts: function | undefined | null (default: true)
})

type VAutoOptionsConfig = v.InferOutput<typeof AutoOptionsConfigSchema>

// we are validating an unknown input
export function parseAutoOptionsConfig(unknownConfig: unknown) {
    // parse the input
    const result = v.safeParse(AutoOptionsConfigSchema, unknownConfig);

    // save it
    if (result.success) {
        autoOptionsConfig = result.output;
    } else {
        // log every issue
        result.issues.forEach(issue => {
            const errorMessage = issue.message;
            const path = issue?.path as v.IssuePathItem[];

            // type is not an object
            if (!path) {
                console.error(errorMessage);
                return;
            }

            const key = path[0].key;

            // invalid value for key error
            if (issue.expected !== 'never') {
                console.error(`Invalid value for '${key}': ${errorMessage}.`);
            } else {
                console.error(`'${key}' is an invalid key.`)
            }
        });

        // stop execution and throw an error
        throw new AOError('Invalid init parameters.');
    }
}

let autoOptionsConfig: VAutoOptionsConfig;

export { autoOptionsConfig }