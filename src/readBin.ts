import { ByteReader, Endian, Order, Schema, SchemaEntry, Type } from './types';

const BYTE_SIZE_OF_TYPE: Readonly<Record<Type, Readonly<number>>> = {
  uint8: 1,
  uint16: 2,
  uint32: 4,
  int8: 1,
  int16: 2,
  int32: 4,
  float32: 4,
  float64: 8,
  string: 1,
  boolean: 1,
  'uint8[]': 1,
  'uint16[]': 2,
  'uint32[]': 4,
  'int8[]': 1,
  'int16[]': 2,
  'int32[]': 4,
  'float32[]': 4,
  'float64[]': 8,
  'string[]': 1,
  'boolean[]': 1,
  custom: 0,
};

/**
 * バイナリデータを読み込む関数のオプションです。
 * 型について:
 * - `T` は読み込むデータの型です。
 * - `T` はオブジェクト型で、フィールド名と型を持ちます。
 */
export type ReadBinOptions<T extends Record<string, unknown>> = {
  /**
   * バイナリデータのスキーマ
   * バイナリデータのスキーマです。
   * スキーマは、フィールド名とその型を持ちます。
   * 型は、`uint8`, `uint16`, `uint32`, `int8`, `int16`, `int32`, `float32`, `float64`, `string`, `boolean` のいずれかです。
   * また、配列型も指定できます。
   * 例: `uint8[]`, `uint16[]`, `uint32[]`, `int8[]`, `int16[]`, `int32[]`, `float32[]`, `float64[]`, `string[]`, `boolean[]`。
   * カスタム型を指定する場合は、`custom` を指定し、`parse` プロパティにパーサー関数を指定します。
   * 例: `{ type: 'custom', parse: (options) => { ... } }`。
   * カスタム型のパーサー関数は、`ParseFunction` 型を持ちます。
   * このオプションは必須です。
   * @example
   * ```ts
   * const schema = {
   *   id: { type: 'uint32' },
   *   name: { type: 'string', byte: 8 },
   *   data: { type: 'uint8[]', count: 4 },
   *   custom: { type: 'custom', parse: (options) => { ... } },
   * };
   * ```
   */
  schema: Schema<T>;

  /**
   * バイナリデータのオフセット（既定値: `0`）
   * バイナリデータの先頭からのオフセットです。
   * 例えば、`offset: 4` は、バイナリデータの先頭から4バイト目から読み込むことを意味します。
   * このオプションは省略可能です。
   * 省略時は、`0` が使用されます。
   */
  offset?: number;

  /**
   * エンディアン（既定値: `'big'`）
   * - `'little'`: リトルエンディアン
   * - `'big'`: ビッグエンディアン
   *
   * リトルエンディアンは、下位バイトが先に来るバイトオーダーです。
   * 例: `0x12345678` は、リトルエンディアンでは `[0x78, 0x56, 0x34, 0x12]` となります。
   *
   * ビッグエンディアンは、上位バイトが先に来るバイトオーダーです。
   * 例: `0x12345678` は、ビッグエンディアンでは `[0x12, 0x34, 0x56, 0x78]` となります。
   *
   * エンディアンは、CPUアーキテクチャに依存します。
   * 例えば、x86アーキテクチャはリトルエンディアンです。
   */
  endian?: Endian;

  /**
   * データのバリデーション関数（省略可）
   * @param obj 読み込んだデータ
   * @returns バリデーション結果
   */
  validate?: (obj: any) => obj is T;
};

export type ReadBinResult<T> = {
  data: T;
  meta: {
    offset: number;
    length: number;
  };
};

export function readBin<T extends Record<string, unknown>>(
  buffer: ArrayBuffer,
  options: ReadBinOptions<T>
): ReadBinResult<T> {
  const {
    schema,
    offset = 0,
    endian: commonEndian = 'big',
    validate,
  } = options;
  const data: Record<string, unknown> = {};

  const entries: [string, SchemaEntry<T>][] = Object.entries(schema);
  const sortedEntries = [...entries].sort(sortEntry);
  let lastOffset = offset;

  for (const [entryKey, entry] of sortedEntries) {
    const {
      type,
      offset = lastOffset,
      byte = BYTE_SIZE_OF_TYPE[type] || 0,
      count = 1,
      endian = commonEndian,
    } = entry;

    const specifiedLength = calculateTotalLength(byte, count);
    const reader = getReader(buffer, offset, endian);

    switch (type) {
      // -----------------------------------------------------------------------
      // 数値型

      // 符号なし8ビット整数
      case 'uint8':
        data[entryKey] = reader.getUint8(0);
        lastOffset += specifiedLength;
        break;

      // 符号なし16ビット整数
      case 'uint16':
        data[entryKey] = reader.getUint16(0);
        lastOffset += specifiedLength;
        break;

      // 符号なし32ビット整数
      case 'uint32':
        data[entryKey] = reader.getUint32(0);
        lastOffset += specifiedLength;
        break;

      // 符号付き8ビット整数
      case 'int8':
        data[entryKey] = reader.getInt8(0);
        lastOffset += specifiedLength;
        break;

      // 符号付き16ビット整数
      case 'int16':
        data[entryKey] = reader.getInt16(0);
        lastOffset += specifiedLength;
        break;

      // 符号付き32ビット整数
      case 'int32':
        data[entryKey] = reader.getInt32(0);
        lastOffset += specifiedLength;
        break;

      // 32ビット浮動小数点数
      case 'float32':
        data[entryKey] = reader.getFloat32(0);
        lastOffset += specifiedLength;
        break;

      // 64ビット浮動小数点数
      case 'float64':
        data[entryKey] = reader.getFloat64(0);
        lastOffset += specifiedLength;
        break;

      // -----------------------------------------------------------------------
      // 文字列型

      // 文字列(ASCII)
      case 'string': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 1) {
          arr.push(reader.getUint8(i));
        }
        data[entryKey] = String.fromCharCode(...arr);
        lastOffset += specifiedLength;
        break;
      }

      // -----------------------------------------------------------------------
      // 論理型

      // 論理型
      case 'boolean':
        data[entryKey] = reader.getUint8(0) !== 0;
        lastOffset += specifiedLength;
        break;

      // -----------------------------------------------------------------------
      // 数値型の配列

      // 符号なし8ビット整数の配列
      case 'uint8[]': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 1) {
          arr.push(reader.getUint8(i));
        }
        data[entryKey] = arr;
        lastOffset += specifiedLength;
        break;
      }

      // 符号なし16ビット整数の配列
      case 'uint16[]': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 2) {
          arr.push(reader.getUint16(i));
        }
        data[entryKey] = arr;
        lastOffset += specifiedLength;
        break;
      }

      // 符号なし32ビット整数の配列
      case 'uint32[]': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 4) {
          arr.push(reader.getUint32(i));
        }
        data[entryKey] = arr;
        lastOffset += specifiedLength;
        break;
      }

      // 符号付き8ビット整数の配列
      case 'int8[]': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 1) {
          arr.push(reader.getInt8(i));
        }
        data[entryKey] = arr;
        lastOffset += specifiedLength;
        break;
      }

      // 符号付き16ビット整数の配列
      case 'int16[]': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 2) {
          arr.push(reader.getInt16(i));
        }
        data[entryKey] = arr;
        lastOffset += specifiedLength;
        break;
      }

      // 符号付き32ビット整数の配列
      case 'int32[]': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 4) {
          arr.push(reader.getInt32(i));
        }
        data[entryKey] = arr;
        lastOffset += specifiedLength;
        break;
      }

      // 32ビット浮動小数点数の配列
      case 'float32[]': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 4) {
          arr.push(reader.getFloat32(i));
        }
        data[entryKey] = arr;
        lastOffset += specifiedLength;
        break;
      }

      // 64ビット浮動小数点数の配列
      case 'float64[]': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 8) {
          arr.push(reader.getFloat64(i));
        }
        data[entryKey] = arr;
        lastOffset += specifiedLength;
        break;
      }

      // -----------------------------------------------------------------------
      // 文字列型の配列

      // 文字列(ASCII)の配列
      case 'string[]': {
        const arr: number[] = [];
        for (let i = 0; i < specifiedLength; i += 1) {
          arr.push(reader.getUint8(i));
        }

        if (typeof byte === 'number') {
          data[entryKey] = String.fromCharCode(...arr);
          lastOffset += specifiedLength;
          break;
        }

        const result = [];
        let start = 0;
        for (let i = 0; i < Math.min(count, byte.length); i++) {
          const end = start + byte[i];
          result.push(String.fromCharCode(...arr.slice(start, end)));
          start = end;
        }
        data[entryKey] = result;
        lastOffset += specifiedLength;
        break;
      }

      // -----------------------------------------------------------------------
      // 論理型の配列

      // 論理型の配列
      case 'boolean[]': {
        const arr: boolean[] = [];
        for (let i = 0; i < specifiedLength; i += 1) {
          arr.push(reader.getUint8(i) !== 0);
        }
        data[entryKey] = arr;
        lastOffset += specifiedLength;
        break;
      }

      // -----------------------------------------------------------------------
      // カスタム型

      // カスタム型
      case 'custom': {
        const { value, length = specifiedLength } = entry.parse({
          reader,
          details: {
            offset,
            length: specifiedLength,
            buffer,
            byte,
            count,
            endian,
            data: data as T,
          },
        });
        data[entryKey] = value;
        lastOffset += length;
        break;
      }

      // -----------------------------------------------------------------------
      // 未知の型
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  if (validate) {
    if (!validate(data)) {
      throw new Error('Validation error');
    }
    return { data: data as T, meta: { offset, length: lastOffset - offset } };
  } else {
    return { data: data as T, meta: { offset, length: lastOffset - offset } };
  }
}

function sortEntry<T extends Record<string, unknown>>(
  a: [string, SchemaEntry<T>],
  b: [string, SchemaEntry<T>]
) {
  const calculateOrderValue = (order?: Order) => {
    if (order == null) {
      return Number.MAX_SAFE_INTEGER - 1;
    } else if (order === 'last') {
      return Number.MAX_SAFE_INTEGER;
    } else if (order === 'first') {
      return -Number.MAX_SAFE_INTEGER;
    } else {
      return order;
    }
  };

  const aOrder = calculateOrderValue(a[1].order);
  const bOrder = calculateOrderValue(b[1].order);

  return aOrder - bOrder;
}

function calculateTotalLength(byte: number | number[], count: number) {
  if (Array.isArray(byte)) {
    let length = 0;
    for (let i = 0; i < Math.min(count, byte.length); i++) {
      length += byte[i];
    }
    return length;
  } else {
    return byte * count;
  }
}

function getReader(
  buffer: ArrayBuffer,
  offset: number,
  endian: Endian
): ByteReader {
  const view = new DataView(buffer, offset);
  const littleEndian = endian === 'little';
  return {
    getUint8: (offset: number) => view.getUint8(offset),
    getUint16: (offset: number) => view.getUint16(offset, littleEndian),
    getUint32: (offset: number) => view.getUint32(offset, littleEndian),
    getInt8: (offset: number) => view.getInt8(offset),
    getInt16: (offset: number) => view.getInt16(offset, littleEndian),
    getInt32: (offset: number) => view.getInt32(offset, littleEndian),
    getFloat32: (offset: number) => view.getFloat32(offset, littleEndian),
    getFloat64: (offset: number) => view.getFloat64(offset, littleEndian),
  };
}
