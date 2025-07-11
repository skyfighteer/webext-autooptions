import * as esbuild from "esbuild";

esbuild.build({
    entryPoints: ["./src/options.ts", "./src/script.ts", "./src/background.ts"],
    bundle: true,
    minify: false,
    format: "iife",
    outdir: "./dist"
})