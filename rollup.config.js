import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"

import pkg from "./package.json"

const isProduction = process.env.NODE_ENV === "production";

export default [{
  input: "src/index.ts",
  output: {
    file: pkg.module,
    format: "esm",
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" })
  ]
}]
