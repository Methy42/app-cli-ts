import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import replace from '@rollup/plugin-replace';
import commonjs from 'rollup-plugin-commonjs';

console.log("start", process.env.NODE_ENV);

export default defineConfig({
    input: "src/main.ts",
    plugins: [
        typescript({ tsconfig: './tsconfig.json' }),
        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: 'node_modules/**',  // Default: undefined
            exclude: ['node_modules/foo/**', 'node_modules/bar/**'],  // Default: undefined
            // these values can also be regular expressions
            // include: /node_modules/

            // search for files other than .js files (must already
            // be transpiled by a previous plugin!)
            extensions: ['.js', '.coffee'],  // Default: [ '.js' ]

            // if true then uses of `global` won't be dealt with by this plugin
            ignoreGlobal: false,  // Default: false

            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: false,  // Default: true

            // explicitly specify unresolvable named exports
            // (see below for more details)
            namedExports: { 'react': ['createElement', 'Component'] },  // Default: undefined

            // sometimes you have to leave require statements
            // unconverted. Pass an array containing the IDs
            // or a `id => boolean` function. Only use this
            // option if you know what you're doing!
            ignore: ['conditional-runtime-dependency']
        }),
        replace({
            'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
        })
    ],
    output: [{
        file: "lib/bundle.cjs.js",
        format: "cjs",
        sourcemap: true
    }, {
        file: "lib/bundle.es.js",
        format: "es",
        sourcemap: true
    }]
});

