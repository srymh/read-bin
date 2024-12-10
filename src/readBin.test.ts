import { describe, it, expect, beforeEach } from 'vitest';
import { readBin } from './readBin';

describe('基本型', () => {
  it('8ビット符号なし整数をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint8(0, 0x00);
    view.setUint8(1, 0x12);
    view.setUint8(2, 0xff);

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

    expect(result.data).toEqual({ a: 0x00, b: 0x12, c: 0xff });
  });

  it('16ビット符号なし整数をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint16(0, 0x0000);
    view.setUint16(2, 0x1234);
    view.setUint16(4, 0xffff);

    type MyObject = {
      a: number;
      b: number;
      c: number;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'uint16' },
        b: { type: 'uint16' },
        c: { type: 'uint16' },
      },
    });

    expect(result.data).toEqual({ a: 0x0000, b: 0x1234, c: 0xffff });
  });

  it('32ビット符号なし整数をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint32(0, 0x00000000);
    view.setUint32(4, 0x12345678);
    view.setUint32(8, 0x7fffffff);
    view.setUint32(12, 0x80000000);
    view.setUint32(16, 0xffffffff);

    type MyObject = {
      a: number;
      b: number;
      c: number;
      d: number;
      e: number;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'uint32' },
        b: { type: 'uint32' },
        c: { type: 'uint32' },
        d: { type: 'uint32' },
        e: { type: 'uint32' },
      },
    });

    expect(result.data).toEqual({
      a: 0x00000000,
      b: 0x12345678,
      c: 0x7fffffff,
      d: 0x80000000,
      e: 0xffffffff,
    });
  });

  it('8ビット符号付き整数をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setInt8(0, 0x00);
    view.setInt8(1, 0x12);
    view.setInt8(2, 0x7f);

    type MyObject = {
      a: number;
      b: number;
      c: number;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'int8' },
        b: { type: 'int8' },
        c: { type: 'int8' },
      },
    });

    expect(result.data).toEqual({ a: 0x00, b: 0x12, c: 0x7f });
  });

  it('16ビット符号付き整数をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setInt16(0, 0x0000);
    view.setInt16(2, 0x1234);
    view.setInt16(4, 0x7fff);

    type MyObject = {
      a: number;
      b: number;
      c: number;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'int16' },
        b: { type: 'int16' },
        c: { type: 'int16' },
      },
    });

    expect(result.data).toEqual({ a: 0x0000, b: 0x1234, c: 0x7fff });
  });

  it('32ビット符号付き整数をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setInt32(0, 0x00000000);
    view.setInt32(4, 0x12345678);
    view.setInt32(8, 0x7fffffff);
    view.setInt32(12, 0x80000000);
    view.setInt32(16, 0xffffffff);

    type MyObject = {
      a: number;
      b: number;
      c: number;
      d: number;
      e: number;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'int32' },
        b: { type: 'int32' },
        c: { type: 'int32' },
        d: { type: 'int32' },
        e: { type: 'int32' },
      },
    });

    expect(result.data).toEqual({
      a: 0x00000000,
      b: 0x12345678,
      c: 0x7fffffff,
      d: -2147483648,
      e: -1,
    });
  });

  it('32ビット浮動小数点数をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setFloat32(0, 0.0);
    view.setFloat32(4, 1.0);
    view.setFloat32(8, 3.14);

    type MyObject = {
      a: number;
      b: number;
      c: number;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'float32' },
        b: { type: 'float32' },
        c: { type: 'float32' },
      },
    });

    expect(result.data.a).toBeCloseTo(0.0, 5);
    expect(result.data.b).toBeCloseTo(1.0, 5);
    expect(result.data.c).toBeCloseTo(3.14, 5);
  });

  it('64ビット浮動小数点数をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setFloat64(0, 0.0);
    view.setFloat64(8, 1.0);
    view.setFloat64(16, 3.141592653589793);

    type MyObject = {
      a: number;
      b: number;
      c: number;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'float64' },
        b: { type: 'float64' },
        c: { type: 'float64' },
      },
    });

    expect(result.data.a).toBeCloseTo(0.0, 15);
    expect(result.data.b).toBeCloseTo(1.0, 15);
    expect(result.data.c).toBeCloseTo(3.141592653589793, 15);
  });

  it('文字列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    const str1 = 'hello';
    for (let i = 0; i < str1.length; i++) {
      view.setUint8(i, str1.charCodeAt(i));
    }
    const str2 = 'world!';
    for (let i = 0; i < str2.length; i++) {
      view.setUint8(str1.length + i, str2.charCodeAt(i));
    }

    type MyObject = {
      a: string;
      b: string;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'string', byte: str1.length },
        b: { type: 'string', byte: str2.length },
      },
    });

    expect(result.data.a).toEqual(str1);
  });

  it('論理値をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint8(0, 1);
    view.setUint8(1, 0);

    type MyObject = {
      a: boolean;
      b: boolean;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'boolean' },
        b: { type: 'boolean' },
      },
    });

    expect(result.data.a).toBe(true);
    expect(result.data.b).toBe(false);
  });

  it('8ビット符号なし整数の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint8(0, 0x00);
    view.setUint8(1, 0x12);
    view.setUint8(2, 0xff);
    view.setUint8(3, 0x00);
    view.setUint8(4, 0x12);
    view.setUint8(5, 0xff);

    type MyObject = {
      a: number[];
      b: number[];
      c: number[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'uint8[]', count: 3 },
        b: { type: 'uint8[]', count: 2 },
        c: { type: 'uint8[]', count: 1 },
      },
    });

    expect(result.data).toEqual({
      a: [0x00, 0x12, 0xff],
      b: [0x00, 0x12],
      c: [0xff],
    });
  });

  it('16ビット符号なし整数の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint16(0, 0x0000);
    view.setUint16(2, 0x1234);
    view.setUint16(4, 0xffff);
    view.setUint16(6, 0x0000);
    view.setUint16(8, 0x1234);
    view.setUint16(10, 0xffff);

    type MyObject = {
      a: number[];
      b: number[];
      c: number[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'uint16[]', count: 3 },
        b: { type: 'uint16[]', count: 2 },
        c: { type: 'uint16[]', count: 1 },
      },
    });

    expect(result.data).toEqual({
      a: [0x0000, 0x1234, 0xffff],
      b: [0x0000, 0x1234],
      c: [0xffff],
    });
  });

  it('32ビット符号なし整数の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint32(0, 0x00000000);
    view.setUint32(4, 0x12345678);
    view.setUint32(8, 0x7fffffff);
    view.setUint32(12, 0x80000000);
    view.setUint32(16, 0xffffffff);
    view.setUint32(20, 0x00000000);
    view.setUint32(24, 0x12345678);
    view.setUint32(28, 0x7fffffff);

    type MyObject = {
      a: number[];
      b: number[];
      c: number[];
      d: number[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'uint32[]', count: 3 },
        b: { type: 'uint32[]', count: 2 },
        c: { type: 'uint32[]', count: 1 },
        d: { type: 'uint32[]', count: 2 },
      },
    });

    expect(result.data).toEqual({
      a: [0x00000000, 0x12345678, 0x7fffffff],
      b: [0x80000000, 0xffffffff],
      c: [0x00000000],
      d: [0x12345678, 0x7fffffff],
    });
  });

  it('8ビット符号付き整数の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setInt8(0, 0x00);
    view.setInt8(1, 0x12);
    view.setInt8(2, 0x7f);
    view.setInt8(3, 0x00);
    view.setInt8(4, 0x12);
    view.setInt8(5, 0x7f);

    type MyObject = {
      a: number[];
      b: number[];
      c: number[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'int8[]', count: 3 },
        b: { type: 'int8[]', count: 2 },
        c: { type: 'int8[]', count: 1 },
      },
    });

    expect(result.data).toEqual({
      a: [0x00, 0x12, 0x7f],
      b: [0x00, 0x12],
      c: [0x7f],
    });
  });

  it('16ビット符号付き整数の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setInt16(0, 0x0000);
    view.setInt16(2, 0x1234);
    view.setInt16(4, 0x7fff);
    view.setInt16(6, 0x0000);
    view.setInt16(8, 0x1234);
    view.setInt16(10, 0x7fff);

    type MyObject = {
      a: number[];
      b: number[];
      c: number[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'int16[]', count: 3 },
        b: { type: 'int16[]', count: 2 },
        c: { type: 'int16[]', count: 1 },
      },
    });

    expect(result.data).toEqual({
      a: [0x0000, 0x1234, 0x7fff],
      b: [0x0000, 0x1234],
      c: [0x7fff],
    });
  });

  it('32ビット符号付き整数の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setInt32(0, 0x00000000);
    view.setInt32(4, 0x12345678);
    view.setInt32(8, 0x7fffffff);
    view.setInt32(12, 0x80000000);
    view.setInt32(16, 0xffffffff);
    view.setInt32(20, 0x00000000);
    view.setInt32(24, 0x12345678);
    view.setInt32(28, 0x7fffffff);

    type MyObject = {
      a: number[];
      b: number[];
      c: number[];
      d: number[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'int32[]', count: 3 },
        b: { type: 'int32[]', count: 2 },
        c: { type: 'int32[]', count: 1 },
        d: { type: 'int32[]', count: 2 },
      },
    });

    expect(result.data).toEqual({
      a: [0x00000000, 0x12345678, 0x7fffffff],
      b: [-2147483648, -1],
      c: [0x00000000],
      d: [0x12345678, 0x7fffffff],
    });
  });

  it('32ビット浮動小数点数の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setFloat32(0, 0.0);
    view.setFloat32(4, 1.0);
    view.setFloat32(8, 3.14);
    view.setFloat32(12, 0.0);
    view.setFloat32(16, 1.0);
    view.setFloat32(20, 3.14);

    type MyObject = {
      a: number[];
      b: number[];
      c: number[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'float32[]', count: 3 },
        b: { type: 'float32[]', count: 2 },
        c: { type: 'float32[]', count: 1 },
      },
    });

    expect(result.data.a[0]).toBeCloseTo(0.0, 5);
    expect(result.data.a[1]).toBeCloseTo(1.0, 5);
    expect(result.data.a[2]).toBeCloseTo(3.14, 5);
    expect(result.data.b[0]).toBeCloseTo(0.0, 5);
    expect(result.data.b[1]).toBeCloseTo(1.0, 5);
    expect(result.data.c[0]).toBeCloseTo(3.14, 5);
  });

  it('64ビット浮動小数点数の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setFloat64(0, 0.0);
    view.setFloat64(8, 1.0);
    view.setFloat64(16, 3.141592653589793);
    view.setFloat64(24, 0.0);
    view.setFloat64(32, 1.0);
    view.setFloat64(40, 3.141592653589793);

    type MyObject = {
      a: number[];
      b: number[];
      c: number[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'float64[]', count: 3 },
        b: { type: 'float64[]', count: 2 },
        c: { type: 'float64[]', count: 1 },
      },
    });

    expect(result.data.a[0]).toBeCloseTo(0.0, 15);
    expect(result.data.a[1]).toBeCloseTo(1.0, 15);
    expect(result.data.a[2]).toBeCloseTo(3.141592653589793, 15);
    expect(result.data.b[0]).toBeCloseTo(0.0, 15);
    expect(result.data.b[1]).toBeCloseTo(1.0, 15);
    expect(result.data.c[0]).toBeCloseTo(3.141592653589793, 15);
  });

  it('文字列の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    const str = 'hello';
    for (let i = 0; i < str.length; i++) {
      view.setUint8(i, str.charCodeAt(i));
    }
    const str2 = 'world!';
    for (let i = 0; i < str2.length; i++) {
      view.setUint8(str.length + i, str2.charCodeAt(i));
    }

    type MyObject = {
      a: string[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: {
          type: 'string[]',
          byte: [str.length, str2.length],
          count: 2,
        },
      },
    });

    expect(result.data.a).toEqual([str, str2]);
  });

  it('論理値の配列をバッファから読み込む', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint8(0, 1);
    view.setUint8(1, 0);
    view.setUint8(2, 1);
    view.setUint8(3, 0);

    type MyObject = {
      a: boolean[];
      b: boolean[];
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: { type: 'boolean[]', count: 2 },
        b: { type: 'boolean[]', count: 2 },
      },
    });

    expect(result.data).toEqual({ a: [true, false], b: [true, false] });
  });

  // --------------------------------------------------------------------------
});

describe('処理順序', () => {
  describe('キーが1, 3, 2と並んでいる場合', () => {
    type MyObject = {
      '1': number;
      '3': number;
      '2': number;
    };

    let buffer: ArrayBuffer;

    beforeEach(() => {
      buffer = new ArrayBuffer(256);
      const view = new DataView(buffer);
      view.setUint8(0, 0x0a);
      view.setUint8(1, 0x0b);
      view.setUint8(2, 0x0c);
    });

    it('offsetを指定しない場合には失敗する', () => {
      const result = readBin<MyObject>(buffer, {
        schema: {
          1: { type: 'uint8' },
          3: { type: 'uint8' },
          2: { type: 'uint8' },
        },
      });

      expect(result.data).not.toEqual({
        1: 0x0a,
        3: 0x0b,
        2: 0x0c,
      });
    });

    it('offsetを指定した場合には成功する', () => {
      const result = readBin<MyObject>(buffer, {
        schema: {
          1: { type: 'uint8', offset: 0 },
          3: { type: 'uint8', offset: 1 },
          2: { type: 'uint8', offset: 2 },
        },
      });

      expect(result.data).toEqual({
        1: 0x0a,
        3: 0x0b,
        2: 0x0c,
      });
    });

    it('orderを指定した場合には成功する', () => {
      const result = readBin<MyObject>(buffer, {
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
    });
  });

  describe('エントリーの order に', () => {
    it('"first"を指定した場合には最初に処理される', () => {
      const buffer = new ArrayBuffer(256);
      const view = new DataView(buffer);
      view.setUint8(0, 0x0a);
      view.setUint8(1, 0x0b);
      view.setUint8(2, 0x0c);
      view.setUint8(3, 0x0d);
      view.setUint8(4, 0x0e);

      const result = readBin<{
        '5': number;
        '1': number;
        '2': number;
        '3': number;
        '4': number;
      }>(buffer, {
        schema: {
          '5': { type: 'uint8', order: 'first' },
          '1': { type: 'uint8' },
          '2': { type: 'uint8' },
          '3': { type: 'uint8' },
          '4': { type: 'uint8' },
        },
      });

      expect(result.data).toEqual({
        '5': 0x0a,
        '1': 0x0b,
        '2': 0x0c,
        '3': 0x0d,
        '4': 0x0e,
      });
    });

    it('"last"を指定した場合には最後に処理される', () => {
      const buffer = new ArrayBuffer(256);
      const view = new DataView(buffer);
      view.setUint8(0, 0x0a);
      view.setUint8(1, 0x0b);
      view.setUint8(2, 0x0c);
      view.setUint8(3, 0x0d);
      view.setUint8(4, 0x0e);

      const result = readBin<{
        '2': number;
        '3': number;
        '4': number;
        '5': number;
        '1': number;
      }>(buffer, {
        schema: {
          '2': { type: 'uint8' },
          '3': { type: 'uint8' },
          '4': { type: 'uint8' },
          '5': { type: 'uint8' },
          '1': { type: 'uint8', order: 'last' },
        },
      });

      expect(result.data).toEqual({
        '2': 0x0a,
        '3': 0x0b,
        '4': 0x0c,
        '5': 0x0d,
        '1': 0x0e,
      });
    });

    it('数値を指定した場合には指定した数値が小さい順に処理される', () => {
      const buffer = new ArrayBuffer(256);
      const view = new DataView(buffer);
      view.setUint8(0, 0x0a);
      view.setUint8(1, 0x0b);
      view.setUint8(2, 0x0c);
      view.setUint8(3, 0x0d);
      view.setUint8(4, 0x0e);

      const result = readBin<{
        '5': number;
        '4': number;
        '3': number;
        '2': number;
        '1': number;
      }>(buffer, {
        schema: {
          '5': { type: 'uint8', order: 1 },
          '4': { type: 'uint8', order: 2 },
          '3': { type: 'uint8', order: 3 },
          '2': { type: 'uint8', order: 4 },
          '1': { type: 'uint8', order: 5 },
        },
      });

      expect(result.data).toEqual({
        '5': 0x0a,
        '4': 0x0b,
        '3': 0x0c,
        '2': 0x0d,
        '1': 0x0e,
      });
    });

    it('何も指定していない場合には、数値指定よりも後かつ、"last"よりも前に処理される', () => {
      const buffer = new ArrayBuffer(256);
      const view = new DataView(buffer);
      view.setUint8(0, 0x0a);
      view.setUint8(1, 0x0b);
      view.setUint8(2, 0x0c);
      view.setUint8(3, 0x0d);
      view.setUint8(4, 0x0e);

      const result = readBin<{
        '5': number;
        '4': number;
        '3': number;
        '2': number;
        '1': number;
      }>(buffer, {
        schema: {
          '5': { type: 'uint8', order: 1 },
          '4': { type: 'uint8', order: 2 },
          '3': { type: 'uint8', order: 3 },
          '2': { type: 'uint8' },
          '1': { type: 'uint8', order: 'last' },
        },
      });

      expect(result.data).toEqual({
        '5': 0x0a,
        '4': 0x0b,
        '3': 0x0c,
        '2': 0x0d,
        '1': 0x0e,
      });
    });

    it('同じ値が複数ある場合には同じorderのエントリー同士がfor...inの順序に従って処理される', () => {
      const buffer = new ArrayBuffer(256);
      const view = new DataView(buffer);
      view.setUint8(0, 0x0a);
      view.setUint8(1, 0x0b);
      view.setUint8(2, 0x0c);
      view.setUint8(3, 0x0d);
      view.setUint8(4, 0x0e);

      const result = readBin<{
        '4': number;
        '5': number;
        '1': number;
        '2': number;
        '3': number;
      }>(buffer, {
        schema: {
          '4': { type: 'uint8', order: 'first' },
          '5': { type: 'uint8', order: 'first' },
          '1': { type: 'uint8' },
          '2': { type: 'uint8' },
          '3': { type: 'uint8' },
        },
      });

      expect(result.data).toEqual({
        '4': 0x0a,
        '5': 0x0b,
        '1': 0x0c,
        '2': 0x0d,
        '3': 0x0e,
      });
    });
  });
});

describe('カスタムパーサー', () => {
  it('基本的なカスタムパーサーの使用方法', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint8(0, 1);
    view.setUint8(1, 0);
    view.setUint8(2, 1);
    view.setUint8(3, 0);
    view.setUint8(4, 10);
    view.setUint8(5, 20);
    view.setUint8(6, 20);

    type MyObject = {
      a: [boolean[], number];
      b: number;
      c: number;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: {
          type: 'custom',
          byte: 4,
          count: 1,
          parse: ({ reader }) => {
            const result: [boolean[], number] = [[], 0];
            const offset = 0;
            for (let i = 0; i < 3; i++) {
              result[0].push(reader.getUint8(offset + i) === 1);
            }
            result[1] = reader.getUint8(offset + 3);
            return { value: result, length: 4 };
          },
        },
        b: { type: 'uint8' },
        c: {
          type: 'custom',
          byte: 1,
          count: 1,
          parse: ({ reader }) => {
            return { value: reader.getUint8(0), length: 1 };
          },
        },
      },
    });

    expect(result.data).toEqual({
      a: [[true, false, true], 0],
      b: 10,
      c: 20,
    });
  });

  it('nested', () => {
    const buffer = new ArrayBuffer(256);
    const view = new DataView(buffer);
    view.setUint8(0, 1);
    view.setUint8(1, 0);
    view.setUint8(2, 1);
    view.setUint8(3, 0);
    view.setUint8(4, 10);
    view.setUint8(5, 20);
    view.setUint8(6, 20);

    type MyObject = {
      a: [boolean[], number];
      b: number;
      c: number;
    };

    type MyObject2 = {
      a: boolean[];
      b: number;
    };

    const result = readBin<MyObject>(buffer, {
      schema: {
        a: {
          type: 'custom',
          parse: ({ details: { buffer, offset } }) => {
            const result2 = readBin<MyObject2>(buffer, {
              schema: {
                a: { type: 'boolean[]', count: 3 },
                b: { type: 'uint8' },
              },
              offset,
            });

            return {
              value: [result2.data.a, result2.data.b],
              length: result2.meta.length,
            };
          },
        },
        b: { type: 'uint8' },
        c: {
          type: 'custom',
          byte: 1,
          count: 1,
          parse: ({ reader, details: { data } }) => {
            console.log(data);
            data.a;
            return { value: reader.getUint8(0) };
          },
        },
      },
    });

    expect(result.data).toEqual({
      a: [[true, false, true], 0],
      b: 10,
      c: 20,
    });
  });
});
