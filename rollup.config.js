import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const getPlugins = shouldMinify => {
  return [
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    shouldMinify && terser(),
  ];
};

let bundles = [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'esm',
    },
    plugins: [...getPlugins(isProduction)],
  },
];

export default bundles;
