# Read Bin

バイナリから指定したスキーマでデータを読み取る。

``` typescript
type MyObject = {
  a: number;
  b: number;
  c: number;
};

const result = readBin<MyObject>(buffer, {
  schema: {
    a: { type: 'uint8' },
    b: { type: 'uint8' },
    c: { type: 'uint8' },
  },
});

console.log(result.data);
// => { a: 1, b: 2, c: 3 }
```

<!-- [デモ]() -->

<!-- ---

## 特徴 ✨

- `Record<string, unknown>` 型としてデータを読み取る。
- スキーマの型を `Record<string, unknown>`
- 特徴3 -->

ブラウザとNode.jsで共通のバイナリデータ操作ガイド: [docs/sub.md](docs/sub.md)

---

## インストール 📦

```bash
npm install https://github.com/srymh/read-bin.git
```

---

## 使い方 🚀

### 基本的な使用例

``` typescript
import { readBin } from 'read-bin';

const buffer = new ArrayBuffer(256);
const view = new DataView(buffer);
view.setUint8(0, 0x00);
view.setUint8(1, 0x12);
view.setUint8(2, 0xff);

// 使用例
const result = readBin<{
  a: number;
  b: number;
  c: number;
}>(buffer, {
  schema: {
    a: { type: 'uint8' },
    b: { type: 'uint8' },
    c: { type: 'uint8' },
  },
});

expect(result.data).toEqual({ a: 0x00, b: 0x12, c: 0xff });
```

### 詳細な使い方

- `schema[key].order` を省略した場合には `for...in` の順序で読み取る。
    > [MDN | for...in](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for...in)
    >
    > 現代の ECMAScript の仕様では、走査順序は明確に定義されており、 実装同士の間で一貫しています。
    > プロトタイプチェーンのそれぞれの成分内では、非負の整数値（配列の添字となるもの）は
    > すべて値の昇順で最初に走査され、次に文字列のキーがプロパティの作成時系列で昇順に走査されます。
- `schema[key].offset` を省略した場合には前回の読み取り位置から `schema[key].byte` バイト分読み取る。

``` typescript
import { readBin } from 'read-bin';

const buffer = new ArrayBuffer(256);
const view = new DataView(buffer);
view.setUint8(0, 0x00);
view.setUint8(1, 0x12);
view.setUint8(2, 0xff);

// 詳細な例
const result = readBin<{
  a: number;
  b: number;
  c: number;
}>(buffer, {
  schema: {
    a: { type: 'uint8', offset: 0, byte: 1, count: 1, endian: 'big', order: 1 },
    b: { type: 'uint8', offset: 1, byte: 1, count: 1, endian: 'big', order: 2 },
    c: { type: 'uint8', offset: 2, byte: 1, count: 1, endian: 'big', order: 3 },
  },
  offset: 0,
  endian: 'big',
});

expect(result.data).toEqual({ a: 0x00, b: 0x12, c: 0xff });
```

#### オブジェクトのキーが数値の場合の使用例

``` typescript
import { readBin } from 'read-bin';

// 詳細な例
buffer = new ArrayBuffer(256);
const view = new DataView(buffer);
view.setUint8(0, 0x0a);
view.setUint8(1, 0x0b);
view.setUint8(2, 0x0c);

const result = readBin<{
  '1': number;
  '3': number;
  '2': number;
}>(buffer, {
  schema: {
    1: { type: 'uint8', order: 1 },
    3: { type: 'uint8', order: 2 },
    2: { type: 'uint8', order: 3 },
  },
});

expect(result.data).toEqual({
  1: 0x0a,
  3: 0x0b,
  2: 0x0c,
});
```

---

## API ドキュメント 📚

### 関数名

```typescript
関数名(引数: 型): 戻り値の型
```

- **引数1**: 説明 (例: `string` - 処理したい文字列)
- **戻り値**: 説明 (例: `boolean` - 成功した場合は `true`)

### その他の関数

必要に応じて追加します。

---

## 開発者向け情報 🔧

### スクリプト

- **ビルド**: `npm run build`
- **テスト**: `npm test`

### パッケージング

```bash
npm pack
```
