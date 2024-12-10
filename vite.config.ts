import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      // エントリーポイント
      entry: 'src/index.ts',
      // UMD形式でのライブラリ名
      name: 'MyLib',
      // 出力形式
      formats: ['es', 'cjs', 'umd'],
      // 出力ファイル名
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.mjs';
          case 'cjs':
            return 'index.cjs';
          case 'umd':
            return 'my-lib.js';
          default:
            return 'my-lib.js';
        }
      },
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: false,
    minify: true,
  },
  plugins: [dts()],
});
