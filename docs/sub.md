# ブラウザとNode.jsで共通のバイナリデータ操作ガイド

## バイナリデータの扱い方: ブラウザとNode.jsで共通の形式

ブラウザ環境とNode.js環境の**両方で扱える形式**を以下にまとめます。これらは、バイナリデータを操作する際に環境を問わず利用可能な形式や方法です。

---

### **ArrayBuffer**

- **特徴**:
  - バイナリデータを格納する汎用的な形式。
  - ブラウザ環境でもNode.js環境でもネイティブでサポートされています。
- **用途例**:
  - ブラウザ: Web APIs（例: `fetch` で `response.arrayBuffer()`）  
  - Node.js: `Buffer` から変換して操作可能。
- **例**:
  ```javascript
  // 共通コード: ArrayBufferを生成
  const buffer = new ArrayBuffer(8);
  const view = new Uint8Array(buffer);
  view[0] = 255;

  console.log(buffer); // ArrayBuffer(8)
  ```

---

### **Typed Arrays (例: Uint8Array, Int16Arrayなど)**

- **特徴**:
  - `ArrayBuffer` を基にデータ型を指定して操作可能。
  - 型付き配列はブラウザとNode.jsの両方でサポートされています。
- **用途例**:
  - バイナリデータを特定の型として直接操作する場合に便利。
- **例**:
  ```javascript
  // 共通コード: Uint8Arrayを使って操作
  const buffer = new ArrayBuffer(8);
  const uint8 = new Uint8Array(buffer);
  uint8[0] = 42;

  console.log(uint8); // Uint8Array(8) [ 42, 0, 0, 0, 0, 0, 0, 0 ]
  ```

---

### **Blob**

- **特徴**:
  - 主にブラウザで使用されますが、Node.jsでも `buffer.Blob` モジュールを利用可能（Node.js 15+）。
- **用途例**:
  - ブラウザ: `File` APIやURLオブジェクトの生成。
  - Node.js: `Blob` オブジェクトとして扱い、`ArrayBuffer` へ変換可能。
- **例**:
  ```javascript
  // 共通コード: BlobからArrayBufferへ変換
  const blob = new Blob(['Hello, world!'], { type: 'text/plain' });

  if (typeof blob.arrayBuffer === 'function') {
    blob.arrayBuffer().then(buffer => console.log(buffer)); // ブラウザで動作
  }
  ```

---

### **Base64 エンコード**

- **特徴**:
  - バイナリデータを文字列化し、どちらの環境でもやり取り可能。
  - 環境依存せずに安全にデータを転送できる。
- **用途例**:
  - バイナリを文字列に変換して、ブラウザとNode.js間でデータを交換。
- **例**:
  ```javascript
  // 共通コード: バイナリをBase64にエンコード
  const data = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
  const base64 = btoa(String.fromCharCode(...data));
  console.log(base64); // "SGVsbG8="

  // デコード
  const decoded = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  console.log(decoded); // Uint8Array(5) [ 72, 101, 108, 108, 111 ]
  ```

---

### **Node.js固有形式: Buffer**

- **特徴**:
  - Node.js特有の形式だが、ブラウザでも `ArrayBuffer` や `Uint8Array` に変換可能。
- **用途例**:
  - `Buffer` を `Uint8Array` や `ArrayBuffer` に変換して、ブラウザでも利用。
- **例**:  
  ```javascript
  // Node.jsでBufferをArrayBufferに変換
  const buffer = Buffer.from([72, 101, 108, 108, 111]); // "Hello"
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  console.log(new Uint8Array(arrayBuffer)); // Uint8Array(5) [ 72, 101, 108, 108, 111 ]
  ```

---

### **ブラウザ & Node.js共通利用のまとめ**

| **形式**         | **ブラウザサポート** | **Node.jsサポート** | **用途**                                     |
| ---------------- | -------------------- | ------------------- | -------------------------------------------- |
| ArrayBuffer      | ✅                    | ✅                   | 汎用的なバイナリデータ格納                   |
| Typed Arrays     | ✅                    | ✅                   | 型付きバイナリ操作                           |
| Blob             | ✅                    | ✅ (Node.js 15+)     | ファイルやデータのチャンク操作               |
| Base64エンコード | ✅                    | ✅                   | バイナリデータを文字列化して環境間でやり取り |
| Node.js Buffer   | ❌                    | ✅                   | Node.js固有だが、変換すれば利用可能          |

---

ブラウザとNode.jsの両方で使うなら、**ArrayBuffer** や **Typed Arrays** が最も推奨されます。他の形式（BlobやBase64など）は用途次第で併用するのが適切です。

## バイナリデータの読み込み: ArrayBufferを引数にするメリット

**バイナリを読む関数を作る際、引数として使用するのは `ArrayBuffer` が推奨されます**。その理由を以下で説明します。

---

### **`ArrayBuffer` を引数にするメリット**

1. **汎用性が高い**  
   - `ArrayBuffer` はバイナリデータの基盤であり、すべての Typed Arrays（例: `Uint8Array`, `Int16Array`）の元になる形式です。  
   - これにより、`Uint8Array` などが必要な場合でも、関数内でビューを作成すれば柔軟に操作できます。

2. **標準的な入力形式**  
   - 多くのWeb API（例: `fetch` の `response.arrayBuffer()` や `FileReader`）が直接 `ArrayBuffer` を返すため、そのまま引数として渡しやすい。

3. **Typed Arraysへの変換が簡単**  
   - 必要に応じて、関数内で型を指定して `Typed Arrays` を生成できます。

---

### **`Typed Arrays` を引数にする場合のメリットとデメリット**

#### メリット

- **特定のデータ型が決まっている場合に効率的**  
  - 例えば、符号なし8ビットデータ（`Uint8Array`）だけを操作する関数では、引数を `Uint8Array` に固定すると型チェックが楽になります。

#### デメリット

- **他のTyped ArraysやArrayBufferとの互換性が下がる**  
  - `Uint8Array` 以外のデータ型（例: `Int16Array`）を扱いたい場合に不便。
  - 利用側でデータ型を統一する手間が増える。

---

### **結論: `ArrayBuffer` を推奨**

関数設計において汎用性と互換性を重視するなら、引数は **`ArrayBuffer`** を採用すべきです。必要に応じて関数内で `Typed Arrays` を作成することで柔軟に対応可能です。

---

### **実装例: ArrayBufferを引数とするバイナリ読み関数**

以下は `ArrayBuffer` を引数にし、柔軟に `Typed Arrays` を操作する例です。

```javascript
function readBinaryData(buffer) {
  // ArrayBufferをUint8Arrayとして解釈
  const uint8 = new Uint8Array(buffer);

  // データを操作（例: 各バイトを出力）
  uint8.forEach((byte, index) => {
    console.log(`Byte ${index}: ${byte}`);
  });

  // 必要なら他のTyped Array形式に変換
  const int16 = new Int16Array(buffer);
  console.log(int16); // Int16Arrayとして表示
}

// 使用例: ArrayBufferを渡す
const buffer = new ArrayBuffer(8);
const uint8 = new Uint8Array(buffer);
uint8.set([10, 20, 30, 40]);

readBinaryData(buffer);
```

---

### **参考: Typed Arraysを引数にしたい場合の工夫**

もし `Typed Arrays` を引数にする場合でも、内部で `buffer` プロパティから元の `ArrayBuffer` を取得できるようにしておくと便利です。

```javascript
function readBinaryTypedArray(typedArray) {
  // Typed Arrayから元のArrayBufferを取得
  const buffer = typedArray.buffer;

  console.log(`ArrayBuffer length: ${buffer.byteLength}`);
  console.log(`Typed Array values: ${typedArray}`);
}

// 使用例: Uint8Arrayを渡す
const uint8 = new Uint8Array([10, 20, 30]);
readBinaryTypedArray(uint8);
```

---

### **最適化案: 両方対応する関数**

`ArrayBuffer` と `Typed Arrays` の両方に対応する関数も可能です。引数の型を判定して処理を分けることで、柔軟なAPIを提供できます。

```javascript
function readBinary(data) {
  let buffer;

  if (data instanceof ArrayBuffer) {
    buffer = data; // ArrayBufferの場合
  } else if (ArrayBuffer.isView(data)) {
    buffer = data.buffer; // Typed Arrayの場合
  } else {
    throw new Error("Invalid input: Expected ArrayBuffer or Typed Array");
  }

  // Uint8Arrayで操作
  const uint8 = new Uint8Array(buffer);
  console.log(uint8);
}

// 使用例
readBinary(new ArrayBuffer(8));
readBinary(new Uint8Array([1, 2, 3]));
```

---

この方法により、柔軟性と簡潔性の両方を確保できます。

<style>
  h1 {
    counter-reset: h2counter;
  }
  h2 {
    counter-reset: h3counter;
    &::before {
      content: counter(h2counter) ". ";
      counter-increment: h2counter;
    }
  }
  h3 {
    counter-reset: h4counter;
    &::before {
      content: counter(h2counter) "." counter(h3counter) ". ";
      counter-increment: h3counter;
    }
  }
</style>
