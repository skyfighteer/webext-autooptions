import { AutoOptions } from "../../dist/index.mjs";
import "./script.ts"

(async () => {
    const ao = new AutoOptions({
        'storageName': 'page',
        installAction: function() {
            console.log('Welcome message.')
        }
    })
    await ao.loadConfig()

    document.querySelector('#reset')?.addEventListener("click", ao.resetToDefault)
    document.querySelector('#save')?.addEventListener("click", ao.saveAll)
})()