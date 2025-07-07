import * as esbuild from "esbuild"
import fs from 'node:fs'

const isDebug = process.env.NODE_ENV === 'development';

const result = await esbuild.build({
    bundle: true,
    // minifyWhitespace is disabled to keep tree-shake comments for esbuild when bundling modules
    // https://github.com/evanw/esbuild/issues/2171
    minifyWhitespace: false,
    minifyIdentifiers: !isDebug,
    minifySyntax: !isDebug,
    format: "esm",
    entryPoints: ["./src/index.mts"],
    outExtension: { '.js': '.mjs' },
    outdir: "./dist/",
    metafile: !isDebug
})

// we only care about minified size
if (!isDebug) {
    fs.writeFileSync('meta.json', JSON.stringify(result.metafile))
}