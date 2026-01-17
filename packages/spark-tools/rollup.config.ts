import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import del from 'rollup-plugin-delete'

export default {
  input: {
    index: 'src/index.ts',
    spark: 'src/spark.ts',
    sparkVitePlugin: 'src/sparkVitePlugin.ts',
    vitePhosphorIconProxyPlugin: 'src/vitePhosphorIconProxyPlugin.ts',
  },
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    preserveModules: false,
  },
  external: ['react', 'react-dom', 'vite'],
  plugins: [
    del({ targets: 'dist/*' }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
    }),
    terser(),
  ],
}
