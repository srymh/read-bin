import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Jestライクなグローバル変数を有効にする
    environment: 'node', // テスト環境をNode.jsにする
    hookTimeout: 10000, // フックのタイムアウトを10秒にする
    include: ['src/**/*.test.ts'], // テストファイルを指定する
    coverage: {
      reporter: ['html'], // カバレッジレポートをHTML形式で出力する
      include: ['src/**/*.ts'], // カバレッジ対象を指定する
    },
  },
});
