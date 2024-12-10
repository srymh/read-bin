export type Endian = 'little' | 'big';

export type Order = number | 'first' | 'last';

export type TypeMap = {
  // ---------------------------------------------------------------------------
  // 数値型

  /** 符号なし8ビット整数 */
  uint8: number;
  /** 符号なし16ビット整数 */
  uint16: number;
  /** 符号なし32ビット整数 */
  uint32: number;
  /** 符号付き8ビット整数 */
  int8: number;
  /** 符号付き16ビット整数 */
  int16: number;
  /** 符号付き32ビット整数 */
  int32: number;
  /** 32ビット浮動小数点数 */
  float32: number;
  /** 64ビット浮動小数点数 */
  float64: number;

  // ---------------------------------------------------------------------------
  // 文字列型

  /** 文字列(ASCII) */
  string: string;

  // ---------------------------------------------------------------------------
  // 論理型

  /** 論理型 */
  boolean: boolean;

  // ---------------------------------------------------------------------------
  // 数値型の配列

  /** 符号なし8ビット整数の配列 */
  'uint8[]': number[];
  /** 符号なし16ビット整数の配列 */
  'uint16[]': number[];
  /** 符号なし32ビット整数の配列 */
  'uint32[]': number[];
  /** 符号付き8ビット整数の配列 */
  'int8[]': number[];
  /** 符号付き16ビット整数の配列 */
  'int16[]': number[];
  /** 符号付き32ビット整数の配列 */
  'int32[]': number[];
  /** 32ビット浮動小数点数の配列 */
  'float32[]': number[];
  /** 64ビット浮動小数点数の配列 */
  'float64[]': number[];

  // ---------------------------------------------------------------------------
  // 文字列型の配列

  /** 文字列(ASCII)の配列 */
  'string[]': string[];

  // ---------------------------------------------------------------------------
  // 論理型の配列

  /** 論理型の配列 */
  'boolean[]': boolean[];

  // ---------------------------------------------------------------------------
  // カスタム型

  /** カスタム型 */
  custom: unknown;
};

export type Type = keyof TypeMap;

export type ReadBinSchemaValue<TType extends Type> = TypeMap[TType];

export type ByteReader = {
  getUint8: (offset: number) => number;
  getUint16: (offset: number) => number;
  getUint32: (offset: number) => number;
  getInt8: (offset: number) => number;
  getInt16: (offset: number) => number;
  getInt32: (offset: number) => number;
  getFloat32: (offset: number) => number;
  getFloat64: (offset: number) => number;
};

export type ParseOptions<TObject extends Record<string, unknown>> = {
  reader: ByteReader;
  details: {
    offset: number;
    length: number;
    buffer: ArrayBuffer;
    byte: number | number[];
    count: number;
    endian: Endian;
    data: Partial<TObject>;
  };
};

export type Parse<TResult, TObject extends Record<string, unknown>> = (
  options: ParseOptions<TObject>
) => {
  value: TResult;
  length?: number;
};

export type ParseWithLength<
  TResult,
  TObject extends Record<string, unknown>
> = (options: ParseOptions<TObject>) => {
  value: TResult;
  length: number;
};

export type SchemaEntryBase<TType extends Type> = {
  /** フィールドの型 */
  type: TType;

  /**
   * フィールドのオフセット（省略可）
   * 省略時のオフセット:
   * [0]: `ReadBinOptions.offset` オプションが使用されます。
   * [1以上]: 前のフィールドのオフセットからの相対オフセットです。
   */
  offset?: number;

  /**
   * フィールドのエンディアン（省略可）
   * 省略時は、`ReadBinOptions.endian` オプションが使用されます。
   */
  endian?: Endian;

  /**
   * 処理順序（省略可）
   * 省略時は、 `for...in` の順序が使用されます。
   *
   * > [MDN | for...in](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for...in)
   * >
   * > 現代の ECMAScript の仕様では、走査順序は明確に定義されており、 実装同士の間で一貫しています。
   * > プロトタイプチェーンのそれぞれの成分内では、非負の整数値（配列の添字となるもの）は
   * > すべて値の昇順で最初に走査され、次に文字列のキーがプロパティの作成時系列で昇順に走査されます。
   */
  order?: Order;
};

export type SchemaEntry<
  TObject extends Record<string, unknown>,
  TResult = unknown,
  TType = Type
> = TType extends
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'int8'
  | 'int16'
  | 'int32'
  | 'float32'
  | 'float64'
  | 'boolean'
  ? SchemaEntryBase<TType> & {
      /** データのバイト数 */
      byte?: number;
      /** データの個数 */
      count?: 1;
    }
  : TType extends 'string'
  ? SchemaEntryBase<TType> & {
      /** データのバイト数 */
      byte: number;
      /** データの個数 */
      count?: 1;
    }
  : TType extends
      | 'uint8[]'
      | 'uint16[]'
      | 'uint32[]'
      | 'int8[]'
      | 'int16[]'
      | 'int32[]'
      | 'float32[]'
      | 'float64[]'
      | 'boolean[]'
  ? SchemaEntryBase<TType> & {
      /** データのバイト数 */
      byte?: number | number[];
      /** データの個数 */
      count: number;
    }
  : TType extends 'string[]'
  ? SchemaEntryBase<TType> & {
      /** データのバイト数 */
      byte: number | number[];
      /** データの個数 */
      count: number;
    }
  : TType extends 'custom'
  ?
      | (SchemaEntryBase<TType> & {
          /** データのバイト数 */
          byte: number | number[];
          /** データの個数 */
          count: number;
          /** カスタム型のパーサー */
          parse: Parse<TResult, TObject>;
        })
      | (SchemaEntryBase<TType> & {
          /** データのバイト数 */
          byte?: number | number[];
          /** データの個数 */
          count?: number;
          /** カスタム型のパーサー */
          parse: ParseWithLength<TResult, TObject>;
        })
  : never;

export type Schema<TObject extends Record<string, unknown>> = {
  [key in keyof TObject]: SchemaEntry<TObject, TObject[key]>;
};
