import { parseAutoOptionsConfig } from "./config";
import { configHandler} from "./handlers/config-handler";

/**
 * Parameters for initializing AutoOptions.
 * @public
 */
interface AutoOptionsConfig {
    /**
     * The name of the storage instance.
     */
    storageName: string;

    /**
     * Set to false to save manually.
     * @defaultValue true
     */
    saveOnChange?: boolean;

    /**
     * Pass any function to run on first install.
     * @defaultValue undefined
     */
    installAction?: () => void;
}

/**
 * Create an AutoOptions instance to store the options of an extension.
 * @public
 */
class AutoOptions {
    constructor(autoOptionsConfig: AutoOptionsConfig) {
        parseAutoOptionsConfig(autoOptionsConfig);
    }

    // load the configuration (note: should only be ran after DOMContentLoaded)
    public async loadConfig() {
        await configHandler.init();
    }
    
    // Reset AutoOptions to default configuration.
    public async resetToDefault() {
        await configHandler.resetToDefault();
    }

    // Save all configurations to chrome storage.
    public async saveAll() {
        await configHandler.saveAll();
    }
}

export { type AutoOptionsConfig, AutoOptions }