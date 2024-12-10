const w = {
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
  "uint8[]": 1,
  "uint16[]": 2,
  "uint32[]": 4,
  "int8[]": 1,
  "int16[]": 2,
  "int32[]": 4,
  "float32[]": 4,
  "float64[]": 8,
  "string[]": 1,
  "boolean[]": 1,
  custom: 0
};
function C(c, f) {
  const {
    schema: u,
    offset: l = 0,
    endian: g = "big",
    validate: i
  } = f, r = {}, F = [...Object.entries(u)].sort(_);
  let a = l;
  for (const [o, E] of F) {
    const {
      type: k,
      offset: U = a,
      byte: h = w[k] || 0,
      count: d = 1,
      endian: m = g
    } = E, n = A(h, d), s = y(c, U, m);
    switch (k) {
      // -----------------------------------------------------------------------
      // 数値型
      // 符号なし8ビット整数
      case "uint8":
        r[o] = s.getUint8(0), a += n;
        break;
      // 符号なし16ビット整数
      case "uint16":
        r[o] = s.getUint16(0), a += n;
        break;
      // 符号なし32ビット整数
      case "uint32":
        r[o] = s.getUint32(0), a += n;
        break;
      // 符号付き8ビット整数
      case "int8":
        r[o] = s.getInt8(0), a += n;
        break;
      // 符号付き16ビット整数
      case "int16":
        r[o] = s.getInt16(0), a += n;
        break;
      // 符号付き32ビット整数
      case "int32":
        r[o] = s.getInt32(0), a += n;
        break;
      // 32ビット浮動小数点数
      case "float32":
        r[o] = s.getFloat32(0), a += n;
        break;
      // 64ビット浮動小数点数
      case "float64":
        r[o] = s.getFloat64(0), a += n;
        break;
      // -----------------------------------------------------------------------
      // 文字列型
      // 文字列(ASCII)
      case "string": {
        const e = [];
        for (let t = 0; t < n; t += 1)
          e.push(s.getUint8(t));
        r[o] = String.fromCharCode(...e), a += n;
        break;
      }
      // -----------------------------------------------------------------------
      // 論理型
      // 論理型
      case "boolean":
        r[o] = s.getUint8(0) !== 0, a += n;
        break;
      // -----------------------------------------------------------------------
      // 数値型の配列
      // 符号なし8ビット整数の配列
      case "uint8[]": {
        const e = [];
        for (let t = 0; t < n; t += 1)
          e.push(s.getUint8(t));
        r[o] = e, a += n;
        break;
      }
      // 符号なし16ビット整数の配列
      case "uint16[]": {
        const e = [];
        for (let t = 0; t < n; t += 2)
          e.push(s.getUint16(t));
        r[o] = e, a += n;
        break;
      }
      // 符号なし32ビット整数の配列
      case "uint32[]": {
        const e = [];
        for (let t = 0; t < n; t += 4)
          e.push(s.getUint32(t));
        r[o] = e, a += n;
        break;
      }
      // 符号付き8ビット整数の配列
      case "int8[]": {
        const e = [];
        for (let t = 0; t < n; t += 1)
          e.push(s.getInt8(t));
        r[o] = e, a += n;
        break;
      }
      // 符号付き16ビット整数の配列
      case "int16[]": {
        const e = [];
        for (let t = 0; t < n; t += 2)
          e.push(s.getInt16(t));
        r[o] = e, a += n;
        break;
      }
      // 符号付き32ビット整数の配列
      case "int32[]": {
        const e = [];
        for (let t = 0; t < n; t += 4)
          e.push(s.getInt32(t));
        r[o] = e, a += n;
        break;
      }
      // 32ビット浮動小数点数の配列
      case "float32[]": {
        const e = [];
        for (let t = 0; t < n; t += 4)
          e.push(s.getFloat32(t));
        r[o] = e, a += n;
        break;
      }
      // 64ビット浮動小数点数の配列
      case "float64[]": {
        const e = [];
        for (let t = 0; t < n; t += 8)
          e.push(s.getFloat64(t));
        r[o] = e, a += n;
        break;
      }
      // -----------------------------------------------------------------------
      // 文字列型の配列
      // 文字列(ASCII)の配列
      case "string[]": {
        const e = [];
        for (let b = 0; b < n; b += 1)
          e.push(s.getUint8(b));
        if (typeof h == "number") {
          r[o] = String.fromCharCode(...e), a += n;
          break;
        }
        const t = [];
        let p = 0;
        for (let b = 0; b < Math.min(d, h.length); b++) {
          const I = p + h[b];
          t.push(String.fromCharCode(...e.slice(p, I))), p = I;
        }
        r[o] = t, a += n;
        break;
      }
      // -----------------------------------------------------------------------
      // 論理型の配列
      // 論理型の配列
      case "boolean[]": {
        const e = [];
        for (let t = 0; t < n; t += 1)
          e.push(s.getUint8(t) !== 0);
        r[o] = e, a += n;
        break;
      }
      // -----------------------------------------------------------------------
      // カスタム型
      // カスタム型
      case "custom": {
        const { value: e, length: t = n } = E.parse({
          reader: s,
          details: {
            offset: U,
            length: n,
            buffer: c,
            byte: h,
            count: d,
            endian: m,
            data: r
          }
        });
        r[o] = e, a += t;
        break;
      }
      // -----------------------------------------------------------------------
      // 未知の型
      default:
        throw new Error(`Unknown type: ${k}`);
    }
  }
  if (i) {
    if (!i(r))
      throw new Error("Validation error");
    return { data: r, meta: { offset: l, length: a - l } };
  } else
    return { data: r, meta: { offset: l, length: a - l } };
}
function _(c, f) {
  const u = (i) => i == null ? Number.MAX_SAFE_INTEGER - 1 : i === "last" ? Number.MAX_SAFE_INTEGER : i === "first" ? -Number.MAX_SAFE_INTEGER : i, l = u(c[1].order), g = u(f[1].order);
  return l - g;
}
function A(c, f) {
  if (Array.isArray(c)) {
    let u = 0;
    for (let l = 0; l < Math.min(f, c.length); l++)
      u += c[l];
    return u;
  } else
    return c * f;
}
function y(c, f, u) {
  const l = new DataView(c, f), g = u === "little";
  return {
    getUint8: (i) => l.getUint8(i),
    getUint16: (i) => l.getUint16(i, g),
    getUint32: (i) => l.getUint32(i, g),
    getInt8: (i) => l.getInt8(i),
    getInt16: (i) => l.getInt16(i, g),
    getInt32: (i) => l.getInt32(i, g),
    getFloat32: (i) => l.getFloat32(i, g),
    getFloat64: (i) => l.getFloat64(i, g)
  };
}
export {
  C as readBin
};
