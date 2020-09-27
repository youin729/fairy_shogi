const path = require('path');

module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'development',
  
    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: {
      main: './src/index.ts',
      chat: './chat/index.ts',
      mail: './src/mail/mail.ts',
    },
    module: {
      rules: [
        {
          // 拡張子 .ts の場合
          test: /\.ts$/,
          // TypeScript をコンパイルする
          use: 'ts-loader',
        },
      ],
    },
    resolve: {
      modules: [
          "./node_modules",
      ],
      extensions: [
        '.ts', '.js',
      ],
    },
  };