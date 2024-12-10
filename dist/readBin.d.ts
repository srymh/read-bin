import { Endian, Schema } from './types';
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
export declare function readBin<T extends Record<string, unknown>>(buffer: ArrayBuffer, options: ReadBinOptions<T>): ReadBinResult<T>;
