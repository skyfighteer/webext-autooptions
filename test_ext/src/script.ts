import { onSettingChange, getConfiguration } from "../../dist/index.mjs";

(async ()=> {
    //const config = await getConfiguration('page')
    //console.log(config)
})();

onSettingChange('a', (e)=> {
    console.log(e)
});


