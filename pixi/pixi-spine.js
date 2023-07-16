/*!
 * pixi-spine - v4.0.3
 * Compiled Thu, 19 Jan 2023 18:42:04 UTC
 *
 * pixi-spine is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 *
 * Copyright 2023, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */ (this.PIXI_dpbf = this.PIXI_dpbf || {}),
  (this.PIXI_dpbf.spine = (function (tt, H, dn, wr, br, oe, qe) {
    "use strict";
    var Z = ((c) => (
      (c[(c.Region = 0)] = "Region"),
      (c[(c.BoundingBox = 1)] = "BoundingBox"),
      (c[(c.Mesh = 2)] = "Mesh"),
      (c[(c.LinkedMesh = 3)] = "LinkedMesh"),
      (c[(c.Path = 4)] = "Path"),
      (c[(c.Point = 5)] = "Point"),
      (c[(c.Clipping = 6)] = "Clipping"),
      c
    ))(Z || {});
    class Mn {
      constructor(t, n = new Array(), e = 0, i = new DataView(t.buffer)) {
        (this.strings = n), (this.index = e), (this.buffer = i);
      }
      readByte() {
        return this.buffer.getInt8(this.index++);
      }
      readUnsignedByte() {
        return this.buffer.getUint8(this.index++);
      }
      readShort() {
        const t = this.buffer.getInt16(this.index);
        return (this.index += 2), t;
      }
      readInt32() {
        const t = this.buffer.getInt32(this.index);
        return (this.index += 4), t;
      }
      readInt(t) {
        let n = this.readByte(),
          e = n & 127;
        return (
          n & 128 &&
            ((n = this.readByte()),
            (e |= (n & 127) << 7),
            n & 128 &&
              ((n = this.readByte()),
              (e |= (n & 127) << 14),
              n & 128 &&
                ((n = this.readByte()),
                (e |= (n & 127) << 21),
                n & 128 && ((n = this.readByte()), (e |= (n & 127) << 28))))),
          t ? e : (e >>> 1) ^ -(e & 1)
        );
      }
      readStringRef() {
        const t = this.readInt(!0);
        return t == 0 ? null : this.strings[t - 1];
      }
      readString() {
        let t = this.readInt(!0);
        switch (t) {
          case 0:
            return null;
          case 1:
            return "";
        }
        t--;
        let n = "";
        for (let e = 0; e < t; ) {
          const i = this.readUnsignedByte();
          switch (i >> 4) {
            case 12:
            case 13:
              (n += String.fromCharCode(
                ((i & 31) << 6) | (this.readByte() & 63)
              )),
                (e += 2);
              break;
            case 14:
              (n += String.fromCharCode(
                ((i & 15) << 12) |
                  ((this.readByte() & 63) << 6) |
                  (this.readByte() & 63)
              )),
                (e += 3);
              break;
            default:
              (n += String.fromCharCode(i)), e++;
          }
        }
        return n;
      }
      readFloat() {
        const t = this.buffer.getFloat32(this.index);
        return (this.index += 4), t;
      }
      readBoolean() {
        return this.readByte() != 0;
      }
    }
    var A = ((c) => (
        (c[(c.setup = 0)] = "setup"),
        (c[(c.first = 1)] = "first"),
        (c[(c.replace = 2)] = "replace"),
        (c[(c.add = 3)] = "add"),
        c
      ))(A || {}),
      J = ((c) => (
        (c[(c.mixIn = 0)] = "mixIn"), (c[(c.mixOut = 1)] = "mixOut"), c
      ))(J || {}),
      dt = ((c) => (
        (c[(c.Fixed = 0)] = "Fixed"), (c[(c.Percent = 1)] = "Percent"), c
      ))(dt || {}),
      pt = ((c) => (
        (c[(c.Tangent = 0)] = "Tangent"),
        (c[(c.Chain = 1)] = "Chain"),
        (c[(c.ChainScale = 2)] = "ChainScale"),
        c
      ))(pt || {}),
      j = ((c) => (
        (c[(c.Normal = 0)] = "Normal"),
        (c[(c.OnlyTranslation = 1)] = "OnlyTranslation"),
        (c[(c.NoRotationOrReflection = 2)] = "NoRotationOrReflection"),
        (c[(c.NoScale = 3)] = "NoScale"),
        (c[(c.NoScaleOrReflection = 4)] = "NoScaleOrReflection"),
        c
      ))(j || {});
    function Jn(c) {
      switch (c.toLowerCase()) {
        case "nearest":
          return Bt.Nearest;
        case "linear":
          return Bt.Linear;
        case "mipmap":
          return Bt.MipMap;
        case "mipmapnearestnearest":
          return Bt.MipMapNearestNearest;
        case "mipmaplinearnearest":
          return Bt.MipMapLinearNearest;
        case "mipmapnearestlinear":
          return Bt.MipMapNearestLinear;
        case "mipmaplinearlinear":
          return Bt.MipMapLinearLinear;
        default:
          throw new Error(`Unknown texture filter ${c}`);
      }
    }
    function Er(c) {
      switch (c.toLowerCase()) {
        case "mirroredtepeat":
          return fe.MirroredRepeat;
        case "clamptoedge":
          return fe.ClampToEdge;
        case "repeat":
          return fe.Repeat;
        default:
          throw new Error(`Unknown texture wrap ${c}`);
      }
    }
    var Bt = ((c) => (
        (c[(c.Nearest = 9728)] = "Nearest"),
        (c[(c.Linear = 9729)] = "Linear"),
        (c[(c.MipMap = 9987)] = "MipMap"),
        (c[(c.MipMapNearestNearest = 9984)] = "MipMapNearestNearest"),
        (c[(c.MipMapLinearNearest = 9985)] = "MipMapLinearNearest"),
        (c[(c.MipMapNearestLinear = 9986)] = "MipMapNearestLinear"),
        (c[(c.MipMapLinearLinear = 9987)] = "MipMapLinearLinear"),
        c
      ))(Bt || {}),
      fe = ((c) => (
        (c[(c.MirroredRepeat = 33648)] = "MirroredRepeat"),
        (c[(c.ClampToEdge = 33071)] = "ClampToEdge"),
        (c[(c.Repeat = 10497)] = "Repeat"),
        c
      ))(fe || {});
    class Vn {
      constructor() {
        (this.size = null),
          (this.names = null),
          (this.values = null),
          (this.renderObject = null);
      }
      get width() {
        const t = this.texture;
        return t.trim ? t.trim.width : t.orig.width;
      }
      get height() {
        const t = this.texture;
        return t.trim ? t.trim.height : t.orig.height;
      }
      get u() {
        return this.texture._uvs.x0;
      }
      get v() {
        return this.texture._uvs.y0;
      }
      get u2() {
        return this.texture._uvs.x2;
      }
      get v2() {
        return this.texture._uvs.y2;
      }
      get offsetX() {
        const t = this.texture;
        return t.trim ? t.trim.x : 0;
      }
      get offsetY() {
        return this.spineOffsetY;
      }
      get pixiOffsetY() {
        const t = this.texture;
        return t.trim ? t.trim.y : 0;
      }
      get spineOffsetY() {
        const t = this.texture;
        return this.originalHeight - this.height - (t.trim ? t.trim.y : 0);
      }
      get originalWidth() {
        return this.texture.orig.width;
      }
      get originalHeight() {
        return this.texture.orig.height;
      }
      get x() {
        return this.texture.frame.x;
      }
      get y() {
        return this.texture.frame.y;
      }
      get rotate() {
        return this.texture.rotate !== 0;
      }
      get degrees() {
        return (360 - this.texture.rotate * 45) % 360;
      }
    }
    class Sr {
      constructor() {
        (this.x = 0),
          (this.y = 0),
          (this.width = 0),
          (this.height = 0),
          (this.offsetX = 0),
          (this.offsetY = 0),
          (this.originalWidth = 0),
          (this.originalHeight = 0),
          (this.rotate = 0),
          (this.index = 0);
      }
    }
    class Fn {
      constructor(t, n, e) {
        (this.pages = new Array()),
          (this.regions = new Array()),
          t && this.addSpineAtlas(t, n, e);
      }
      addTexture(t, n) {
        const e = this.pages;
        let i = null;
        for (let h = 0; h < e.length; h++)
          if (e[h].baseTexture === n.baseTexture) {
            i = e[h];
            break;
          }
        if (i === null) {
          (i = new ts()), (i.name = "texturePage");
          const h = n.baseTexture;
          (i.width = h.realWidth),
            (i.height = h.realHeight),
            (i.baseTexture = h),
            (i.minFilter = i.magFilter = Bt.Nearest),
            (i.uWrap = fe.ClampToEdge),
            (i.vWrap = fe.ClampToEdge),
            e.push(i);
        }
        const r = new es();
        return (
          (r.name = t),
          (r.page = i),
          (r.texture = n),
          (r.index = -1),
          this.regions.push(r),
          r
        );
      }
      addTextureHash(t, n) {
        for (const e in t)
          t.hasOwnProperty(e) &&
            this.addTexture(
              n && e.indexOf(".") !== -1 ? e.substr(0, e.lastIndexOf(".")) : e,
              t[e]
            );
      }
      addSpineAtlas(t, n, e) {
        return this.load(t, n, e);
      }
      load(t, n, e) {
        if (n == null) throw new Error("textureLoader cannot be null.");
        const i = new yr(t),
          r = new Array(4);
        let h = null;
        const l = {};
        let s = null;
        (l.size = () => {
          (h.width = parseInt(r[1])), (h.height = parseInt(r[2]));
        }),
          (l.format = () => {}),
          (l.filter = () => {
            (h.minFilter = Jn(r[1])), (h.magFilter = Jn(r[2]));
          }),
          (l.repeat = () => {
            r[1].indexOf("x") != -1 && (h.uWrap = fe.Repeat),
              r[1].indexOf("y") != -1 && (h.vWrap = fe.Repeat);
          }),
          (l.pma = () => {
            h.pma = r[1] == "true";
          });
        const a = {};
        (a.xy = () => {
          (s.x = parseInt(r[1])), (s.y = parseInt(r[2]));
        }),
          (a.size = () => {
            (s.width = parseInt(r[1])), (s.height = parseInt(r[2]));
          }),
          (a.bounds = () => {
            (s.x = parseInt(r[1])),
              (s.y = parseInt(r[2])),
              (s.width = parseInt(r[3])),
              (s.height = parseInt(r[4]));
          }),
          (a.offset = () => {
            (s.offsetX = parseInt(r[1])), (s.offsetY = parseInt(r[2]));
          }),
          (a.orig = () => {
            (s.originalWidth = parseInt(r[1])),
              (s.originalHeight = parseInt(r[2]));
          }),
          (a.offsets = () => {
            (s.offsetX = parseInt(r[1])),
              (s.offsetY = parseInt(r[2])),
              (s.originalWidth = parseInt(r[3])),
              (s.originalHeight = parseInt(r[4]));
          }),
          (a.rotate = () => {
            const f = r[1];
            let u = 0;
            f.toLocaleLowerCase() == "true"
              ? (u = 6)
              : f.toLocaleLowerCase() == "false"
              ? (u = 0)
              : (u = ((720 - parseFloat(f)) % 360) / 45),
              (s.rotate = u);
          }),
          (a.index = () => {
            s.index = parseInt(r[1]);
          });
        let o = i.readLine();
        for (; o != null && o.trim().length == 0; ) o = i.readLine();
        for (; !(o == null || o.trim().length == 0 || i.readEntry(r, o) == 0); )
          o = i.readLine();
        const d = () => {
          for (;;) {
            if (o == null) return e && e(this);
            if (o.trim().length == 0) (h = null), (o = i.readLine());
            else if (h === null) {
              for (
                h = new ts(), h.name = o.trim();
                i.readEntry(r, (o = i.readLine())) != 0;

              ) {
                const f = l[r[0]];
                f && f();
              }
              this.pages.push(h),
                n(h.name, (f) => {
                  if (f === null)
                    return (
                      this.pages.splice(this.pages.indexOf(h), 1), e && e(null)
                    );
                  (h.baseTexture = f),
                    h.pma && (f.alphaMode = H.ALPHA_MODES.PMA),
                    f.valid || f.setSize(h.width, h.height),
                    h.setFilters(),
                    (!h.width || !h.height) &&
                      ((h.width = f.realWidth),
                      (h.height = f.realHeight),
                      (!h.width || !h.height) &&
                        console.log(
                          `ERROR spine atlas page ${h.name}: meshes wont work if you dont specify size in atlas (http://www.html5gamedevs.com/topic/18888-pixi-spines-and-meshes/?p=107121)`
                        )),
                    d();
                });
              break;
            } else {
              s = new Sr();
              const f = new es();
              (f.name = o), (f.page = h);
              let u = null,
                m = null;
              for (;;) {
                const p = i.readEntry(r, (o = i.readLine()));
                if (p == 0) break;
                const S = a[r[0]];
                if (S) S();
                else {
                  u == null && ((u = []), (m = [])), u.push(r[0]);
                  const y = [];
                  for (let M = 0; M < p; M++) y.push(parseInt(r[M + 1]));
                  m.push(y);
                }
              }
              s.originalWidth == 0 &&
                s.originalHeight == 0 &&
                ((s.originalWidth = s.width), (s.originalHeight = s.height));
              const g = h.baseTexture.resolution;
              (s.x /= g),
                (s.y /= g),
                (s.width /= g),
                (s.height /= g),
                (s.originalWidth /= g),
                (s.originalHeight /= g),
                (s.offsetX /= g),
                (s.offsetY /= g);
              const x = s.rotate % 4 !== 0,
                E = new H.Rectangle(
                  s.x,
                  s.y,
                  x ? s.height : s.width,
                  x ? s.width : s.height
                ),
                w = new H.Rectangle(0, 0, s.originalWidth, s.originalHeight),
                b = new H.Rectangle(
                  s.offsetX,
                  s.originalHeight - s.height - s.offsetY,
                  s.width,
                  s.height
                );
              (f.texture = new H.Texture(
                f.page.baseTexture,
                E,
                w,
                b,
                s.rotate
              )),
                (f.index = s.index),
                f.texture.updateUvs(),
                this.regions.push(f);
            }
          }
        };
        d();
      }
      findRegion(t) {
        for (let n = 0; n < this.regions.length; n++)
          if (this.regions[n].name == t) return this.regions[n];
        return null;
      }
      dispose() {
        for (let t = 0; t < this.pages.length; t++)
          this.pages[t].baseTexture.dispose();
      }
    }
    class yr {
      constructor(t) {
        (this.index = 0), (this.lines = t.split(/\r\n|\r|\n/));
      }
      readLine() {
        return this.index >= this.lines.length
          ? null
          : this.lines[this.index++];
      }
      readEntry(t, n) {
        if (n == null || ((n = n.trim()), n.length == 0)) return 0;
        const e = n.indexOf(":");
        if (e == -1) return 0;
        t[0] = n.substr(0, e).trim();
        for (let i = 1, r = e + 1; ; i++) {
          const h = n.indexOf(",", r);
          if (h == -1) return (t[i] = n.substr(r).trim()), i;
          if (((t[i] = n.substr(r, h - r).trim()), (r = h + 1), i == 4))
            return 4;
        }
      }
    }
    class ts {
      constructor() {
        (this.minFilter = Bt.Nearest),
          (this.magFilter = Bt.Nearest),
          (this.uWrap = fe.ClampToEdge),
          (this.vWrap = fe.ClampToEdge);
      }
      setFilters() {
        const t = this.baseTexture,
          n = this.minFilter;
        n == Bt.Linear
          ? (t.scaleMode = H.SCALE_MODES.LINEAR)
          : this.minFilter == Bt.Nearest
          ? (t.scaleMode = H.SCALE_MODES.NEAREST)
          : ((t.mipmap = H.MIPMAP_MODES.POW2),
            n == Bt.MipMapNearestNearest
              ? (t.scaleMode = H.SCALE_MODES.NEAREST)
              : (t.scaleMode = H.SCALE_MODES.LINEAR));
      }
    }
    class es extends Vn {}
    class ns {
      constructor() {
        this.array = new Array();
      }
      add(t) {
        const n = this.contains(t);
        return (this.array[t | 0] = t | 0), !n;
      }
      contains(t) {
        return this.array[t | 0] != null;
      }
      remove(t) {
        this.array[t | 0] = void 0;
      }
      clear() {
        this.array.length = 0;
      }
    }
    class ss {
      constructor() {
        (this.entries = {}), (this.size = 0);
      }
      add(t) {
        const n = this.entries[t];
        return (this.entries[t] = !0), n ? !1 : (this.size++, !0);
      }
      addAll(t) {
        const n = this.size;
        for (let e = 0, i = t.length; e < i; e++) this.add(t[e]);
        return n != this.size;
      }
      contains(t) {
        return this.entries[t];
      }
      clear() {
        (this.entries = {}), (this.size = 0);
      }
    }
    const Je = class {
      constructor(c = 0, t = 0, n = 0, e = 0) {
        (this.r = c), (this.g = t), (this.b = n), (this.a = e);
      }
      set(c, t, n, e) {
        return (
          (this.r = c), (this.g = t), (this.b = n), (this.a = e), this.clamp()
        );
      }
      setFromColor(c) {
        return (
          (this.r = c.r), (this.g = c.g), (this.b = c.b), (this.a = c.a), this
        );
      }
      setFromString(c) {
        return (
          (c = c.charAt(0) == "#" ? c.substr(1) : c),
          (this.r = parseInt(c.substr(0, 2), 16) / 255),
          (this.g = parseInt(c.substr(2, 2), 16) / 255),
          (this.b = parseInt(c.substr(4, 2), 16) / 255),
          (this.a = c.length != 8 ? 1 : parseInt(c.substr(6, 2), 16) / 255),
          this
        );
      }
      add(c, t, n, e) {
        return (
          (this.r += c),
          (this.g += t),
          (this.b += n),
          (this.a += e),
          this.clamp()
        );
      }
      clamp() {
        return (
          this.r < 0 ? (this.r = 0) : this.r > 1 && (this.r = 1),
          this.g < 0 ? (this.g = 0) : this.g > 1 && (this.g = 1),
          this.b < 0 ? (this.b = 0) : this.b > 1 && (this.b = 1),
          this.a < 0 ? (this.a = 0) : this.a > 1 && (this.a = 1),
          this
        );
      }
      static rgba8888ToColor(c, t) {
        (c.r = ((t & 4278190080) >>> 24) / 255),
          (c.g = ((t & 16711680) >>> 16) / 255),
          (c.b = ((t & 65280) >>> 8) / 255),
          (c.a = (t & 255) / 255);
      }
      static rgb888ToColor(c, t) {
        (c.r = ((t & 16711680) >>> 16) / 255),
          (c.g = ((t & 65280) >>> 8) / 255),
          (c.b = (t & 255) / 255);
      }
      static fromString(c) {
        return new Je().setFromString(c);
      }
    };
    let _ = Je;
    (_.WHITE = new Je(1, 1, 1, 1)),
      (_.RED = new Je(1, 0, 0, 1)),
      (_.GREEN = new Je(0, 1, 0, 1)),
      (_.BLUE = new Je(0, 0, 1, 1)),
      (_.MAGENTA = new Je(1, 0, 1, 1));
    const Fe = class {
      static clamp(c, t, n) {
        return c < t ? t : c > n ? n : c;
      }
      static cosDeg(c) {
        return Math.cos(c * Fe.degRad);
      }
      static sinDeg(c) {
        return Math.sin(c * Fe.degRad);
      }
      static signum(c) {
        return Math.sign(c);
      }
      static toInt(c) {
        return c > 0 ? Math.floor(c) : Math.ceil(c);
      }
      static cbrt(c) {
        const t = Math.pow(Math.abs(c), 0.3333333333333333);
        return c < 0 ? -t : t;
      }
      static randomTriangular(c, t) {
        return Fe.randomTriangularWith(c, t, (c + t) * 0.5);
      }
      static randomTriangularWith(c, t, n) {
        const e = Math.random(),
          i = t - c;
        return e <= (n - c) / i
          ? c + Math.sqrt(e * i * (n - c))
          : t - Math.sqrt((1 - e) * i * (t - n));
      }
      static isPowerOfTwo(c) {
        return c && (c & (c - 1)) === 0;
      }
    };
    let C = Fe;
    (C.PI = 3.1415927),
      (C.PI2 = Fe.PI * 2),
      (C.radiansToDegrees = 180 / Fe.PI),
      (C.radDeg = Fe.radiansToDegrees),
      (C.degreesToRadians = Fe.PI / 180),
      (C.degRad = Fe.degreesToRadians);
    class Si {
      apply(t, n, e) {
        return t + (n - t) * this.applyInternal(e);
      }
    }
    class yi extends Si {
      constructor(t) {
        super(), (this.power = 2), (this.power = t);
      }
      applyInternal(t) {
        return t <= 0.5
          ? Math.pow(t * 2, this.power) / 2
          : Math.pow((t - 1) * 2, this.power) / (this.power % 2 == 0 ? -2 : 2) +
              1;
      }
    }
    class is extends yi {
      applyInternal(t) {
        return Math.pow(t - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1;
      }
    }
    const fn = class {
      static arrayCopy(c, t, n, e, i) {
        for (let r = t, h = e; r < t + i; r++, h++) n[h] = c[r];
      }
      static arrayFill(c, t, n, e) {
        for (let i = t; i < n; i++) c[i] = e;
      }
      static setArraySize(c, t, n = 0) {
        const e = c.length;
        if (e == t) return c;
        if (((c.length = t), e < t)) for (let i = e; i < t; i++) c[i] = n;
        return c;
      }
      static ensureArrayCapacity(c, t, n = 0) {
        return c.length >= t ? c : fn.setArraySize(c, t, n);
      }
      static newArray(c, t) {
        const n = new Array(c);
        for (let e = 0; e < c; e++) n[e] = t;
        return n;
      }
      static newFloatArray(c) {
        if (fn.SUPPORTS_TYPED_ARRAYS) return new Float32Array(c);
        const t = new Array(c);
        for (let n = 0; n < t.length; n++) t[n] = 0;
        return t;
      }
      static newShortArray(c) {
        if (fn.SUPPORTS_TYPED_ARRAYS) return new Int16Array(c);
        const t = new Array(c);
        for (let n = 0; n < t.length; n++) t[n] = 0;
        return t;
      }
      static toFloatArray(c) {
        return fn.SUPPORTS_TYPED_ARRAYS ? new Float32Array(c) : c;
      }
      static toSinglePrecision(c) {
        return fn.SUPPORTS_TYPED_ARRAYS ? Math.fround(c) : c;
      }
      static webkit602BugfixHelper(c, t) {}
      static contains(c, t, n = !0) {
        for (let e = 0; e < c.length; e++) if (c[e] == t) return !0;
        return !1;
      }
      static enumValue(c, t) {
        return c[t[0].toUpperCase() + t.slice(1)];
      }
    };
    let v = fn;
    v.SUPPORTS_TYPED_ARRAYS = typeof Float32Array != "undefined";
    class Mr {
      static logBones(t) {
        for (let n = 0; n < t.bones.length; n++) {
          const e = t.bones[n],
            i = e.matrix;
          console.log(
            `${e.data.name}, ${i.a}, ${i.b}, ${i.c}, ${i.d}, ${i.tx}, ${i.ty}`
          );
        }
      }
    }
    class An {
      constructor(t) {
        (this.items = new Array()), (this.instantiator = t);
      }
      obtain() {
        return this.items.length > 0 ? this.items.pop() : this.instantiator();
      }
      free(t) {
        t.reset && t.reset(), this.items.push(t);
      }
      freeAll(t) {
        for (let n = 0; n < t.length; n++) this.free(t[n]);
      }
      clear() {
        this.items.length = 0;
      }
    }
    class un {
      constructor(t = 0, n = 0) {
        (this.x = t), (this.y = n);
      }
      set(t, n) {
        return (this.x = t), (this.y = n), this;
      }
      length() {
        const t = this.x,
          n = this.y;
        return Math.sqrt(t * t + n * n);
      }
      normalize() {
        const t = this.length();
        return t != 0 && ((this.x /= t), (this.y /= t)), this;
      }
    }
    class Ar {
      constructor() {
        (this.maxDelta = 0.064),
          (this.framesPerSecond = 0),
          (this.delta = 0),
          (this.totalTime = 0),
          (this.lastTime = Date.now() / 1e3),
          (this.frameCount = 0),
          (this.frameTime = 0);
      }
      update() {
        const t = Date.now() / 1e3;
        (this.delta = t - this.lastTime),
          (this.frameTime += this.delta),
          (this.totalTime += this.delta),
          this.delta > this.maxDelta && (this.delta = this.maxDelta),
          (this.lastTime = t),
          this.frameCount++,
          this.frameTime > 1 &&
            ((this.framesPerSecond = this.frameCount / this.frameTime),
            (this.frameTime = 0),
            (this.frameCount = 0));
      }
    }
    class Cr {
      constructor(t = 32) {
        (this.addedValues = 0),
          (this.lastValue = 0),
          (this.mean = 0),
          (this.dirty = !0),
          (this.values = new Array(t));
      }
      hasEnoughData() {
        return this.addedValues >= this.values.length;
      }
      addValue(t) {
        this.addedValues < this.values.length && this.addedValues++,
          (this.values[this.lastValue++] = t),
          this.lastValue > this.values.length - 1 && (this.lastValue = 0),
          (this.dirty = !0);
      }
      getMean() {
        if (this.hasEnoughData()) {
          if (this.dirty) {
            let t = 0;
            for (let n = 0; n < this.values.length; n++) t += this.values[n];
            (this.mean = t / this.values.length), (this.dirty = !1);
          }
          return this.mean;
        }
        return 0;
      }
    }
    class Cn {
      constructor() {
        (this.minX = 0),
          (this.minY = 0),
          (this.maxX = 0),
          (this.maxY = 0),
          (this.boundingBoxes = new Array()),
          (this.polygons = new Array()),
          (this.polygonPool = new An(() => v.newFloatArray(16)));
      }
      update(t, n) {
        if (!t) throw new Error("skeleton cannot be null.");
        const e = this.boundingBoxes,
          i = this.polygons,
          r = this.polygonPool,
          h = t.slots,
          l = h.length;
        (e.length = 0), r.freeAll(i), (i.length = 0);
        for (let s = 0; s < l; s++) {
          const a = h[s];
          if (!a.bone.active) continue;
          const o = a.getAttachment();
          if (o != null && o.type === Z.BoundingBox) {
            const d = o;
            e.push(d);
            let f = r.obtain();
            f.length != d.worldVerticesLength &&
              (f = v.newFloatArray(d.worldVerticesLength)),
              i.push(f),
              d.computeWorldVertices(a, 0, d.worldVerticesLength, f, 0, 2);
          }
        }
        n
          ? this.aabbCompute()
          : ((this.minX = Number.POSITIVE_INFINITY),
            (this.minY = Number.POSITIVE_INFINITY),
            (this.maxX = Number.NEGATIVE_INFINITY),
            (this.maxY = Number.NEGATIVE_INFINITY));
      }
      aabbCompute() {
        let t = Number.POSITIVE_INFINITY,
          n = Number.POSITIVE_INFINITY,
          e = Number.NEGATIVE_INFINITY,
          i = Number.NEGATIVE_INFINITY;
        const r = this.polygons;
        for (let h = 0, l = r.length; h < l; h++) {
          const s = r[h],
            a = s;
          for (let o = 0, d = s.length; o < d; o += 2) {
            const f = a[o],
              u = a[o + 1];
            (t = Math.min(t, f)),
              (n = Math.min(n, u)),
              (e = Math.max(e, f)),
              (i = Math.max(i, u));
          }
        }
        (this.minX = t), (this.minY = n), (this.maxX = e), (this.maxY = i);
      }
      aabbContainsPoint(t, n) {
        return (
          t >= this.minX && t <= this.maxX && n >= this.minY && n <= this.maxY
        );
      }
      aabbIntersectsSegment(t, n, e, i) {
        const r = this.minX,
          h = this.minY,
          l = this.maxX,
          s = this.maxY;
        if (
          (t <= r && e <= r) ||
          (n <= h && i <= h) ||
          (t >= l && e >= l) ||
          (n >= s && i >= s)
        )
          return !1;
        const a = (i - n) / (e - t);
        let o = a * (r - t) + n;
        if ((o > h && o < s) || ((o = a * (l - t) + n), o > h && o < s))
          return !0;
        let d = (h - n) / a + t;
        return (d > r && d < l) || ((d = (s - n) / a + t), d > r && d < l);
      }
      aabbIntersectsSkeleton(t) {
        return (
          this.minX < t.maxX &&
          this.maxX > t.minX &&
          this.minY < t.maxY &&
          this.maxY > t.minY
        );
      }
      containsPoint(t, n) {
        const e = this.polygons;
        for (let i = 0, r = e.length; i < r; i++)
          if (this.containsPointPolygon(e[i], t, n))
            return this.boundingBoxes[i];
        return null;
      }
      containsPointPolygon(t, n, e) {
        const i = t,
          r = t.length;
        let h = r - 2,
          l = !1;
        for (let s = 0; s < r; s += 2) {
          const a = i[s + 1],
            o = i[h + 1];
          if ((a < e && o >= e) || (o < e && a >= e)) {
            const d = i[s];
            d + ((e - a) / (o - a)) * (i[h] - d) < n && (l = !l);
          }
          h = s;
        }
        return l;
      }
      intersectsSegment(t, n, e, i) {
        const r = this.polygons;
        for (let h = 0, l = r.length; h < l; h++)
          if (this.intersectsSegmentPolygon(r[h], t, n, e, i))
            return this.boundingBoxes[h];
        return null;
      }
      intersectsSegmentPolygon(t, n, e, i, r) {
        const h = t,
          l = t.length,
          s = n - i,
          a = e - r,
          o = n * r - e * i;
        let d = h[l - 2],
          f = h[l - 1];
        for (let u = 0; u < l; u += 2) {
          const m = h[u],
            g = h[u + 1],
            x = d * g - f * m,
            E = d - m,
            w = f - g,
            b = s * w - a * E,
            p = (o * E - s * x) / b;
          if (
            ((p >= d && p <= m) || (p >= m && p <= d)) &&
            ((p >= n && p <= i) || (p >= i && p <= n))
          ) {
            const S = (o * w - a * x) / b;
            if (
              ((S >= f && S <= g) || (S >= g && S <= f)) &&
              ((S >= e && S <= r) || (S >= r && S <= e))
            )
              return !0;
          }
          (d = m), (f = g);
        }
        return !1;
      }
      getPolygon(t) {
        if (!t) throw new Error("boundingBox cannot be null.");
        const n = this.boundingBoxes.indexOf(t);
        return n == -1 ? null : this.polygons[n];
      }
      getWidth() {
        return this.maxX - this.minX;
      }
      getHeight() {
        return this.maxY - this.minY;
      }
    }
    const zt = {
        yDown: !0,
        FAIL_ON_NON_EXISTING_SKIN: !1,
        GLOBAL_AUTO_UPDATE: !0,
        GLOBAL_DELAY_LIMIT: 0,
      },
      Ue = [0, 0, 0];
    class Mi extends wr.Sprite {
      constructor() {
        super(...arguments), (this.region = null), (this.attachment = null);
      }
    }
    class Ai extends br.SimpleMesh {
      constructor(t, n, e, i, r) {
        super(t, n, e, i, r), (this.region = null), (this.attachment = null);
      }
    }
    const Ci = class extends dn.Container {
      constructor(c) {
        if ((super(), !c)) throw new Error("The spineData param is required.");
        if (typeof c == "string")
          throw new Error(
            'spineData param cant be string. Please use spine.Spine.fromAtlas("YOUR_RESOURCE_NAME") from now on.'
          );
        (this.spineData = c),
          this.createSkeleton(c),
          (this.slotContainers = []),
          (this.tempClipContainers = []);
        for (let t = 0, n = this.skeleton.slots.length; t < n; t++) {
          const e = this.skeleton.slots[t],
            i = e.getAttachment(),
            r = this.newContainer();
          if (
            (this.slotContainers.push(r),
            this.addChild(r),
            this.tempClipContainers.push(null),
            !!i)
          )
            if (i.type === Z.Region) {
              const h = i.name,
                l = this.createSprite(e, i, h);
              (e.currentSprite = l), (e.currentSpriteName = h), r.addChild(l);
            } else if (i.type === Z.Mesh) {
              const h = this.createMesh(e, i);
              (e.currentMesh = h),
                (e.currentMeshId = i.id),
                (e.currentMeshName = i.name),
                r.addChild(h);
            } else
              i.type === Z.Clipping &&
                (this.createGraphics(e, i),
                r.addChild(e.clippingContainer),
                r.addChild(e.currentGraphics));
        }
        (this.tintRgb = new Float32Array([1, 1, 1])),
          (this.autoUpdate = !0),
          (this.visible = !0);
      }
      get debug() {
        return this._debug;
      }
      set debug(c) {
        var t;
        c != this._debug &&
          ((t = this._debug) == null || t.unregisterSpine(this),
          c == null || c.registerSpine(this),
          (this._debug = c));
      }
      get autoUpdate() {
        return this._autoUpdate;
      }
      set autoUpdate(c) {
        c !== this._autoUpdate &&
          ((this._autoUpdate = c),
          (this.updateTransform = c
            ? Ci.prototype.autoUpdateTransform
            : dn.Container.prototype.updateTransform));
      }
      get tint() {
        return H.utils.rgb2hex(this.tintRgb);
      }
      set tint(c) {
        this.tintRgb = H.utils.hex2rgb(c, this.tintRgb);
      }
      get delayLimit() {
        return (
          (typeof this.localDelayLimit != "undefined"
            ? this.localDelayLimit
            : zt.GLOBAL_DELAY_LIMIT) || Number.MAX_VALUE
        );
      }
      update(c) {
        var a;
        const t = this.delayLimit;
        if (
          (c > t && (c = t),
          this.state.update(c),
          this.state.apply(this.skeleton),
          !this.skeleton)
        )
          return;
        this.skeleton.updateWorldTransform();
        const n = this.skeleton.slots,
          e = this.color;
        let i = null,
          r = null;
        e ? ((i = e.light), (r = e.dark)) : (i = this.tintRgb);
        for (let o = 0, d = n.length; o < d; o++) {
          const f = n[o],
            u = f.getAttachment(),
            m = this.slotContainers[o];
          if (!u) {
            m.visible = !1;
            continue;
          }
          let g = null;
          u.sequence && u.sequence.apply(f, u);
          let x = u.region;
          const E = u.color;
          switch (u != null && u.type) {
            case Z.Region:
              if (
                (m.transform.setFromMatrix(f.bone.matrix),
                (x = u.region),
                f.currentMesh &&
                  ((f.currentMesh.visible = !1),
                  (f.currentMesh = null),
                  (f.currentMeshId = void 0),
                  (f.currentMeshName = void 0)),
                !x)
              ) {
                f.currentSprite && (f.currentSprite.renderable = !1);
                break;
              }
              if (!f.currentSpriteName || f.currentSpriteName !== u.name) {
                const p = u.name;
                if (
                  (f.currentSprite && (f.currentSprite.visible = !1),
                  (f.sprites = f.sprites || {}),
                  f.sprites[p] !== void 0)
                )
                  f.sprites[p].visible = !0;
                else {
                  const S = this.createSprite(f, u, p);
                  m.addChild(S);
                }
                (f.currentSprite = f.sprites[p]), (f.currentSpriteName = p);
              }
              (f.currentSprite.renderable = !0),
                f.hackRegion || this.setSpriteRegion(u, f.currentSprite, x),
                f.currentSprite.color
                  ? (g = f.currentSprite.color)
                  : ((Ue[0] = i[0] * f.color.r * E.r),
                    (Ue[1] = i[1] * f.color.g * E.g),
                    (Ue[2] = i[2] * f.color.b * E.b),
                    (f.currentSprite.tint = H.utils.rgb2hex(Ue))),
                (f.currentSprite.blendMode = f.blendMode);
              break;
            case Z.Mesh:
              if (f.currentSprite) {
                (f.currentSprite.visible = !1),
                  (f.currentSprite = null),
                  (f.currentSpriteName = void 0);
                const p = new H.Transform();
                (p._parentID = -1),
                  (p._worldID = m.transform._worldID),
                  (m.transform = p);
              }
              if (!x) {
                f.currentMesh && (f.currentMesh.renderable = !1);
                break;
              }
              const b = u.id;
              if (f.currentMeshId === void 0 || f.currentMeshId !== b) {
                const p = b;
                if (
                  (f.currentMesh && (f.currentMesh.visible = !1),
                  (f.meshes = f.meshes || {}),
                  f.meshes[p] !== void 0)
                )
                  f.meshes[p].visible = !0;
                else {
                  const S = this.createMesh(f, u);
                  m.addChild(S);
                }
                (f.currentMesh = f.meshes[p]),
                  (f.currentMeshName = u.name),
                  (f.currentMeshId = p);
              }
              (f.currentMesh.renderable = !0),
                u.computeWorldVerticesOld(f, f.currentMesh.vertices),
                f.currentMesh.color
                  ? (g = f.currentMesh.color)
                  : ((Ue[0] = i[0] * f.color.r * E.r),
                    (Ue[1] = i[1] * f.color.g * E.g),
                    (Ue[2] = i[2] * f.color.b * E.b),
                    (f.currentMesh.tint = H.utils.rgb2hex(Ue))),
                (f.currentMesh.blendMode = f.blendMode),
                f.hackRegion || this.setMeshRegion(u, f.currentMesh, x);
              break;
            case Z.Clipping:
              f.currentGraphics ||
                (this.createGraphics(f, u),
                m.addChild(f.clippingContainer),
                m.addChild(f.currentGraphics)),
                this.updateGraphics(f, u),
                (m.alpha = 1),
                (m.visible = !0);
              continue;
            default:
              m.visible = !1;
              continue;
          }
          if (((m.visible = !0), g)) {
            let w = f.color.r * E.r,
              b = f.color.g * E.g,
              p = f.color.b * E.b;
            g.setLight(
              i[0] * w + r[0] * (1 - w),
              i[1] * b + r[1] * (1 - b),
              i[2] * p + r[2] * (1 - p)
            ),
              f.darkColor
                ? ((w = f.darkColor.r),
                  (b = f.darkColor.g),
                  (p = f.darkColor.b))
                : ((w = 0), (b = 0), (p = 0)),
              g.setDark(
                i[0] * w + r[0] * (1 - w),
                i[1] * b + r[1] * (1 - b),
                i[2] * p + r[2] * (1 - p)
              );
          }
          m.alpha = f.color.a;
        }
        const h = this.skeleton.drawOrder;
        let l = null,
          s = null;
        for (let o = 0, d = h.length; o < d; o++) {
          const f = n[h[o].data.index],
            u = this.slotContainers[h[o].data.index];
          if (
            (s ||
              (u.parent !== null &&
                u.parent !== this &&
                (u.parent.removeChild(u), (u.parent = this))),
            f.currentGraphics && f.getAttachment())
          )
            (s = f.clippingContainer),
              (l = f.getAttachment()),
              (s.children.length = 0),
              (this.children[o] = u),
              l.endSlot === f.data && (l.endSlot = null);
          else if (s) {
            let m = this.tempClipContainers[o];
            m ||
              ((m = this.tempClipContainers[o] = this.newContainer()),
              (m.visible = !1)),
              (this.children[o] = m),
              (u.parent = null),
              s.addChild(u),
              l.endSlot == f.data &&
                ((s.renderable = !0), (s = null), (l = null));
          } else this.children[o] = u;
        }
        (a = this._debug) == null || a.renderDebug(this);
      }
      setSpriteRegion(c, t, n) {
        (t.attachment === c && t.region === n) ||
          ((t.region = n),
          (t.attachment = c),
          (t.texture = n.texture),
          (t.rotation = c.rotation * C.degRad),
          (t.position.x = c.x),
          (t.position.y = c.y),
          (t.alpha = c.color.a),
          n.size
            ? ((t.scale.x = n.size.width / n.originalWidth),
              (t.scale.y = -n.size.height / n.originalHeight))
            : ((t.scale.x = (c.scaleX * c.width) / n.originalWidth),
              (t.scale.y = (-c.scaleY * c.height) / n.originalHeight)));
      }
      setMeshRegion(c, t, n) {
        (t.attachment === c && t.region === n) ||
          ((t.region = n),
          (t.attachment = c),
          (t.texture = n.texture),
          n.texture.updateUvs(),
          t.uvBuffer.update(c.regionUVs));
      }
      autoUpdateTransform() {
        if (zt.GLOBAL_AUTO_UPDATE) {
          this.lastTime = this.lastTime || Date.now();
          const c = (Date.now() - this.lastTime) * 0.001;
          (this.lastTime = Date.now()), this.update(c);
        } else this.lastTime = 0;
        dn.Container.prototype.updateTransform.call(this);
      }
      createSprite(c, t, n) {
        let e = t.region;
        c.hackAttachment === t && (e = c.hackRegion);
        const i = e ? e.texture : null,
          r = this.newSprite(i);
        return (
          r.anchor.set(0.5),
          e && this.setSpriteRegion(t, r, t.region),
          (c.sprites = c.sprites || {}),
          (c.sprites[n] = r),
          r
        );
      }
      createMesh(c, t) {
        let n = t.region;
        c.hackAttachment === t &&
          ((n = c.hackRegion),
          (c.hackAttachment = null),
          (c.hackRegion = null));
        const e = this.newMesh(
          n ? n.texture : null,
          new Float32Array(t.regionUVs.length),
          t.regionUVs,
          new Uint16Array(t.triangles),
          H.DRAW_MODES.TRIANGLES
        );
        return (
          typeof e._canvasPadding != "undefined" && (e._canvasPadding = 1.5),
          (e.alpha = t.color.a),
          (e.region = t.region),
          n && this.setMeshRegion(t, e, n),
          (c.meshes = c.meshes || {}),
          (c.meshes[t.id] = e),
          e
        );
      }
      createGraphics(c, t) {
        const n = this.newGraphics(),
          e = new H.Polygon([]);
        return (
          n.clear(),
          n.beginFill(16777215, 1),
          n.drawPolygon(e),
          (n.renderable = !1),
          (c.currentGraphics = n),
          (c.clippingContainer = this.newContainer()),
          (c.clippingContainer.mask = c.currentGraphics),
          n
        );
      }
      updateGraphics(c, t) {
        const n = c.currentGraphics.geometry,
          e = n.graphicsData[0].shape.points,
          i = t.worldVerticesLength;
        (e.length = i),
          t.computeWorldVertices(c, 0, i, e, 0, 2),
          n.invalidate();
      }
      hackTextureBySlotIndex(c, t = null, n = null) {
        const e = this.skeleton.slots[c];
        if (!e) return !1;
        const i = e.getAttachment();
        let r = i.region;
        return (
          t
            ? ((r = new Vn()),
              (r.texture = t),
              (r.size = n),
              (e.hackRegion = r),
              (e.hackAttachment = i))
            : ((e.hackRegion = null), (e.hackAttachment = null)),
          e.currentSprite
            ? this.setSpriteRegion(i, e.currentSprite, r)
            : e.currentMesh && this.setMeshRegion(i, e.currentMesh, r),
          !0
        );
      }
      hackTextureBySlotName(c, t = null, n = null) {
        const e = this.skeleton.findSlotIndex(c);
        return e == -1 ? !1 : this.hackTextureBySlotIndex(e, t, n);
      }
      hackTextureAttachment(c, t, n, e = null) {
        const i = this.skeleton.findSlotIndex(c),
          r = this.skeleton.getAttachmentByName(c, t);
        r.region.texture = n;
        const h = this.skeleton.slots[i];
        if (!h) return !1;
        const l = h.getAttachment();
        if (t === l.name) {
          let s = r.region;
          return (
            n
              ? ((s = new Vn()),
                (s.texture = n),
                (s.size = e),
                (h.hackRegion = s),
                (h.hackAttachment = l))
              : ((h.hackRegion = null), (h.hackAttachment = null)),
            h.currentSprite && h.currentSprite.region != s
              ? (this.setSpriteRegion(l, h.currentSprite, s),
                (h.currentSprite.region = s))
              : h.currentMesh &&
                h.currentMesh.region != s &&
                this.setMeshRegion(l, h.currentMesh, s),
            !0
          );
        }
        return !1;
      }
      newContainer() {
        return new dn.Container();
      }
      newSprite(c) {
        return new Mi(c);
      }
      newGraphics() {
        return new oe.Graphics();
      }
      newMesh(c, t, n, e, i) {
        return new Ai(c, t, n, e, i);
      }
      transformHack() {
        return 1;
      }
      hackAttachmentGroups(c, t, n) {
        if (!c) return;
        const e = [],
          i = [];
        for (let r = 0, h = this.skeleton.slots.length; r < h; r++) {
          const l = this.skeleton.slots[r],
            s = l.currentSpriteName || l.currentMeshName || "",
            a = l.currentSprite || l.currentMesh;
          s.endsWith(c)
            ? ((a.parentGroup = t), i.push(a))
            : n && a && ((a.parentGroup = n), e.push(a));
        }
        return [e, i];
      }
      destroy(c) {
        this.debug = null;
        for (let t = 0, n = this.skeleton.slots.length; t < n; t++) {
          const e = this.skeleton.slots[t];
          for (const i in e.meshes) e.meshes[i].destroy(c);
          e.meshes = null;
          for (const i in e.sprites) e.sprites[i].destroy(c);
          e.sprites = null;
        }
        for (let t = 0, n = this.slotContainers.length; t < n; t++)
          this.slotContainers[t].destroy(c);
        (this.spineData = null),
          (this.skeleton = null),
          (this.slotContainers = null),
          (this.stateData = null),
          (this.state = null),
          (this.tempClipContainers = null),
          super.destroy(c);
      }
    };
    let tn = Ci;
    (tn.clippingPolygon = []),
      Object.defineProperty(tn.prototype, "visible", {
        get() {
          return this._visible;
        },
        set(c) {
          c !== this._visible &&
            ((this._visible = c), c && (this.lastTime = 0));
        },
      });
    class Tr {
      constructor() {
        (this.registeredSpines = new Map()),
          (this.drawDebug = !0),
          (this.drawMeshHull = !0),
          (this.drawMeshTriangles = !0),
          (this.drawBones = !0),
          (this.drawPaths = !0),
          (this.drawBoundingBoxes = !0),
          (this.drawClipping = !0),
          (this.drawRegionAttachments = !0),
          (this.lineWidth = 1),
          (this.regionAttachmentsColor = 30975),
          (this.meshHullColor = 30975),
          (this.meshTrianglesColor = 16763904),
          (this.clippingPolygonColor = 16711935),
          (this.boundingBoxesRectColor = 65280),
          (this.boundingBoxesPolygonColor = 65280),
          (this.boundingBoxesCircleColor = 65280),
          (this.pathsCurveColor = 16711680),
          (this.pathsLineColor = 16711935),
          (this.skeletonXYColor = 16711680),
          (this.bonesColor = 61132);
      }
      registerSpine(t) {
        this.registeredSpines.has(t) &&
          console.warn(
            "SpineDebugRenderer.registerSpine() - this spine is already registered!",
            t
          );
        const n = {
          parentDebugContainer: new dn.Container(),
          bones: new dn.Container(),
          skeletonXY: new oe.Graphics(),
          regionAttachmentsShape: new oe.Graphics(),
          meshTrianglesLine: new oe.Graphics(),
          meshHullLine: new oe.Graphics(),
          clippingPolygon: new oe.Graphics(),
          boundingBoxesRect: new oe.Graphics(),
          boundingBoxesCircle: new oe.Graphics(),
          boundingBoxesPolygon: new oe.Graphics(),
          pathsCurve: new oe.Graphics(),
          pathsLine: new oe.Graphics(),
        };
        n.parentDebugContainer.addChild(n.bones),
          n.parentDebugContainer.addChild(n.skeletonXY),
          n.parentDebugContainer.addChild(n.regionAttachmentsShape),
          n.parentDebugContainer.addChild(n.meshTrianglesLine),
          n.parentDebugContainer.addChild(n.meshHullLine),
          n.parentDebugContainer.addChild(n.clippingPolygon),
          n.parentDebugContainer.addChild(n.boundingBoxesRect),
          n.parentDebugContainer.addChild(n.boundingBoxesCircle),
          n.parentDebugContainer.addChild(n.boundingBoxesPolygon),
          n.parentDebugContainer.addChild(n.pathsCurve),
          n.parentDebugContainer.addChild(n.pathsLine),
          t.addChild(n.parentDebugContainer),
          this.registeredSpines.set(t, n);
      }
      renderDebug(t) {
        this.registeredSpines.has(t) || this.registerSpine(t);
        const n = this.registeredSpines.get(t);
        n.skeletonXY.clear(),
          n.regionAttachmentsShape.clear(),
          n.meshTrianglesLine.clear(),
          n.meshHullLine.clear(),
          n.clippingPolygon.clear(),
          n.boundingBoxesRect.clear(),
          n.boundingBoxesCircle.clear(),
          n.boundingBoxesPolygon.clear(),
          n.pathsCurve.clear(),
          n.pathsLine.clear();
        for (let r = n.bones.children.length; r > 0; r--)
          n.bones.children[r - 1].destroy({
            children: !0,
            texture: !0,
            baseTexture: !0,
          });
        const e = t.scale.x || t.scale.y || 1,
          i = this.lineWidth / e;
        this.drawBones && this.drawBonesFunc(t, n, i, e),
          this.drawPaths && this.drawPathsFunc(t, n, i),
          this.drawBoundingBoxes && this.drawBoundingBoxesFunc(t, n, i),
          this.drawClipping && this.drawClippingFunc(t, n, i),
          (this.drawMeshHull || this.drawMeshTriangles) &&
            this.drawMeshHullAndMeshTriangles(t, n, i),
          this.drawRegionAttachments && this.drawRegionAttachmentsFunc(t, n, i);
      }
      drawBonesFunc(t, n, e, i) {
        const r = t.skeleton,
          h = r.x,
          l = r.y,
          s = r.bones;
        n.skeletonXY.lineStyle(e, this.skeletonXYColor, 1);
        for (let o = 0, d = s.length; o < d; o++) {
          const f = s[o],
            u = f.data.length,
            m = h + f.matrix.tx,
            g = l + f.matrix.ty,
            x = h + u * f.matrix.a + f.matrix.tx,
            E = l + u * f.matrix.b + f.matrix.ty;
          if (f.data.name === "root" || f.data.parent === null) continue;
          const w = Math.abs(m - x),
            b = Math.abs(g - E),
            p = Math.pow(w, 2),
            S = b,
            y = Math.pow(b, 2),
            M = Math.sqrt(p + y),
            T = Math.pow(M, 2),
            k = Math.PI / 180,
            I = Math.acos((T + y - p) / (2 * S * M)) || 0;
          if (M === 0) continue;
          const R = new oe.Graphics();
          n.bones.addChild(R);
          const V = M / 50 / i;
          R.beginFill(this.bonesColor, 1),
            R.drawPolygon(0, 0, 0 - V, M - V * 3, 0, M - V, 0 + V, M - V * 3),
            R.endFill(),
            (R.x = m),
            (R.y = g),
            (R.pivot.y = M);
          let F = 0;
          m < x && g < E
            ? (F = -I + 180 * k)
            : m > x && g < E
            ? (F = 180 * k + I)
            : m > x && g > E
            ? (F = -I)
            : m < x && g > E
            ? (F = I)
            : g === E && m < x
            ? (F = 90 * k)
            : g === E && m > x
            ? (F = -90 * k)
            : m === x && g < E
            ? (F = 180 * k)
            : m === x && g > E && (F = 0),
            (R.rotation = F),
            R.lineStyle(e + V / 2.4, this.bonesColor, 1),
            R.beginFill(0, 0.6),
            R.drawCircle(0, M, V * 1.2),
            R.endFill();
        }
        const a = e * 3;
        n.skeletonXY.moveTo(h - a, l - a),
          n.skeletonXY.lineTo(h + a, l + a),
          n.skeletonXY.moveTo(h + a, l - a),
          n.skeletonXY.lineTo(h - a, l + a);
      }
      drawRegionAttachmentsFunc(t, n, e) {
        const r = t.skeleton.slots;
        n.regionAttachmentsShape.lineStyle(e, this.regionAttachmentsColor, 1);
        for (let h = 0, l = r.length; h < l; h++) {
          const s = r[h],
            a = s.getAttachment();
          if (a == null || a.type !== Z.Region) continue;
          const o = a,
            d = new Float32Array(8);
          o.updateOffset && o.updateOffset(),
            o.computeWorldVertices(s, d, 0, 2),
            n.regionAttachmentsShape.drawPolygon(Array.from(d.slice(0, 8)));
        }
      }
      drawMeshHullAndMeshTriangles(t, n, e) {
        const r = t.skeleton.slots;
        n.meshHullLine.lineStyle(e, this.meshHullColor, 1),
          n.meshTrianglesLine.lineStyle(e, this.meshTrianglesColor, 1);
        for (let h = 0, l = r.length; h < l; h++) {
          const s = r[h];
          if (!s.bone.active) continue;
          const a = s.getAttachment();
          if (a == null || a.type !== Z.Mesh) continue;
          const o = a,
            d = new Float32Array(o.worldVerticesLength),
            f = o.triangles;
          let u = o.hullLength;
          if (
            (o.computeWorldVertices(s, 0, o.worldVerticesLength, d, 0, 2),
            this.drawMeshTriangles)
          )
            for (let m = 0, g = f.length; m < g; m += 3) {
              const x = f[m] * 2,
                E = f[m + 1] * 2,
                w = f[m + 2] * 2;
              n.meshTrianglesLine.moveTo(d[x], d[x + 1]),
                n.meshTrianglesLine.lineTo(d[E], d[E + 1]),
                n.meshTrianglesLine.lineTo(d[w], d[w + 1]);
            }
          if (this.drawMeshHull && u > 0) {
            u = (u >> 1) * 2;
            let m = d[u - 2],
              g = d[u - 1];
            for (let x = 0, E = u; x < E; x += 2) {
              const w = d[x],
                b = d[x + 1];
              n.meshHullLine.moveTo(w, b),
                n.meshHullLine.lineTo(m, g),
                (m = w),
                (g = b);
            }
          }
        }
      }
      drawClippingFunc(t, n, e) {
        const r = t.skeleton.slots;
        n.clippingPolygon.lineStyle(e, this.clippingPolygonColor, 1);
        for (let h = 0, l = r.length; h < l; h++) {
          const s = r[h];
          if (!s.bone.active) continue;
          const a = s.getAttachment();
          if (a == null || a.type !== Z.Clipping) continue;
          const o = a,
            d = o.worldVerticesLength,
            f = new Float32Array(d);
          o.computeWorldVertices(s, 0, d, f, 0, 2),
            n.clippingPolygon.drawPolygon(Array.from(f));
        }
      }
      drawBoundingBoxesFunc(t, n, e) {
        n.boundingBoxesRect.lineStyle(e, this.boundingBoxesRectColor, 5);
        const i = new Cn();
        i.update(t.skeleton, !0),
          n.boundingBoxesRect.drawRect(
            i.minX,
            i.minY,
            i.getWidth(),
            i.getHeight()
          );
        const r = i.polygons,
          h = (l, s, a) => {
            if (
              (n.boundingBoxesPolygon.lineStyle(
                e,
                this.boundingBoxesPolygonColor,
                1
              ),
              n.boundingBoxesPolygon.beginFill(
                this.boundingBoxesPolygonColor,
                0.1
              ),
              a < 3)
            )
              throw new Error("Polygon must contain at least 3 vertices");
            const o = [],
              d = e * 2;
            for (let f = 0, u = l.length; f < u; f += 2) {
              const m = l[f],
                g = l[f + 1];
              n.boundingBoxesCircle.lineStyle(0),
                n.boundingBoxesCircle.beginFill(this.boundingBoxesCircleColor),
                n.boundingBoxesCircle.drawCircle(m, g, d),
                n.boundingBoxesCircle.endFill(),
                o.push(m, g);
            }
            n.boundingBoxesPolygon.drawPolygon(o),
              n.boundingBoxesPolygon.endFill();
          };
        for (let l = 0, s = r.length; l < s; l++) {
          const a = r[l];
          h(a, 0, a.length);
        }
      }
      drawPathsFunc(t, n, e) {
        const r = t.skeleton.slots;
        n.pathsCurve.lineStyle(e, this.pathsCurveColor, 1),
          n.pathsLine.lineStyle(e, this.pathsLineColor, 1);
        for (let h = 0, l = r.length; h < l; h++) {
          const s = r[h];
          if (!s.bone.active) continue;
          const a = s.getAttachment();
          if (a == null || a.type !== Z.Path) continue;
          const o = a;
          let d = o.worldVerticesLength;
          const f = new Float32Array(d);
          o.computeWorldVertices(s, 0, d, f, 0, 2);
          let u = f[2],
            m = f[3],
            g = 0,
            x = 0;
          if (o.closed) {
            const E = f[0],
              w = f[1],
              b = f[d - 2],
              p = f[d - 1];
            (g = f[d - 4]),
              (x = f[d - 3]),
              n.pathsCurve.moveTo(u, m),
              n.pathsCurve.bezierCurveTo(E, w, b, p, g, x),
              n.pathsLine.moveTo(u, m),
              n.pathsLine.lineTo(E, w),
              n.pathsLine.moveTo(g, x),
              n.pathsLine.lineTo(b, p);
          }
          d -= 4;
          for (let E = 4; E < d; E += 6) {
            const w = f[E],
              b = f[E + 1],
              p = f[E + 2],
              S = f[E + 3];
            (g = f[E + 4]),
              (x = f[E + 5]),
              n.pathsCurve.moveTo(u, m),
              n.pathsCurve.bezierCurveTo(w, b, p, S, g, x),
              n.pathsLine.moveTo(u, m),
              n.pathsLine.lineTo(w, b),
              n.pathsLine.moveTo(g, x),
              n.pathsLine.lineTo(p, S),
              (u = g),
              (m = x);
          }
        }
      }
      unregisterSpine(t) {
        this.registeredSpines.has(t) ||
          console.warn(
            "SpineDebugRenderer.unregisterSpine() - spine is not registered, can't unregister!",
            t
          ),
          this.registeredSpines
            .get(t)
            .parentDebugContainer.destroy({
              baseTexture: !0,
              children: !0,
              texture: !0,
            }),
          this.registeredSpines.delete(t);
      }
    }
    const kr = {
        extension: H.ExtensionType.Asset,
        loader: {
          extension: {
            type: H.ExtensionType.LoadParser,
            priority: qe.LoaderParserPriority.Normal,
          },
          test(c) {
            return qe.checkExtension(c, ".atlas");
          },
          async load(c) {
            return await (await H.settings.ADAPTER.fetch(c)).text();
          },
          testParse(c, t) {
            const n = qe.checkExtension(t.src, ".atlas"),
              e = typeof c == "string";
            return Promise.resolve(n && e);
          },
          async parse(c, t, n) {
            const e = t.data;
            let i = H.utils.path.dirname(t.src);
            i && i.lastIndexOf("/") !== i.length - 1 && (i += "/");
            let r = null,
              h = null;
            const l = new Promise((o, d) => {
              (r = o), (h = d);
            });
            let s;
            const a = (o) => {
              o ||
                h(`Something went terribly wrong loading a spine .atlas file
Most likely your texture failed to load.`),
                r(s);
            };
            if (e.image || e.images) {
              const o = Object.assign(
                e.image ? { default: e.image } : {},
                e.images
              );
              s = new Fn(
                c,
                (d, f) => {
                  const u = o[d] || o.default;
                  u && u.baseTexture ? f(u.baseTexture) : f(u);
                },
                a
              );
            } else s = new Fn(c, Ti(n, i, e.imageMetadata), a);
            return await l;
          },
          unload(c) {
            c.dispose();
          },
        },
      },
      Ti = (c, t, n) => async (e, i) => {
        const r = H.utils.path.join(...t.split(H.utils.path.sep), e),
          h = await c.load({ src: r, data: n });
        i(h.baseTexture);
      };
    H.extensions.add(kr);
    function ki(c) {
      return c.hasOwnProperty("bones");
    }
    function Ir(c) {
      return c instanceof ArrayBuffer;
    }
    class Rr {
      constructor() {}
      installLoader() {
        const t = this,
          n = {
            extension: H.ExtensionType.Asset,
            loader: {
              extension: {
                type: H.ExtensionType.LoadParser,
                priority: qe.LoaderParserPriority.Normal,
              },
              test(e) {
                return qe.checkExtension(e, ".skel");
              },
              async load(e) {
                return await (await H.settings.ADAPTER.fetch(e)).arrayBuffer();
              },
              testParse(e, i) {
                var s;
                const r = qe.checkExtension(i.src, ".json") && ki(e),
                  h = qe.checkExtension(i.src, ".skel") && Ir(e),
                  l = ((s = i.data) == null ? void 0 : s.spineAtlas) === !1;
                return Promise.resolve((r && !l) || h);
              },
              async parse(e, i, r) {
                var w;
                const h = H.utils.path.extname(i.src).toLowerCase(),
                  l = H.utils.path.basename(i.src, h);
                let s = H.utils.path.dirname(i.src);
                s && s.lastIndexOf("/") !== s.length - 1 && (s += "/");
                const a = qe.checkExtension(i.src, ".json") && ki(e);
                let o = null,
                  d = e;
                a
                  ? (o = t.createJsonParser())
                  : ((o = t.createBinaryParser()), (d = new Uint8Array(e)));
                const f = i.data || {},
                  u =
                    (w = f == null ? void 0 : f.spineSkeletonScale) != null
                      ? w
                      : null;
                u && (o.scale = u);
                const m = f.spineAtlas;
                if (m && m.pages) return t.parseData(o, m, d);
                const g = f.atlasRawData;
                if (g) {
                  let b = null,
                    p = null;
                  const S = new Promise((T, k) => {
                      (b = T), (p = k);
                    }),
                    y = new Fn(g, Ti(r, s, f.imageMetadata), (T) => {
                      T ||
                        p(`Something went terribly wrong loading a spine .atlas file
Most likely your texture failed to load.`),
                        b(y);
                    }),
                    M = await S;
                  return t.parseData(o, M, d);
                }
                let x = f.spineAtlasFile;
                x || (x = `${s + l}.atlas`);
                const E = await r.load({
                  src: x,
                  data: f,
                  alias: f.spineAtlasAlias,
                });
                return t.parseData(o, E, d);
              },
            },
          };
        return H.extensions.add(n), n;
      }
    }
    let rs = class {
      constructor(t) {
        if (t == null) throw new Error("name cannot be null.");
        this.name = t;
      }
    };
    const Ii = class extends rs {
      constructor(t) {
        super(t),
          (this.id = (Ii.nextID++ & 65535) << 11),
          (this.worldVerticesLength = 0),
          (this.deformAttachment = this);
      }
      computeWorldVerticesOld(t, n) {
        this.computeWorldVertices(t, 0, this.worldVerticesLength, n, 0, 2);
      }
      computeWorldVertices(t, n, e, i, r, h) {
        e = r + (e >> 1) * h;
        const l = t.bone.skeleton,
          s = t.deform;
        let a = this.vertices;
        const o = this.bones;
        if (o == null) {
          s.length > 0 && (a = s);
          const m = t.bone.matrix,
            g = m.tx,
            x = m.ty,
            E = m.a,
            w = m.c,
            b = m.b,
            p = m.d;
          for (let S = n, y = r; y < e; S += 2, y += h) {
            const M = a[S],
              T = a[S + 1];
            (i[y] = M * E + T * w + g), (i[y + 1] = M * b + T * p + x);
          }
          return;
        }
        let d = 0,
          f = 0;
        for (let m = 0; m < n; m += 2) {
          const g = o[d];
          (d += g + 1), (f += g);
        }
        const u = l.bones;
        if (s.length == 0)
          for (let m = r, g = f * 3; m < e; m += h) {
            let x = 0,
              E = 0,
              w = o[d++];
            for (w += d; d < w; d++, g += 3) {
              const b = u[o[d]].matrix,
                p = a[g],
                S = a[g + 1],
                y = a[g + 2];
              (x += (p * b.a + S * b.c + b.tx) * y),
                (E += (p * b.b + S * b.d + b.ty) * y);
            }
            (i[m] = x), (i[m + 1] = E);
          }
        else {
          const m = s;
          for (let g = r, x = f * 3, E = f << 1; g < e; g += h) {
            let w = 0,
              b = 0,
              p = o[d++];
            for (p += d; d < p; d++, x += 3, E += 2) {
              const S = u[o[d]].matrix,
                y = a[x] + m[E],
                M = a[x + 1] + m[E + 1],
                T = a[x + 2];
              (w += (y * S.a + M * S.c + S.tx) * T),
                (b += (y * S.b + M * S.d + S.ty) * T);
            }
            (i[g] = w), (i[g + 1] = b);
          }
        }
      }
      copyTo(t) {
        this.bones != null
          ? ((t.bones = new Array(this.bones.length)),
            v.arrayCopy(this.bones, 0, t.bones, 0, this.bones.length))
          : (t.bones = null),
          this.vertices != null
            ? ((t.vertices = v.newFloatArray(this.vertices.length)),
              v.arrayCopy(
                this.vertices,
                0,
                t.vertices,
                0,
                this.vertices.length
              ))
            : (t.vertices = null),
          (t.worldVerticesLength = this.worldVerticesLength),
          (t.deformAttachment = this.deformAttachment);
      }
    };
    let ze = Ii;
    ze.nextID = 0;
    let as = class extends ze {
        constructor(t) {
          super(t),
            (this.type = Z.BoundingBox),
            (this.color = new _(1, 1, 1, 1));
        }
        copy() {
          const t = new as(this.name);
          return this.copyTo(t), t.color.setFromColor(this.color), t;
        }
      },
      os = class extends ze {
        constructor(t) {
          super(t),
            (this.type = Z.Clipping),
            (this.color = new _(0.2275, 0.2275, 0.8078, 1));
        }
        copy() {
          const t = new os(this.name);
          return (
            this.copyTo(t),
            (t.endSlot = this.endSlot),
            t.color.setFromColor(this.color),
            t
          );
        }
      },
      mn = class extends ze {
        constructor(t) {
          super(t),
            (this.type = Z.Mesh),
            (this.color = new _(1, 1, 1, 1)),
            (this.tempColor = new _(0, 0, 0, 0));
        }
        getParentMesh() {
          return this.parentMesh;
        }
        setParentMesh(t) {
          (this.parentMesh = t),
            t != null &&
              ((this.bones = t.bones),
              (this.vertices = t.vertices),
              (this.worldVerticesLength = t.worldVerticesLength),
              (this.regionUVs = t.regionUVs),
              (this.triangles = t.triangles),
              (this.hullLength = t.hullLength),
              (this.worldVerticesLength = t.worldVerticesLength));
        }
        copy() {
          if (this.parentMesh != null) return this.newLinkedMesh();
          const t = new mn(this.name);
          return (
            (t.region = this.region),
            (t.path = this.path),
            t.color.setFromColor(this.color),
            this.copyTo(t),
            (t.regionUVs = new Float32Array(this.regionUVs.length)),
            v.arrayCopy(
              this.regionUVs,
              0,
              t.regionUVs,
              0,
              this.regionUVs.length
            ),
            (t.triangles = new Array(this.triangles.length)),
            v.arrayCopy(
              this.triangles,
              0,
              t.triangles,
              0,
              this.triangles.length
            ),
            (t.hullLength = this.hullLength),
            this.edges != null &&
              ((t.edges = new Array(this.edges.length)),
              v.arrayCopy(this.edges, 0, t.edges, 0, this.edges.length)),
            (t.width = this.width),
            (t.height = this.height),
            t
          );
        }
        newLinkedMesh() {
          const t = new mn(this.name);
          return (
            (t.region = this.region),
            (t.path = this.path),
            t.color.setFromColor(this.color),
            (t.deformAttachment = this.deformAttachment),
            t.setParentMesh(this.parentMesh != null ? this.parentMesh : this),
            t
          );
        }
      },
      gn = class extends ze {
        constructor(t) {
          super(t),
            (this.type = Z.Path),
            (this.closed = !1),
            (this.constantSpeed = !1),
            (this.color = new _(1, 1, 1, 1));
        }
        copy() {
          const t = new gn(this.name);
          return (
            this.copyTo(t),
            (t.lengths = new Array(this.lengths.length)),
            v.arrayCopy(this.lengths, 0, t.lengths, 0, this.lengths.length),
            (t.closed = closed),
            (t.constantSpeed = this.constantSpeed),
            t.color.setFromColor(this.color),
            t
          );
        }
      },
      ls = class extends ze {
        constructor(t) {
          super(t),
            (this.type = Z.Point),
            (this.color = new _(0.38, 0.94, 0, 1));
        }
        computeWorldPosition(t, n) {
          const e = t.matrix;
          return (
            (n.x = this.x * e.a + this.y * e.c + t.worldX),
            (n.y = this.x * e.b + this.y * e.d + t.worldY),
            n
          );
        }
        computeWorldRotation(t) {
          const n = t.matrix,
            e = C.cosDeg(this.rotation),
            i = C.sinDeg(this.rotation),
            r = e * n.a + i * n.c,
            h = e * n.b + i * n.d;
          return Math.atan2(h, r) * C.radDeg;
        }
        copy() {
          const t = new ls(this.name);
          return (
            (t.x = this.x),
            (t.y = this.y),
            (t.rotation = this.rotation),
            t.color.setFromColor(this.color),
            t
          );
        }
      },
      cs = class {
        constructor(t, n) {
          if (((this.deform = new Array()), t == null))
            throw new Error("data cannot be null.");
          if (n == null) throw new Error("bone cannot be null.");
          (this.data = t),
            (this.bone = n),
            (this.color = new _()),
            (this.darkColor = t.darkColor == null ? null : new _()),
            this.setToSetupPose(),
            (this.blendMode = this.data.blendMode);
        }
        getAttachment() {
          return this.attachment;
        }
        setAttachment(t) {
          this.attachment != t &&
            ((this.attachment = t),
            (this.attachmentTime = this.bone.skeleton.time),
            (this.deform.length = 0));
        }
        setAttachmentTime(t) {
          this.attachmentTime = this.bone.skeleton.time - t;
        }
        getAttachmentTime() {
          return this.bone.skeleton.time - this.attachmentTime;
        }
        setToSetupPose() {
          this.color.setFromColor(this.data.color),
            this.darkColor != null &&
              this.darkColor.setFromColor(this.data.darkColor),
            this.data.attachmentName == null
              ? (this.attachment = null)
              : ((this.attachment = null),
                this.setAttachment(
                  this.bone.skeleton.getAttachment(
                    this.data.index,
                    this.data.attachmentName
                  )
                ));
        }
      };
    const Rt = class extends rs {
      constructor(t) {
        super(t),
          (this.type = Z.Region),
          (this.x = 0),
          (this.y = 0),
          (this.scaleX = 1),
          (this.scaleY = 1),
          (this.rotation = 0),
          (this.width = 0),
          (this.height = 0),
          (this.color = new _(1, 1, 1, 1)),
          (this.offset = v.newFloatArray(8)),
          (this.uvs = v.newFloatArray(8)),
          (this.tempColor = new _(1, 1, 1, 1));
      }
      updateOffset() {
        const t = (this.width / this.region.originalWidth) * this.scaleX,
          n = (this.height / this.region.originalHeight) * this.scaleY,
          e = (-this.width / 2) * this.scaleX + this.region.offsetX * t,
          i = (-this.height / 2) * this.scaleY + this.region.offsetY * n,
          r = e + this.region.width * t,
          h = i + this.region.height * n,
          l = (this.rotation * Math.PI) / 180,
          s = Math.cos(l),
          a = Math.sin(l),
          o = e * s + this.x,
          d = e * a,
          f = i * s + this.y,
          u = i * a,
          m = r * s + this.x,
          g = r * a,
          x = h * s + this.y,
          E = h * a,
          w = this.offset;
        (w[Rt.OX1] = o - u),
          (w[Rt.OY1] = f + d),
          (w[Rt.OX2] = o - E),
          (w[Rt.OY2] = x + d),
          (w[Rt.OX3] = m - E),
          (w[Rt.OY3] = x + g),
          (w[Rt.OX4] = m - u),
          (w[Rt.OY4] = f + g);
      }
      setRegion(t) {
        this.region = t;
        const n = this.uvs;
        t.rotate
          ? ((n[2] = t.u),
            (n[3] = t.v2),
            (n[4] = t.u),
            (n[5] = t.v),
            (n[6] = t.u2),
            (n[7] = t.v),
            (n[0] = t.u2),
            (n[1] = t.v2))
          : ((n[0] = t.u),
            (n[1] = t.v2),
            (n[2] = t.u),
            (n[3] = t.v),
            (n[4] = t.u2),
            (n[5] = t.v),
            (n[6] = t.u2),
            (n[7] = t.v2));
      }
      computeWorldVertices(t, n, e, i) {
        const r = this.offset,
          h = t instanceof cs ? t.bone.matrix : t.matrix,
          l = h.tx,
          s = h.ty,
          a = h.a,
          o = h.c,
          d = h.b,
          f = h.d;
        let u = 0,
          m = 0;
        (u = r[Rt.OX1]),
          (m = r[Rt.OY1]),
          (n[e] = u * a + m * o + l),
          (n[e + 1] = u * d + m * f + s),
          (e += i),
          (u = r[Rt.OX2]),
          (m = r[Rt.OY2]),
          (n[e] = u * a + m * o + l),
          (n[e + 1] = u * d + m * f + s),
          (e += i),
          (u = r[Rt.OX3]),
          (m = r[Rt.OY3]),
          (n[e] = u * a + m * o + l),
          (n[e + 1] = u * d + m * f + s),
          (e += i),
          (u = r[Rt.OX4]),
          (m = r[Rt.OY4]),
          (n[e] = u * a + m * o + l),
          (n[e + 1] = u * d + m * f + s);
      }
      copy() {
        const t = new Rt(this.name);
        return (
          (t.region = this.region),
          (t.rendererObject = this.rendererObject),
          (t.path = this.path),
          (t.x = this.x),
          (t.y = this.y),
          (t.scaleX = this.scaleX),
          (t.scaleY = this.scaleY),
          (t.rotation = this.rotation),
          (t.width = this.width),
          (t.height = this.height),
          v.arrayCopy(this.uvs, 0, t.uvs, 0, 8),
          v.arrayCopy(this.offset, 0, t.offset, 0, 8),
          t.color.setFromColor(this.color),
          t
        );
      }
    };
    let Q = Rt;
    (Q.OX1 = 0),
      (Q.OY1 = 1),
      (Q.OX2 = 2),
      (Q.OY2 = 3),
      (Q.OX3 = 4),
      (Q.OY3 = 5),
      (Q.OX4 = 6),
      (Q.OY4 = 7),
      (Q.X1 = 0),
      (Q.Y1 = 1),
      (Q.C1R = 2),
      (Q.C1G = 3),
      (Q.C1B = 4),
      (Q.C1A = 5),
      (Q.U1 = 6),
      (Q.V1 = 7),
      (Q.X2 = 8),
      (Q.Y2 = 9),
      (Q.C2R = 10),
      (Q.C2G = 11),
      (Q.C2B = 12),
      (Q.C2A = 13),
      (Q.U2 = 14),
      (Q.V2 = 15),
      (Q.X3 = 16),
      (Q.Y3 = 17),
      (Q.C3R = 18),
      (Q.C3G = 19),
      (Q.C3B = 20),
      (Q.C3A = 21),
      (Q.U3 = 22),
      (Q.V3 = 23),
      (Q.X4 = 24),
      (Q.Y4 = 25),
      (Q.C4R = 26),
      (Q.C4G = 27),
      (Q.C4B = 28),
      (Q.C4A = 29),
      (Q.U4 = 30),
      (Q.V4 = 31);
    let vr = class {
      constructor(t, n) {
        (this.jitterX = 0),
          (this.jitterY = 0),
          (this.jitterX = t),
          (this.jitterY = n);
      }
      begin(t) {}
      transform(t, n, e, i) {
        (t.x += C.randomTriangular(-this.jitterX, this.jitterY)),
          (t.y += C.randomTriangular(-this.jitterX, this.jitterY));
      }
      end() {}
    };
    const Ri = class {
      constructor(t) {
        (this.centerX = 0),
          (this.centerY = 0),
          (this.radius = 0),
          (this.angle = 0),
          (this.worldX = 0),
          (this.worldY = 0),
          (this.radius = t);
      }
      begin(t) {
        (this.worldX = t.x + this.centerX), (this.worldY = t.y + this.centerY);
      }
      transform(t, n, e, i) {
        const r = this.angle * C.degreesToRadians,
          h = t.x - this.worldX,
          l = t.y - this.worldY,
          s = Math.sqrt(h * h + l * l);
        if (s < this.radius) {
          const a = Ri.interpolation.apply(
              0,
              r,
              (this.radius - s) / this.radius
            ),
            o = Math.cos(a),
            d = Math.sin(a);
          (t.x = o * h - d * l + this.worldX),
            (t.y = d * h + o * l + this.worldY);
        }
      }
      end() {}
    };
    let vi = Ri;
    vi.interpolation = new is(2);
    let Et = class {
      constructor(t, n, e) {
        if (t == null) throw new Error("name cannot be null.");
        if (n == null) throw new Error("timelines cannot be null.");
        (this.name = t), (this.timelines = n), (this.timelineIds = []);
        for (let i = 0; i < n.length; i++)
          this.timelineIds[n[i].getPropertyId()] = !0;
        this.duration = e;
      }
      hasTimeline(t) {
        return this.timelineIds[t] == !0;
      }
      apply(t, n, e, i, r, h, l, s) {
        if (t == null) throw new Error("skeleton cannot be null.");
        i &&
          this.duration != 0 &&
          ((e %= this.duration), n > 0 && (n %= this.duration));
        const a = this.timelines;
        for (let o = 0, d = a.length; o < d; o++)
          a[o].apply(t, n, e, r, h, l, s);
      }
      static binarySearch(t, n, e = 1) {
        let i = 0,
          r = t.length / e - 2;
        if (r == 0) return e;
        let h = r >>> 1;
        for (;;) {
          if ((t[(h + 1) * e] <= n ? (i = h + 1) : (r = h), i == r))
            return (i + 1) * e;
          h = (i + r) >>> 1;
        }
      }
      static linearSearch(t, n, e) {
        for (let i = 0, r = t.length - e; i <= r; i += e)
          if (t[i] > n) return i;
        return -1;
      }
    };
    var Pi = ((c) => (
      (c[(c.rotate = 0)] = "rotate"),
      (c[(c.translate = 1)] = "translate"),
      (c[(c.scale = 2)] = "scale"),
      (c[(c.shear = 3)] = "shear"),
      (c[(c.attachment = 4)] = "attachment"),
      (c[(c.color = 5)] = "color"),
      (c[(c.deform = 6)] = "deform"),
      (c[(c.event = 7)] = "event"),
      (c[(c.drawOrder = 8)] = "drawOrder"),
      (c[(c.ikConstraint = 9)] = "ikConstraint"),
      (c[(c.transformConstraint = 10)] = "transformConstraint"),
      (c[(c.pathConstraintPosition = 11)] = "pathConstraintPosition"),
      (c[(c.pathConstraintSpacing = 12)] = "pathConstraintSpacing"),
      (c[(c.pathConstraintMix = 13)] = "pathConstraintMix"),
      (c[(c.twoColor = 14)] = "twoColor"),
      c
    ))(Pi || {});
    const St = class {
      constructor(t) {
        if (t <= 0) throw new Error(`frameCount must be > 0: ${t}`);
        this.curves = v.newFloatArray((t - 1) * St.BEZIER_SIZE);
      }
      getFrameCount() {
        return this.curves.length / St.BEZIER_SIZE + 1;
      }
      setLinear(t) {
        this.curves[t * St.BEZIER_SIZE] = St.LINEAR;
      }
      setStepped(t) {
        this.curves[t * St.BEZIER_SIZE] = St.STEPPED;
      }
      getCurveType(t) {
        const n = t * St.BEZIER_SIZE;
        if (n == this.curves.length) return St.LINEAR;
        const e = this.curves[n];
        return e == St.LINEAR
          ? St.LINEAR
          : e == St.STEPPED
          ? St.STEPPED
          : St.BEZIER;
      }
      setCurve(t, n, e, i, r) {
        const h = (-n * 2 + i) * 0.03,
          l = (-e * 2 + r) * 0.03,
          s = ((n - i) * 3 + 1) * 0.006,
          a = ((e - r) * 3 + 1) * 0.006;
        let o = h * 2 + s,
          d = l * 2 + a,
          f = n * 0.3 + h + s * 0.16666667,
          u = e * 0.3 + l + a * 0.16666667,
          m = t * St.BEZIER_SIZE;
        const g = this.curves;
        g[m++] = St.BEZIER;
        let x = f,
          E = u;
        for (let w = m + St.BEZIER_SIZE - 1; m < w; m += 2)
          (g[m] = x),
            (g[m + 1] = E),
            (f += o),
            (u += d),
            (o += s),
            (d += a),
            (x += f),
            (E += u);
      }
      getCurvePercent(t, n) {
        n = C.clamp(n, 0, 1);
        const e = this.curves;
        let i = t * St.BEZIER_SIZE;
        const r = e[i];
        if (r == St.LINEAR) return n;
        if (r == St.STEPPED) return 0;
        i++;
        let h = 0;
        for (let s = i, a = i + St.BEZIER_SIZE - 1; i < a; i += 2)
          if (((h = e[i]), h >= n)) {
            let o, d;
            return (
              i == s ? ((o = 0), (d = 0)) : ((o = e[i - 2]), (d = e[i - 1])),
              d + ((e[i + 1] - d) * (n - o)) / (h - o)
            );
          }
        const l = e[i - 1];
        return l + ((1 - l) * (n - h)) / (1 - h);
      }
    };
    let Ht = St;
    (Ht.LINEAR = 0),
      (Ht.STEPPED = 1),
      (Ht.BEZIER = 2),
      (Ht.BEZIER_SIZE = 10 * 2 - 1);
    const He = class extends Ht {
      constructor(t) {
        super(t), (this.frames = v.newFloatArray(t << 1));
      }
      getPropertyId() {
        return (0 << 24) + this.boneIndex;
      }
      setFrame(t, n, e) {
        (t <<= 1), (this.frames[t] = n), (this.frames[t + He.ROTATION] = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = this.frames,
          a = t.bones[this.boneIndex];
        if (!a.active) return;
        if (e < s[0]) {
          switch (h) {
            case A.setup:
              a.rotation = a.data.rotation;
              return;
            case A.first:
              const g = a.data.rotation - a.rotation;
              a.rotation +=
                (g - (16384 - ((16384.499999999996 - g / 360) | 0)) * 360) * r;
          }
          return;
        }
        if (e >= s[s.length - He.ENTRIES]) {
          let g = s[s.length + He.PREV_ROTATION];
          switch (h) {
            case A.setup:
              a.rotation = a.data.rotation + g * r;
              break;
            case A.first:
            case A.replace:
              (g += a.data.rotation - a.rotation),
                (g -= (16384 - ((16384.499999999996 - g / 360) | 0)) * 360);
            case A.add:
              a.rotation += g * r;
          }
          return;
        }
        const o = Et.binarySearch(s, e, He.ENTRIES),
          d = s[o + He.PREV_ROTATION],
          f = s[o],
          u = this.getCurvePercent(
            (o >> 1) - 1,
            1 - (e - f) / (s[o + He.PREV_TIME] - f)
          );
        let m = s[o + He.ROTATION] - d;
        switch (
          ((m =
            d + (m - (16384 - ((16384.499999999996 - m / 360) | 0)) * 360) * u),
          h)
        ) {
          case A.setup:
            a.rotation =
              a.data.rotation +
              (m - (16384 - ((16384.499999999996 - m / 360) | 0)) * 360) * r;
            break;
          case A.first:
          case A.replace:
            m += a.data.rotation - a.rotation;
          case A.add:
            a.rotation +=
              (m - (16384 - ((16384.499999999996 - m / 360) | 0)) * 360) * r;
        }
      }
    };
    let Vt = He;
    (Vt.ENTRIES = 2),
      (Vt.PREV_TIME = -2),
      (Vt.PREV_ROTATION = -1),
      (Vt.ROTATION = 1);
    const Dt = class extends Ht {
      constructor(t) {
        super(t), (this.frames = v.newFloatArray(t * Dt.ENTRIES));
      }
      getPropertyId() {
        return (1 << 24) + this.boneIndex;
      }
      setFrame(t, n, e, i) {
        (t *= Dt.ENTRIES),
          (this.frames[t] = n),
          (this.frames[t + Dt.X] = e),
          (this.frames[t + Dt.Y] = i);
      }
      apply(t, n, e, i, r, h, l) {
        const s = this.frames,
          a = t.bones[this.boneIndex];
        if (!a.active) return;
        if (e < s[0]) {
          switch (h) {
            case A.setup:
              (a.x = a.data.x), (a.y = a.data.y);
              return;
            case A.first:
              (a.x += (a.data.x - a.x) * r), (a.y += (a.data.y - a.y) * r);
          }
          return;
        }
        let o = 0,
          d = 0;
        if (e >= s[s.length - Dt.ENTRIES])
          (o = s[s.length + Dt.PREV_X]), (d = s[s.length + Dt.PREV_Y]);
        else {
          const f = Et.binarySearch(s, e, Dt.ENTRIES);
          (o = s[f + Dt.PREV_X]), (d = s[f + Dt.PREV_Y]);
          const u = s[f],
            m = this.getCurvePercent(
              f / Dt.ENTRIES - 1,
              1 - (e - u) / (s[f + Dt.PREV_TIME] - u)
            );
          (o += (s[f + Dt.X] - o) * m), (d += (s[f + Dt.Y] - d) * m);
        }
        switch (h) {
          case A.setup:
            (a.x = a.data.x + o * r), (a.y = a.data.y + d * r);
            break;
          case A.first:
          case A.replace:
            (a.x += (a.data.x + o - a.x) * r),
              (a.y += (a.data.y + d - a.y) * r);
            break;
          case A.add:
            (a.x += o * r), (a.y += d * r);
        }
      }
    };
    let Jt = Dt;
    (Jt.ENTRIES = 3),
      (Jt.PREV_TIME = -3),
      (Jt.PREV_X = -2),
      (Jt.PREV_Y = -1),
      (Jt.X = 1),
      (Jt.Y = 2);
    let te = class extends Jt {
        constructor(t) {
          super(t);
        }
        getPropertyId() {
          return (2 << 24) + this.boneIndex;
        }
        apply(t, n, e, i, r, h, l) {
          const s = this.frames,
            a = t.bones[this.boneIndex];
          if (!a.active) return;
          if (e < s[0]) {
            switch (h) {
              case A.setup:
                (a.scaleX = a.data.scaleX), (a.scaleY = a.data.scaleY);
                return;
              case A.first:
                (a.scaleX += (a.data.scaleX - a.scaleX) * r),
                  (a.scaleY += (a.data.scaleY - a.scaleY) * r);
            }
            return;
          }
          let o = 0,
            d = 0;
          if (e >= s[s.length - te.ENTRIES])
            (o = s[s.length + te.PREV_X] * a.data.scaleX),
              (d = s[s.length + te.PREV_Y] * a.data.scaleY);
          else {
            const f = Et.binarySearch(s, e, te.ENTRIES);
            (o = s[f + te.PREV_X]), (d = s[f + te.PREV_Y]);
            const u = s[f],
              m = this.getCurvePercent(
                f / te.ENTRIES - 1,
                1 - (e - u) / (s[f + te.PREV_TIME] - u)
              );
            (o = (o + (s[f + te.X] - o) * m) * a.data.scaleX),
              (d = (d + (s[f + te.Y] - d) * m) * a.data.scaleY);
          }
          if (r == 1)
            h == A.add
              ? ((a.scaleX += o - a.data.scaleX),
                (a.scaleY += d - a.data.scaleY))
              : ((a.scaleX = o), (a.scaleY = d));
          else {
            let f = 0,
              u = 0;
            if (l == J.mixOut)
              switch (h) {
                case A.setup:
                  (f = a.data.scaleX),
                    (u = a.data.scaleY),
                    (a.scaleX = f + (Math.abs(o) * C.signum(f) - f) * r),
                    (a.scaleY = u + (Math.abs(d) * C.signum(u) - u) * r);
                  break;
                case A.first:
                case A.replace:
                  (f = a.scaleX),
                    (u = a.scaleY),
                    (a.scaleX = f + (Math.abs(o) * C.signum(f) - f) * r),
                    (a.scaleY = u + (Math.abs(d) * C.signum(u) - u) * r);
                  break;
                case A.add:
                  (f = a.scaleX),
                    (u = a.scaleY),
                    (a.scaleX =
                      f + (Math.abs(o) * C.signum(f) - a.data.scaleX) * r),
                    (a.scaleY =
                      u + (Math.abs(d) * C.signum(u) - a.data.scaleY) * r);
              }
            else
              switch (h) {
                case A.setup:
                  (f = Math.abs(a.data.scaleX) * C.signum(o)),
                    (u = Math.abs(a.data.scaleY) * C.signum(d)),
                    (a.scaleX = f + (o - f) * r),
                    (a.scaleY = u + (d - u) * r);
                  break;
                case A.first:
                case A.replace:
                  (f = Math.abs(a.scaleX) * C.signum(o)),
                    (u = Math.abs(a.scaleY) * C.signum(d)),
                    (a.scaleX = f + (o - f) * r),
                    (a.scaleY = u + (d - u) * r);
                  break;
                case A.add:
                  (f = C.signum(o)),
                    (u = C.signum(d)),
                    (a.scaleX =
                      Math.abs(a.scaleX) * f +
                      (o - Math.abs(a.data.scaleX) * f) * r),
                    (a.scaleY =
                      Math.abs(a.scaleY) * u +
                      (d - Math.abs(a.data.scaleY) * u) * r);
              }
          }
        }
      },
      ee = class extends Jt {
        constructor(t) {
          super(t);
        }
        getPropertyId() {
          return (3 << 24) + this.boneIndex;
        }
        apply(t, n, e, i, r, h, l) {
          const s = this.frames,
            a = t.bones[this.boneIndex];
          if (!a.active) return;
          if (e < s[0]) {
            switch (h) {
              case A.setup:
                (a.shearX = a.data.shearX), (a.shearY = a.data.shearY);
                return;
              case A.first:
                (a.shearX += (a.data.shearX - a.shearX) * r),
                  (a.shearY += (a.data.shearY - a.shearY) * r);
            }
            return;
          }
          let o = 0,
            d = 0;
          if (e >= s[s.length - ee.ENTRIES])
            (o = s[s.length + ee.PREV_X]), (d = s[s.length + ee.PREV_Y]);
          else {
            const f = Et.binarySearch(s, e, ee.ENTRIES);
            (o = s[f + ee.PREV_X]), (d = s[f + ee.PREV_Y]);
            const u = s[f],
              m = this.getCurvePercent(
                f / ee.ENTRIES - 1,
                1 - (e - u) / (s[f + ee.PREV_TIME] - u)
              );
            (o = o + (s[f + ee.X] - o) * m), (d = d + (s[f + ee.Y] - d) * m);
          }
          switch (h) {
            case A.setup:
              (a.shearX = a.data.shearX + o * r),
                (a.shearY = a.data.shearY + d * r);
              break;
            case A.first:
            case A.replace:
              (a.shearX += (a.data.shearX + o - a.shearX) * r),
                (a.shearY += (a.data.shearY + d - a.shearY) * r);
              break;
            case A.add:
              (a.shearX += o * r), (a.shearY += d * r);
          }
        }
      };
    const ft = class extends Ht {
      constructor(t) {
        super(t), (this.frames = v.newFloatArray(t * ft.ENTRIES));
      }
      getPropertyId() {
        return (5 << 24) + this.slotIndex;
      }
      setFrame(t, n, e, i, r, h) {
        (t *= ft.ENTRIES),
          (this.frames[t] = n),
          (this.frames[t + ft.R] = e),
          (this.frames[t + ft.G] = i),
          (this.frames[t + ft.B] = r),
          (this.frames[t + ft.A] = h);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.slots[this.slotIndex];
        if (!s.bone.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.color.setFromColor(s.data.color);
              return;
            case A.first:
              const m = s.color,
                g = s.data.color;
              m.add(
                (g.r - m.r) * r,
                (g.g - m.g) * r,
                (g.b - m.b) * r,
                (g.a - m.a) * r
              );
          }
          return;
        }
        let o = 0,
          d = 0,
          f = 0,
          u = 0;
        if (e >= a[a.length - ft.ENTRIES]) {
          const m = a.length;
          (o = a[m + ft.PREV_R]),
            (d = a[m + ft.PREV_G]),
            (f = a[m + ft.PREV_B]),
            (u = a[m + ft.PREV_A]);
        } else {
          const m = Et.binarySearch(a, e, ft.ENTRIES);
          (o = a[m + ft.PREV_R]),
            (d = a[m + ft.PREV_G]),
            (f = a[m + ft.PREV_B]),
            (u = a[m + ft.PREV_A]);
          const g = a[m],
            x = this.getCurvePercent(
              m / ft.ENTRIES - 1,
              1 - (e - g) / (a[m + ft.PREV_TIME] - g)
            );
          (o += (a[m + ft.R] - o) * x),
            (d += (a[m + ft.G] - d) * x),
            (f += (a[m + ft.B] - f) * x),
            (u += (a[m + ft.A] - u) * x);
        }
        if (r == 1) s.color.set(o, d, f, u);
        else {
          const m = s.color;
          h == A.setup && m.setFromColor(s.data.color),
            m.add((o - m.r) * r, (d - m.g) * r, (f - m.b) * r, (u - m.a) * r);
        }
      }
    };
    let Lt = ft;
    (Lt.ENTRIES = 5),
      (Lt.PREV_TIME = -5),
      (Lt.PREV_R = -4),
      (Lt.PREV_G = -3),
      (Lt.PREV_B = -2),
      (Lt.PREV_A = -1),
      (Lt.R = 1),
      (Lt.G = 2),
      (Lt.B = 3),
      (Lt.A = 4);
    const nt = class extends Ht {
      constructor(t) {
        super(t), (this.frames = v.newFloatArray(t * nt.ENTRIES));
      }
      getPropertyId() {
        return (14 << 24) + this.slotIndex;
      }
      setFrame(t, n, e, i, r, h, l, s, a) {
        (t *= nt.ENTRIES),
          (this.frames[t] = n),
          (this.frames[t + nt.R] = e),
          (this.frames[t + nt.G] = i),
          (this.frames[t + nt.B] = r),
          (this.frames[t + nt.A] = h),
          (this.frames[t + nt.R2] = l),
          (this.frames[t + nt.G2] = s),
          (this.frames[t + nt.B2] = a);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.slots[this.slotIndex];
        if (!s.bone.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.color.setFromColor(s.data.color),
                s.darkColor.setFromColor(s.data.darkColor);
              return;
            case A.first:
              const E = s.color,
                w = s.darkColor,
                b = s.data.color,
                p = s.data.darkColor;
              E.add(
                (b.r - E.r) * r,
                (b.g - E.g) * r,
                (b.b - E.b) * r,
                (b.a - E.a) * r
              ),
                w.add((p.r - w.r) * r, (p.g - w.g) * r, (p.b - w.b) * r, 0);
          }
          return;
        }
        let o = 0,
          d = 0,
          f = 0,
          u = 0,
          m = 0,
          g = 0,
          x = 0;
        if (e >= a[a.length - nt.ENTRIES]) {
          const E = a.length;
          (o = a[E + nt.PREV_R]),
            (d = a[E + nt.PREV_G]),
            (f = a[E + nt.PREV_B]),
            (u = a[E + nt.PREV_A]),
            (m = a[E + nt.PREV_R2]),
            (g = a[E + nt.PREV_G2]),
            (x = a[E + nt.PREV_B2]);
        } else {
          const E = Et.binarySearch(a, e, nt.ENTRIES);
          (o = a[E + nt.PREV_R]),
            (d = a[E + nt.PREV_G]),
            (f = a[E + nt.PREV_B]),
            (u = a[E + nt.PREV_A]),
            (m = a[E + nt.PREV_R2]),
            (g = a[E + nt.PREV_G2]),
            (x = a[E + nt.PREV_B2]);
          const w = a[E],
            b = this.getCurvePercent(
              E / nt.ENTRIES - 1,
              1 - (e - w) / (a[E + nt.PREV_TIME] - w)
            );
          (o += (a[E + nt.R] - o) * b),
            (d += (a[E + nt.G] - d) * b),
            (f += (a[E + nt.B] - f) * b),
            (u += (a[E + nt.A] - u) * b),
            (m += (a[E + nt.R2] - m) * b),
            (g += (a[E + nt.G2] - g) * b),
            (x += (a[E + nt.B2] - x) * b);
        }
        if (r == 1) s.color.set(o, d, f, u), s.darkColor.set(m, g, x, 1);
        else {
          const E = s.color,
            w = s.darkColor;
          h == A.setup &&
            (E.setFromColor(s.data.color), w.setFromColor(s.data.darkColor)),
            E.add((o - E.r) * r, (d - E.g) * r, (f - E.b) * r, (u - E.a) * r),
            w.add((m - w.r) * r, (g - w.g) * r, (x - w.b) * r, 0);
        }
      }
    };
    let yt = nt;
    (yt.ENTRIES = 8),
      (yt.PREV_TIME = -8),
      (yt.PREV_R = -7),
      (yt.PREV_G = -6),
      (yt.PREV_B = -5),
      (yt.PREV_A = -4),
      (yt.PREV_R2 = -3),
      (yt.PREV_G2 = -2),
      (yt.PREV_B2 = -1),
      (yt.R = 1),
      (yt.G = 2),
      (yt.B = 3),
      (yt.A = 4),
      (yt.R2 = 5),
      (yt.G2 = 6),
      (yt.B2 = 7);
    let en = class {
        constructor(t) {
          (this.frames = v.newFloatArray(t)),
            (this.attachmentNames = new Array(t));
        }
        getPropertyId() {
          return (4 << 24) + this.slotIndex;
        }
        getFrameCount() {
          return this.frames.length;
        }
        setFrame(t, n, e) {
          (this.frames[t] = n), (this.attachmentNames[t] = e);
        }
        apply(t, n, e, i, r, h, l) {
          const s = t.slots[this.slotIndex];
          if (!s.bone.active) return;
          if (l == J.mixOut) {
            h == A.setup && this.setAttachment(t, s, s.data.attachmentName);
            return;
          }
          const a = this.frames;
          if (e < a[0]) {
            (h == A.setup || h == A.first) &&
              this.setAttachment(t, s, s.data.attachmentName);
            return;
          }
          let o = 0;
          e >= a[a.length - 1]
            ? (o = a.length - 1)
            : (o = Et.binarySearch(a, e, 1) - 1);
          const d = this.attachmentNames[o];
          t.slots[this.slotIndex].setAttachment(
            d == null ? null : t.getAttachment(this.slotIndex, d)
          );
        }
        setAttachment(t, n, e) {
          n.setAttachment(
            e == null ? null : t.getAttachment(this.slotIndex, e)
          );
        }
      },
      Vi = null,
      hs = class extends Ht {
        constructor(t) {
          super(t),
            (this.frames = v.newFloatArray(t)),
            (this.frameVertices = new Array(t)),
            Vi == null && (Vi = v.newFloatArray(64));
        }
        getPropertyId() {
          return (6 << 27) + Number(this.attachment.id) + this.slotIndex;
        }
        setFrame(t, n, e) {
          (this.frames[t] = n), (this.frameVertices[t] = e);
        }
        apply(t, n, e, i, r, h, l) {
          const s = t.slots[this.slotIndex];
          if (!s.bone.active) return;
          const a = s.getAttachment();
          if (!(a instanceof ze) || a.deformAttachment != this.attachment)
            return;
          const o = s.deform;
          o.length == 0 && (h = A.setup);
          const d = this.frameVertices,
            f = d[0].length,
            u = this.frames;
          if (e < u[0]) {
            const p = a;
            switch (h) {
              case A.setup:
                o.length = 0;
                return;
              case A.first:
                if (r == 1) {
                  o.length = 0;
                  break;
                }
                const S = v.setArraySize(o, f);
                if (p.bones == null) {
                  const y = p.vertices;
                  for (let M = 0; M < f; M++) S[M] += (y[M] - S[M]) * r;
                } else {
                  r = 1 - r;
                  for (let y = 0; y < f; y++) S[y] *= r;
                }
            }
            return;
          }
          const m = v.setArraySize(o, f);
          if (e >= u[u.length - 1]) {
            const p = d[u.length - 1];
            if (r == 1)
              if (h == A.add) {
                const S = a;
                if (S.bones == null) {
                  const y = S.vertices;
                  for (let M = 0; M < f; M++) m[M] += p[M] - y[M];
                } else for (let y = 0; y < f; y++) m[y] += p[y];
              } else v.arrayCopy(p, 0, m, 0, f);
            else
              switch (h) {
                case A.setup: {
                  const y = a;
                  if (y.bones == null) {
                    const M = y.vertices;
                    for (let T = 0; T < f; T++) {
                      const k = M[T];
                      m[T] = k + (p[T] - k) * r;
                    }
                  } else for (let M = 0; M < f; M++) m[M] = p[M] * r;
                  break;
                }
                case A.first:
                case A.replace:
                  for (let y = 0; y < f; y++) m[y] += (p[y] - m[y]) * r;
                  break;
                case A.add:
                  const S = a;
                  if (S.bones == null) {
                    const y = S.vertices;
                    for (let M = 0; M < f; M++) m[M] += (p[M] - y[M]) * r;
                  } else for (let y = 0; y < f; y++) m[y] += p[y] * r;
              }
            return;
          }
          const g = Et.binarySearch(u, e),
            x = d[g - 1],
            E = d[g],
            w = u[g],
            b = this.getCurvePercent(g - 1, 1 - (e - w) / (u[g - 1] - w));
          if (r == 1)
            if (h == A.add) {
              const p = a;
              if (p.bones == null) {
                const S = p.vertices;
                for (let y = 0; y < f; y++) {
                  const M = x[y];
                  m[y] += M + (E[y] - M) * b - S[y];
                }
              } else
                for (let S = 0; S < f; S++) {
                  const y = x[S];
                  m[S] += y + (E[S] - y) * b;
                }
            } else
              for (let p = 0; p < f; p++) {
                const S = x[p];
                m[p] = S + (E[p] - S) * b;
              }
          else
            switch (h) {
              case A.setup: {
                const S = a;
                if (S.bones == null) {
                  const y = S.vertices;
                  for (let M = 0; M < f; M++) {
                    const T = x[M],
                      k = y[M];
                    m[M] = k + (T + (E[M] - T) * b - k) * r;
                  }
                } else
                  for (let y = 0; y < f; y++) {
                    const M = x[y];
                    m[y] = (M + (E[y] - M) * b) * r;
                  }
                break;
              }
              case A.first:
              case A.replace:
                for (let S = 0; S < f; S++) {
                  const y = x[S];
                  m[S] += (y + (E[S] - y) * b - m[S]) * r;
                }
                break;
              case A.add:
                const p = a;
                if (p.bones == null) {
                  const S = p.vertices;
                  for (let y = 0; y < f; y++) {
                    const M = x[y];
                    m[y] += (M + (E[y] - M) * b - S[y]) * r;
                  }
                } else
                  for (let S = 0; S < f; S++) {
                    const y = x[S];
                    m[S] += (y + (E[S] - y) * b) * r;
                  }
            }
        }
      },
      Yn = class {
        constructor(t) {
          (this.frames = v.newFloatArray(t)), (this.events = new Array(t));
        }
        getPropertyId() {
          return 7 << 24;
        }
        getFrameCount() {
          return this.frames.length;
        }
        setFrame(t, n) {
          (this.frames[t] = n.time), (this.events[t] = n);
        }
        apply(t, n, e, i, r, h, l) {
          if (i == null) return;
          const s = this.frames,
            a = this.frames.length;
          if (n > e) this.apply(t, n, Number.MAX_VALUE, i, r, h, l), (n = -1);
          else if (n >= s[a - 1]) return;
          if (e < s[0]) return;
          let o = 0;
          if (n < s[0]) o = 0;
          else {
            o = Et.binarySearch(s, n);
            const d = s[o];
            for (; o > 0 && s[o - 1] == d; ) o--;
          }
          for (; o < a && e >= s[o]; o++) i.push(this.events[o]);
        }
      },
      xn = class {
        constructor(t) {
          (this.frames = v.newFloatArray(t)), (this.drawOrders = new Array(t));
        }
        getPropertyId() {
          return 8 << 24;
        }
        getFrameCount() {
          return this.frames.length;
        }
        setFrame(t, n, e) {
          (this.frames[t] = n), (this.drawOrders[t] = e);
        }
        apply(t, n, e, i, r, h, l) {
          const s = t.drawOrder,
            a = t.slots;
          if (l == J.mixOut && h == A.setup) {
            v.arrayCopy(t.slots, 0, t.drawOrder, 0, t.slots.length);
            return;
          }
          const o = this.frames;
          if (e < o[0]) {
            (h == A.setup || h == A.first) &&
              v.arrayCopy(t.slots, 0, t.drawOrder, 0, t.slots.length);
            return;
          }
          let d = 0;
          e >= o[o.length - 1]
            ? (d = o.length - 1)
            : (d = Et.binarySearch(o, e) - 1);
          const f = this.drawOrders[d];
          if (f == null) v.arrayCopy(a, 0, s, 0, a.length);
          else for (let u = 0, m = f.length; u < m; u++) s[u] = a[f[u]];
        }
      };
    const at = class extends Ht {
      constructor(t) {
        super(t), (this.frames = v.newFloatArray(t * at.ENTRIES));
      }
      getPropertyId() {
        return (9 << 24) + this.ikConstraintIndex;
      }
      setFrame(t, n, e, i, r, h, l) {
        (t *= at.ENTRIES),
          (this.frames[t] = n),
          (this.frames[t + at.MIX] = e),
          (this.frames[t + at.SOFTNESS] = i),
          (this.frames[t + at.BEND_DIRECTION] = r),
          (this.frames[t + at.COMPRESS] = h ? 1 : 0),
          (this.frames[t + at.STRETCH] = l ? 1 : 0);
      }
      apply(t, n, e, i, r, h, l) {
        const s = this.frames,
          a = t.ikConstraints[this.ikConstraintIndex];
        if (!a.active) return;
        if (e < s[0]) {
          switch (h) {
            case A.setup:
              (a.mix = a.data.mix),
                (a.softness = a.data.softness),
                (a.bendDirection = a.data.bendDirection),
                (a.compress = a.data.compress),
                (a.stretch = a.data.stretch);
              return;
            case A.first:
              (a.mix += (a.data.mix - a.mix) * r),
                (a.softness += (a.data.softness - a.softness) * r),
                (a.bendDirection = a.data.bendDirection),
                (a.compress = a.data.compress),
                (a.stretch = a.data.stretch);
          }
          return;
        }
        if (e >= s[s.length - at.ENTRIES]) {
          h == A.setup
            ? ((a.mix =
                a.data.mix + (s[s.length + at.PREV_MIX] - a.data.mix) * r),
              (a.softness =
                a.data.softness +
                (s[s.length + at.PREV_SOFTNESS] - a.data.softness) * r),
              l == J.mixOut
                ? ((a.bendDirection = a.data.bendDirection),
                  (a.compress = a.data.compress),
                  (a.stretch = a.data.stretch))
                : ((a.bendDirection = s[s.length + at.PREV_BEND_DIRECTION]),
                  (a.compress = s[s.length + at.PREV_COMPRESS] != 0),
                  (a.stretch = s[s.length + at.PREV_STRETCH] != 0)))
            : ((a.mix += (s[s.length + at.PREV_MIX] - a.mix) * r),
              (a.softness += (s[s.length + at.PREV_SOFTNESS] - a.softness) * r),
              l == J.mixIn &&
                ((a.bendDirection = s[s.length + at.PREV_BEND_DIRECTION]),
                (a.compress = s[s.length + at.PREV_COMPRESS] != 0),
                (a.stretch = s[s.length + at.PREV_STRETCH] != 0)));
          return;
        }
        const o = Et.binarySearch(s, e, at.ENTRIES),
          d = s[o + at.PREV_MIX],
          f = s[o + at.PREV_SOFTNESS],
          u = s[o],
          m = this.getCurvePercent(
            o / at.ENTRIES - 1,
            1 - (e - u) / (s[o + at.PREV_TIME] - u)
          );
        h == A.setup
          ? ((a.mix =
              a.data.mix + (d + (s[o + at.MIX] - d) * m - a.data.mix) * r),
            (a.softness =
              a.data.softness +
              (f + (s[o + at.SOFTNESS] - f) * m - a.data.softness) * r),
            l == J.mixOut
              ? ((a.bendDirection = a.data.bendDirection),
                (a.compress = a.data.compress),
                (a.stretch = a.data.stretch))
              : ((a.bendDirection = s[o + at.PREV_BEND_DIRECTION]),
                (a.compress = s[o + at.PREV_COMPRESS] != 0),
                (a.stretch = s[o + at.PREV_STRETCH] != 0)))
          : ((a.mix += (d + (s[o + at.MIX] - d) * m - a.mix) * r),
            (a.softness += (f + (s[o + at.SOFTNESS] - f) * m - a.softness) * r),
            l == J.mixIn &&
              ((a.bendDirection = s[o + at.PREV_BEND_DIRECTION]),
              (a.compress = s[o + at.PREV_COMPRESS] != 0),
              (a.stretch = s[o + at.PREV_STRETCH] != 0)));
      }
    };
    let Ft = at;
    (Ft.ENTRIES = 6),
      (Ft.PREV_TIME = -6),
      (Ft.PREV_MIX = -5),
      (Ft.PREV_SOFTNESS = -4),
      (Ft.PREV_BEND_DIRECTION = -3),
      (Ft.PREV_COMPRESS = -2),
      (Ft.PREV_STRETCH = -1),
      (Ft.MIX = 1),
      (Ft.SOFTNESS = 2),
      (Ft.BEND_DIRECTION = 3),
      (Ft.COMPRESS = 4),
      (Ft.STRETCH = 5);
    const ut = class extends Ht {
      constructor(t) {
        super(t), (this.frames = v.newFloatArray(t * ut.ENTRIES));
      }
      getPropertyId() {
        return (10 << 24) + this.transformConstraintIndex;
      }
      setFrame(t, n, e, i, r, h) {
        (t *= ut.ENTRIES),
          (this.frames[t] = n),
          (this.frames[t + ut.ROTATE] = e),
          (this.frames[t + ut.TRANSLATE] = i),
          (this.frames[t + ut.SCALE] = r),
          (this.frames[t + ut.SHEAR] = h);
      }
      apply(t, n, e, i, r, h, l) {
        const s = this.frames,
          a = t.transformConstraints[this.transformConstraintIndex];
        if (!a.active) return;
        if (e < s[0]) {
          const m = a.data;
          switch (h) {
            case A.setup:
              (a.rotateMix = m.rotateMix),
                (a.translateMix = m.translateMix),
                (a.scaleMix = m.scaleMix),
                (a.shearMix = m.shearMix);
              return;
            case A.first:
              (a.rotateMix += (m.rotateMix - a.rotateMix) * r),
                (a.translateMix += (m.translateMix - a.translateMix) * r),
                (a.scaleMix += (m.scaleMix - a.scaleMix) * r),
                (a.shearMix += (m.shearMix - a.shearMix) * r);
          }
          return;
        }
        let o = 0,
          d = 0,
          f = 0,
          u = 0;
        if (e >= s[s.length - ut.ENTRIES]) {
          const m = s.length;
          (o = s[m + ut.PREV_ROTATE]),
            (d = s[m + ut.PREV_TRANSLATE]),
            (f = s[m + ut.PREV_SCALE]),
            (u = s[m + ut.PREV_SHEAR]);
        } else {
          const m = Et.binarySearch(s, e, ut.ENTRIES);
          (o = s[m + ut.PREV_ROTATE]),
            (d = s[m + ut.PREV_TRANSLATE]),
            (f = s[m + ut.PREV_SCALE]),
            (u = s[m + ut.PREV_SHEAR]);
          const g = s[m],
            x = this.getCurvePercent(
              m / ut.ENTRIES - 1,
              1 - (e - g) / (s[m + ut.PREV_TIME] - g)
            );
          (o += (s[m + ut.ROTATE] - o) * x),
            (d += (s[m + ut.TRANSLATE] - d) * x),
            (f += (s[m + ut.SCALE] - f) * x),
            (u += (s[m + ut.SHEAR] - u) * x);
        }
        if (h == A.setup) {
          const m = a.data;
          (a.rotateMix = m.rotateMix + (o - m.rotateMix) * r),
            (a.translateMix = m.translateMix + (d - m.translateMix) * r),
            (a.scaleMix = m.scaleMix + (f - m.scaleMix) * r),
            (a.shearMix = m.shearMix + (u - m.shearMix) * r);
        } else
          (a.rotateMix += (o - a.rotateMix) * r),
            (a.translateMix += (d - a.translateMix) * r),
            (a.scaleMix += (f - a.scaleMix) * r),
            (a.shearMix += (u - a.shearMix) * r);
      }
    };
    let _t = ut;
    (_t.ENTRIES = 5),
      (_t.PREV_TIME = -5),
      (_t.PREV_ROTATE = -4),
      (_t.PREV_TRANSLATE = -3),
      (_t.PREV_SCALE = -2),
      (_t.PREV_SHEAR = -1),
      (_t.ROTATE = 1),
      (_t.TRANSLATE = 2),
      (_t.SCALE = 3),
      (_t.SHEAR = 4);
    const ue = class extends Ht {
      constructor(t) {
        super(t), (this.frames = v.newFloatArray(t * ue.ENTRIES));
      }
      getPropertyId() {
        return (11 << 24) + this.pathConstraintIndex;
      }
      setFrame(t, n, e) {
        (t *= ue.ENTRIES),
          (this.frames[t] = n),
          (this.frames[t + ue.VALUE] = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = this.frames,
          a = t.pathConstraints[this.pathConstraintIndex];
        if (!a.active) return;
        if (e < s[0]) {
          switch (h) {
            case A.setup:
              a.position = a.data.position;
              return;
            case A.first:
              a.position += (a.data.position - a.position) * r;
          }
          return;
        }
        let o = 0;
        if (e >= s[s.length - ue.ENTRIES]) o = s[s.length + ue.PREV_VALUE];
        else {
          const d = Et.binarySearch(s, e, ue.ENTRIES);
          o = s[d + ue.PREV_VALUE];
          const f = s[d],
            u = this.getCurvePercent(
              d / ue.ENTRIES - 1,
              1 - (e - f) / (s[d + ue.PREV_TIME] - f)
            );
          o += (s[d + ue.VALUE] - o) * u;
        }
        h == A.setup
          ? (a.position = a.data.position + (o - a.data.position) * r)
          : (a.position += (o - a.position) * r);
      }
    };
    let Te = ue;
    (Te.ENTRIES = 2), (Te.PREV_TIME = -2), (Te.PREV_VALUE = -1), (Te.VALUE = 1);
    let ke = class extends Te {
      constructor(t) {
        super(t);
      }
      getPropertyId() {
        return (12 << 24) + this.pathConstraintIndex;
      }
      apply(t, n, e, i, r, h, l) {
        const s = this.frames,
          a = t.pathConstraints[this.pathConstraintIndex];
        if (!a.active) return;
        if (e < s[0]) {
          switch (h) {
            case A.setup:
              a.spacing = a.data.spacing;
              return;
            case A.first:
              a.spacing += (a.data.spacing - a.spacing) * r;
          }
          return;
        }
        let o = 0;
        if (e >= s[s.length - ke.ENTRIES]) o = s[s.length + ke.PREV_VALUE];
        else {
          const d = Et.binarySearch(s, e, ke.ENTRIES);
          o = s[d + ke.PREV_VALUE];
          const f = s[d],
            u = this.getCurvePercent(
              d / ke.ENTRIES - 1,
              1 - (e - f) / (s[d + ke.PREV_TIME] - f)
            );
          o += (s[d + ke.VALUE] - o) * u;
        }
        h == A.setup
          ? (a.spacing = a.data.spacing + (o - a.data.spacing) * r)
          : (a.spacing += (o - a.spacing) * r);
      }
    };
    const Ot = class extends Ht {
      constructor(t) {
        super(t), (this.frames = v.newFloatArray(t * Ot.ENTRIES));
      }
      getPropertyId() {
        return (13 << 24) + this.pathConstraintIndex;
      }
      setFrame(t, n, e, i) {
        (t *= Ot.ENTRIES),
          (this.frames[t] = n),
          (this.frames[t + Ot.ROTATE] = e),
          (this.frames[t + Ot.TRANSLATE] = i);
      }
      apply(t, n, e, i, r, h, l) {
        const s = this.frames,
          a = t.pathConstraints[this.pathConstraintIndex];
        if (!a.active) return;
        if (e < s[0]) {
          switch (h) {
            case A.setup:
              (a.rotateMix = a.data.rotateMix),
                (a.translateMix = a.data.translateMix);
              return;
            case A.first:
              (a.rotateMix += (a.data.rotateMix - a.rotateMix) * r),
                (a.translateMix += (a.data.translateMix - a.translateMix) * r);
          }
          return;
        }
        let o = 0,
          d = 0;
        if (e >= s[s.length - Ot.ENTRIES])
          (o = s[s.length + Ot.PREV_ROTATE]),
            (d = s[s.length + Ot.PREV_TRANSLATE]);
        else {
          const f = Et.binarySearch(s, e, Ot.ENTRIES);
          (o = s[f + Ot.PREV_ROTATE]), (d = s[f + Ot.PREV_TRANSLATE]);
          const u = s[f],
            m = this.getCurvePercent(
              f / Ot.ENTRIES - 1,
              1 - (e - u) / (s[f + Ot.PREV_TIME] - u)
            );
          (o += (s[f + Ot.ROTATE] - o) * m),
            (d += (s[f + Ot.TRANSLATE] - d) * m);
        }
        h == A.setup
          ? ((a.rotateMix = a.data.rotateMix + (o - a.data.rotateMix) * r),
            (a.translateMix =
              a.data.translateMix + (d - a.data.translateMix) * r))
          : ((a.rotateMix += (o - a.rotateMix) * r),
            (a.translateMix += (d - a.translateMix) * r));
      }
    };
    let me = Ot;
    (me.ENTRIES = 3),
      (me.PREV_TIME = -3),
      (me.PREV_ROTATE = -2),
      (me.PREV_TRANSLATE = -1),
      (me.ROTATE = 1),
      (me.TRANSLATE = 2);
    const mt = class {
      constructor(t) {
        (this.tracks = new Array()),
          (this.timeScale = 1),
          (this.unkeyedState = 0),
          (this.events = new Array()),
          (this.listeners = new Array()),
          (this.queue = new fs(this)),
          (this.propertyIDs = new ns()),
          (this.animationsChanged = !1),
          (this.trackEntryPool = new An(() => new Xn())),
          (this.data = t);
      }
      update(t) {
        t *= this.timeScale;
        const n = this.tracks;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r == null) continue;
          (r.animationLast = r.nextAnimationLast),
            (r.trackLast = r.nextTrackLast);
          let h = t * r.timeScale;
          if (r.delay > 0) {
            if (((r.delay -= h), r.delay > 0)) continue;
            (h = -r.delay), (r.delay = 0);
          }
          let l = r.next;
          if (l != null) {
            const s = r.trackLast - l.delay;
            if (s >= 0) {
              for (
                l.delay = 0,
                  l.trackTime +=
                    r.timeScale == 0 ? 0 : (s / r.timeScale + t) * l.timeScale,
                  r.trackTime += h,
                  this.setCurrent(e, l, !0);
                l.mixingFrom != null;

              )
                (l.mixTime += t), (l = l.mixingFrom);
              continue;
            }
          } else if (r.trackLast >= r.trackEnd && r.mixingFrom == null) {
            (n[e] = null), this.queue.end(r), this.disposeNext(r);
            continue;
          }
          if (r.mixingFrom != null && this.updateMixingFrom(r, t)) {
            let s = r.mixingFrom;
            for (
              r.mixingFrom = null, s != null && (s.mixingTo = null);
              s != null;

            )
              this.queue.end(s), (s = s.mixingFrom);
          }
          r.trackTime += h;
        }
        this.queue.drain();
      }
      updateMixingFrom(t, n) {
        const e = t.mixingFrom;
        if (e == null) return !0;
        const i = this.updateMixingFrom(e, n);
        return (
          (e.animationLast = e.nextAnimationLast),
          (e.trackLast = e.nextTrackLast),
          t.mixTime > 0 && t.mixTime >= t.mixDuration
            ? ((e.totalAlpha == 0 || t.mixDuration == 0) &&
                ((t.mixingFrom = e.mixingFrom),
                e.mixingFrom != null && (e.mixingFrom.mixingTo = t),
                (t.interruptAlpha = e.interruptAlpha),
                this.queue.end(e)),
              i)
            : ((e.trackTime += n * e.timeScale), (t.mixTime += n), !1)
        );
      }
      apply(t) {
        if (t == null) throw new Error("skeleton cannot be null.");
        this.animationsChanged && this._animationsChanged();
        const n = this.events,
          e = this.tracks;
        let i = !1;
        for (let l = 0, s = e.length; l < s; l++) {
          const a = e[l];
          if (a == null || a.delay > 0) continue;
          i = !0;
          const o = l == 0 ? A.first : a.mixBlend;
          let d = a.alpha;
          a.mixingFrom != null
            ? (d *= this.applyMixingFrom(a, t, o))
            : a.trackTime >= a.trackEnd && a.next == null && (d = 0);
          const f = a.animationLast,
            u = a.getAnimationTime(),
            m = a.animation.timelines.length,
            g = a.animation.timelines;
          if ((l == 0 && d == 1) || o == A.add)
            for (let x = 0; x < m; x++) {
              v.webkit602BugfixHelper(d, o);
              const E = g[x];
              E instanceof en
                ? this.applyAttachmentTimeline(E, t, u, o, !0)
                : E.apply(t, f, u, n, d, o, J.mixIn);
            }
          else {
            const x = a.timelineMode,
              E = a.timelinesRotation.length == 0;
            E && v.setArraySize(a.timelinesRotation, m << 1, null);
            const w = a.timelinesRotation;
            for (let b = 0; b < m; b++) {
              const p = g[b],
                S = x[b] == mt.SUBSEQUENT ? o : A.setup;
              p instanceof Vt
                ? this.applyRotateTimeline(p, t, u, d, S, w, b << 1, E)
                : p instanceof en
                ? this.applyAttachmentTimeline(p, t, u, o, !0)
                : (v.webkit602BugfixHelper(d, o),
                  p.apply(t, f, u, n, d, S, J.mixIn));
            }
          }
          this.queueEvents(a, u),
            (n.length = 0),
            (a.nextAnimationLast = u),
            (a.nextTrackLast = a.trackTime);
        }
        const r = this.unkeyedState + mt.SETUP,
          h = t.slots;
        for (let l = 0, s = t.slots.length; l < s; l++) {
          const a = h[l];
          if (a.attachmentState == r) {
            const o = a.data.attachmentName;
            a.setAttachment(
              o == null ? null : t.getAttachment(a.data.index, o)
            );
          }
        }
        return (this.unkeyedState += 2), this.queue.drain(), i;
      }
      applyMixingFrom(t, n, e) {
        const i = t.mixingFrom;
        i.mixingFrom != null && this.applyMixingFrom(i, n, e);
        let r = 0;
        t.mixDuration == 0
          ? ((r = 1), e == A.first && (e = A.setup))
          : ((r = t.mixTime / t.mixDuration),
            r > 1 && (r = 1),
            e != A.first && (e = i.mixBlend));
        const h = r < i.eventThreshold ? this.events : null,
          l = r < i.attachmentThreshold,
          s = r < i.drawOrderThreshold,
          a = i.animationLast,
          o = i.getAnimationTime(),
          d = i.animation.timelines.length,
          f = i.animation.timelines,
          u = i.alpha * t.interruptAlpha,
          m = u * (1 - r);
        if (e == A.add)
          for (let g = 0; g < d; g++) f[g].apply(n, a, o, h, m, e, J.mixOut);
        else {
          const g = i.timelineMode,
            x = i.timelineHoldMix,
            E = i.timelinesRotation.length == 0;
          E && v.setArraySize(i.timelinesRotation, d << 1, null);
          const w = i.timelinesRotation;
          i.totalAlpha = 0;
          for (let b = 0; b < d; b++) {
            const p = f[b];
            let S = J.mixOut,
              y,
              M = 0;
            switch (g[b]) {
              case mt.SUBSEQUENT:
                if (!s && p instanceof xn) continue;
                (y = e), (M = m);
                break;
              case mt.FIRST:
                (y = A.setup), (M = m);
                break;
              case mt.HOLD_SUBSEQUENT:
                (y = e), (M = u);
                break;
              case mt.HOLD_FIRST:
                (y = A.setup), (M = u);
                break;
              default:
                y = A.setup;
                const T = x[b];
                M = u * Math.max(0, 1 - T.mixTime / T.mixDuration);
                break;
            }
            (i.totalAlpha += M),
              p instanceof Vt
                ? this.applyRotateTimeline(p, n, o, M, y, w, b << 1, E)
                : p instanceof en
                ? this.applyAttachmentTimeline(p, n, o, y, l)
                : (v.webkit602BugfixHelper(M, e),
                  s && p instanceof xn && y == A.setup && (S = J.mixIn),
                  p.apply(n, a, o, h, M, y, S));
          }
        }
        return (
          t.mixDuration > 0 && this.queueEvents(i, o),
          (this.events.length = 0),
          (i.nextAnimationLast = o),
          (i.nextTrackLast = i.trackTime),
          r
        );
      }
      applyAttachmentTimeline(t, n, e, i, r) {
        const h = n.slots[t.slotIndex];
        if (!h.bone.active) return;
        const l = t.frames;
        if (e < l[0])
          (i == A.setup || i == A.first) &&
            this.setAttachment(n, h, h.data.attachmentName, r);
        else {
          let s;
          e >= l[l.length - 1]
            ? (s = l.length - 1)
            : (s = Et.binarySearch(l, e) - 1),
            this.setAttachment(n, h, t.attachmentNames[s], r);
        }
        h.attachmentState <= this.unkeyedState &&
          (h.attachmentState = this.unkeyedState + mt.SETUP);
      }
      setAttachment(t, n, e, i) {
        n.setAttachment(e == null ? null : t.getAttachment(n.data.index, e)),
          i && (n.attachmentState = this.unkeyedState + mt.CURRENT);
      }
      applyRotateTimeline(t, n, e, i, r, h, l, s) {
        if ((s && (h[l] = 0), i == 1)) {
          t.apply(n, 0, e, null, 1, r, J.mixIn);
          return;
        }
        const a = t,
          o = a.frames,
          d = n.bones[a.boneIndex];
        if (!d.active) return;
        let f = 0,
          u = 0;
        if (e < o[0])
          switch (r) {
            case A.setup:
              d.rotation = d.data.rotation;
            default:
              return;
            case A.first:
              (f = d.rotation), (u = d.data.rotation);
          }
        else if (
          ((f = r == A.setup ? d.data.rotation : d.rotation),
          e >= o[o.length - Vt.ENTRIES])
        )
          u = d.data.rotation + o[o.length + Vt.PREV_ROTATION];
        else {
          const x = Et.binarySearch(o, e, Vt.ENTRIES),
            E = o[x + Vt.PREV_ROTATION],
            w = o[x],
            b = a.getCurvePercent(
              (x >> 1) - 1,
              1 - (e - w) / (o[x + Vt.PREV_TIME] - w)
            );
          (u = o[x + Vt.ROTATION] - E),
            (u -= (16384 - ((16384.499999999996 - u / 360) | 0)) * 360),
            (u = E + u * b + d.data.rotation),
            (u -= (16384 - ((16384.499999999996 - u / 360) | 0)) * 360);
        }
        let m = 0,
          g = u - f;
        if (
          ((g -= (16384 - ((16384.499999999996 - g / 360) | 0)) * 360), g == 0)
        )
          m = h[l];
        else {
          let x = 0,
            E = 0;
          s ? ((x = 0), (E = g)) : ((x = h[l]), (E = h[l + 1]));
          const w = g > 0;
          let b = x >= 0;
          C.signum(E) != C.signum(g) &&
            Math.abs(E) <= 90 &&
            (Math.abs(x) > 180 && (x += 360 * C.signum(x)), (b = w)),
            (m = g + x - (x % 360)),
            b != w && (m += 360 * C.signum(x)),
            (h[l] = m);
        }
        (h[l + 1] = g),
          (f += m * i),
          (d.rotation =
            f - (16384 - ((16384.499999999996 - f / 360) | 0)) * 360);
      }
      queueEvents(t, n) {
        const e = t.animationStart,
          i = t.animationEnd,
          r = i - e,
          h = t.trackLast % r,
          l = this.events;
        let s = 0;
        const a = l.length;
        for (; s < a; s++) {
          const d = l[s];
          if (d.time < h) break;
          d.time > i || this.queue.event(t, d);
        }
        let o = !1;
        for (
          t.loop
            ? (o = r == 0 || h > t.trackTime % r)
            : (o = n >= i && t.animationLast < i),
            o && this.queue.complete(t);
          s < a;
          s++
        )
          l[s].time < e || this.queue.event(t, l[s]);
      }
      clearTracks() {
        const t = this.queue.drainDisabled;
        this.queue.drainDisabled = !0;
        for (let n = 0, e = this.tracks.length; n < e; n++) this.clearTrack(n);
        (this.tracks.length = 0),
          (this.queue.drainDisabled = t),
          this.queue.drain();
      }
      clearTrack(t) {
        if (t >= this.tracks.length) return;
        const n = this.tracks[t];
        if (n == null) return;
        this.queue.end(n), this.disposeNext(n);
        let e = n;
        for (;;) {
          const i = e.mixingFrom;
          if (i == null) break;
          this.queue.end(i),
            (e.mixingFrom = null),
            (e.mixingTo = null),
            (e = i);
        }
        (this.tracks[n.trackIndex] = null), this.queue.drain();
      }
      setCurrent(t, n, e) {
        const i = this.expandToIndex(t);
        (this.tracks[t] = n),
          i != null &&
            (e && this.queue.interrupt(i),
            (n.mixingFrom = i),
            (i.mixingTo = n),
            (n.mixTime = 0),
            i.mixingFrom != null &&
              i.mixDuration > 0 &&
              (n.interruptAlpha *= Math.min(1, i.mixTime / i.mixDuration)),
            (i.timelinesRotation.length = 0)),
          this.queue.start(n);
      }
      setAnimation(t, n, e) {
        const i = this.data.skeletonData.findAnimation(n);
        if (i == null) throw new Error(`Animation not found: ${n}`);
        return this.setAnimationWith(t, i, e);
      }
      setAnimationWith(t, n, e) {
        if (n == null) throw new Error("animation cannot be null.");
        let i = !0,
          r = this.expandToIndex(t);
        r != null &&
          (r.nextTrackLast == -1
            ? ((this.tracks[t] = r.mixingFrom),
              this.queue.interrupt(r),
              this.queue.end(r),
              this.disposeNext(r),
              (r = r.mixingFrom),
              (i = !1))
            : this.disposeNext(r));
        const h = this.trackEntry(t, n, e, r);
        return this.setCurrent(t, h, i), this.queue.drain(), h;
      }
      addAnimation(t, n, e, i) {
        const r = this.data.skeletonData.findAnimation(n);
        if (r == null) throw new Error(`Animation not found: ${n}`);
        return this.addAnimationWith(t, r, e, i);
      }
      addAnimationWith(t, n, e, i) {
        if (n == null) throw new Error("animation cannot be null.");
        let r = this.expandToIndex(t);
        if (r != null) for (; r.next != null; ) r = r.next;
        const h = this.trackEntry(t, n, e, r);
        if (r == null) this.setCurrent(t, h, !0), this.queue.drain();
        else if (((r.next = h), i <= 0)) {
          const l = r.animationEnd - r.animationStart;
          l != 0
            ? (r.loop
                ? (i += l * (1 + ((r.trackTime / l) | 0)))
                : (i += Math.max(l, r.trackTime)),
              (i -= this.data.getMix(r.animation, n)))
            : (i = r.trackTime);
        }
        return (h.delay = i), h;
      }
      setEmptyAnimation(t, n) {
        const e = this.setAnimationWith(t, mt.emptyAnimation, !1);
        return (e.mixDuration = n), (e.trackEnd = n), e;
      }
      addEmptyAnimation(t, n, e) {
        e <= 0 && (e -= n);
        const i = this.addAnimationWith(t, mt.emptyAnimation, !1, e);
        return (i.mixDuration = n), (i.trackEnd = n), i;
      }
      setEmptyAnimations(t) {
        const n = this.queue.drainDisabled;
        this.queue.drainDisabled = !0;
        for (let e = 0, i = this.tracks.length; e < i; e++) {
          const r = this.tracks[e];
          r != null && this.setEmptyAnimation(r.trackIndex, t);
        }
        (this.queue.drainDisabled = n), this.queue.drain();
      }
      expandToIndex(t) {
        return t < this.tracks.length
          ? this.tracks[t]
          : (v.ensureArrayCapacity(this.tracks, t + 1, null),
            (this.tracks.length = t + 1),
            null);
      }
      trackEntry(t, n, e, i) {
        const r = this.trackEntryPool.obtain();
        return (
          (r.trackIndex = t),
          (r.animation = n),
          (r.loop = e),
          (r.holdPrevious = !1),
          (r.eventThreshold = 0),
          (r.attachmentThreshold = 0),
          (r.drawOrderThreshold = 0),
          (r.animationStart = 0),
          (r.animationEnd = n.duration),
          (r.animationLast = -1),
          (r.nextAnimationLast = -1),
          (r.delay = 0),
          (r.trackTime = 0),
          (r.trackLast = -1),
          (r.nextTrackLast = -1),
          (r.trackEnd = Number.MAX_VALUE),
          (r.timeScale = 1),
          (r.alpha = 1),
          (r.interruptAlpha = 1),
          (r.mixTime = 0),
          (r.mixDuration = i == null ? 0 : this.data.getMix(i.animation, n)),
          (r.mixBlend = A.replace),
          r
        );
      }
      disposeNext(t) {
        let n = t.next;
        for (; n != null; ) this.queue.dispose(n), (n = n.next);
        t.next = null;
      }
      _animationsChanged() {
        (this.animationsChanged = !1), this.propertyIDs.clear();
        for (let t = 0, n = this.tracks.length; t < n; t++) {
          let e = this.tracks[t];
          if (e != null) {
            for (; e.mixingFrom != null; ) e = e.mixingFrom;
            do
              (e.mixingFrom == null || e.mixBlend != A.add) &&
                this.computeHold(e),
                (e = e.mixingTo);
            while (e != null);
          }
        }
      }
      computeHold(t) {
        const n = t.mixingTo,
          e = t.animation.timelines,
          i = t.animation.timelines.length,
          r = v.setArraySize(t.timelineMode, i);
        t.timelineHoldMix.length = 0;
        const h = v.setArraySize(t.timelineHoldMix, i),
          l = this.propertyIDs;
        if (n != null && n.holdPrevious) {
          for (let s = 0; s < i; s++)
            r[s] = l.add(e[s].getPropertyId())
              ? mt.HOLD_FIRST
              : mt.HOLD_SUBSEQUENT;
          return;
        }
        t: for (let s = 0; s < i; s++) {
          const a = e[s],
            o = a.getPropertyId();
          if (!l.add(o)) r[s] = mt.SUBSEQUENT;
          else if (
            n == null ||
            a instanceof en ||
            a instanceof xn ||
            a instanceof Yn ||
            !n.animation.hasTimeline(o)
          )
            r[s] = mt.FIRST;
          else {
            for (let d = n.mixingTo; d != null; d = d.mixingTo)
              if (!d.animation.hasTimeline(o)) {
                if (t.mixDuration > 0) {
                  (r[s] = mt.HOLD_MIX), (h[s] = d);
                  continue t;
                }
                break;
              }
            r[s] = mt.HOLD_FIRST;
          }
        }
      }
      getCurrent(t) {
        return t >= this.tracks.length ? null : this.tracks[t];
      }
      addListener(t) {
        if (t == null) throw new Error("listener cannot be null.");
        this.listeners.push(t);
      }
      removeListener(t) {
        const n = this.listeners.indexOf(t);
        n >= 0 && this.listeners.splice(n, 1);
      }
      clearListeners() {
        this.listeners.length = 0;
      }
      clearListenerNotifications() {
        this.queue.clear();
      }
      setAnimationByName(t, n, e) {
        mt.deprecatedWarning1 ||
          ((mt.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: AnimationState.setAnimationByName is deprecated, please use setAnimation from now on."
          )),
          this.setAnimation(t, n, e);
      }
      addAnimationByName(t, n, e, i) {
        mt.deprecatedWarning2 ||
          ((mt.deprecatedWarning2 = !0),
          console.warn(
            "Spine Deprecation Warning: AnimationState.addAnimationByName is deprecated, please use addAnimation from now on."
          )),
          this.addAnimation(t, n, e, i);
      }
      hasAnimation(t) {
        return this.data.skeletonData.findAnimation(t) !== null;
      }
      hasAnimationByName(t) {
        return (
          mt.deprecatedWarning3 ||
            ((mt.deprecatedWarning3 = !0),
            console.warn(
              "Spine Deprecation Warning: AnimationState.hasAnimationByName is deprecated, please use hasAnimation from now on."
            )),
          this.hasAnimation(t)
        );
      }
    };
    let ne = mt;
    (ne.emptyAnimation = new Et("<empty>", [], 0)),
      (ne.SUBSEQUENT = 0),
      (ne.FIRST = 1),
      (ne.HOLD_SUBSEQUENT = 2),
      (ne.HOLD_FIRST = 3),
      (ne.HOLD_MIX = 4),
      (ne.SETUP = 1),
      (ne.CURRENT = 2),
      (ne.deprecatedWarning1 = !1),
      (ne.deprecatedWarning2 = !1),
      (ne.deprecatedWarning3 = !1);
    const Ye = class {
      constructor() {
        (this.mixBlend = A.replace),
          (this.timelineMode = new Array()),
          (this.timelineHoldMix = new Array()),
          (this.timelinesRotation = new Array());
      }
      reset() {
        (this.next = null),
          (this.mixingFrom = null),
          (this.mixingTo = null),
          (this.animation = null),
          (this.listener = null),
          (this.timelineMode.length = 0),
          (this.timelineHoldMix.length = 0),
          (this.timelinesRotation.length = 0);
      }
      getAnimationTime() {
        if (this.loop) {
          const t = this.animationEnd - this.animationStart;
          return t == 0
            ? this.animationStart
            : (this.trackTime % t) + this.animationStart;
        }
        return Math.min(
          this.trackTime + this.animationStart,
          this.animationEnd
        );
      }
      setAnimationLast(t) {
        (this.animationLast = t), (this.nextAnimationLast = t);
      }
      isComplete() {
        return this.trackTime >= this.animationEnd - this.animationStart;
      }
      resetRotationDirections() {
        this.timelinesRotation.length = 0;
      }
      get time() {
        return (
          Ye.deprecatedWarning1 ||
            ((Ye.deprecatedWarning1 = !0),
            console.warn(
              "Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on."
            )),
          this.trackTime
        );
      }
      set time(t) {
        Ye.deprecatedWarning1 ||
          ((Ye.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on."
          )),
          (this.trackTime = t);
      }
      get endTime() {
        return (
          Ye.deprecatedWarning2 ||
            ((Ye.deprecatedWarning2 = !0),
            console.warn(
              "Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on."
            )),
          this.trackTime
        );
      }
      set endTime(t) {
        Ye.deprecatedWarning2 ||
          ((Ye.deprecatedWarning2 = !0),
          console.warn(
            "Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on."
          )),
          (this.trackTime = t);
      }
      loopsCount() {
        return Math.floor(this.trackTime / this.trackEnd);
      }
    };
    let Xn = Ye;
    (Xn.deprecatedWarning1 = !1), (Xn.deprecatedWarning2 = !1);
    const ds = class {
      constructor(t) {
        (this.objects = []), (this.drainDisabled = !1), (this.animState = t);
      }
      start(t) {
        this.objects.push(Gt.start),
          this.objects.push(t),
          (this.animState.animationsChanged = !0);
      }
      interrupt(t) {
        this.objects.push(Gt.interrupt), this.objects.push(t);
      }
      end(t) {
        this.objects.push(Gt.end),
          this.objects.push(t),
          (this.animState.animationsChanged = !0);
      }
      dispose(t) {
        this.objects.push(Gt.dispose), this.objects.push(t);
      }
      complete(t) {
        this.objects.push(Gt.complete), this.objects.push(t);
      }
      event(t, n) {
        this.objects.push(Gt.event), this.objects.push(t), this.objects.push(n);
      }
      deprecateStuff() {
        return (
          ds.deprecatedWarning1 ||
            ((ds.deprecatedWarning1 = !0),
            console.warn(
              "Spine Deprecation Warning: onComplete, onStart, onEnd, onEvent art deprecated, please use listeners from now on. 'state.addListener({ complete: function(track, event) { } })'"
            )),
          !0
        );
      }
      drain() {
        if (this.drainDisabled) return;
        this.drainDisabled = !0;
        const t = this.objects,
          n = this.animState.listeners;
        for (let e = 0; e < t.length; e += 2) {
          const i = t[e],
            r = t[e + 1];
          switch (i) {
            case Gt.start:
              r.listener != null && r.listener.start && r.listener.start(r);
              for (let s = 0; s < n.length; s++) n[s].start && n[s].start(r);
              r.onStart && this.deprecateStuff() && r.onStart(r.trackIndex),
                this.animState.onStart &&
                  this.deprecateStuff() &&
                  this.deprecateStuff &&
                  this.animState.onStart(r.trackIndex);
              break;
            case Gt.interrupt:
              r.listener != null &&
                r.listener.interrupt &&
                r.listener.interrupt(r);
              for (let s = 0; s < n.length; s++)
                n[s].interrupt && n[s].interrupt(r);
              break;
            case Gt.end:
              r.listener != null && r.listener.end && r.listener.end(r);
              for (let s = 0; s < n.length; s++) n[s].end && n[s].end(r);
              r.onEnd && this.deprecateStuff() && r.onEnd(r.trackIndex),
                this.animState.onEnd &&
                  this.deprecateStuff() &&
                  this.animState.onEnd(r.trackIndex);
            case Gt.dispose:
              r.listener != null && r.listener.dispose && r.listener.dispose(r);
              for (let s = 0; s < n.length; s++)
                n[s].dispose && n[s].dispose(r);
              this.animState.trackEntryPool.free(r);
              break;
            case Gt.complete:
              r.listener != null &&
                r.listener.complete &&
                r.listener.complete(r);
              for (let s = 0; s < n.length; s++)
                n[s].complete && n[s].complete(r);
              const h = C.toInt(r.loopsCount());
              r.onComplete &&
                this.deprecateStuff() &&
                r.onComplete(r.trackIndex, h),
                this.animState.onComplete &&
                  this.deprecateStuff() &&
                  this.animState.onComplete(r.trackIndex, h);
              break;
            case Gt.event:
              const l = t[e++ + 2];
              r.listener != null && r.listener.event && r.listener.event(r, l);
              for (let s = 0; s < n.length; s++) n[s].event && n[s].event(r, l);
              r.onEvent && this.deprecateStuff() && r.onEvent(r.trackIndex, l),
                this.animState.onEvent &&
                  this.deprecateStuff() &&
                  this.animState.onEvent(r.trackIndex, l);
              break;
          }
        }
        this.clear(), (this.drainDisabled = !1);
      }
      clear() {
        this.objects.length = 0;
      }
    };
    let fs = ds;
    fs.deprecatedWarning1 = !1;
    var Gt = ((c) => (
      (c[(c.start = 0)] = "start"),
      (c[(c.interrupt = 1)] = "interrupt"),
      (c[(c.end = 2)] = "end"),
      (c[(c.dispose = 3)] = "dispose"),
      (c[(c.complete = 4)] = "complete"),
      (c[(c.event = 5)] = "event"),
      c
    ))(Gt || {});
    let Pr = class {
      start(t) {}
      interrupt(t) {}
      end(t) {}
      dispose(t) {}
      complete(t) {}
      event(t, n) {}
    };
    const us = class {
      constructor(t) {
        if (((this.animationToMixTime = {}), (this.defaultMix = 0), t == null))
          throw new Error("skeletonData cannot be null.");
        this.skeletonData = t;
      }
      setMix(t, n, e) {
        const i = this.skeletonData.findAnimation(t);
        if (i == null) throw new Error(`Animation not found: ${t}`);
        const r = this.skeletonData.findAnimation(n);
        if (r == null) throw new Error(`Animation not found: ${n}`);
        this.setMixWith(i, r, e);
      }
      setMixByName(t, n, e) {
        us.deprecatedWarning1 ||
          ((us.deprecatedWarning1 = !0),
          console.warn(
            "Deprecation Warning: AnimationStateData.setMixByName is deprecated, please use setMix from now on."
          )),
          this.setMix(t, n, e);
      }
      setMixWith(t, n, e) {
        if (t == null) throw new Error("from cannot be null.");
        if (n == null) throw new Error("to cannot be null.");
        const i = `${t.name}.${n.name}`;
        this.animationToMixTime[i] = e;
      }
      getMix(t, n) {
        const e = `${t.name}.${n.name}`,
          i = this.animationToMixTime[e];
        return i === void 0 ? this.defaultMix : i;
      }
    };
    let ms = us;
    ms.deprecatedWarning1 = !1;
    let gs = class {
        constructor(t) {
          this.atlas = t;
        }
        newRegionAttachment(t, n, e) {
          const i = this.atlas.findRegion(e);
          if (i == null)
            throw new Error(
              `Region not found in atlas: ${e} (region attachment: ${n})`
            );
          const r = new Q(n);
          return (r.region = i), r;
        }
        newMeshAttachment(t, n, e) {
          const i = this.atlas.findRegion(e);
          if (i == null)
            throw new Error(
              `Region not found in atlas: ${e} (mesh attachment: ${n})`
            );
          const r = new mn(n);
          return (r.region = i), r;
        }
        newBoundingBoxAttachment(t, n) {
          return new as(n);
        }
        newPathAttachment(t, n) {
          return new gn(n);
        }
        newPointAttachment(t, n) {
          return new ls(n);
        }
        newClippingAttachment(t, n) {
          return new os(n);
        }
      },
      xs = class {
        constructor(t, n, e) {
          if (
            ((this.matrix = new H.Matrix()),
            (this.children = new Array()),
            (this.x = 0),
            (this.y = 0),
            (this.rotation = 0),
            (this.scaleX = 0),
            (this.scaleY = 0),
            (this.shearX = 0),
            (this.shearY = 0),
            (this.ax = 0),
            (this.ay = 0),
            (this.arotation = 0),
            (this.ascaleX = 0),
            (this.ascaleY = 0),
            (this.ashearX = 0),
            (this.ashearY = 0),
            (this.appliedValid = !1),
            (this.sorted = !1),
            (this.active = !1),
            t == null)
          )
            throw new Error("data cannot be null.");
          if (n == null) throw new Error("skeleton cannot be null.");
          (this.data = t),
            (this.skeleton = n),
            (this.parent = e),
            this.setToSetupPose();
        }
        get worldX() {
          return this.matrix.tx;
        }
        get worldY() {
          return this.matrix.ty;
        }
        isActive() {
          return this.active;
        }
        update() {
          this.updateWorldTransformWith(
            this.x,
            this.y,
            this.rotation,
            this.scaleX,
            this.scaleY,
            this.shearX,
            this.shearY
          );
        }
        updateWorldTransform() {
          this.updateWorldTransformWith(
            this.x,
            this.y,
            this.rotation,
            this.scaleX,
            this.scaleY,
            this.shearX,
            this.shearY
          );
        }
        updateWorldTransformWith(t, n, e, i, r, h, l) {
          (this.ax = t),
            (this.ay = n),
            (this.arotation = e),
            (this.ascaleX = i),
            (this.ascaleY = r),
            (this.ashearX = h),
            (this.ashearY = l),
            (this.appliedValid = !0);
          const s = this.parent,
            a = this.matrix,
            o = this.skeleton.scaleX,
            d = zt.yDown ? -this.skeleton.scaleY : this.skeleton.scaleY;
          if (s == null) {
            const x = this.skeleton,
              E = e + 90 + l;
            (a.a = C.cosDeg(e + h) * i * o),
              (a.c = C.cosDeg(E) * r * o),
              (a.b = C.sinDeg(e + h) * i * d),
              (a.d = C.sinDeg(E) * r * d),
              (a.tx = t * o + x.x),
              (a.ty = n * d + x.y);
            return;
          }
          let f = s.matrix.a,
            u = s.matrix.c,
            m = s.matrix.b,
            g = s.matrix.d;
          switch (
            ((a.tx = f * t + u * n + s.matrix.tx),
            (a.ty = m * t + g * n + s.matrix.ty),
            this.data.transformMode)
          ) {
            case j.Normal: {
              const x = e + 90 + l,
                E = C.cosDeg(e + h) * i,
                w = C.cosDeg(x) * r,
                b = C.sinDeg(e + h) * i,
                p = C.sinDeg(x) * r;
              (a.a = f * E + u * b),
                (a.c = f * w + u * p),
                (a.b = m * E + g * b),
                (a.d = m * w + g * p);
              return;
            }
            case j.OnlyTranslation: {
              const x = e + 90 + l;
              (a.a = C.cosDeg(e + h) * i),
                (a.c = C.cosDeg(x) * r),
                (a.b = C.sinDeg(e + h) * i),
                (a.d = C.sinDeg(x) * r);
              break;
            }
            case j.NoRotationOrReflection: {
              let x = f * f + m * m,
                E = 0;
              x > 1e-4
                ? ((x = Math.abs(f * g - u * m) / x),
                  (f /= this.skeleton.scaleX),
                  (m /= this.skeleton.scaleY),
                  (u = m * x),
                  (g = f * x),
                  (E = Math.atan2(m, f) * C.radDeg))
                : ((f = 0), (m = 0), (E = 90 - Math.atan2(g, u) * C.radDeg));
              const w = e + h - E,
                b = e + l - E + 90,
                p = C.cosDeg(w) * i,
                S = C.cosDeg(b) * r,
                y = C.sinDeg(w) * i,
                M = C.sinDeg(b) * r;
              (a.a = f * p - u * y),
                (a.c = f * S - u * M),
                (a.b = m * p + g * y),
                (a.d = m * S + g * M);
              break;
            }
            case j.NoScale:
            case j.NoScaleOrReflection: {
              const x = C.cosDeg(e),
                E = C.sinDeg(e);
              let w = (f * x + u * E) / o,
                b = (m * x + g * E) / d,
                p = Math.sqrt(w * w + b * b);
              p > 1e-5 && (p = 1 / p),
                (w *= p),
                (b *= p),
                (p = Math.sqrt(w * w + b * b)),
                this.data.transformMode == j.NoScale &&
                  f * g - u * m < 0 !=
                    (zt.yDown
                      ? this.skeleton.scaleX < 0 != this.skeleton.scaleY > 0
                      : this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0) &&
                  (p = -p);
              const S = Math.PI / 2 + Math.atan2(b, w),
                y = Math.cos(S) * p,
                M = Math.sin(S) * p,
                T = C.cosDeg(h) * i,
                k = C.cosDeg(90 + l) * r,
                I = C.sinDeg(h) * i,
                R = C.sinDeg(90 + l) * r;
              (a.a = w * T + y * I),
                (a.c = w * k + y * R),
                (a.b = b * T + M * I),
                (a.d = b * k + M * R);
              break;
            }
          }
          (a.a *= o), (a.c *= o), (a.b *= d), (a.d *= d);
        }
        setToSetupPose() {
          const t = this.data;
          (this.x = t.x),
            (this.y = t.y),
            (this.rotation = t.rotation),
            (this.scaleX = t.scaleX),
            (this.scaleY = t.scaleY),
            (this.shearX = t.shearX),
            (this.shearY = t.shearY);
        }
        getWorldRotationX() {
          return Math.atan2(this.matrix.b, this.matrix.a) * C.radDeg;
        }
        getWorldRotationY() {
          return Math.atan2(this.matrix.d, this.matrix.c) * C.radDeg;
        }
        getWorldScaleX() {
          const t = this.matrix;
          return Math.sqrt(t.a * t.a + t.c * t.c);
        }
        getWorldScaleY() {
          const t = this.matrix;
          return Math.sqrt(t.b * t.b + t.d * t.d);
        }
        updateAppliedTransform() {
          this.appliedValid = !0;
          const t = this.parent,
            n = this.matrix;
          if (t == null) {
            (this.ax = n.tx),
              (this.ay = n.ty),
              (this.arotation = Math.atan2(n.b, n.a) * C.radDeg),
              (this.ascaleX = Math.sqrt(n.a * n.a + n.b * n.b)),
              (this.ascaleY = Math.sqrt(n.c * n.c + n.d * n.d)),
              (this.ashearX = 0),
              (this.ashearY =
                Math.atan2(n.a * n.c + n.b * n.d, n.a * n.d - n.b * n.c) *
                C.radDeg);
            return;
          }
          const e = t.matrix,
            i = 1 / (e.a * e.d - e.b * e.c),
            r = n.tx - e.tx,
            h = n.ty - e.ty;
          (this.ax = r * e.d * i - h * e.c * i),
            (this.ay = h * e.a * i - r * e.b * i);
          const l = i * e.d,
            s = i * e.a,
            a = i * e.c,
            o = i * e.b,
            d = l * n.a - a * n.b,
            f = l * n.c - a * n.d,
            u = s * n.b - o * n.a,
            m = s * n.d - o * n.c;
          if (
            ((this.ashearX = 0),
            (this.ascaleX = Math.sqrt(d * d + u * u)),
            this.ascaleX > 1e-4)
          ) {
            const g = d * m - f * u;
            (this.ascaleY = g / this.ascaleX),
              (this.ashearY = Math.atan2(d * f + u * m, g) * C.radDeg),
              (this.arotation = Math.atan2(u, d) * C.radDeg);
          } else
            (this.ascaleX = 0),
              (this.ascaleY = Math.sqrt(f * f + m * m)),
              (this.ashearY = 0),
              (this.arotation = 90 - Math.atan2(m, f) * C.radDeg);
        }
        worldToLocal(t) {
          const n = this.matrix,
            e = n.a,
            i = n.c,
            r = n.b,
            h = n.d,
            l = 1 / (e * h - i * r),
            s = t.x - n.tx,
            a = t.y - n.ty;
          return (
            (t.x = s * h * l - a * i * l), (t.y = a * e * l - s * r * l), t
          );
        }
        localToWorld(t) {
          const n = this.matrix,
            e = t.x,
            i = t.y;
          return (
            (t.x = e * n.a + i * n.c + n.tx),
            (t.y = e * n.b + i * n.d + n.ty),
            t
          );
        }
        worldToLocalRotation(t) {
          const n = C.sinDeg(t),
            e = C.cosDeg(t),
            i = this.matrix;
          return Math.atan2(i.a * n - i.b * e, i.d * e - i.c * n) * C.radDeg;
        }
        localToWorldRotation(t) {
          const n = C.sinDeg(t),
            e = C.cosDeg(t),
            i = this.matrix;
          return Math.atan2(e * i.b + n * i.d, e * i.a + n * i.c) * C.radDeg;
        }
        rotateWorld(t) {
          const n = this.matrix,
            e = n.a,
            i = n.c,
            r = n.b,
            h = n.d,
            l = C.cosDeg(t),
            s = C.sinDeg(t);
          (n.a = l * e - s * r),
            (n.c = l * i - s * h),
            (n.b = s * e + l * r),
            (n.d = s * i + l * h),
            (this.appliedValid = !1);
        }
      },
      ps = class {
        constructor(t, n, e) {
          if (
            ((this.x = 0),
            (this.y = 0),
            (this.rotation = 0),
            (this.scaleX = 1),
            (this.scaleY = 1),
            (this.shearX = 0),
            (this.shearY = 0),
            (this.transformMode = j.Normal),
            (this.skinRequired = !1),
            (this.color = new _()),
            t < 0)
          )
            throw new Error("index must be >= 0.");
          if (n == null) throw new Error("name cannot be null.");
          (this.index = t), (this.name = n), (this.parent = e);
        }
      },
      Nn = class {
        constructor(t, n, e) {
          (this.name = t), (this.order = n), (this.skinRequired = e);
        }
      },
      ws = class {
        constructor(t, n) {
          if (n == null) throw new Error("data cannot be null.");
          (this.time = t), (this.data = n);
        }
      },
      bs = class {
        constructor(t) {
          this.name = t;
        }
      },
      Fi = class {
        constructor(t, n) {
          if (
            ((this.bendDirection = 0),
            (this.compress = !1),
            (this.stretch = !1),
            (this.mix = 1),
            (this.softness = 0),
            (this.active = !1),
            t == null)
          )
            throw new Error("data cannot be null.");
          if (n == null) throw new Error("skeleton cannot be null.");
          (this.data = t),
            (this.mix = t.mix),
            (this.softness = t.softness),
            (this.bendDirection = t.bendDirection),
            (this.compress = t.compress),
            (this.stretch = t.stretch),
            (this.bones = new Array());
          for (let e = 0; e < t.bones.length; e++)
            this.bones.push(n.findBone(t.bones[e].name));
          this.target = n.findBone(t.target.name);
        }
        isActive() {
          return this.active;
        }
        apply() {
          this.update();
        }
        update() {
          const t = this.target,
            n = this.bones;
          switch (n.length) {
            case 1:
              this.apply1(
                n[0],
                t.worldX,
                t.worldY,
                this.compress,
                this.stretch,
                this.data.uniform,
                this.mix
              );
              break;
            case 2:
              this.apply2(
                n[0],
                n[1],
                t.worldX,
                t.worldY,
                this.bendDirection,
                this.stretch,
                this.softness,
                this.mix
              );
              break;
          }
        }
        apply1(t, n, e, i, r, h, l) {
          t.appliedValid || t.updateAppliedTransform();
          const s = t.parent.matrix,
            a = s.a;
          let o = s.c;
          const d = s.b;
          let f = s.d,
            u = -t.ashearX - t.arotation,
            m = 0,
            g = 0;
          switch (t.data.transformMode) {
            case j.OnlyTranslation:
              (m = n - t.worldX), (g = e - t.worldY);
              break;
            case j.NoRotationOrReflection:
              const w = Math.abs(a * f - o * d) / (a * a + d * d),
                b = a / t.skeleton.scaleX,
                p = d / t.skeleton.scaleY;
              (o = -p * w * t.skeleton.scaleX),
                (f = b * w * t.skeleton.scaleY),
                (u += Math.atan2(p, b) * C.radDeg);
            default:
              const S = n - s.tx,
                y = e - s.ty,
                M = a * f - o * d;
              (m = (S * f - y * o) / M - t.ax),
                (g = (y * a - S * d) / M - t.ay);
          }
          (u += Math.atan2(g, m) * C.radDeg),
            t.ascaleX < 0 && (u += 180),
            u > 180 ? (u -= 360) : u < -180 && (u += 360);
          let x = t.ascaleX,
            E = t.ascaleY;
          if (i || r) {
            switch (t.data.transformMode) {
              case j.NoScale:
              case j.NoScaleOrReflection:
                (m = n - t.worldX), (g = e - t.worldY);
            }
            const w = t.data.length * x,
              b = Math.sqrt(m * m + g * g);
            if ((i && b < w) || (r && b > w && w > 1e-4)) {
              const p = (b / w - 1) * l + 1;
              (x *= p), h && (E *= p);
            }
          }
          t.updateWorldTransformWith(
            t.ax,
            t.ay,
            t.arotation + u * l,
            x,
            E,
            t.ashearX,
            t.ashearY
          );
        }
        apply2(t, n, e, i, r, h, l, s) {
          if (s == 0) {
            n.updateWorldTransform();
            return;
          }
          t.appliedValid || t.updateAppliedTransform(),
            n.appliedValid || n.updateAppliedTransform();
          const a = t.ax,
            o = t.ay;
          let d = t.ascaleX,
            f = d,
            u = t.ascaleY,
            m = n.ascaleX;
          const g = t.matrix;
          let x = 0,
            E = 0,
            w = 0;
          d < 0 ? ((d = -d), (x = 180), (w = -1)) : ((x = 0), (w = 1)),
            u < 0 && ((u = -u), (w = -w)),
            m < 0 ? ((m = -m), (E = 180)) : (E = 0);
          const b = n.ax;
          let p = 0,
            S = 0,
            y = 0,
            M = g.a,
            T = g.c,
            k = g.b,
            I = g.d;
          const R = Math.abs(d - u) <= 1e-4;
          R
            ? ((p = n.ay),
              (S = M * b + T * p + g.tx),
              (y = k * b + I * p + g.ty))
            : ((p = 0), (S = M * b + g.tx), (y = k * b + g.ty));
          const V = t.parent.matrix;
          (M = V.a), (T = V.c), (k = V.b), (I = V.d);
          const F = 1 / (M * I - T * k);
          let B = S - V.tx,
            Y = y - V.ty;
          const N = (B * I - Y * T) * F - a,
            q = (Y * M - B * k) * F - o,
            z = Math.sqrt(N * N + q * q);
          let D = n.data.length * m,
            X,
            L;
          if (z < 1e-4) {
            this.apply1(t, e, i, !1, h, !1, s),
              n.updateWorldTransformWith(
                b,
                p,
                0,
                n.ascaleX,
                n.ascaleY,
                n.ashearX,
                n.ashearY
              );
            return;
          }
          (B = e - V.tx), (Y = i - V.ty);
          let O = (B * I - Y * T) * F - a,
            W = (Y * M - B * k) * F - o,
            U = O * O + W * W;
          if (l != 0) {
            l *= (d * (m + 1)) / 2;
            const lt = Math.sqrt(U),
              It = lt - z - D * d + l;
            if (It > 0) {
              let ct = Math.min(1, It / (l * 2)) - 1;
              (ct = (It - l * (1 - ct * ct)) / lt),
                (O -= ct * O),
                (W -= ct * W),
                (U = O * O + W * W);
            }
          }
          t: if (R) {
            D *= d;
            let lt = (U - z * z - D * D) / (2 * z * D);
            lt < -1
              ? (lt = -1)
              : lt > 1 &&
                ((lt = 1), h && (f *= (Math.sqrt(U) / (z + D) - 1) * s + 1)),
              (L = Math.acos(lt) * r),
              (M = z + D * lt),
              (T = D * Math.sin(L)),
              (X = Math.atan2(W * M - O * T, O * M + W * T));
          } else {
            (M = d * D), (T = u * D);
            const lt = M * M,
              It = T * T,
              ct = Math.atan2(W, O);
            k = It * z * z + lt * U - lt * It;
            const Xt = -2 * It * z,
              Ut = It - lt;
            if (((I = Xt * Xt - 4 * Ut * k), I >= 0)) {
              let ae = Math.sqrt(I);
              Xt < 0 && (ae = -ae), (ae = -(Xt + ae) / 2);
              const Ke = ae / Ut,
                Nt = k / ae,
                We = Math.abs(Ke) < Math.abs(Nt) ? Ke : Nt;
              if (We * We <= U) {
                (Y = Math.sqrt(U - We * We) * r),
                  (X = ct - Math.atan2(Y, We)),
                  (L = Math.atan2(Y / u, (We - z) / d));
                break t;
              }
            }
            let de = C.PI,
              Me = z - M,
              Oe = Me * Me,
              Ve = 0,
              Ae = 0,
              Ce = z + M,
              $e = Ce * Ce,
              Kt = 0;
            (k = (-M * z) / (lt - It)),
              k >= -1 &&
                k <= 1 &&
                ((k = Math.acos(k)),
                (B = M * Math.cos(k) + z),
                (Y = T * Math.sin(k)),
                (I = B * B + Y * Y),
                I < Oe && ((de = k), (Oe = I), (Me = B), (Ve = Y)),
                I > $e && ((Ae = k), ($e = I), (Ce = B), (Kt = Y))),
              U <= (Oe + $e) / 2
                ? ((X = ct - Math.atan2(Ve * r, Me)), (L = de * r))
                : ((X = ct - Math.atan2(Kt * r, Ce)), (L = Ae * r));
          }
          const $ = Math.atan2(p, b) * w;
          let G = t.arotation;
          (X = (X - $) * C.radDeg + x - G),
            X > 180 ? (X -= 360) : X < -180 && (X += 360),
            t.updateWorldTransformWith(a, o, G + X * s, f, t.ascaleY, 0, 0),
            (G = n.arotation),
            (L = ((L + $) * C.radDeg - n.ashearX) * w + E - G),
            L > 180 ? (L -= 360) : L < -180 && (L += 360),
            n.updateWorldTransformWith(
              b,
              p,
              G + L * s,
              n.ascaleX,
              n.ascaleY,
              n.ashearX,
              n.ashearY
            );
        }
      },
      Es = class extends Nn {
        constructor(t) {
          super(t, 0, !1),
            (this.bones = new Array()),
            (this.bendDirection = 1),
            (this.compress = !1),
            (this.stretch = !1),
            (this.uniform = !1),
            (this.mix = 1),
            (this.softness = 0);
        }
      },
      Ss = class extends Nn {
        constructor(t) {
          super(t, 0, !1), (this.bones = new Array());
        }
      };
    var vt = ((c) => (
      (c[(c.Length = 0)] = "Length"),
      (c[(c.Fixed = 1)] = "Fixed"),
      (c[(c.Percent = 2)] = "Percent"),
      c
    ))(vt || {});
    const nn = class {
      constructor(t, n) {
        if (
          ((this.position = 0),
          (this.spacing = 0),
          (this.rotateMix = 0),
          (this.translateMix = 0),
          (this.spaces = new Array()),
          (this.positions = new Array()),
          (this.world = new Array()),
          (this.curves = new Array()),
          (this.lengths = new Array()),
          (this.segments = new Array()),
          (this.active = !1),
          t == null)
        )
          throw new Error("data cannot be null.");
        if (n == null) throw new Error("skeleton cannot be null.");
        (this.data = t), (this.bones = new Array());
        for (let e = 0, i = t.bones.length; e < i; e++)
          this.bones.push(n.findBone(t.bones[e].name));
        (this.target = n.findSlot(t.target.name)),
          (this.position = t.position),
          (this.spacing = t.spacing),
          (this.rotateMix = t.rotateMix),
          (this.translateMix = t.translateMix);
      }
      isActive() {
        return this.active;
      }
      apply() {
        this.update();
      }
      update() {
        const t = this.target.getAttachment();
        if (!(t instanceof gn)) return;
        const n = this.rotateMix,
          e = this.translateMix,
          i = e > 0,
          r = n > 0;
        if (!i && !r) return;
        const h = this.data,
          l = h.spacingMode,
          s = l == vt.Length,
          a = h.rotateMode,
          o = a == pt.Tangent,
          d = a == pt.ChainScale,
          f = this.bones.length,
          u = o ? f : f + 1,
          m = this.bones,
          g = v.setArraySize(this.spaces, u);
        let x = null;
        const E = this.spacing;
        if (d || s) {
          d && (x = v.setArraySize(this.lengths, f));
          for (let M = 0, T = u - 1; M < T; ) {
            const k = m[M],
              I = k.data.length;
            if (I < nn.epsilon) d && (x[M] = 0), (g[++M] = 0);
            else {
              const R = I * k.matrix.a,
                V = I * k.matrix.b,
                F = Math.sqrt(R * R + V * V);
              d && (x[M] = F), (g[++M] = ((s ? I + E : E) * F) / I);
            }
          }
        } else for (let M = 1; M < u; M++) g[M] = E;
        const w = this.computeWorldPositions(
          t,
          u,
          o,
          h.positionMode == dt.Percent,
          l == vt.Percent
        );
        let b = w[0],
          p = w[1],
          S = h.offsetRotation,
          y = !1;
        if (S == 0) y = a == pt.Chain;
        else {
          y = !1;
          const M = this.target.bone.matrix;
          S *= M.a * M.d - M.b * M.c > 0 ? C.degRad : -C.degRad;
        }
        for (let M = 0, T = 3; M < f; M++, T += 3) {
          const k = m[M],
            I = k.matrix;
          (I.tx += (b - I.tx) * e), (I.ty += (p - I.ty) * e);
          const R = w[T],
            V = w[T + 1],
            F = R - b,
            B = V - p;
          if (d) {
            const Y = x[M];
            if (Y != 0) {
              const N = (Math.sqrt(F * F + B * B) / Y - 1) * n + 1;
              (I.a *= N), (I.b *= N);
            }
          }
          if (((b = R), (p = V), r)) {
            const Y = I.a,
              N = I.c,
              q = I.b,
              z = I.d;
            let D = 0,
              X = 0,
              L = 0;
            if (
              (o &&
                (o
                  ? (D = w[T - 1])
                  : g[M + 1] == 0
                  ? (D = w[T + 2])
                  : (D = Math.atan2(B, F))),
              (D -= Math.atan2(q, Y)),
              y)
            ) {
              (X = Math.cos(D)), (L = Math.sin(D));
              const O = k.data.length;
              (b += (O * (X * Y - L * q) - F) * n),
                (p += (O * (L * Y + X * q) - B) * n);
            } else D += S;
            D > C.PI ? (D -= C.PI2) : D < -C.PI && (D += C.PI2),
              (D *= n),
              (X = Math.cos(D)),
              (L = Math.sin(D)),
              (I.a = X * Y - L * q),
              (I.c = X * N - L * z),
              (I.b = L * Y + X * q),
              (I.d = L * N + X * z);
          }
          k.appliedValid = !1;
        }
      }
      computeWorldPositions(t, n, e, i, r) {
        const h = this.target;
        let l = this.position;
        const s = this.spaces,
          a = v.setArraySize(this.positions, n * 3 + 2);
        let o = null;
        const d = t.closed;
        let f = t.worldVerticesLength,
          u = f / 6,
          m = nn.NONE;
        if (!t.constantSpeed) {
          const D = t.lengths;
          u -= d ? 1 : 2;
          const X = D[u];
          if ((i && (l *= X), r)) for (let L = 0; L < n; L++) s[L] *= X;
          o = v.setArraySize(this.world, 8);
          for (let L = 0, O = 0, W = 0; L < n; L++, O += 3) {
            const U = s[L];
            l += U;
            let $ = l;
            if (d) ($ %= X), $ < 0 && ($ += X), (W = 0);
            else if ($ < 0) {
              m != nn.BEFORE &&
                ((m = nn.BEFORE), t.computeWorldVertices(h, 2, 4, o, 0, 2)),
                this.addBeforePosition($, o, 0, a, O);
              continue;
            } else if ($ > X) {
              m != nn.AFTER &&
                ((m = nn.AFTER), t.computeWorldVertices(h, f - 6, 4, o, 0, 2)),
                this.addAfterPosition($ - X, o, 0, a, O);
              continue;
            }
            for (; ; W++) {
              const G = D[W];
              if (!($ > G)) {
                if (W == 0) $ /= G;
                else {
                  const lt = D[W - 1];
                  $ = ($ - lt) / (G - lt);
                }
                break;
              }
            }
            W != m &&
              ((m = W),
              d && W == u
                ? (t.computeWorldVertices(h, f - 4, 4, o, 0, 2),
                  t.computeWorldVertices(h, 0, 4, o, 4, 2))
                : t.computeWorldVertices(h, W * 6 + 2, 8, o, 0, 2)),
              this.addCurvePosition(
                $,
                o[0],
                o[1],
                o[2],
                o[3],
                o[4],
                o[5],
                o[6],
                o[7],
                a,
                O,
                e || (L > 0 && U == 0)
              );
          }
          return a;
        }
        d
          ? ((f += 2),
            (o = v.setArraySize(this.world, f)),
            t.computeWorldVertices(h, 2, f - 4, o, 0, 2),
            t.computeWorldVertices(h, 0, 2, o, f - 4, 2),
            (o[f - 2] = o[0]),
            (o[f - 1] = o[1]))
          : (u--,
            (f -= 4),
            (o = v.setArraySize(this.world, f)),
            t.computeWorldVertices(h, 2, f, o, 0, 2));
        const g = v.setArraySize(this.curves, u);
        let x = 0,
          E = o[0],
          w = o[1],
          b = 0,
          p = 0,
          S = 0,
          y = 0,
          M = 0,
          T = 0,
          k = 0,
          I = 0,
          R = 0,
          V = 0,
          F = 0,
          B = 0,
          Y = 0,
          N = 0;
        for (let D = 0, X = 2; D < u; D++, X += 6)
          (b = o[X]),
            (p = o[X + 1]),
            (S = o[X + 2]),
            (y = o[X + 3]),
            (M = o[X + 4]),
            (T = o[X + 5]),
            (k = (E - b * 2 + S) * 0.1875),
            (I = (w - p * 2 + y) * 0.1875),
            (R = ((b - S) * 3 - E + M) * 0.09375),
            (V = ((p - y) * 3 - w + T) * 0.09375),
            (F = k * 2 + R),
            (B = I * 2 + V),
            (Y = (b - E) * 0.75 + k + R * 0.16666667),
            (N = (p - w) * 0.75 + I + V * 0.16666667),
            (x += Math.sqrt(Y * Y + N * N)),
            (Y += F),
            (N += B),
            (F += R),
            (B += V),
            (x += Math.sqrt(Y * Y + N * N)),
            (Y += F),
            (N += B),
            (x += Math.sqrt(Y * Y + N * N)),
            (Y += F + R),
            (N += B + V),
            (x += Math.sqrt(Y * Y + N * N)),
            (g[D] = x),
            (E = M),
            (w = T);
        if ((i && (l *= x), r)) for (let D = 0; D < n; D++) s[D] *= x;
        const q = this.segments;
        let z = 0;
        for (let D = 0, X = 0, L = 0, O = 0; D < n; D++, X += 3) {
          const W = s[D];
          l += W;
          let U = l;
          if (d) (U %= x), U < 0 && (U += x), (L = 0);
          else if (U < 0) {
            this.addBeforePosition(U, o, 0, a, X);
            continue;
          } else if (U > x) {
            this.addAfterPosition(U - x, o, f - 4, a, X);
            continue;
          }
          for (; ; L++) {
            const $ = g[L];
            if (!(U > $)) {
              if (L == 0) U /= $;
              else {
                const G = g[L - 1];
                U = (U - G) / ($ - G);
              }
              break;
            }
          }
          if (L != m) {
            m = L;
            let $ = L * 6;
            for (
              E = o[$],
                w = o[$ + 1],
                b = o[$ + 2],
                p = o[$ + 3],
                S = o[$ + 4],
                y = o[$ + 5],
                M = o[$ + 6],
                T = o[$ + 7],
                k = (E - b * 2 + S) * 0.03,
                I = (w - p * 2 + y) * 0.03,
                R = ((b - S) * 3 - E + M) * 0.006,
                V = ((p - y) * 3 - w + T) * 0.006,
                F = k * 2 + R,
                B = I * 2 + V,
                Y = (b - E) * 0.3 + k + R * 0.16666667,
                N = (p - w) * 0.3 + I + V * 0.16666667,
                z = Math.sqrt(Y * Y + N * N),
                q[0] = z,
                $ = 1;
              $ < 8;
              $++
            )
              (Y += F),
                (N += B),
                (F += R),
                (B += V),
                (z += Math.sqrt(Y * Y + N * N)),
                (q[$] = z);
            (Y += F),
              (N += B),
              (z += Math.sqrt(Y * Y + N * N)),
              (q[8] = z),
              (Y += F + R),
              (N += B + V),
              (z += Math.sqrt(Y * Y + N * N)),
              (q[9] = z),
              (O = 0);
          }
          for (U *= z; ; O++) {
            const $ = q[O];
            if (!(U > $)) {
              if (O == 0) U /= $;
              else {
                const G = q[O - 1];
                U = O + (U - G) / ($ - G);
              }
              break;
            }
          }
          this.addCurvePosition(
            U * 0.1,
            E,
            w,
            b,
            p,
            S,
            y,
            M,
            T,
            a,
            X,
            e || (D > 0 && W == 0)
          );
        }
        return a;
      }
      addBeforePosition(t, n, e, i, r) {
        const h = n[e],
          l = n[e + 1],
          s = n[e + 2] - h,
          a = n[e + 3] - l,
          o = Math.atan2(a, s);
        (i[r] = h + t * Math.cos(o)),
          (i[r + 1] = l + t * Math.sin(o)),
          (i[r + 2] = o);
      }
      addAfterPosition(t, n, e, i, r) {
        const h = n[e + 2],
          l = n[e + 3],
          s = h - n[e],
          a = l - n[e + 1],
          o = Math.atan2(a, s);
        (i[r] = h + t * Math.cos(o)),
          (i[r + 1] = l + t * Math.sin(o)),
          (i[r + 2] = o);
      }
      addCurvePosition(t, n, e, i, r, h, l, s, a, o, d, f) {
        (t == 0 || isNaN(t)) && (t = 1e-4);
        const u = t * t,
          m = u * t,
          g = 1 - t,
          x = g * g,
          E = x * g,
          w = g * t,
          b = w * 3,
          p = g * b,
          S = b * t,
          y = n * E + i * p + h * S + s * m,
          M = e * E + r * p + l * S + a * m;
        (o[d] = y),
          (o[d + 1] = M),
          f &&
            (o[d + 2] = Math.atan2(
              M - (e * x + r * w * 2 + l * u),
              y - (n * x + i * w * 2 + h * u)
            ));
      }
    };
    let pn = nn;
    (pn.NONE = -1), (pn.BEFORE = -2), (pn.AFTER = -3), (pn.epsilon = 1e-5);
    let Yi = class {
      constructor(t, n) {
        if (
          ((this.rotateMix = 0),
          (this.translateMix = 0),
          (this.scaleMix = 0),
          (this.shearMix = 0),
          (this.temp = new un()),
          (this.active = !1),
          t == null)
        )
          throw new Error("data cannot be null.");
        if (n == null) throw new Error("skeleton cannot be null.");
        (this.data = t),
          (this.rotateMix = t.rotateMix),
          (this.translateMix = t.translateMix),
          (this.scaleMix = t.scaleMix),
          (this.shearMix = t.shearMix),
          (this.bones = new Array());
        for (let e = 0; e < t.bones.length; e++)
          this.bones.push(n.findBone(t.bones[e].name));
        this.target = n.findBone(t.target.name);
      }
      isActive() {
        return this.active;
      }
      apply() {
        this.update();
      }
      update() {
        this.data.local
          ? this.data.relative
            ? this.applyRelativeLocal()
            : this.applyAbsoluteLocal()
          : this.data.relative
          ? this.applyRelativeWorld()
          : this.applyAbsoluteWorld();
      }
      applyAbsoluteWorld() {
        const t = this.rotateMix,
          n = this.translateMix,
          e = this.scaleMix,
          i = this.shearMix,
          r = this.target,
          h = r.matrix,
          l = h.a,
          s = h.c,
          a = h.b,
          o = h.d,
          d = l * o - s * a > 0 ? C.degRad : -C.degRad,
          f = this.data.offsetRotation * d,
          u = this.data.offsetShearY * d,
          m = this.bones;
        for (let g = 0, x = m.length; g < x; g++) {
          const E = m[g];
          let w = !1;
          const b = E.matrix;
          if (t != 0) {
            const p = b.a,
              S = b.c,
              y = b.b,
              M = b.d;
            let T = Math.atan2(a, l) - Math.atan2(y, p) + f;
            T > C.PI ? (T -= C.PI2) : T < -C.PI && (T += C.PI2), (T *= t);
            const k = Math.cos(T),
              I = Math.sin(T);
            (b.a = k * p - I * y),
              (b.c = k * S - I * M),
              (b.b = I * p + k * y),
              (b.d = I * S + k * M),
              (w = !0);
          }
          if (n != 0) {
            const p = this.temp;
            r.localToWorld(p.set(this.data.offsetX, this.data.offsetY)),
              (b.tx += (p.x - b.tx) * n),
              (b.ty += (p.y - b.ty) * n),
              (w = !0);
          }
          if (e > 0) {
            let p = Math.sqrt(b.a * b.a + b.b * b.b),
              S = Math.sqrt(l * l + a * a);
            p > 1e-5 && (p = (p + (S - p + this.data.offsetScaleX) * e) / p),
              (b.a *= p),
              (b.b *= p),
              (p = Math.sqrt(b.c * b.c + b.d * b.d)),
              (S = Math.sqrt(s * s + o * o)),
              p > 1e-5 && (p = (p + (S - p + this.data.offsetScaleY) * e) / p),
              (b.c *= p),
              (b.d *= p),
              (w = !0);
          }
          if (i > 0) {
            const p = b.c,
              S = b.d,
              y = Math.atan2(S, p);
            let M =
              Math.atan2(o, s) - Math.atan2(a, l) - (y - Math.atan2(b.b, b.a));
            M > C.PI ? (M -= C.PI2) : M < -C.PI && (M += C.PI2),
              (M = y + (M + u) * i);
            const T = Math.sqrt(p * p + S * S);
            (b.c = Math.cos(M) * T), (b.d = Math.sin(M) * T), (w = !0);
          }
          w && (E.appliedValid = !1);
        }
      }
      applyRelativeWorld() {
        const t = this.rotateMix,
          n = this.translateMix,
          e = this.scaleMix,
          i = this.shearMix,
          r = this.target,
          h = r.matrix,
          l = h.a,
          s = h.c,
          a = h.b,
          o = h.d,
          d = l * o - s * a > 0 ? C.degRad : -C.degRad,
          f = this.data.offsetRotation * d,
          u = this.data.offsetShearY * d,
          m = this.bones;
        for (let g = 0, x = m.length; g < x; g++) {
          const E = m[g];
          let w = !1;
          const b = E.matrix;
          if (t != 0) {
            const p = b.a,
              S = b.c,
              y = b.b,
              M = b.d;
            let T = Math.atan2(a, l) + f;
            T > C.PI ? (T -= C.PI2) : T < -C.PI && (T += C.PI2), (T *= t);
            const k = Math.cos(T),
              I = Math.sin(T);
            (b.a = k * p - I * y),
              (b.c = k * S - I * M),
              (b.b = I * p + k * y),
              (b.d = I * S + k * M),
              (w = !0);
          }
          if (n != 0) {
            const p = this.temp;
            r.localToWorld(p.set(this.data.offsetX, this.data.offsetY)),
              (b.tx += p.x * n),
              (b.ty += p.y * n),
              (w = !0);
          }
          if (e > 0) {
            let p =
              (Math.sqrt(l * l + a * a) - 1 + this.data.offsetScaleX) * e + 1;
            (b.a *= p),
              (b.b *= p),
              (p =
                (Math.sqrt(s * s + o * o) - 1 + this.data.offsetScaleY) * e +
                1),
              (b.c *= p),
              (b.d *= p),
              (w = !0);
          }
          if (i > 0) {
            let p = Math.atan2(o, s) - Math.atan2(a, l);
            p > C.PI ? (p -= C.PI2) : p < -C.PI && (p += C.PI2);
            const S = b.c,
              y = b.d;
            p = Math.atan2(y, S) + (p - C.PI / 2 + u) * i;
            const M = Math.sqrt(S * S + y * y);
            (b.c = Math.cos(p) * M), (b.d = Math.sin(p) * M), (w = !0);
          }
          w && (E.appliedValid = !1);
        }
      }
      applyAbsoluteLocal() {
        const t = this.rotateMix,
          n = this.translateMix,
          e = this.scaleMix,
          i = this.shearMix,
          r = this.target;
        r.appliedValid || r.updateAppliedTransform();
        const h = this.bones;
        for (let l = 0, s = h.length; l < s; l++) {
          const a = h[l];
          a.appliedValid || a.updateAppliedTransform();
          let o = a.arotation;
          if (t != 0) {
            let x = r.arotation - o + this.data.offsetRotation;
            (x -= (16384 - ((16384.499999999996 - x / 360) | 0)) * 360),
              (o += x * t);
          }
          let d = a.ax,
            f = a.ay;
          n != 0 &&
            ((d += (r.ax - d + this.data.offsetX) * n),
            (f += (r.ay - f + this.data.offsetY) * n));
          let u = a.ascaleX,
            m = a.ascaleY;
          e > 0 &&
            (u > 1e-5 &&
              (u = (u + (r.ascaleX - u + this.data.offsetScaleX) * e) / u),
            m > 1e-5 &&
              (m = (m + (r.ascaleY - m + this.data.offsetScaleY) * e) / m));
          const g = a.ashearY;
          if (i > 0) {
            let x = r.ashearY - g + this.data.offsetShearY;
            (x -= (16384 - ((16384.499999999996 - x / 360) | 0)) * 360),
              (a.shearY += x * i);
          }
          a.updateWorldTransformWith(d, f, o, u, m, a.ashearX, g);
        }
      }
      applyRelativeLocal() {
        const t = this.rotateMix,
          n = this.translateMix,
          e = this.scaleMix,
          i = this.shearMix,
          r = this.target;
        r.appliedValid || r.updateAppliedTransform();
        const h = this.bones;
        for (let l = 0, s = h.length; l < s; l++) {
          const a = h[l];
          a.appliedValid || a.updateAppliedTransform();
          let o = a.arotation;
          t != 0 && (o += (r.arotation + this.data.offsetRotation) * t);
          let d = a.ax,
            f = a.ay;
          n != 0 &&
            ((d += (r.ax + this.data.offsetX) * n),
            (f += (r.ay + this.data.offsetY) * n));
          let u = a.ascaleX,
            m = a.ascaleY;
          e > 0 &&
            (u > 1e-5 &&
              (u *= (r.ascaleX - 1 + this.data.offsetScaleX) * e + 1),
            m > 1e-5 &&
              (m *= (r.ascaleY - 1 + this.data.offsetScaleY) * e + 1));
          let g = a.ashearY;
          i > 0 && (g += (r.ashearY + this.data.offsetShearY) * i),
            a.updateWorldTransformWith(d, f, o, u, m, a.ashearX, g);
        }
      }
    };
    const Tn = class {
      constructor(t) {
        if (
          ((this._updateCache = new Array()),
          (this.updateCacheReset = new Array()),
          (this.time = 0),
          (this.scaleX = 1),
          (this.scaleY = 1),
          (this.x = 0),
          (this.y = 0),
          t == null)
        )
          throw new Error("data cannot be null.");
        (this.data = t), (this.bones = new Array());
        for (let n = 0; n < t.bones.length; n++) {
          const e = t.bones[n];
          let i;
          if (e.parent == null) i = new xs(e, this, null);
          else {
            const r = this.bones[e.parent.index];
            (i = new xs(e, this, r)), r.children.push(i);
          }
          this.bones.push(i);
        }
        (this.slots = new Array()), (this.drawOrder = new Array());
        for (let n = 0; n < t.slots.length; n++) {
          const e = t.slots[n],
            i = this.bones[e.boneData.index],
            r = new cs(e, i);
          this.slots.push(r), this.drawOrder.push(r);
        }
        this.ikConstraints = new Array();
        for (let n = 0; n < t.ikConstraints.length; n++) {
          const e = t.ikConstraints[n];
          this.ikConstraints.push(new Fi(e, this));
        }
        this.transformConstraints = new Array();
        for (let n = 0; n < t.transformConstraints.length; n++) {
          const e = t.transformConstraints[n];
          this.transformConstraints.push(new Yi(e, this));
        }
        this.pathConstraints = new Array();
        for (let n = 0; n < t.pathConstraints.length; n++) {
          const e = t.pathConstraints[n];
          this.pathConstraints.push(new pn(e, this));
        }
        (this.color = new _(1, 1, 1, 1)), this.updateCache();
      }
      updateCache() {
        const t = this._updateCache;
        (t.length = 0), (this.updateCacheReset.length = 0);
        const n = this.bones;
        for (let o = 0, d = n.length; o < d; o++) {
          const f = n[o];
          (f.sorted = f.data.skinRequired), (f.active = !f.sorted);
        }
        if (this.skin != null) {
          const o = this.skin.bones;
          for (let d = 0, f = this.skin.bones.length; d < f; d++) {
            let u = this.bones[o[d].index];
            do (u.sorted = !1), (u.active = !0), (u = u.parent);
            while (u != null);
          }
        }
        const e = this.ikConstraints,
          i = this.transformConstraints,
          r = this.pathConstraints,
          h = e.length,
          l = i.length,
          s = r.length,
          a = h + l + s;
        t: for (let o = 0; o < a; o++) {
          for (let d = 0; d < h; d++) {
            const f = e[d];
            if (f.data.order == o) {
              this.sortIkConstraint(f);
              continue t;
            }
          }
          for (let d = 0; d < l; d++) {
            const f = i[d];
            if (f.data.order == o) {
              this.sortTransformConstraint(f);
              continue t;
            }
          }
          for (let d = 0; d < s; d++) {
            const f = r[d];
            if (f.data.order == o) {
              this.sortPathConstraint(f);
              continue t;
            }
          }
        }
        for (let o = 0, d = n.length; o < d; o++) this.sortBone(n[o]);
      }
      sortIkConstraint(t) {
        if (
          ((t.active =
            t.target.isActive() &&
            (!t.data.skinRequired ||
              (this.skin != null &&
                v.contains(this.skin.constraints, t.data, !0)))),
          !t.active)
        )
          return;
        const n = t.target;
        this.sortBone(n);
        const e = t.bones,
          i = e[0];
        if ((this.sortBone(i), e.length > 1)) {
          const r = e[e.length - 1];
          this._updateCache.indexOf(r) > -1 || this.updateCacheReset.push(r);
        }
        this._updateCache.push(t),
          this.sortReset(i.children),
          (e[e.length - 1].sorted = !0);
      }
      sortPathConstraint(t) {
        if (
          ((t.active =
            t.target.bone.isActive() &&
            (!t.data.skinRequired ||
              (this.skin != null &&
                v.contains(this.skin.constraints, t.data, !0)))),
          !t.active)
        )
          return;
        const n = t.target,
          e = n.data.index,
          i = n.bone;
        this.skin != null && this.sortPathConstraintAttachment(this.skin, e, i),
          this.data.defaultSkin != null &&
            this.data.defaultSkin != this.skin &&
            this.sortPathConstraintAttachment(this.data.defaultSkin, e, i);
        for (let s = 0, a = this.data.skins.length; s < a; s++)
          this.sortPathConstraintAttachment(this.data.skins[s], e, i);
        const r = n.getAttachment();
        r instanceof gn && this.sortPathConstraintAttachmentWith(r, i);
        const h = t.bones,
          l = h.length;
        for (let s = 0; s < l; s++) this.sortBone(h[s]);
        this._updateCache.push(t);
        for (let s = 0; s < l; s++) this.sortReset(h[s].children);
        for (let s = 0; s < l; s++) h[s].sorted = !0;
      }
      sortTransformConstraint(t) {
        if (
          ((t.active =
            t.target.isActive() &&
            (!t.data.skinRequired ||
              (this.skin != null &&
                v.contains(this.skin.constraints, t.data, !0)))),
          !t.active)
        )
          return;
        this.sortBone(t.target);
        const n = t.bones,
          e = n.length;
        if (t.data.local)
          for (let i = 0; i < e; i++) {
            const r = n[i];
            this.sortBone(r.parent),
              this._updateCache.indexOf(r) > -1 ||
                this.updateCacheReset.push(r);
          }
        else for (let i = 0; i < e; i++) this.sortBone(n[i]);
        this._updateCache.push(t);
        for (let i = 0; i < e; i++) this.sortReset(n[i].children);
        for (let i = 0; i < e; i++) n[i].sorted = !0;
      }
      sortPathConstraintAttachment(t, n, e) {
        const i = t.attachments[n];
        if (i)
          for (const r in i) this.sortPathConstraintAttachmentWith(i[r], e);
      }
      sortPathConstraintAttachmentWith(t, n) {
        if (!(t instanceof gn)) return;
        const e = t.bones;
        if (e == null) this.sortBone(n);
        else {
          const i = this.bones;
          let r = 0;
          for (; r < e.length; ) {
            const h = e[r++];
            for (let l = r + h; r < l; r++) {
              const s = e[r];
              this.sortBone(i[s]);
            }
          }
        }
      }
      sortBone(t) {
        if (t.sorted) return;
        const n = t.parent;
        n != null && this.sortBone(n),
          (t.sorted = !0),
          this._updateCache.push(t);
      }
      sortReset(t) {
        for (let n = 0, e = t.length; n < e; n++) {
          const i = t[n];
          i.active && (i.sorted && this.sortReset(i.children), (i.sorted = !1));
        }
      }
      updateWorldTransform() {
        const t = this.updateCacheReset;
        for (let e = 0, i = t.length; e < i; e++) {
          const r = t[e];
          (r.ax = r.x),
            (r.ay = r.y),
            (r.arotation = r.rotation),
            (r.ascaleX = r.scaleX),
            (r.ascaleY = r.scaleY),
            (r.ashearX = r.shearX),
            (r.ashearY = r.shearY),
            (r.appliedValid = !0);
        }
        const n = this._updateCache;
        for (let e = 0, i = n.length; e < i; e++) n[e].update();
      }
      setToSetupPose() {
        this.setBonesToSetupPose(), this.setSlotsToSetupPose();
      }
      setBonesToSetupPose() {
        const t = this.bones;
        for (let r = 0, h = t.length; r < h; r++) t[r].setToSetupPose();
        const n = this.ikConstraints;
        for (let r = 0, h = n.length; r < h; r++) {
          const l = n[r];
          (l.mix = l.data.mix),
            (l.softness = l.data.softness),
            (l.bendDirection = l.data.bendDirection),
            (l.compress = l.data.compress),
            (l.stretch = l.data.stretch);
        }
        const e = this.transformConstraints;
        for (let r = 0, h = e.length; r < h; r++) {
          const l = e[r],
            s = l.data;
          (l.rotateMix = s.rotateMix),
            (l.translateMix = s.translateMix),
            (l.scaleMix = s.scaleMix),
            (l.shearMix = s.shearMix);
        }
        const i = this.pathConstraints;
        for (let r = 0, h = i.length; r < h; r++) {
          const l = i[r],
            s = l.data;
          (l.position = s.position),
            (l.spacing = s.spacing),
            (l.rotateMix = s.rotateMix),
            (l.translateMix = s.translateMix);
        }
      }
      setSlotsToSetupPose() {
        const t = this.slots;
        v.arrayCopy(t, 0, this.drawOrder, 0, t.length);
        for (let n = 0, e = t.length; n < e; n++) t[n].setToSetupPose();
      }
      getRootBone() {
        return this.bones.length == 0 ? null : this.bones[0];
      }
      findBone(t) {
        if (t == null) throw new Error("boneName cannot be null.");
        const n = this.bones;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      findBoneIndex(t) {
        if (t == null) throw new Error("boneName cannot be null.");
        const n = this.bones;
        for (let e = 0, i = n.length; e < i; e++)
          if (n[e].data.name == t) return e;
        return -1;
      }
      findSlot(t) {
        if (t == null) throw new Error("slotName cannot be null.");
        const n = this.slots;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      findSlotIndex(t) {
        if (t == null) throw new Error("slotName cannot be null.");
        const n = this.slots;
        for (let e = 0, i = n.length; e < i; e++)
          if (n[e].data.name == t) return e;
        return -1;
      }
      setSkinByName(t) {
        const n = this.data.findSkin(t);
        if (n == null) throw new Error(`Skin not found: ${t}`);
        this.setSkin(n);
      }
      setSkin(t) {
        if (t != this.skin) {
          if (t != null)
            if (this.skin != null) t.attachAll(this, this.skin);
            else {
              const n = this.slots;
              for (let e = 0, i = n.length; e < i; e++) {
                const r = n[e],
                  h = r.data.attachmentName;
                if (h != null) {
                  const l = t.getAttachment(e, h);
                  l != null && r.setAttachment(l);
                }
              }
            }
          (this.skin = t), this.updateCache();
        }
      }
      getAttachmentByName(t, n) {
        return this.getAttachment(this.data.findSlotIndex(t), n);
      }
      getAttachment(t, n) {
        if (n == null) throw new Error("attachmentName cannot be null.");
        if (this.skin != null) {
          const e = this.skin.getAttachment(t, n);
          if (e != null) return e;
        }
        return this.data.defaultSkin != null
          ? this.data.defaultSkin.getAttachment(t, n)
          : null;
      }
      setAttachment(t, n) {
        if (t == null) throw new Error("slotName cannot be null.");
        const e = this.slots;
        for (let i = 0, r = e.length; i < r; i++) {
          const h = e[i];
          if (h.data.name == t) {
            let l = null;
            if (n != null && ((l = this.getAttachment(i, n)), l == null))
              throw new Error(`Attachment not found: ${n}, for slot: ${t}`);
            h.setAttachment(l);
            return;
          }
        }
        throw new Error(`Slot not found: ${t}`);
      }
      findIkConstraint(t) {
        if (t == null) throw new Error("constraintName cannot be null.");
        const n = this.ikConstraints;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      findTransformConstraint(t) {
        if (t == null) throw new Error("constraintName cannot be null.");
        const n = this.transformConstraints;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      findPathConstraint(t) {
        if (t == null) throw new Error("constraintName cannot be null.");
        const n = this.pathConstraints;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      getBounds(t, n, e = new Array(2)) {
        if (t == null) throw new Error("offset cannot be null.");
        if (n == null) throw new Error("size cannot be null.");
        const i = this.drawOrder;
        let r = Number.POSITIVE_INFINITY,
          h = Number.POSITIVE_INFINITY,
          l = Number.NEGATIVE_INFINITY,
          s = Number.NEGATIVE_INFINITY;
        for (let a = 0, o = i.length; a < o; a++) {
          const d = i[a];
          if (!d.bone.active) continue;
          let f = 0,
            u = null;
          const m = d.getAttachment();
          if (m instanceof Q)
            (f = 8),
              (u = v.setArraySize(e, f, 0)),
              m.computeWorldVertices(d.bone, u, 0, 2);
          else if (m instanceof mn) {
            const g = m;
            (f = g.worldVerticesLength),
              (u = v.setArraySize(e, f, 0)),
              g.computeWorldVertices(d, 0, f, u, 0, 2);
          }
          if (u != null)
            for (let g = 0, x = u.length; g < x; g += 2) {
              const E = u[g],
                w = u[g + 1];
              (r = Math.min(r, E)),
                (h = Math.min(h, w)),
                (l = Math.max(l, E)),
                (s = Math.max(s, w));
            }
        }
        t.set(r, h), n.set(l - r, s - h);
      }
      update(t) {
        this.time += t;
      }
      get flipX() {
        return this.scaleX == -1;
      }
      set flipX(t) {
        Tn.deprecatedWarning1 ||
          ((Tn.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY"
          )),
          (this.scaleX = t ? 1 : -1);
      }
      get flipY() {
        return this.scaleY == -1;
      }
      set flipY(t) {
        Tn.deprecatedWarning1 ||
          ((Tn.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY"
          )),
          (this.scaleY = t ? 1 : -1);
      }
    };
    let ys = Tn;
    ys.deprecatedWarning1 = !1;
    let Ms = class {
        constructor() {
          (this.bones = new Array()),
            (this.slots = new Array()),
            (this.skins = new Array()),
            (this.events = new Array()),
            (this.animations = new Array()),
            (this.ikConstraints = new Array()),
            (this.transformConstraints = new Array()),
            (this.pathConstraints = new Array()),
            (this.fps = 0);
        }
        findBone(t) {
          if (t == null) throw new Error("boneName cannot be null.");
          const n = this.bones;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findBoneIndex(t) {
          if (t == null) throw new Error("boneName cannot be null.");
          const n = this.bones;
          for (let e = 0, i = n.length; e < i; e++)
            if (n[e].name == t) return e;
          return -1;
        }
        findSlot(t) {
          if (t == null) throw new Error("slotName cannot be null.");
          const n = this.slots;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findSlotIndex(t) {
          if (t == null) throw new Error("slotName cannot be null.");
          const n = this.slots;
          for (let e = 0, i = n.length; e < i; e++)
            if (n[e].name == t) return e;
          return -1;
        }
        findSkin(t) {
          if (t == null) throw new Error("skinName cannot be null.");
          const n = this.skins;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findEvent(t) {
          if (t == null) throw new Error("eventDataName cannot be null.");
          const n = this.events;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findAnimation(t) {
          if (t == null) throw new Error("animationName cannot be null.");
          const n = this.animations;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findIkConstraint(t) {
          if (t == null) throw new Error("constraintName cannot be null.");
          const n = this.ikConstraints;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findTransformConstraint(t) {
          if (t == null) throw new Error("constraintName cannot be null.");
          const n = this.transformConstraints;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findPathConstraint(t) {
          if (t == null) throw new Error("constraintName cannot be null.");
          const n = this.pathConstraints;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findPathConstraintIndex(t) {
          if (t == null) throw new Error("pathConstraintName cannot be null.");
          const n = this.pathConstraints;
          for (let e = 0, i = n.length; e < i; e++)
            if (n[e].name == t) return e;
          return -1;
        }
      },
      As = class {
        constructor(t, n, e) {
          if (((this.color = new _(1, 1, 1, 1)), t < 0))
            throw new Error("index must be >= 0.");
          if (n == null) throw new Error("name cannot be null.");
          if (e == null) throw new Error("boneData cannot be null.");
          (this.index = t), (this.name = n), (this.boneData = e);
        }
      },
      Cs = class extends Nn {
        constructor(t) {
          super(t, 0, !1),
            (this.bones = new Array()),
            (this.rotateMix = 0),
            (this.translateMix = 0),
            (this.scaleMix = 0),
            (this.shearMix = 0),
            (this.offsetRotation = 0),
            (this.offsetX = 0),
            (this.offsetY = 0),
            (this.offsetScaleX = 0),
            (this.offsetScaleY = 0),
            (this.offsetShearY = 0),
            (this.relative = !1),
            (this.local = !1);
        }
      },
      Ts = class {
        constructor(t, n, e) {
          (this.slotIndex = t), (this.name = n), (this.attachment = e);
        }
      },
      Bn = class {
        constructor(t) {
          if (
            ((this.attachments = new Array()),
            (this.bones = Array()),
            (this.constraints = new Array()),
            t == null)
          )
            throw new Error("name cannot be null.");
          this.name = t;
        }
        setAttachment(t, n, e) {
          if (e == null) throw new Error("attachment cannot be null.");
          const i = this.attachments;
          t >= i.length && (i.length = t + 1),
            i[t] || (i[t] = {}),
            (i[t][n] = e);
        }
        addSkin(t) {
          for (let e = 0; e < t.bones.length; e++) {
            const i = t.bones[e];
            let r = !1;
            for (let h = 0; h < this.bones.length; h++)
              if (this.bones[h] == i) {
                r = !0;
                break;
              }
            r || this.bones.push(i);
          }
          for (let e = 0; e < t.constraints.length; e++) {
            const i = t.constraints[e];
            let r = !1;
            for (let h = 0; h < this.constraints.length; h++)
              if (this.constraints[h] == i) {
                r = !0;
                break;
              }
            r || this.constraints.push(i);
          }
          const n = t.getAttachments();
          for (let e = 0; e < n.length; e++) {
            const i = n[e];
            this.setAttachment(i.slotIndex, i.name, i.attachment);
          }
        }
        copySkin(t) {
          for (let e = 0; e < t.bones.length; e++) {
            const i = t.bones[e];
            let r = !1;
            for (let h = 0; h < this.bones.length; h++)
              if (this.bones[h] == i) {
                r = !0;
                break;
              }
            r || this.bones.push(i);
          }
          for (let e = 0; e < t.constraints.length; e++) {
            const i = t.constraints[e];
            let r = !1;
            for (let h = 0; h < this.constraints.length; h++)
              if (this.constraints[h] == i) {
                r = !0;
                break;
              }
            r || this.constraints.push(i);
          }
          const n = t.getAttachments();
          for (let e = 0; e < n.length; e++) {
            const i = n[e];
            i.attachment != null &&
              (i.attachment instanceof mn
                ? ((i.attachment = i.attachment.newLinkedMesh()),
                  this.setAttachment(i.slotIndex, i.name, i.attachment))
                : ((i.attachment = i.attachment.copy()),
                  this.setAttachment(i.slotIndex, i.name, i.attachment)));
          }
        }
        getAttachment(t, n) {
          const e = this.attachments[t];
          return e ? e[n] : null;
        }
        removeAttachment(t, n) {
          const e = this.attachments[t];
          e && (e[n] = null);
        }
        getAttachments() {
          const t = new Array();
          for (let n = 0; n < this.attachments.length; n++) {
            const e = this.attachments[n];
            if (e)
              for (const i in e) {
                const r = e[i];
                r && t.push(new Ts(n, i, r));
              }
          }
          return t;
        }
        getAttachmentsForSlot(t, n) {
          const e = this.attachments[t];
          if (e)
            for (const i in e) {
              const r = e[i];
              r && n.push(new Ts(t, i, r));
            }
        }
        clear() {
          (this.attachments.length = 0),
            (this.bones.length = 0),
            (this.constraints.length = 0);
        }
        attachAll(t, n) {
          let e = 0;
          for (let i = 0; i < t.slots.length; i++) {
            const r = t.slots[i],
              h = r.getAttachment();
            if (h && e < n.attachments.length) {
              const l = n.attachments[e];
              for (const s in l) {
                const a = l[s];
                if (h == a) {
                  const o = this.getAttachment(e, s);
                  o != null && r.setAttachment(o);
                  break;
                }
              }
            }
            e++;
          }
        }
      };
    const wt = class {
      constructor(c) {
        (this.scale = 1),
          (this.linkedMeshes = new Array()),
          (this.attachmentLoader = c);
      }
      readSkeletonData(c) {
        const t = this.scale,
          n = new Ms();
        n.name = "";
        const e = new Mn(c);
        (n.hash = e.readString()),
          (n.version = e.readString()),
          n.version === "3.8.75" &&
            console.error(
              "Unsupported skeleton data, 3.8.75 is deprecated, please export with a newer version of Spine."
            ),
          (n.x = e.readFloat()),
          (n.y = e.readFloat()),
          (n.width = e.readFloat()),
          (n.height = e.readFloat());
        const i = e.readBoolean();
        i &&
          ((n.fps = e.readFloat()),
          (n.imagesPath = e.readString()),
          (n.audioPath = e.readString()));
        let r = 0;
        r = e.readInt(!0);
        for (let l = 0; l < r; l++) e.strings.push(e.readString());
        r = e.readInt(!0);
        for (let l = 0; l < r; l++) {
          const s = e.readString(),
            a = l == 0 ? null : n.bones[e.readInt(!0)],
            o = new ps(l, s, a);
          (o.rotation = e.readFloat()),
            (o.x = e.readFloat() * t),
            (o.y = e.readFloat() * t),
            (o.scaleX = e.readFloat()),
            (o.scaleY = e.readFloat()),
            (o.shearX = e.readFloat()),
            (o.shearY = e.readFloat()),
            (o.length = e.readFloat() * t),
            (o.transformMode = wt.TransformModeValues[e.readInt(!0)]),
            (o.skinRequired = e.readBoolean()),
            i && _.rgba8888ToColor(o.color, e.readInt32()),
            n.bones.push(o);
        }
        r = e.readInt(!0);
        for (let l = 0; l < r; l++) {
          const s = e.readString(),
            a = n.bones[e.readInt(!0)],
            o = new As(l, s, a);
          _.rgba8888ToColor(o.color, e.readInt32());
          const d = e.readInt32();
          d != -1 && _.rgb888ToColor((o.darkColor = new _()), d),
            (o.attachmentName = e.readStringRef()),
            (o.blendMode = wt.BlendModeValues[e.readInt(!0)]),
            n.slots.push(o);
        }
        r = e.readInt(!0);
        for (let l = 0, s; l < r; l++) {
          const a = new Es(e.readString());
          (a.order = e.readInt(!0)),
            (a.skinRequired = e.readBoolean()),
            (s = e.readInt(!0));
          for (let o = 0; o < s; o++) a.bones.push(n.bones[e.readInt(!0)]);
          (a.target = n.bones[e.readInt(!0)]),
            (a.mix = e.readFloat()),
            (a.softness = e.readFloat() * t),
            (a.bendDirection = e.readByte()),
            (a.compress = e.readBoolean()),
            (a.stretch = e.readBoolean()),
            (a.uniform = e.readBoolean()),
            n.ikConstraints.push(a);
        }
        r = e.readInt(!0);
        for (let l = 0, s; l < r; l++) {
          const a = new Cs(e.readString());
          (a.order = e.readInt(!0)),
            (a.skinRequired = e.readBoolean()),
            (s = e.readInt(!0));
          for (let o = 0; o < s; o++) a.bones.push(n.bones[e.readInt(!0)]);
          (a.target = n.bones[e.readInt(!0)]),
            (a.local = e.readBoolean()),
            (a.relative = e.readBoolean()),
            (a.offsetRotation = e.readFloat()),
            (a.offsetX = e.readFloat() * t),
            (a.offsetY = e.readFloat() * t),
            (a.offsetScaleX = e.readFloat()),
            (a.offsetScaleY = e.readFloat()),
            (a.offsetShearY = e.readFloat()),
            (a.rotateMix = e.readFloat()),
            (a.translateMix = e.readFloat()),
            (a.scaleMix = e.readFloat()),
            (a.shearMix = e.readFloat()),
            n.transformConstraints.push(a);
        }
        r = e.readInt(!0);
        for (let l = 0, s; l < r; l++) {
          const a = new Ss(e.readString());
          (a.order = e.readInt(!0)),
            (a.skinRequired = e.readBoolean()),
            (s = e.readInt(!0));
          for (let o = 0; o < s; o++) a.bones.push(n.bones[e.readInt(!0)]);
          (a.target = n.slots[e.readInt(!0)]),
            (a.positionMode = wt.PositionModeValues[e.readInt(!0)]),
            (a.spacingMode = wt.SpacingModeValues[e.readInt(!0)]),
            (a.rotateMode = wt.RotateModeValues[e.readInt(!0)]),
            (a.offsetRotation = e.readFloat()),
            (a.position = e.readFloat()),
            a.positionMode == dt.Fixed && (a.position *= t),
            (a.spacing = e.readFloat()),
            (a.spacingMode == vt.Length || a.spacingMode == vt.Fixed) &&
              (a.spacing *= t),
            (a.rotateMix = e.readFloat()),
            (a.translateMix = e.readFloat()),
            n.pathConstraints.push(a);
        }
        const h = this.readSkin(e, n, !0, i);
        h != null && ((n.defaultSkin = h), n.skins.push(h));
        {
          let l = n.skins.length;
          for (v.setArraySize(n.skins, (r = l + e.readInt(!0))); l < r; l++)
            n.skins[l] = this.readSkin(e, n, !1, i);
        }
        r = this.linkedMeshes.length;
        for (let l = 0; l < r; l++) {
          const s = this.linkedMeshes[l],
            a = s.skin == null ? n.defaultSkin : n.findSkin(s.skin);
          if (a == null) throw new Error(`Skin not found: ${s.skin}`);
          const o = a.getAttachment(s.slotIndex, s.parent);
          if (o == null) throw new Error(`Parent mesh not found: ${s.parent}`);
          (s.mesh.deformAttachment = s.inheritDeform ? o : s.mesh),
            s.mesh.setParentMesh(o);
        }
        (this.linkedMeshes.length = 0), (r = e.readInt(!0));
        for (let l = 0; l < r; l++) {
          const s = new bs(e.readStringRef());
          (s.intValue = e.readInt(!1)),
            (s.floatValue = e.readFloat()),
            (s.stringValue = e.readString()),
            (s.audioPath = e.readString()),
            s.audioPath != null &&
              ((s.volume = e.readFloat()), (s.balance = e.readFloat())),
            n.events.push(s);
        }
        r = e.readInt(!0);
        for (let l = 0; l < r; l++)
          n.animations.push(this.readAnimation(e, e.readString(), n));
        return n;
      }
      readSkin(c, t, n, e) {
        let i = null,
          r = 0;
        if (n) {
          if (((r = c.readInt(!0)), r == 0)) return null;
          i = new Bn("default");
        } else {
          (i = new Bn(c.readStringRef())), (i.bones.length = c.readInt(!0));
          for (let h = 0, l = i.bones.length; h < l; h++)
            i.bones[h] = t.bones[c.readInt(!0)];
          for (let h = 0, l = c.readInt(!0); h < l; h++)
            i.constraints.push(t.ikConstraints[c.readInt(!0)]);
          for (let h = 0, l = c.readInt(!0); h < l; h++)
            i.constraints.push(t.transformConstraints[c.readInt(!0)]);
          for (let h = 0, l = c.readInt(!0); h < l; h++)
            i.constraints.push(t.pathConstraints[c.readInt(!0)]);
          r = c.readInt(!0);
        }
        for (let h = 0; h < r; h++) {
          const l = c.readInt(!0);
          for (let s = 0, a = c.readInt(!0); s < a; s++) {
            const o = c.readStringRef(),
              d = this.readAttachment(c, t, i, l, o, e);
            d != null && i.setAttachment(l, o, d);
          }
        }
        return i;
      }
      readAttachment(c, t, n, e, i, r) {
        const h = this.scale;
        let l = c.readStringRef();
        l == null && (l = i);
        const s = c.readByte();
        switch (wt.AttachmentTypeValues[s]) {
          case Z.Region: {
            let o = c.readStringRef();
            const d = c.readFloat(),
              f = c.readFloat(),
              u = c.readFloat(),
              m = c.readFloat(),
              g = c.readFloat(),
              x = c.readFloat(),
              E = c.readFloat(),
              w = c.readInt32();
            o == null && (o = l);
            const b = this.attachmentLoader.newRegionAttachment(n, l, o);
            return b == null
              ? null
              : ((b.path = o),
                (b.x = f * h),
                (b.y = u * h),
                (b.scaleX = m),
                (b.scaleY = g),
                (b.rotation = d),
                (b.width = x * h),
                (b.height = E * h),
                _.rgba8888ToColor(b.color, w),
                b);
          }
          case Z.BoundingBox: {
            const o = c.readInt(!0),
              d = this.readVertices(c, o),
              f = r ? c.readInt32() : 0,
              u = this.attachmentLoader.newBoundingBoxAttachment(n, l);
            return u == null
              ? null
              : ((u.worldVerticesLength = o << 1),
                (u.vertices = d.vertices),
                (u.bones = d.bones),
                r && _.rgba8888ToColor(u.color, f),
                u);
          }
          case Z.Mesh: {
            let o = c.readStringRef();
            const d = c.readInt32(),
              f = c.readInt(!0),
              u = this.readFloatArray(c, f << 1, 1),
              m = this.readShortArray(c),
              g = this.readVertices(c, f),
              x = c.readInt(!0);
            let E = null,
              w = 0,
              b = 0;
            r &&
              ((E = this.readShortArray(c)),
              (w = c.readFloat()),
              (b = c.readFloat())),
              o == null && (o = l);
            const p = this.attachmentLoader.newMeshAttachment(n, l, o);
            return p == null
              ? null
              : ((p.path = o),
                _.rgba8888ToColor(p.color, d),
                (p.bones = g.bones),
                (p.vertices = g.vertices),
                (p.worldVerticesLength = f << 1),
                (p.triangles = m),
                (p.regionUVs = new Float32Array(u)),
                (p.hullLength = x << 1),
                r && ((p.edges = E), (p.width = w * h), (p.height = b * h)),
                p);
          }
          case Z.LinkedMesh: {
            let o = c.readStringRef();
            const d = c.readInt32(),
              f = c.readStringRef(),
              u = c.readStringRef(),
              m = c.readBoolean();
            let g = 0,
              x = 0;
            r && ((g = c.readFloat()), (x = c.readFloat())),
              o == null && (o = l);
            const E = this.attachmentLoader.newMeshAttachment(n, l, o);
            return E == null
              ? null
              : ((E.path = o),
                _.rgba8888ToColor(E.color, d),
                r && ((E.width = g * h), (E.height = x * h)),
                this.linkedMeshes.push(new Vr(E, f, e, u, m)),
                E);
          }
          case Z.Path: {
            const o = c.readBoolean(),
              d = c.readBoolean(),
              f = c.readInt(!0),
              u = this.readVertices(c, f),
              m = v.newArray(f / 3, 0);
            for (let E = 0, w = m.length; E < w; E++) m[E] = c.readFloat() * h;
            const g = r ? c.readInt32() : 0,
              x = this.attachmentLoader.newPathAttachment(n, l);
            return x == null
              ? null
              : ((x.closed = o),
                (x.constantSpeed = d),
                (x.worldVerticesLength = f << 1),
                (x.vertices = u.vertices),
                (x.bones = u.bones),
                (x.lengths = m),
                r && _.rgba8888ToColor(x.color, g),
                x);
          }
          case Z.Point: {
            const o = c.readFloat(),
              d = c.readFloat(),
              f = c.readFloat(),
              u = r ? c.readInt32() : 0,
              m = this.attachmentLoader.newPointAttachment(n, l);
            return m == null
              ? null
              : ((m.x = d * h),
                (m.y = f * h),
                (m.rotation = o),
                r && _.rgba8888ToColor(m.color, u),
                m);
          }
          case Z.Clipping: {
            const o = c.readInt(!0),
              d = c.readInt(!0),
              f = this.readVertices(c, d),
              u = r ? c.readInt32() : 0,
              m = this.attachmentLoader.newClippingAttachment(n, l);
            return m == null
              ? null
              : ((m.endSlot = t.slots[o]),
                (m.worldVerticesLength = d << 1),
                (m.vertices = f.vertices),
                (m.bones = f.bones),
                r && _.rgba8888ToColor(m.color, u),
                m);
          }
        }
        return null;
      }
      readVertices(c, t) {
        const n = t << 1,
          e = new Fr(),
          i = this.scale;
        if (!c.readBoolean())
          return (e.vertices = this.readFloatArray(c, n, i)), e;
        const r = new Array(),
          h = new Array();
        for (let l = 0; l < t; l++) {
          const s = c.readInt(!0);
          h.push(s);
          for (let a = 0; a < s; a++)
            h.push(c.readInt(!0)),
              r.push(c.readFloat() * i),
              r.push(c.readFloat() * i),
              r.push(c.readFloat());
        }
        return (e.vertices = v.toFloatArray(r)), (e.bones = h), e;
      }
      readFloatArray(c, t, n) {
        const e = new Array(t);
        if (n == 1) for (let i = 0; i < t; i++) e[i] = c.readFloat();
        else for (let i = 0; i < t; i++) e[i] = c.readFloat() * n;
        return e;
      }
      readShortArray(c) {
        const t = c.readInt(!0),
          n = new Array(t);
        for (let e = 0; e < t; e++) n[e] = c.readShort();
        return n;
      }
      readAnimation(c, t, n) {
        const e = new Array(),
          i = this.scale;
        let r = 0;
        const h = new _(),
          l = new _();
        for (let o = 0, d = c.readInt(!0); o < d; o++) {
          const f = c.readInt(!0);
          for (let u = 0, m = c.readInt(!0); u < m; u++) {
            const g = c.readByte(),
              x = c.readInt(!0);
            switch (g) {
              case wt.SLOT_ATTACHMENT: {
                const E = new en(x);
                E.slotIndex = f;
                for (let w = 0; w < x; w++)
                  E.setFrame(w, c.readFloat(), c.readStringRef());
                e.push(E), (r = Math.max(r, E.frames[x - 1]));
                break;
              }
              case wt.SLOT_COLOR: {
                const E = new Lt(x);
                E.slotIndex = f;
                for (let w = 0; w < x; w++) {
                  const b = c.readFloat();
                  _.rgba8888ToColor(h, c.readInt32()),
                    E.setFrame(w, b, h.r, h.g, h.b, h.a),
                    w < x - 1 && this.readCurve(c, w, E);
                }
                e.push(E), (r = Math.max(r, E.frames[(x - 1) * Lt.ENTRIES]));
                break;
              }
              case wt.SLOT_TWO_COLOR: {
                const E = new yt(x);
                E.slotIndex = f;
                for (let w = 0; w < x; w++) {
                  const b = c.readFloat();
                  _.rgba8888ToColor(h, c.readInt32()),
                    _.rgb888ToColor(l, c.readInt32()),
                    E.setFrame(w, b, h.r, h.g, h.b, h.a, l.r, l.g, l.b),
                    w < x - 1 && this.readCurve(c, w, E);
                }
                e.push(E), (r = Math.max(r, E.frames[(x - 1) * yt.ENTRIES]));
                break;
              }
            }
          }
        }
        for (let o = 0, d = c.readInt(!0); o < d; o++) {
          const f = c.readInt(!0);
          for (let u = 0, m = c.readInt(!0); u < m; u++) {
            const g = c.readByte(),
              x = c.readInt(!0);
            switch (g) {
              case wt.BONE_ROTATE: {
                const E = new Vt(x);
                E.boneIndex = f;
                for (let w = 0; w < x; w++)
                  E.setFrame(w, c.readFloat(), c.readFloat()),
                    w < x - 1 && this.readCurve(c, w, E);
                e.push(E), (r = Math.max(r, E.frames[(x - 1) * Vt.ENTRIES]));
                break;
              }
              case wt.BONE_TRANSLATE:
              case wt.BONE_SCALE:
              case wt.BONE_SHEAR: {
                let E,
                  w = 1;
                g == wt.BONE_SCALE
                  ? (E = new te(x))
                  : g == wt.BONE_SHEAR
                  ? (E = new ee(x))
                  : ((E = new Jt(x)), (w = i)),
                  (E.boneIndex = f);
                for (let b = 0; b < x; b++)
                  E.setFrame(
                    b,
                    c.readFloat(),
                    c.readFloat() * w,
                    c.readFloat() * w
                  ),
                    b < x - 1 && this.readCurve(c, b, E);
                e.push(E), (r = Math.max(r, E.frames[(x - 1) * Jt.ENTRIES]));
                break;
              }
            }
          }
        }
        for (let o = 0, d = c.readInt(!0); o < d; o++) {
          const f = c.readInt(!0),
            u = c.readInt(!0),
            m = new Ft(u);
          m.ikConstraintIndex = f;
          for (let g = 0; g < u; g++)
            m.setFrame(
              g,
              c.readFloat(),
              c.readFloat(),
              c.readFloat() * i,
              c.readByte(),
              c.readBoolean(),
              c.readBoolean()
            ),
              g < u - 1 && this.readCurve(c, g, m);
          e.push(m), (r = Math.max(r, m.frames[(u - 1) * Ft.ENTRIES]));
        }
        for (let o = 0, d = c.readInt(!0); o < d; o++) {
          const f = c.readInt(!0),
            u = c.readInt(!0),
            m = new _t(u);
          m.transformConstraintIndex = f;
          for (let g = 0; g < u; g++)
            m.setFrame(
              g,
              c.readFloat(),
              c.readFloat(),
              c.readFloat(),
              c.readFloat(),
              c.readFloat()
            ),
              g < u - 1 && this.readCurve(c, g, m);
          e.push(m), (r = Math.max(r, m.frames[(u - 1) * _t.ENTRIES]));
        }
        for (let o = 0, d = c.readInt(!0); o < d; o++) {
          const f = c.readInt(!0),
            u = n.pathConstraints[f];
          for (let m = 0, g = c.readInt(!0); m < g; m++) {
            const x = c.readByte(),
              E = c.readInt(!0);
            switch (x) {
              case wt.PATH_POSITION:
              case wt.PATH_SPACING: {
                let w,
                  b = 1;
                x == wt.PATH_SPACING
                  ? ((w = new ke(E)),
                    (u.spacingMode == vt.Length || u.spacingMode == vt.Fixed) &&
                      (b = i))
                  : ((w = new Te(E)), u.positionMode == dt.Fixed && (b = i)),
                  (w.pathConstraintIndex = f);
                for (let p = 0; p < E; p++)
                  w.setFrame(p, c.readFloat(), c.readFloat() * b),
                    p < E - 1 && this.readCurve(c, p, w);
                e.push(w), (r = Math.max(r, w.frames[(E - 1) * Te.ENTRIES]));
                break;
              }
              case wt.PATH_MIX: {
                const w = new me(E);
                w.pathConstraintIndex = f;
                for (let b = 0; b < E; b++)
                  w.setFrame(b, c.readFloat(), c.readFloat(), c.readFloat()),
                    b < E - 1 && this.readCurve(c, b, w);
                e.push(w), (r = Math.max(r, w.frames[(E - 1) * me.ENTRIES]));
                break;
              }
            }
          }
        }
        for (let o = 0, d = c.readInt(!0); o < d; o++) {
          const f = n.skins[c.readInt(!0)];
          for (let u = 0, m = c.readInt(!0); u < m; u++) {
            const g = c.readInt(!0);
            for (let x = 0, E = c.readInt(!0); x < E; x++) {
              const w = f.getAttachment(g, c.readStringRef()),
                b = w.bones != null,
                p = w.vertices,
                S = b ? (p.length / 3) * 2 : p.length,
                y = c.readInt(!0),
                M = new hs(y);
              (M.slotIndex = g), (M.attachment = w);
              for (let T = 0; T < y; T++) {
                const k = c.readFloat();
                let I,
                  R = c.readInt(!0);
                if (R == 0) I = b ? v.newFloatArray(S) : p;
                else {
                  I = v.newFloatArray(S);
                  const V = c.readInt(!0);
                  if (((R += V), i == 1))
                    for (let F = V; F < R; F++) I[F] = c.readFloat();
                  else for (let F = V; F < R; F++) I[F] = c.readFloat() * i;
                  if (!b)
                    for (let F = 0, B = I.length; F < B; F++) I[F] += p[F];
                }
                M.setFrame(T, k, I), T < y - 1 && this.readCurve(c, T, M);
              }
              e.push(M), (r = Math.max(r, M.frames[y - 1]));
            }
          }
        }
        const s = c.readInt(!0);
        if (s > 0) {
          const o = new xn(s),
            d = n.slots.length;
          for (let f = 0; f < s; f++) {
            const u = c.readFloat(),
              m = c.readInt(!0),
              g = v.newArray(d, 0);
            for (let b = d - 1; b >= 0; b--) g[b] = -1;
            const x = v.newArray(d - m, 0);
            let E = 0,
              w = 0;
            for (let b = 0; b < m; b++) {
              const p = c.readInt(!0);
              for (; E != p; ) x[w++] = E++;
              g[E + c.readInt(!0)] = E++;
            }
            for (; E < d; ) x[w++] = E++;
            for (let b = d - 1; b >= 0; b--) g[b] == -1 && (g[b] = x[--w]);
            o.setFrame(f, u, g);
          }
          e.push(o), (r = Math.max(r, o.frames[s - 1]));
        }
        const a = c.readInt(!0);
        if (a > 0) {
          const o = new Yn(a);
          for (let d = 0; d < a; d++) {
            const f = c.readFloat(),
              u = n.events[c.readInt(!0)],
              m = new ws(f, u);
            (m.intValue = c.readInt(!1)),
              (m.floatValue = c.readFloat()),
              (m.stringValue = c.readBoolean()
                ? c.readString()
                : u.stringValue),
              m.data.audioPath != null &&
                ((m.volume = c.readFloat()), (m.balance = c.readFloat())),
              o.setFrame(d, m);
          }
          e.push(o), (r = Math.max(r, o.frames[a - 1]));
        }
        return new Et(t, e, r);
      }
      readCurve(c, t, n) {
        switch (c.readByte()) {
          case wt.CURVE_STEPPED:
            n.setStepped(t);
            break;
          case wt.CURVE_BEZIER:
            this.setCurve(
              n,
              t,
              c.readFloat(),
              c.readFloat(),
              c.readFloat(),
              c.readFloat()
            );
            break;
        }
      }
      setCurve(c, t, n, e, i, r) {
        c.setCurve(t, n, e, i, r);
      }
    };
    let Mt = wt;
    (Mt.AttachmentTypeValues = [0, 1, 2, 3, 4, 5, 6]),
      (Mt.TransformModeValues = [
        j.Normal,
        j.OnlyTranslation,
        j.NoRotationOrReflection,
        j.NoScale,
        j.NoScaleOrReflection,
      ]),
      (Mt.PositionModeValues = [dt.Fixed, dt.Percent]),
      (Mt.SpacingModeValues = [vt.Length, vt.Fixed, vt.Percent]),
      (Mt.RotateModeValues = [pt.Tangent, pt.Chain, pt.ChainScale]),
      (Mt.BlendModeValues = [
        H.BLEND_MODES.NORMAL,
        H.BLEND_MODES.ADD,
        H.BLEND_MODES.MULTIPLY,
        H.BLEND_MODES.SCREEN,
      ]),
      (Mt.BONE_ROTATE = 0),
      (Mt.BONE_TRANSLATE = 1),
      (Mt.BONE_SCALE = 2),
      (Mt.BONE_SHEAR = 3),
      (Mt.SLOT_ATTACHMENT = 0),
      (Mt.SLOT_COLOR = 1),
      (Mt.SLOT_TWO_COLOR = 2),
      (Mt.PATH_POSITION = 0),
      (Mt.PATH_SPACING = 1),
      (Mt.PATH_MIX = 2),
      (Mt.CURVE_LINEAR = 0),
      (Mt.CURVE_STEPPED = 1),
      (Mt.CURVE_BEZIER = 2);
    let Vr = class {
        constructor(t, n, e, i, r) {
          (this.mesh = t),
            (this.skin = n),
            (this.slotIndex = e),
            (this.parent = i),
            (this.inheritDeform = r);
        }
      },
      Fr = class {
        constructor(t = null, n = null) {
          (this.bones = t), (this.vertices = n);
        }
      },
      Yr = class extends Cn {},
      sn = class {
        constructor(t) {
          (this.scale = 1),
            (this.linkedMeshes = new Array()),
            (this.attachmentLoader = t);
        }
        readSkeletonData(t) {
          const n = this.scale,
            e = new Ms(),
            i = typeof t == "string" ? JSON.parse(t) : t,
            r = i.skeleton;
          if (r != null) {
            if (
              ((e.hash = r.hash),
              (e.version = r.spine),
              e.version.substr(0, 3) !== "3.8")
            ) {
              const h = `Spine 3.8 loader cant load version ${r.spine}. Please configure your pixi-spine bundle`;
              console.error(h);
            }
            e.version === "3.8.75" &&
              console.error(
                "Unsupported skeleton data, 3.8.75 is deprecated, please export with a newer version of Spine."
              ),
              (e.x = r.x),
              (e.y = r.y),
              (e.width = r.width),
              (e.height = r.height),
              (e.fps = r.fps),
              (e.imagesPath = r.images);
          }
          if (i.bones)
            for (let h = 0; h < i.bones.length; h++) {
              const l = i.bones[h];
              let s = null;
              const a = this.getValue(l, "parent", null);
              if (a != null && ((s = e.findBone(a)), s == null))
                throw new Error(`Parent bone not found: ${a}`);
              const o = new ps(e.bones.length, l.name, s);
              (o.length = this.getValue(l, "length", 0) * n),
                (o.x = this.getValue(l, "x", 0) * n),
                (o.y = this.getValue(l, "y", 0) * n),
                (o.rotation = this.getValue(l, "rotation", 0)),
                (o.scaleX = this.getValue(l, "scaleX", 1)),
                (o.scaleY = this.getValue(l, "scaleY", 1)),
                (o.shearX = this.getValue(l, "shearX", 0)),
                (o.shearY = this.getValue(l, "shearY", 0)),
                (o.transformMode = sn.transformModeFromString(
                  this.getValue(l, "transform", "normal")
                )),
                (o.skinRequired = this.getValue(l, "skin", !1)),
                e.bones.push(o);
            }
          if (i.slots)
            for (let h = 0; h < i.slots.length; h++) {
              const l = i.slots[h],
                s = l.name,
                a = l.bone,
                o = e.findBone(a);
              if (o == null) throw new Error(`Slot bone not found: ${a}`);
              const d = new As(e.slots.length, s, o),
                f = this.getValue(l, "color", null);
              f != null && d.color.setFromString(f);
              const u = this.getValue(l, "dark", null);
              u != null &&
                ((d.darkColor = new _(1, 1, 1, 1)),
                d.darkColor.setFromString(u)),
                (d.attachmentName = this.getValue(l, "attachment", null)),
                (d.blendMode = sn.blendModeFromString(
                  this.getValue(l, "blend", "normal")
                )),
                e.slots.push(d);
            }
          if (i.ik)
            for (let h = 0; h < i.ik.length; h++) {
              const l = i.ik[h],
                s = new Es(l.name);
              (s.order = this.getValue(l, "order", 0)),
                (s.skinRequired = this.getValue(l, "skin", !1));
              for (let o = 0; o < l.bones.length; o++) {
                const d = l.bones[o],
                  f = e.findBone(d);
                if (f == null) throw new Error(`IK bone not found: ${d}`);
                s.bones.push(f);
              }
              const a = l.target;
              if (((s.target = e.findBone(a)), s.target == null))
                throw new Error(`IK target bone not found: ${a}`);
              (s.mix = this.getValue(l, "mix", 1)),
                (s.softness = this.getValue(l, "softness", 0) * n),
                (s.bendDirection = this.getValue(l, "bendPositive", !0)
                  ? 1
                  : -1),
                (s.compress = this.getValue(l, "compress", !1)),
                (s.stretch = this.getValue(l, "stretch", !1)),
                (s.uniform = this.getValue(l, "uniform", !1)),
                e.ikConstraints.push(s);
            }
          if (i.transform)
            for (let h = 0; h < i.transform.length; h++) {
              const l = i.transform[h],
                s = new Cs(l.name);
              (s.order = this.getValue(l, "order", 0)),
                (s.skinRequired = this.getValue(l, "skin", !1));
              for (let o = 0; o < l.bones.length; o++) {
                const d = l.bones[o],
                  f = e.findBone(d);
                if (f == null)
                  throw new Error(`Transform constraint bone not found: ${d}`);
                s.bones.push(f);
              }
              const a = l.target;
              if (((s.target = e.findBone(a)), s.target == null))
                throw new Error(
                  `Transform constraint target bone not found: ${a}`
                );
              (s.local = this.getValue(l, "local", !1)),
                (s.relative = this.getValue(l, "relative", !1)),
                (s.offsetRotation = this.getValue(l, "rotation", 0)),
                (s.offsetX = this.getValue(l, "x", 0) * n),
                (s.offsetY = this.getValue(l, "y", 0) * n),
                (s.offsetScaleX = this.getValue(l, "scaleX", 0)),
                (s.offsetScaleY = this.getValue(l, "scaleY", 0)),
                (s.offsetShearY = this.getValue(l, "shearY", 0)),
                (s.rotateMix = this.getValue(l, "rotateMix", 1)),
                (s.translateMix = this.getValue(l, "translateMix", 1)),
                (s.scaleMix = this.getValue(l, "scaleMix", 1)),
                (s.shearMix = this.getValue(l, "shearMix", 1)),
                e.transformConstraints.push(s);
            }
          if (i.path)
            for (let h = 0; h < i.path.length; h++) {
              const l = i.path[h],
                s = new Ss(l.name);
              (s.order = this.getValue(l, "order", 0)),
                (s.skinRequired = this.getValue(l, "skin", !1));
              for (let o = 0; o < l.bones.length; o++) {
                const d = l.bones[o],
                  f = e.findBone(d);
                if (f == null)
                  throw new Error(`Transform constraint bone not found: ${d}`);
                s.bones.push(f);
              }
              const a = l.target;
              if (((s.target = e.findSlot(a)), s.target == null))
                throw new Error(`Path target slot not found: ${a}`);
              (s.positionMode = sn.positionModeFromString(
                this.getValue(l, "positionMode", "percent")
              )),
                (s.spacingMode = sn.spacingModeFromString(
                  this.getValue(l, "spacingMode", "length")
                )),
                (s.rotateMode = sn.rotateModeFromString(
                  this.getValue(l, "rotateMode", "tangent")
                )),
                (s.offsetRotation = this.getValue(l, "rotation", 0)),
                (s.position = this.getValue(l, "position", 0)),
                s.positionMode == dt.Fixed && (s.position *= n),
                (s.spacing = this.getValue(l, "spacing", 0)),
                (s.spacingMode == vt.Length || s.spacingMode == vt.Fixed) &&
                  (s.spacing *= n),
                (s.rotateMix = this.getValue(l, "rotateMix", 1)),
                (s.translateMix = this.getValue(l, "translateMix", 1)),
                e.pathConstraints.push(s);
            }
          if (i.skins)
            for (let h = 0; h < i.skins.length; h++) {
              const l = i.skins[h],
                s = new Bn(l.name);
              if (l.bones)
                for (let a = 0; a < l.bones.length; a++) {
                  const o = e.findBone(l.bones[a]);
                  if (o == null)
                    throw new Error(`Skin bone not found: ${l.bones[h]}`);
                  s.bones.push(o);
                }
              if (l.ik)
                for (let a = 0; a < l.ik.length; a++) {
                  const o = e.findIkConstraint(l.ik[a]);
                  if (o == null)
                    throw new Error(`Skin IK constraint not found: ${l.ik[h]}`);
                  s.constraints.push(o);
                }
              if (l.transform)
                for (let a = 0; a < l.transform.length; a++) {
                  const o = e.findTransformConstraint(l.transform[a]);
                  if (o == null)
                    throw new Error(
                      `Skin transform constraint not found: ${l.transform[h]}`
                    );
                  s.constraints.push(o);
                }
              if (l.path)
                for (let a = 0; a < l.path.length; a++) {
                  const o = e.findPathConstraint(l.path[a]);
                  if (o == null)
                    throw new Error(
                      `Skin path constraint not found: ${l.path[h]}`
                    );
                  s.constraints.push(o);
                }
              for (const a in l.attachments) {
                const o = e.findSlot(a);
                if (o == null) throw new Error(`Slot not found: ${a}`);
                const d = l.attachments[a];
                for (const f in d) {
                  const u = this.readAttachment(d[f], s, o.index, f, e);
                  u != null && s.setAttachment(o.index, f, u);
                }
              }
              e.skins.push(s), s.name == "default" && (e.defaultSkin = s);
            }
          for (let h = 0, l = this.linkedMeshes.length; h < l; h++) {
            const s = this.linkedMeshes[h],
              a = s.skin == null ? e.defaultSkin : e.findSkin(s.skin);
            if (a == null) throw new Error(`Skin not found: ${s.skin}`);
            const o = a.getAttachment(s.slotIndex, s.parent);
            if (o == null)
              throw new Error(`Parent mesh not found: ${s.parent}`);
            (s.mesh.deformAttachment = s.inheritDeform ? o : s.mesh),
              s.mesh.setParentMesh(o);
          }
          if (((this.linkedMeshes.length = 0), i.events))
            for (const h in i.events) {
              const l = i.events[h],
                s = new bs(h);
              (s.intValue = this.getValue(l, "int", 0)),
                (s.floatValue = this.getValue(l, "float", 0)),
                (s.stringValue = this.getValue(l, "string", "")),
                (s.audioPath = this.getValue(l, "audio", null)),
                s.audioPath != null &&
                  ((s.volume = this.getValue(l, "volume", 1)),
                  (s.balance = this.getValue(l, "balance", 0))),
                e.events.push(s);
            }
          if (i.animations)
            for (const h in i.animations) {
              const l = i.animations[h];
              this.readAnimation(l, h, e);
            }
          return e;
        }
        readAttachment(t, n, e, i, r) {
          const h = this.scale;
          switch (
            ((i = this.getValue(t, "name", i)),
            this.getValue(t, "type", "region"))
          ) {
            case "region": {
              const s = this.getValue(t, "path", i),
                a = this.attachmentLoader.newRegionAttachment(n, i, s);
              if (a == null) return null;
              (a.path = s),
                (a.x = this.getValue(t, "x", 0) * h),
                (a.y = this.getValue(t, "y", 0) * h),
                (a.scaleX = this.getValue(t, "scaleX", 1)),
                (a.scaleY = this.getValue(t, "scaleY", 1)),
                (a.rotation = this.getValue(t, "rotation", 0)),
                (a.width = t.width * h),
                (a.height = t.height * h);
              const o = this.getValue(t, "color", null);
              return o != null && a.color.setFromString(o), a;
            }
            case "boundingbox": {
              const s = this.attachmentLoader.newBoundingBoxAttachment(n, i);
              if (s == null) return null;
              this.readVertices(t, s, t.vertexCount << 1);
              const a = this.getValue(t, "color", null);
              return a != null && s.color.setFromString(a), s;
            }
            case "mesh":
            case "linkedmesh": {
              const s = this.getValue(t, "path", i),
                a = this.attachmentLoader.newMeshAttachment(n, i, s);
              if (a == null) return null;
              a.path = s;
              const o = this.getValue(t, "color", null);
              o != null && a.color.setFromString(o),
                (a.width = this.getValue(t, "width", 0) * h),
                (a.height = this.getValue(t, "height", 0) * h);
              const d = this.getValue(t, "parent", null);
              if (d != null)
                return (
                  this.linkedMeshes.push(
                    new Xr(
                      a,
                      this.getValue(t, "skin", null),
                      e,
                      d,
                      this.getValue(t, "deform", !0)
                    )
                  ),
                  a
                );
              const f = t.uvs;
              return (
                this.readVertices(t, a, f.length),
                (a.triangles = t.triangles),
                (a.regionUVs = new Float32Array(f)),
                (a.edges = this.getValue(t, "edges", null)),
                (a.hullLength = this.getValue(t, "hull", 0) * 2),
                a
              );
            }
            case "path": {
              const s = this.attachmentLoader.newPathAttachment(n, i);
              if (s == null) return null;
              (s.closed = this.getValue(t, "closed", !1)),
                (s.constantSpeed = this.getValue(t, "constantSpeed", !0));
              const a = t.vertexCount;
              this.readVertices(t, s, a << 1);
              const o = v.newArray(a / 3, 0);
              for (let f = 0; f < t.lengths.length; f++)
                o[f] = t.lengths[f] * h;
              s.lengths = o;
              const d = this.getValue(t, "color", null);
              return d != null && s.color.setFromString(d), s;
            }
            case "point": {
              const s = this.attachmentLoader.newPointAttachment(n, i);
              if (s == null) return null;
              (s.x = this.getValue(t, "x", 0) * h),
                (s.y = this.getValue(t, "y", 0) * h),
                (s.rotation = this.getValue(t, "rotation", 0));
              const a = this.getValue(t, "color", null);
              return a != null && s.color.setFromString(a), s;
            }
            case "clipping": {
              const s = this.attachmentLoader.newClippingAttachment(n, i);
              if (s == null) return null;
              const a = this.getValue(t, "end", null);
              if (a != null) {
                const f = r.findSlot(a);
                if (f == null)
                  throw new Error(`Clipping end slot not found: ${a}`);
                s.endSlot = f;
              }
              const o = t.vertexCount;
              this.readVertices(t, s, o << 1);
              const d = this.getValue(t, "color", null);
              return d != null && s.color.setFromString(d), s;
            }
          }
          return null;
        }
        readVertices(t, n, e) {
          const i = this.scale;
          n.worldVerticesLength = e;
          const r = t.vertices;
          if (e == r.length) {
            const s = v.toFloatArray(r);
            if (i != 1) for (let a = 0, o = r.length; a < o; a++) s[a] *= i;
            n.vertices = s;
            return;
          }
          const h = new Array(),
            l = new Array();
          for (let s = 0, a = r.length; s < a; ) {
            const o = r[s++];
            l.push(o);
            for (let d = s + o * 4; s < d; s += 4)
              l.push(r[s]),
                h.push(r[s + 1] * i),
                h.push(r[s + 2] * i),
                h.push(r[s + 3]);
          }
          (n.bones = l), (n.vertices = v.toFloatArray(h));
        }
        readAnimation(t, n, e) {
          const i = this.scale,
            r = new Array();
          let h = 0;
          if (t.slots)
            for (const s in t.slots) {
              const a = t.slots[s],
                o = e.findSlotIndex(s);
              if (o == -1) throw new Error(`Slot not found: ${s}`);
              for (const d in a) {
                const f = a[d];
                if (d == "attachment") {
                  const u = new en(f.length);
                  u.slotIndex = o;
                  let m = 0;
                  for (let g = 0; g < f.length; g++) {
                    const x = f[g];
                    u.setFrame(m++, this.getValue(x, "time", 0), x.name);
                  }
                  r.push(u), (h = Math.max(h, u.frames[u.getFrameCount() - 1]));
                } else if (d == "color") {
                  const u = new Lt(f.length);
                  u.slotIndex = o;
                  let m = 0;
                  for (let g = 0; g < f.length; g++) {
                    const x = f[g],
                      E = new _();
                    E.setFromString(x.color || "ffffffff"),
                      u.setFrame(
                        m,
                        this.getValue(x, "time", 0),
                        E.r,
                        E.g,
                        E.b,
                        E.a
                      ),
                      this.readCurve(x, u, m),
                      m++;
                  }
                  r.push(u),
                    (h = Math.max(
                      h,
                      u.frames[(u.getFrameCount() - 1) * Lt.ENTRIES]
                    ));
                } else if (d == "twoColor") {
                  const u = new yt(f.length);
                  u.slotIndex = o;
                  let m = 0;
                  for (let g = 0; g < f.length; g++) {
                    const x = f[g],
                      E = new _(),
                      w = new _();
                    E.setFromString(x.light),
                      w.setFromString(x.dark),
                      u.setFrame(
                        m,
                        this.getValue(x, "time", 0),
                        E.r,
                        E.g,
                        E.b,
                        E.a,
                        w.r,
                        w.g,
                        w.b
                      ),
                      this.readCurve(x, u, m),
                      m++;
                  }
                  r.push(u),
                    (h = Math.max(
                      h,
                      u.frames[(u.getFrameCount() - 1) * yt.ENTRIES]
                    ));
                } else
                  throw new Error(
                    `Invalid timeline type for a slot: ${d} (${s})`
                  );
              }
            }
          if (t.bones)
            for (const s in t.bones) {
              const a = t.bones[s],
                o = e.findBoneIndex(s);
              if (o == -1) throw new Error(`Bone not found: ${s}`);
              for (const d in a) {
                const f = a[d];
                if (d === "rotate") {
                  const u = new Vt(f.length);
                  u.boneIndex = o;
                  let m = 0;
                  for (let g = 0; g < f.length; g++) {
                    const x = f[g];
                    u.setFrame(
                      m,
                      this.getValue(x, "time", 0),
                      this.getValue(x, "angle", 0)
                    ),
                      this.readCurve(x, u, m),
                      m++;
                  }
                  r.push(u),
                    (h = Math.max(
                      h,
                      u.frames[(u.getFrameCount() - 1) * Vt.ENTRIES]
                    ));
                } else if (
                  d === "translate" ||
                  d === "scale" ||
                  d === "shear"
                ) {
                  let u = null,
                    m = 1,
                    g = 0;
                  d === "scale"
                    ? ((u = new te(f.length)), (g = 1))
                    : d === "shear"
                    ? (u = new ee(f.length))
                    : ((u = new Jt(f.length)), (m = i)),
                    (u.boneIndex = o);
                  let x = 0;
                  for (let E = 0; E < f.length; E++) {
                    const w = f[E],
                      b = this.getValue(w, "x", g),
                      p = this.getValue(w, "y", g);
                    u.setFrame(x, this.getValue(w, "time", 0), b * m, p * m),
                      this.readCurve(w, u, x),
                      x++;
                  }
                  r.push(u),
                    (h = Math.max(
                      h,
                      u.frames[(u.getFrameCount() - 1) * Jt.ENTRIES]
                    ));
                } else
                  throw new Error(
                    `Invalid timeline type for a bone: ${d} (${s})`
                  );
              }
            }
          if (t.ik)
            for (const s in t.ik) {
              const a = t.ik[s],
                o = e.findIkConstraint(s),
                d = new Ft(a.length);
              d.ikConstraintIndex = e.ikConstraints.indexOf(o);
              let f = 0;
              for (let u = 0; u < a.length; u++) {
                const m = a[u];
                d.setFrame(
                  f,
                  this.getValue(m, "time", 0),
                  this.getValue(m, "mix", 1),
                  this.getValue(m, "softness", 0) * i,
                  this.getValue(m, "bendPositive", !0) ? 1 : -1,
                  this.getValue(m, "compress", !1),
                  this.getValue(m, "stretch", !1)
                ),
                  this.readCurve(m, d, f),
                  f++;
              }
              r.push(d),
                (h = Math.max(
                  h,
                  d.frames[(d.getFrameCount() - 1) * Ft.ENTRIES]
                ));
            }
          if (t.transform)
            for (const s in t.transform) {
              const a = t.transform[s],
                o = e.findTransformConstraint(s),
                d = new _t(a.length);
              d.transformConstraintIndex = e.transformConstraints.indexOf(o);
              let f = 0;
              for (let u = 0; u < a.length; u++) {
                const m = a[u];
                d.setFrame(
                  f,
                  this.getValue(m, "time", 0),
                  this.getValue(m, "rotateMix", 1),
                  this.getValue(m, "translateMix", 1),
                  this.getValue(m, "scaleMix", 1),
                  this.getValue(m, "shearMix", 1)
                ),
                  this.readCurve(m, d, f),
                  f++;
              }
              r.push(d),
                (h = Math.max(
                  h,
                  d.frames[(d.getFrameCount() - 1) * _t.ENTRIES]
                ));
            }
          if (t.path)
            for (const s in t.path) {
              const a = t.path[s],
                o = e.findPathConstraintIndex(s);
              if (o == -1) throw new Error(`Path constraint not found: ${s}`);
              const d = e.pathConstraints[o];
              for (const f in a) {
                const u = a[f];
                if (f === "position" || f === "spacing") {
                  let m = null,
                    g = 1;
                  f === "spacing"
                    ? ((m = new ke(u.length)),
                      (d.spacingMode == vt.Length ||
                        d.spacingMode == vt.Fixed) &&
                        (g = i))
                    : ((m = new Te(u.length)),
                      d.positionMode == dt.Fixed && (g = i)),
                    (m.pathConstraintIndex = o);
                  let x = 0;
                  for (let E = 0; E < u.length; E++) {
                    const w = u[E];
                    m.setFrame(
                      x,
                      this.getValue(w, "time", 0),
                      this.getValue(w, f, 0) * g
                    ),
                      this.readCurve(w, m, x),
                      x++;
                  }
                  r.push(m),
                    (h = Math.max(
                      h,
                      m.frames[(m.getFrameCount() - 1) * Te.ENTRIES]
                    ));
                } else if (f === "mix") {
                  const m = new me(u.length);
                  m.pathConstraintIndex = o;
                  let g = 0;
                  for (let x = 0; x < u.length; x++) {
                    const E = u[x];
                    m.setFrame(
                      g,
                      this.getValue(E, "time", 0),
                      this.getValue(E, "rotateMix", 1),
                      this.getValue(E, "translateMix", 1)
                    ),
                      this.readCurve(E, m, g),
                      g++;
                  }
                  r.push(m),
                    (h = Math.max(
                      h,
                      m.frames[(m.getFrameCount() - 1) * me.ENTRIES]
                    ));
                }
              }
            }
          if (t.deform)
            for (const s in t.deform) {
              const a = t.deform[s],
                o = e.findSkin(s);
              if (o == null) {
                if (zt.FAIL_ON_NON_EXISTING_SKIN)
                  throw new Error(`Skin not found: ${s}`);
                continue;
              }
              for (const d in a) {
                const f = a[d],
                  u = e.findSlotIndex(d);
                if (u == -1) throw new Error(`Slot not found: ${f.name}`);
                for (const m in f) {
                  const g = f[m],
                    x = o.getAttachment(u, m);
                  if (x == null)
                    throw new Error(`Deform attachment not found: ${g.name}`);
                  const E = x.bones != null,
                    w = x.vertices,
                    b = E ? (w.length / 3) * 2 : w.length,
                    p = new hs(g.length);
                  (p.slotIndex = u), (p.attachment = x);
                  let S = 0;
                  for (let y = 0; y < g.length; y++) {
                    const M = g[y];
                    let T;
                    const k = this.getValue(M, "vertices", null);
                    if (k == null) T = E ? v.newFloatArray(b) : w;
                    else {
                      T = v.newFloatArray(b);
                      const I = this.getValue(M, "offset", 0);
                      if ((v.arrayCopy(k, 0, T, I, k.length), i != 1))
                        for (let R = I, V = R + k.length; R < V; R++) T[R] *= i;
                      if (!E) for (let R = 0; R < b; R++) T[R] += w[R];
                    }
                    p.setFrame(S, this.getValue(M, "time", 0), T),
                      this.readCurve(M, p, S),
                      S++;
                  }
                  r.push(p), (h = Math.max(h, p.frames[p.getFrameCount() - 1]));
                }
              }
            }
          let l = t.drawOrder;
          if ((l == null && (l = t.draworder), l != null)) {
            const s = new xn(l.length),
              a = e.slots.length;
            let o = 0;
            for (let d = 0; d < l.length; d++) {
              const f = l[d];
              let u = null;
              const m = this.getValue(f, "offsets", null);
              if (m != null) {
                u = v.newArray(a, -1);
                const g = v.newArray(a - m.length, 0);
                let x = 0,
                  E = 0;
                for (let w = 0; w < m.length; w++) {
                  const b = m[w],
                    p = e.findSlotIndex(b.slot);
                  if (p == -1) throw new Error(`Slot not found: ${b.slot}`);
                  for (; x != p; ) g[E++] = x++;
                  u[x + b.offset] = x++;
                }
                for (; x < a; ) g[E++] = x++;
                for (let w = a - 1; w >= 0; w--) u[w] == -1 && (u[w] = g[--E]);
              }
              s.setFrame(o++, this.getValue(f, "time", 0), u);
            }
            r.push(s), (h = Math.max(h, s.frames[s.getFrameCount() - 1]));
          }
          if (t.events) {
            const s = new Yn(t.events.length);
            let a = 0;
            for (let o = 0; o < t.events.length; o++) {
              const d = t.events[o],
                f = e.findEvent(d.name);
              if (f == null) throw new Error(`Event not found: ${d.name}`);
              const u = new ws(
                v.toSinglePrecision(this.getValue(d, "time", 0)),
                f
              );
              (u.intValue = this.getValue(d, "int", f.intValue)),
                (u.floatValue = this.getValue(d, "float", f.floatValue)),
                (u.stringValue = this.getValue(d, "string", f.stringValue)),
                u.data.audioPath != null &&
                  ((u.volume = this.getValue(d, "volume", 1)),
                  (u.balance = this.getValue(d, "balance", 0))),
                s.setFrame(a++, u);
            }
            r.push(s), (h = Math.max(h, s.frames[s.getFrameCount() - 1]));
          }
          if (isNaN(h))
            throw new Error("Error while parsing animation, duration is NaN");
          e.animations.push(new Et(n, r, h));
        }
        readCurve(t, n, e) {
          if (t.hasOwnProperty("curve"))
            if (t.curve === "stepped") n.setStepped(e);
            else {
              const i = t.curve;
              n.setCurve(
                e,
                i,
                this.getValue(t, "c2", 0),
                this.getValue(t, "c3", 1),
                this.getValue(t, "c4", 1)
              );
            }
        }
        getValue(t, n, e) {
          return t[n] !== void 0 ? t[n] : e;
        }
        static blendModeFromString(t) {
          if (((t = t.toLowerCase()), t == "normal"))
            return H.BLEND_MODES.NORMAL;
          if (t == "additive") return H.BLEND_MODES.ADD;
          if (t == "multiply") return H.BLEND_MODES.MULTIPLY;
          if (t == "screen") return H.BLEND_MODES.SCREEN;
          throw new Error(`Unknown blend mode: ${t}`);
        }
        static positionModeFromString(t) {
          if (((t = t.toLowerCase()), t == "fixed")) return dt.Fixed;
          if (t == "percent") return dt.Percent;
          throw new Error(`Unknown position mode: ${t}`);
        }
        static spacingModeFromString(t) {
          if (((t = t.toLowerCase()), t == "length")) return vt.Length;
          if (t == "fixed") return vt.Fixed;
          if (t == "percent") return vt.Percent;
          throw new Error(`Unknown position mode: ${t}`);
        }
        static rotateModeFromString(t) {
          if (((t = t.toLowerCase()), t == "tangent")) return pt.Tangent;
          if (t == "chain") return pt.Chain;
          if (t == "chainscale") return pt.ChainScale;
          throw new Error(`Unknown rotate mode: ${t}`);
        }
        static transformModeFromString(t) {
          if (((t = t.toLowerCase()), t == "normal")) return j.Normal;
          if (t == "onlytranslation") return j.OnlyTranslation;
          if (t == "norotationorreflection") return j.NoRotationOrReflection;
          if (t == "noscale") return j.NoScale;
          if (t == "noscaleorreflection") return j.NoScaleOrReflection;
          throw new Error(`Unknown transform mode: ${t}`);
        }
      },
      Xr = class {
        constructor(t, n, e, i, r) {
          (this.mesh = t),
            (this.skin = n),
            (this.slotIndex = e),
            (this.parent = i),
            (this.inheritDeform = r);
        }
      };
    var Nr = Object.freeze({
      __proto__: null,
      Animation: Et,
      AnimationState: ne,
      AnimationStateAdapter: Pr,
      AnimationStateData: ms,
      AtlasAttachmentLoader: gs,
      Attachment: rs,
      AttachmentTimeline: en,
      Bone: xs,
      BoneData: ps,
      BoundingBoxAttachment: as,
      ClippingAttachment: os,
      ColorTimeline: Lt,
      ConstraintData: Nn,
      CurveTimeline: Ht,
      DeformTimeline: hs,
      DrawOrderTimeline: xn,
      Event: ws,
      EventData: bs,
      EventQueue: fs,
      EventTimeline: Yn,
      EventType: Gt,
      IkConstraint: Fi,
      IkConstraintData: Es,
      IkConstraintTimeline: Ft,
      JitterEffect: vr,
      MeshAttachment: mn,
      PathAttachment: gn,
      PathConstraint: pn,
      PathConstraintData: Ss,
      PathConstraintMixTimeline: me,
      PathConstraintPositionTimeline: Te,
      PathConstraintSpacingTimeline: ke,
      PointAttachment: ls,
      RegionAttachment: Q,
      RotateTimeline: Vt,
      ScaleTimeline: te,
      ShearTimeline: ee,
      Skeleton: ys,
      SkeletonBinary: Mt,
      SkeletonBounds: Yr,
      SkeletonData: Ms,
      SkeletonJson: sn,
      Skin: Bn,
      SkinEntry: Ts,
      Slot: cs,
      SlotData: As,
      SpacingMode: vt,
      Spine: class extends tn {
        createSkeleton(t) {
          (this.skeleton = new ys(t)),
            this.skeleton.updateWorldTransform(),
            (this.stateData = new ms(t)),
            (this.state = new ne(this.stateData));
        }
      },
      SwirlEffect: vi,
      TimelineType: Pi,
      TrackEntry: Xn,
      TransformConstraint: Yi,
      TransformConstraintData: Cs,
      TransformConstraintTimeline: _t,
      TranslateTimeline: Jt,
      TwoColorTimeline: yt,
      VertexAttachment: ze,
    });
    let ks = class {
      constructor(t) {
        if (t == null) throw new Error("name cannot be null.");
        this.name = t;
      }
    };
    const Xi = class extends ks {
      constructor(t) {
        super(t),
          (this.id = (Xi.nextID++ & 65535) << 11),
          (this.worldVerticesLength = 0);
      }
      computeWorldVerticesOld(t, n) {
        this.computeWorldVertices(t, 0, this.worldVerticesLength, n, 0, 2);
      }
      computeWorldVertices(t, n, e, i, r, h) {
        e = r + (e >> 1) * h;
        const l = t.bone.skeleton,
          s = t.attachmentVertices;
        let a = this.vertices;
        const o = this.bones;
        if (o == null) {
          s.length > 0 && (a = s);
          const m = t.bone.matrix,
            g = m.tx,
            x = m.ty,
            E = m.a,
            w = m.c,
            b = m.b,
            p = m.d;
          for (let S = n, y = r; y < e; S += 2, y += h) {
            const M = a[S],
              T = a[S + 1];
            (i[y] = M * E + T * w + g), (i[y + 1] = M * b + T * p + x);
          }
          return;
        }
        let d = 0,
          f = 0;
        for (let m = 0; m < n; m += 2) {
          const g = o[d];
          (d += g + 1), (f += g);
        }
        const u = l.bones;
        if (s.length == 0)
          for (let m = r, g = f * 3; m < e; m += h) {
            let x = 0,
              E = 0,
              w = o[d++];
            for (w += d; d < w; d++, g += 3) {
              const b = u[o[d]].matrix,
                p = a[g],
                S = a[g + 1],
                y = a[g + 2];
              (x += (p * b.a + S * b.c + b.tx) * y),
                (E += (p * b.b + S * b.d + b.ty) * y);
            }
            (i[m] = x), (i[m + 1] = E);
          }
        else {
          const m = s;
          for (let g = r, x = f * 3, E = f << 1; g < e; g += h) {
            let w = 0,
              b = 0,
              p = o[d++];
            for (p += d; d < p; d++, x += 3, E += 2) {
              const S = u[o[d]].matrix,
                y = a[x] + m[E],
                M = a[x + 1] + m[E + 1],
                T = a[x + 2];
              (w += (y * S.a + M * S.c + S.tx) * T),
                (b += (y * S.b + M * S.d + S.ty) * T);
            }
            (i[g] = w), (i[g + 1] = b);
          }
        }
      }
      applyDeform(t) {
        return this == t;
      }
    };
    let Ge = Xi;
    Ge.nextID = 0;
    let Ni = class extends Ge {
        constructor(t) {
          super(t),
            (this.type = Z.BoundingBox),
            (this.color = new _(1, 1, 1, 1));
        }
      },
      Bi = class extends Ge {
        constructor(t) {
          super(t),
            (this.type = Z.Clipping),
            (this.color = new _(0.2275, 0.2275, 0.8078, 1));
        }
      },
      Is = class extends Ge {
        constructor(t) {
          super(t),
            (this.type = Z.Mesh),
            (this.color = new _(1, 1, 1, 1)),
            (this.inheritDeform = !1),
            (this.tempColor = new _(0, 0, 0, 0));
        }
        applyDeform(t) {
          return this == t || (this.inheritDeform && this.parentMesh == t);
        }
        getParentMesh() {
          return this.parentMesh;
        }
        setParentMesh(t) {
          (this.parentMesh = t),
            t != null &&
              ((this.bones = t.bones),
              (this.vertices = t.vertices),
              (this.worldVerticesLength = t.worldVerticesLength),
              (this.regionUVs = t.regionUVs),
              (this.triangles = t.triangles),
              (this.hullLength = t.hullLength),
              (this.worldVerticesLength = t.worldVerticesLength));
        }
      },
      kn = class extends Ge {
        constructor(t) {
          super(t),
            (this.type = Z.Path),
            (this.closed = !1),
            (this.constantSpeed = !1),
            (this.color = new _(1, 1, 1, 1));
        }
      },
      Di = class extends Ge {
        constructor(t) {
          super(t),
            (this.type = Z.Point),
            (this.color = new _(0.38, 0.94, 0, 1));
        }
        computeWorldPosition(t, n) {
          const e = t.matrix;
          return (
            (n.x = this.x * e.a + this.y * e.c + t.worldX),
            (n.y = this.x * e.b + this.y * e.d + t.worldY),
            n
          );
        }
        computeWorldRotation(t) {
          const n = t.matrix,
            e = C.cosDeg(this.rotation),
            i = C.sinDeg(this.rotation),
            r = e * n.a + i * n.c,
            h = e * n.b + i * n.d;
          return Math.atan2(h, r) * C.radDeg;
        }
      },
      Rs = class {
        constructor(t, n) {
          if (((this.attachmentVertices = new Array()), t == null))
            throw new Error("data cannot be null.");
          if (n == null) throw new Error("bone cannot be null.");
          (this.data = t),
            (this.bone = n),
            (this.color = new _()),
            (this.darkColor = t.darkColor == null ? null : new _()),
            this.setToSetupPose(),
            (this.blendMode = this.data.blendMode);
        }
        getAttachment() {
          return this.attachment;
        }
        setAttachment(t) {
          this.attachment != t &&
            ((this.attachment = t),
            (this.attachmentTime = this.bone.skeleton.time),
            (this.attachmentVertices.length = 0));
        }
        setAttachmentTime(t) {
          this.attachmentTime = this.bone.skeleton.time - t;
        }
        getAttachmentTime() {
          return this.bone.skeleton.time - this.attachmentTime;
        }
        setToSetupPose() {
          this.color.setFromColor(this.data.color),
            this.darkColor != null &&
              this.darkColor.setFromColor(this.data.darkColor),
            this.data.attachmentName == null
              ? (this.attachment = null)
              : ((this.attachment = null),
                this.setAttachment(
                  this.bone.skeleton.getAttachment(
                    this.data.index,
                    this.data.attachmentName
                  )
                ));
        }
      };
    const Yt = class extends ks {
      constructor(t) {
        super(t),
          (this.type = Z.Region),
          (this.x = 0),
          (this.y = 0),
          (this.scaleX = 1),
          (this.scaleY = 1),
          (this.rotation = 0),
          (this.width = 0),
          (this.height = 0),
          (this.color = new _(1, 1, 1, 1)),
          (this.offset = v.newFloatArray(8)),
          (this.uvs = v.newFloatArray(8)),
          (this.tempColor = new _(1, 1, 1, 1));
      }
      updateOffset() {
        const t = (this.width / this.region.originalWidth) * this.scaleX,
          n = (this.height / this.region.originalHeight) * this.scaleY,
          e = (-this.width / 2) * this.scaleX + this.region.offsetX * t,
          i = (-this.height / 2) * this.scaleY + this.region.offsetY * n,
          r = e + this.region.width * t,
          h = i + this.region.height * n,
          l = (this.rotation * Math.PI) / 180,
          s = Math.cos(l),
          a = Math.sin(l),
          o = e * s + this.x,
          d = e * a,
          f = i * s + this.y,
          u = i * a,
          m = r * s + this.x,
          g = r * a,
          x = h * s + this.y,
          E = h * a,
          w = this.offset;
        (w[Yt.OX1] = o - u),
          (w[Yt.OY1] = f + d),
          (w[Yt.OX2] = o - E),
          (w[Yt.OY2] = x + d),
          (w[Yt.OX3] = m - E),
          (w[Yt.OY3] = x + g),
          (w[Yt.OX4] = m - u),
          (w[Yt.OY4] = f + g);
      }
      setRegion(t) {
        this.region = t;
        const n = this.uvs;
        t.rotate
          ? ((n[2] = t.u),
            (n[3] = t.v2),
            (n[4] = t.u),
            (n[5] = t.v),
            (n[6] = t.u2),
            (n[7] = t.v),
            (n[0] = t.u2),
            (n[1] = t.v2))
          : ((n[0] = t.u),
            (n[1] = t.v2),
            (n[2] = t.u),
            (n[3] = t.v),
            (n[4] = t.u2),
            (n[5] = t.v),
            (n[6] = t.u2),
            (n[7] = t.v2));
      }
      computeWorldVertices(t, n, e, i) {
        const r = this.offset,
          h = t instanceof Rs ? t.bone.matrix : t.matrix,
          l = h.tx,
          s = h.ty,
          a = h.a,
          o = h.c,
          d = h.b,
          f = h.d;
        let u = 0,
          m = 0;
        (u = r[Yt.OX1]),
          (m = r[Yt.OY1]),
          (n[e] = u * a + m * o + l),
          (n[e + 1] = u * d + m * f + s),
          (e += i),
          (u = r[Yt.OX2]),
          (m = r[Yt.OY2]),
          (n[e] = u * a + m * o + l),
          (n[e + 1] = u * d + m * f + s),
          (e += i),
          (u = r[Yt.OX3]),
          (m = r[Yt.OY3]),
          (n[e] = u * a + m * o + l),
          (n[e + 1] = u * d + m * f + s),
          (e += i),
          (u = r[Yt.OX4]),
          (m = r[Yt.OY4]),
          (n[e] = u * a + m * o + l),
          (n[e + 1] = u * d + m * f + s);
      }
    };
    let K = Yt;
    (K.OX1 = 0),
      (K.OY1 = 1),
      (K.OX2 = 2),
      (K.OY2 = 3),
      (K.OX3 = 4),
      (K.OY3 = 5),
      (K.OX4 = 6),
      (K.OY4 = 7),
      (K.X1 = 0),
      (K.Y1 = 1),
      (K.C1R = 2),
      (K.C1G = 3),
      (K.C1B = 4),
      (K.C1A = 5),
      (K.U1 = 6),
      (K.V1 = 7),
      (K.X2 = 8),
      (K.Y2 = 9),
      (K.C2R = 10),
      (K.C2G = 11),
      (K.C2B = 12),
      (K.C2A = 13),
      (K.U2 = 14),
      (K.V2 = 15),
      (K.X3 = 16),
      (K.Y3 = 17),
      (K.C3R = 18),
      (K.C3G = 19),
      (K.C3B = 20),
      (K.C3A = 21),
      (K.U3 = 22),
      (K.V3 = 23),
      (K.X4 = 24),
      (K.Y4 = 25),
      (K.C4R = 26),
      (K.C4G = 27),
      (K.C4B = 28),
      (K.C4A = 29),
      (K.U4 = 30),
      (K.V4 = 31);
    class Br {
      constructor(t, n) {
        (this.jitterX = 0),
          (this.jitterY = 0),
          (this.jitterX = t),
          (this.jitterY = n);
      }
      begin(t) {}
      transform(t, n, e, i) {
        (t.x += C.randomTriangular(-this.jitterX, this.jitterY)),
          (t.y += C.randomTriangular(-this.jitterX, this.jitterY));
      }
      end() {}
    }
    const Li = class {
      constructor(c) {
        (this.centerX = 0),
          (this.centerY = 0),
          (this.radius = 0),
          (this.angle = 0),
          (this.worldX = 0),
          (this.worldY = 0),
          (this.radius = c);
      }
      begin(c) {
        (this.worldX = c.x + this.centerX), (this.worldY = c.y + this.centerY);
      }
      transform(c, t, n, e) {
        const i = this.angle * C.degreesToRadians,
          r = c.x - this.worldX,
          h = c.y - this.worldY,
          l = Math.sqrt(r * r + h * h);
        if (l < this.radius) {
          const s = Li.interpolation.apply(
              0,
              i,
              (this.radius - l) / this.radius
            ),
            a = Math.cos(s),
            o = Math.sin(s);
          (c.x = a * r - o * h + this.worldX),
            (c.y = o * r + a * h + this.worldY);
        }
      }
      end() {}
    };
    let _i = Li;
    _i.interpolation = new is(2);
    let Ct = class {
      constructor(t, n, e) {
        if (t == null) throw new Error("name cannot be null.");
        if (n == null) throw new Error("timelines cannot be null.");
        (this.name = t), (this.timelines = n), (this.duration = e);
      }
      apply(t, n, e, i, r, h, l, s) {
        if (t == null) throw new Error("skeleton cannot be null.");
        i &&
          this.duration != 0 &&
          ((e %= this.duration), n > 0 && (n %= this.duration));
        const a = this.timelines;
        for (let o = 0, d = a.length; o < d; o++)
          a[o].apply(t, n, e, r, h, l, s);
      }
      static binarySearch(t, n, e = 1) {
        let i = 0,
          r = t.length / e - 2;
        if (r == 0) return e;
        let h = r >>> 1;
        for (;;) {
          if ((t[(h + 1) * e] <= n ? (i = h + 1) : (r = h), i == r))
            return (i + 1) * e;
          h = (i + r) >>> 1;
        }
      }
      static linearSearch(t, n, e) {
        for (let i = 0, r = t.length - e; i <= r; i += e)
          if (t[i] > n) return i;
        return -1;
      }
    };
    var Oi = ((c) => (
      (c[(c.rotate = 0)] = "rotate"),
      (c[(c.translate = 1)] = "translate"),
      (c[(c.scale = 2)] = "scale"),
      (c[(c.shear = 3)] = "shear"),
      (c[(c.attachment = 4)] = "attachment"),
      (c[(c.color = 5)] = "color"),
      (c[(c.deform = 6)] = "deform"),
      (c[(c.event = 7)] = "event"),
      (c[(c.drawOrder = 8)] = "drawOrder"),
      (c[(c.ikConstraint = 9)] = "ikConstraint"),
      (c[(c.transformConstraint = 10)] = "transformConstraint"),
      (c[(c.pathConstraintPosition = 11)] = "pathConstraintPosition"),
      (c[(c.pathConstraintSpacing = 12)] = "pathConstraintSpacing"),
      (c[(c.pathConstraintMix = 13)] = "pathConstraintMix"),
      (c[(c.twoColor = 14)] = "twoColor"),
      c
    ))(Oi || {});
    const At = class {
      constructor(c) {
        if (c <= 0) throw new Error(`frameCount must be > 0: ${c}`);
        this.curves = v.newFloatArray((c - 1) * At.BEZIER_SIZE);
      }
      getFrameCount() {
        return this.curves.length / At.BEZIER_SIZE + 1;
      }
      setLinear(c) {
        this.curves[c * At.BEZIER_SIZE] = At.LINEAR;
      }
      setStepped(c) {
        this.curves[c * At.BEZIER_SIZE] = At.STEPPED;
      }
      getCurveType(c) {
        const t = c * At.BEZIER_SIZE;
        if (t == this.curves.length) return At.LINEAR;
        const n = this.curves[t];
        return n == At.LINEAR
          ? At.LINEAR
          : n == At.STEPPED
          ? At.STEPPED
          : At.BEZIER;
      }
      setCurve(c, t, n, e, i) {
        const r = (-t * 2 + e) * 0.03,
          h = (-n * 2 + i) * 0.03,
          l = ((t - e) * 3 + 1) * 0.006,
          s = ((n - i) * 3 + 1) * 0.006;
        let a = r * 2 + l,
          o = h * 2 + s,
          d = t * 0.3 + r + l * 0.16666667,
          f = n * 0.3 + h + s * 0.16666667,
          u = c * At.BEZIER_SIZE;
        const m = this.curves;
        m[u++] = At.BEZIER;
        let g = d,
          x = f;
        for (let E = u + At.BEZIER_SIZE - 1; u < E; u += 2)
          (m[u] = g),
            (m[u + 1] = x),
            (d += a),
            (f += o),
            (a += l),
            (o += s),
            (g += d),
            (x += f);
      }
      getCurvePercent(c, t) {
        t = C.clamp(t, 0, 1);
        const n = this.curves;
        let e = c * At.BEZIER_SIZE;
        const i = n[e];
        if (i == At.LINEAR) return t;
        if (i == At.STEPPED) return 0;
        e++;
        let r = 0;
        for (let l = e, s = e + At.BEZIER_SIZE - 1; e < s; e += 2)
          if (((r = n[e]), r >= t)) {
            let a, o;
            return (
              e == l ? ((a = 0), (o = 0)) : ((a = n[e - 2]), (o = n[e - 1])),
              o + ((n[e + 1] - o) * (t - a)) / (r - a)
            );
          }
        const h = n[e - 1];
        return h + ((1 - h) * (t - r)) / (1 - r);
      }
    };
    let jt = At;
    (jt.LINEAR = 0),
      (jt.STEPPED = 1),
      (jt.BEZIER = 2),
      (jt.BEZIER_SIZE = 10 * 2 - 1);
    const je = class extends jt {
      constructor(c) {
        super(c), (this.frames = v.newFloatArray(c << 1));
      }
      getPropertyId() {
        return (0 << 24) + this.boneIndex;
      }
      setFrame(c, t, n) {
        (c <<= 1), (this.frames[c] = t), (this.frames[c + je.ROTATION] = n);
      }
      apply(c, t, n, e, i, r, h) {
        const l = this.frames,
          s = c.bones[this.boneIndex];
        if (n < l[0]) {
          switch (r) {
            case A.setup:
              s.rotation = s.data.rotation;
              return;
            case A.first:
              const m = s.data.rotation - s.rotation;
              s.rotation +=
                (m - (16384 - ((16384.499999999996 - m / 360) | 0)) * 360) * i;
          }
          return;
        }
        if (n >= l[l.length - je.ENTRIES]) {
          let m = l[l.length + je.PREV_ROTATION];
          switch (r) {
            case A.setup:
              s.rotation = s.data.rotation + m * i;
              break;
            case A.first:
            case A.replace:
              (m += s.data.rotation - s.rotation),
                (m -= (16384 - ((16384.499999999996 - m / 360) | 0)) * 360);
            case A.add:
              s.rotation += m * i;
          }
          return;
        }
        const a = Ct.binarySearch(l, n, je.ENTRIES),
          o = l[a + je.PREV_ROTATION],
          d = l[a],
          f = this.getCurvePercent(
            (a >> 1) - 1,
            1 - (n - d) / (l[a + je.PREV_TIME] - d)
          );
        let u = l[a + je.ROTATION] - o;
        switch (
          ((u =
            o + (u - (16384 - ((16384.499999999996 - u / 360) | 0)) * 360) * f),
          r)
        ) {
          case A.setup:
            s.rotation =
              s.data.rotation +
              (u - (16384 - ((16384.499999999996 - u / 360) | 0)) * 360) * i;
            break;
          case A.first:
          case A.replace:
            u += s.data.rotation - s.rotation;
          case A.add:
            s.rotation +=
              (u - (16384 - ((16384.499999999996 - u / 360) | 0)) * 360) * i;
        }
      }
    };
    let $t = je;
    ($t.ENTRIES = 2),
      ($t.PREV_TIME = -2),
      ($t.PREV_ROTATION = -1),
      ($t.ROTATION = 1);
    const Wt = class extends jt {
      constructor(c) {
        super(c), (this.frames = v.newFloatArray(c * Wt.ENTRIES));
      }
      getPropertyId() {
        return (1 << 24) + this.boneIndex;
      }
      setFrame(c, t, n, e) {
        (c *= Wt.ENTRIES),
          (this.frames[c] = t),
          (this.frames[c + Wt.X] = n),
          (this.frames[c + Wt.Y] = e);
      }
      apply(c, t, n, e, i, r, h) {
        const l = this.frames,
          s = c.bones[this.boneIndex];
        if (n < l[0]) {
          switch (r) {
            case A.setup:
              (s.x = s.data.x), (s.y = s.data.y);
              return;
            case A.first:
              (s.x += (s.data.x - s.x) * i), (s.y += (s.data.y - s.y) * i);
          }
          return;
        }
        let a = 0,
          o = 0;
        if (n >= l[l.length - Wt.ENTRIES])
          (a = l[l.length + Wt.PREV_X]), (o = l[l.length + Wt.PREV_Y]);
        else {
          const d = Ct.binarySearch(l, n, Wt.ENTRIES);
          (a = l[d + Wt.PREV_X]), (o = l[d + Wt.PREV_Y]);
          const f = l[d],
            u = this.getCurvePercent(
              d / Wt.ENTRIES - 1,
              1 - (n - f) / (l[d + Wt.PREV_TIME] - f)
            );
          (a += (l[d + Wt.X] - a) * u), (o += (l[d + Wt.Y] - o) * u);
        }
        switch (r) {
          case A.setup:
            (s.x = s.data.x + a * i), (s.y = s.data.y + o * i);
            break;
          case A.first:
          case A.replace:
            (s.x += (s.data.x + a - s.x) * i),
              (s.y += (s.data.y + o - s.y) * i);
            break;
          case A.add:
            (s.x += a * i), (s.y += o * i);
        }
      }
    };
    let ge = Wt;
    (ge.ENTRIES = 3),
      (ge.PREV_TIME = -3),
      (ge.PREV_X = -2),
      (ge.PREV_Y = -1),
      (ge.X = 1),
      (ge.Y = 2);
    let le = class extends ge {
        constructor(t) {
          super(t);
        }
        getPropertyId() {
          return (2 << 24) + this.boneIndex;
        }
        apply(t, n, e, i, r, h, l) {
          const s = this.frames,
            a = t.bones[this.boneIndex];
          if (e < s[0]) {
            switch (h) {
              case A.setup:
                (a.scaleX = a.data.scaleX), (a.scaleY = a.data.scaleY);
                return;
              case A.first:
                (a.scaleX += (a.data.scaleX - a.scaleX) * r),
                  (a.scaleY += (a.data.scaleY - a.scaleY) * r);
            }
            return;
          }
          let o = 0,
            d = 0;
          if (e >= s[s.length - le.ENTRIES])
            (o = s[s.length + le.PREV_X] * a.data.scaleX),
              (d = s[s.length + le.PREV_Y] * a.data.scaleY);
          else {
            const f = Ct.binarySearch(s, e, le.ENTRIES);
            (o = s[f + le.PREV_X]), (d = s[f + le.PREV_Y]);
            const u = s[f],
              m = this.getCurvePercent(
                f / le.ENTRIES - 1,
                1 - (e - u) / (s[f + le.PREV_TIME] - u)
              );
            (o = (o + (s[f + le.X] - o) * m) * a.data.scaleX),
              (d = (d + (s[f + le.Y] - d) * m) * a.data.scaleY);
          }
          if (r == 1)
            h == A.add
              ? ((a.scaleX += o - a.data.scaleX),
                (a.scaleY += d - a.data.scaleY))
              : ((a.scaleX = o), (a.scaleY = d));
          else {
            let f = 0,
              u = 0;
            if (l == J.mixOut)
              switch (h) {
                case A.setup:
                  (f = a.data.scaleX),
                    (u = a.data.scaleY),
                    (a.scaleX = f + (Math.abs(o) * C.signum(f) - f) * r),
                    (a.scaleY = u + (Math.abs(d) * C.signum(u) - u) * r);
                  break;
                case A.first:
                case A.replace:
                  (f = a.scaleX),
                    (u = a.scaleY),
                    (a.scaleX = f + (Math.abs(o) * C.signum(f) - f) * r),
                    (a.scaleY = u + (Math.abs(d) * C.signum(u) - u) * r);
                  break;
                case A.add:
                  (f = a.scaleX),
                    (u = a.scaleY),
                    (a.scaleX =
                      f + (Math.abs(o) * C.signum(f) - a.data.scaleX) * r),
                    (a.scaleY =
                      u + (Math.abs(d) * C.signum(u) - a.data.scaleY) * r);
              }
            else
              switch (h) {
                case A.setup:
                  (f = Math.abs(a.data.scaleX) * C.signum(o)),
                    (u = Math.abs(a.data.scaleY) * C.signum(d)),
                    (a.scaleX = f + (o - f) * r),
                    (a.scaleY = u + (d - u) * r);
                  break;
                case A.first:
                case A.replace:
                  (f = Math.abs(a.scaleX) * C.signum(o)),
                    (u = Math.abs(a.scaleY) * C.signum(d)),
                    (a.scaleX = f + (o - f) * r),
                    (a.scaleY = u + (d - u) * r);
                  break;
                case A.add:
                  (f = C.signum(o)),
                    (u = C.signum(d)),
                    (a.scaleX =
                      Math.abs(a.scaleX) * f +
                      (o - Math.abs(a.data.scaleX) * f) * r),
                    (a.scaleY =
                      Math.abs(a.scaleY) * u +
                      (d - Math.abs(a.data.scaleY) * u) * r);
              }
          }
        }
      },
      ce = class extends ge {
        constructor(t) {
          super(t);
        }
        getPropertyId() {
          return (3 << 24) + this.boneIndex;
        }
        apply(t, n, e, i, r, h, l) {
          const s = this.frames,
            a = t.bones[this.boneIndex];
          if (e < s[0]) {
            switch (h) {
              case A.setup:
                (a.shearX = a.data.shearX), (a.shearY = a.data.shearY);
                return;
              case A.first:
                (a.shearX += (a.data.shearX - a.shearX) * r),
                  (a.shearY += (a.data.shearY - a.shearY) * r);
            }
            return;
          }
          let o = 0,
            d = 0;
          if (e >= s[s.length - ce.ENTRIES])
            (o = s[s.length + ce.PREV_X]), (d = s[s.length + ce.PREV_Y]);
          else {
            const f = Ct.binarySearch(s, e, ce.ENTRIES);
            (o = s[f + ce.PREV_X]), (d = s[f + ce.PREV_Y]);
            const u = s[f],
              m = this.getCurvePercent(
                f / ce.ENTRIES - 1,
                1 - (e - u) / (s[f + ce.PREV_TIME] - u)
              );
            (o = o + (s[f + ce.X] - o) * m), (d = d + (s[f + ce.Y] - d) * m);
          }
          switch (h) {
            case A.setup:
              (a.shearX = a.data.shearX + o * r),
                (a.shearY = a.data.shearY + d * r);
              break;
            case A.first:
            case A.replace:
              (a.shearX += (a.data.shearX + o - a.shearX) * r),
                (a.shearY += (a.data.shearY + d - a.shearY) * r);
              break;
            case A.add:
              (a.shearX += o * r), (a.shearY += d * r);
          }
        }
      };
    const gt = class extends jt {
      constructor(c) {
        super(c), (this.frames = v.newFloatArray(c * gt.ENTRIES));
      }
      getPropertyId() {
        return (5 << 24) + this.slotIndex;
      }
      setFrame(c, t, n, e, i, r) {
        (c *= gt.ENTRIES),
          (this.frames[c] = t),
          (this.frames[c + gt.R] = n),
          (this.frames[c + gt.G] = e),
          (this.frames[c + gt.B] = i),
          (this.frames[c + gt.A] = r);
      }
      apply(c, t, n, e, i, r, h) {
        const l = c.slots[this.slotIndex],
          s = this.frames;
        if (n < s[0]) {
          switch (r) {
            case A.setup:
              l.color.setFromColor(l.data.color);
              return;
            case A.first:
              const u = l.color,
                m = l.data.color;
              u.add(
                (m.r - u.r) * i,
                (m.g - u.g) * i,
                (m.b - u.b) * i,
                (m.a - u.a) * i
              );
          }
          return;
        }
        let a = 0,
          o = 0,
          d = 0,
          f = 0;
        if (n >= s[s.length - gt.ENTRIES]) {
          const u = s.length;
          (a = s[u + gt.PREV_R]),
            (o = s[u + gt.PREV_G]),
            (d = s[u + gt.PREV_B]),
            (f = s[u + gt.PREV_A]);
        } else {
          const u = Ct.binarySearch(s, n, gt.ENTRIES);
          (a = s[u + gt.PREV_R]),
            (o = s[u + gt.PREV_G]),
            (d = s[u + gt.PREV_B]),
            (f = s[u + gt.PREV_A]);
          const m = s[u],
            g = this.getCurvePercent(
              u / gt.ENTRIES - 1,
              1 - (n - m) / (s[u + gt.PREV_TIME] - m)
            );
          (a += (s[u + gt.R] - a) * g),
            (o += (s[u + gt.G] - o) * g),
            (d += (s[u + gt.B] - d) * g),
            (f += (s[u + gt.A] - f) * g);
        }
        if (i == 1) l.color.set(a, o, d, f);
        else {
          const u = l.color;
          r == A.setup && u.setFromColor(l.data.color),
            u.add((a - u.r) * i, (o - u.g) * i, (d - u.b) * i, (f - u.a) * i);
        }
      }
    };
    let se = gt;
    (se.ENTRIES = 5),
      (se.PREV_TIME = -5),
      (se.PREV_R = -4),
      (se.PREV_G = -3),
      (se.PREV_B = -2),
      (se.PREV_A = -1),
      (se.R = 1),
      (se.G = 2),
      (se.B = 3),
      (se.A = 4);
    const st = class extends jt {
      constructor(c) {
        super(c), (this.frames = v.newFloatArray(c * st.ENTRIES));
      }
      getPropertyId() {
        return (14 << 24) + this.slotIndex;
      }
      setFrame(c, t, n, e, i, r, h, l, s) {
        (c *= st.ENTRIES),
          (this.frames[c] = t),
          (this.frames[c + st.R] = n),
          (this.frames[c + st.G] = e),
          (this.frames[c + st.B] = i),
          (this.frames[c + st.A] = r),
          (this.frames[c + st.R2] = h),
          (this.frames[c + st.G2] = l),
          (this.frames[c + st.B2] = s);
      }
      apply(c, t, n, e, i, r, h) {
        const l = c.slots[this.slotIndex],
          s = this.frames;
        if (n < s[0]) {
          switch (r) {
            case A.setup:
              l.color.setFromColor(l.data.color),
                l.darkColor.setFromColor(l.data.darkColor);
              return;
            case A.first:
              const x = l.color,
                E = l.darkColor,
                w = l.data.color,
                b = l.data.darkColor;
              x.add(
                (w.r - x.r) * i,
                (w.g - x.g) * i,
                (w.b - x.b) * i,
                (w.a - x.a) * i
              ),
                E.add((b.r - E.r) * i, (b.g - E.g) * i, (b.b - E.b) * i, 0);
          }
          return;
        }
        let a = 0,
          o = 0,
          d = 0,
          f = 0,
          u = 0,
          m = 0,
          g = 0;
        if (n >= s[s.length - st.ENTRIES]) {
          const x = s.length;
          (a = s[x + st.PREV_R]),
            (o = s[x + st.PREV_G]),
            (d = s[x + st.PREV_B]),
            (f = s[x + st.PREV_A]),
            (u = s[x + st.PREV_R2]),
            (m = s[x + st.PREV_G2]),
            (g = s[x + st.PREV_B2]);
        } else {
          const x = Ct.binarySearch(s, n, st.ENTRIES);
          (a = s[x + st.PREV_R]),
            (o = s[x + st.PREV_G]),
            (d = s[x + st.PREV_B]),
            (f = s[x + st.PREV_A]),
            (u = s[x + st.PREV_R2]),
            (m = s[x + st.PREV_G2]),
            (g = s[x + st.PREV_B2]);
          const E = s[x],
            w = this.getCurvePercent(
              x / st.ENTRIES - 1,
              1 - (n - E) / (s[x + st.PREV_TIME] - E)
            );
          (a += (s[x + st.R] - a) * w),
            (o += (s[x + st.G] - o) * w),
            (d += (s[x + st.B] - d) * w),
            (f += (s[x + st.A] - f) * w),
            (u += (s[x + st.R2] - u) * w),
            (m += (s[x + st.G2] - m) * w),
            (g += (s[x + st.B2] - g) * w);
        }
        if (i == 1) l.color.set(a, o, d, f), l.darkColor.set(u, m, g, 1);
        else {
          const x = l.color,
            E = l.darkColor;
          r == A.setup &&
            (x.setFromColor(l.data.color), E.setFromColor(l.data.darkColor)),
            x.add((a - x.r) * i, (o - x.g) * i, (d - x.b) * i, (f - x.a) * i),
            E.add((u - E.r) * i, (m - E.g) * i, (g - E.b) * i, 0);
        }
      }
    };
    let Tt = st;
    (Tt.ENTRIES = 8),
      (Tt.PREV_TIME = -8),
      (Tt.PREV_R = -7),
      (Tt.PREV_G = -6),
      (Tt.PREV_B = -5),
      (Tt.PREV_A = -4),
      (Tt.PREV_R2 = -3),
      (Tt.PREV_G2 = -2),
      (Tt.PREV_B2 = -1),
      (Tt.R = 1),
      (Tt.G = 2),
      (Tt.B = 3),
      (Tt.A = 4),
      (Tt.R2 = 5),
      (Tt.G2 = 6),
      (Tt.B2 = 7);
    let Dn = class {
        constructor(t) {
          (this.frames = v.newFloatArray(t)),
            (this.attachmentNames = new Array(t));
        }
        getPropertyId() {
          return (4 << 24) + this.slotIndex;
        }
        getFrameCount() {
          return this.frames.length;
        }
        setFrame(t, n, e) {
          (this.frames[t] = n), (this.attachmentNames[t] = e);
        }
        apply(t, n, e, i, r, h, l) {
          const s = t.slots[this.slotIndex];
          if (l == J.mixOut && h == A.setup) {
            const f = s.data.attachmentName;
            s.setAttachment(
              f == null ? null : t.getAttachment(this.slotIndex, f)
            );
            return;
          }
          const a = this.frames;
          if (e < a[0]) {
            if (h == A.setup || h == A.first) {
              const f = s.data.attachmentName;
              s.setAttachment(
                f == null ? null : t.getAttachment(this.slotIndex, f)
              );
            }
            return;
          }
          let o = 0;
          e >= a[a.length - 1]
            ? (o = a.length - 1)
            : (o = Ct.binarySearch(a, e, 1) - 1);
          const d = this.attachmentNames[o];
          t.slots[this.slotIndex].setAttachment(
            d == null ? null : t.getAttachment(this.slotIndex, d)
          );
        }
      },
      $i = null,
      Wi = class extends jt {
        constructor(t) {
          super(t),
            (this.frames = v.newFloatArray(t)),
            (this.frameVertices = new Array(t)),
            $i == null && ($i = v.newFloatArray(64));
        }
        getPropertyId() {
          return (6 << 27) + Number(this.attachment.id) + this.slotIndex;
        }
        setFrame(t, n, e) {
          (this.frames[t] = n), (this.frameVertices[t] = e);
        }
        apply(t, n, e, i, r, h, l) {
          const s = t.slots[this.slotIndex],
            a = s.getAttachment();
          if (!(a instanceof Ge) || !a.applyDeform(this.attachment)) return;
          const o = s.attachmentVertices;
          o.length == 0 && (h = A.setup);
          const d = this.frameVertices,
            f = d[0].length,
            u = this.frames;
          if (e < u[0]) {
            const p = a;
            switch (h) {
              case A.setup:
                o.length = 0;
                return;
              case A.first:
                if (r == 1) {
                  o.length = 0;
                  break;
                }
                const S = v.setArraySize(o, f);
                if (p.bones == null) {
                  const y = p.vertices;
                  for (let M = 0; M < f; M++) S[M] += (y[M] - S[M]) * r;
                } else {
                  r = 1 - r;
                  for (let y = 0; y < f; y++) S[y] *= r;
                }
            }
            return;
          }
          const m = v.setArraySize(o, f);
          if (e >= u[u.length - 1]) {
            const p = d[u.length - 1];
            if (r == 1)
              if (h == A.add) {
                const S = a;
                if (S.bones == null) {
                  const y = S.vertices;
                  for (let M = 0; M < f; M++) m[M] += p[M] - y[M];
                } else for (let y = 0; y < f; y++) m[y] += p[y];
              } else v.arrayCopy(p, 0, m, 0, f);
            else
              switch (h) {
                case A.setup: {
                  const y = a;
                  if (y.bones == null) {
                    const M = y.vertices;
                    for (let T = 0; T < f; T++) {
                      const k = M[T];
                      m[T] = k + (p[T] - k) * r;
                    }
                  } else for (let M = 0; M < f; M++) m[M] = p[M] * r;
                  break;
                }
                case A.first:
                case A.replace:
                  for (let y = 0; y < f; y++) m[y] += (p[y] - m[y]) * r;
                case A.add:
                  const S = a;
                  if (S.bones == null) {
                    const y = S.vertices;
                    for (let M = 0; M < f; M++) m[M] += (p[M] - y[M]) * r;
                  } else for (let y = 0; y < f; y++) m[y] += p[y] * r;
              }
            return;
          }
          const g = Ct.binarySearch(u, e),
            x = d[g - 1],
            E = d[g],
            w = u[g],
            b = this.getCurvePercent(g - 1, 1 - (e - w) / (u[g - 1] - w));
          if (r == 1)
            if (h == A.add) {
              const p = a;
              if (p.bones == null) {
                const S = p.vertices;
                for (let y = 0; y < f; y++) {
                  const M = x[y];
                  m[y] += M + (E[y] - M) * b - S[y];
                }
              } else
                for (let S = 0; S < f; S++) {
                  const y = x[S];
                  m[S] += y + (E[S] - y) * b;
                }
            } else
              for (let p = 0; p < f; p++) {
                const S = x[p];
                m[p] = S + (E[p] - S) * b;
              }
          else
            switch (h) {
              case A.setup: {
                const S = a;
                if (S.bones == null) {
                  const y = S.vertices;
                  for (let M = 0; M < f; M++) {
                    const T = x[M],
                      k = y[M];
                    m[M] = k + (T + (E[M] - T) * b - k) * r;
                  }
                } else
                  for (let y = 0; y < f; y++) {
                    const M = x[y];
                    m[y] = (M + (E[y] - M) * b) * r;
                  }
                break;
              }
              case A.first:
              case A.replace:
                for (let S = 0; S < f; S++) {
                  const y = x[S];
                  m[S] += (y + (E[S] - y) * b - m[S]) * r;
                }
                break;
              case A.add:
                const p = a;
                if (p.bones == null) {
                  const S = p.vertices;
                  for (let y = 0; y < f; y++) {
                    const M = x[y];
                    m[y] += (M + (E[y] - M) * b - S[y]) * r;
                  }
                } else
                  for (let S = 0; S < f; S++) {
                    const y = x[S];
                    m[S] += (y + (E[S] - y) * b) * r;
                  }
            }
        }
      },
      qi = class {
        constructor(t) {
          (this.frames = v.newFloatArray(t)), (this.events = new Array(t));
        }
        getPropertyId() {
          return 7 << 24;
        }
        getFrameCount() {
          return this.frames.length;
        }
        setFrame(t, n) {
          (this.frames[t] = n.time), (this.events[t] = n);
        }
        apply(t, n, e, i, r, h, l) {
          if (i == null) return;
          const s = this.frames,
            a = this.frames.length;
          if (n > e) this.apply(t, n, Number.MAX_VALUE, i, r, h, l), (n = -1);
          else if (n >= s[a - 1]) return;
          if (e < s[0]) return;
          let o = 0;
          if (n < s[0]) o = 0;
          else {
            o = Ct.binarySearch(s, n);
            const d = s[o];
            for (; o > 0 && s[o - 1] == d; ) o--;
          }
          for (; o < a && e >= s[o]; o++) i.push(this.events[o]);
        }
      },
      Ln = class {
        constructor(t) {
          (this.frames = v.newFloatArray(t)), (this.drawOrders = new Array(t));
        }
        getPropertyId() {
          return 8 << 24;
        }
        getFrameCount() {
          return this.frames.length;
        }
        setFrame(t, n, e) {
          (this.frames[t] = n), (this.drawOrders[t] = e);
        }
        apply(t, n, e, i, r, h, l) {
          const s = t.drawOrder,
            a = t.slots;
          if (l == J.mixOut && h == A.setup) {
            v.arrayCopy(t.slots, 0, t.drawOrder, 0, t.slots.length);
            return;
          }
          const o = this.frames;
          if (e < o[0]) {
            (h == A.setup || h == A.first) &&
              v.arrayCopy(t.slots, 0, t.drawOrder, 0, t.slots.length);
            return;
          }
          let d = 0;
          e >= o[o.length - 1]
            ? (d = o.length - 1)
            : (d = Ct.binarySearch(o, e) - 1);
          const f = this.drawOrders[d];
          if (f == null) v.arrayCopy(a, 0, s, 0, a.length);
          else for (let u = 0, m = f.length; u < m; u++) s[u] = a[f[u]];
        }
      };
    const ht = class extends jt {
      constructor(c) {
        super(c), (this.frames = v.newFloatArray(c * ht.ENTRIES));
      }
      getPropertyId() {
        return (9 << 24) + this.ikConstraintIndex;
      }
      setFrame(c, t, n, e, i, r) {
        (c *= ht.ENTRIES),
          (this.frames[c] = t),
          (this.frames[c + ht.MIX] = n),
          (this.frames[c + ht.BEND_DIRECTION] = e),
          (this.frames[c + ht.COMPRESS] = i ? 1 : 0),
          (this.frames[c + ht.STRETCH] = r ? 1 : 0);
      }
      apply(c, t, n, e, i, r, h) {
        const l = this.frames,
          s = c.ikConstraints[this.ikConstraintIndex];
        if (n < l[0]) {
          switch (r) {
            case A.setup:
              (s.mix = s.data.mix),
                (s.bendDirection = s.data.bendDirection),
                (s.compress = s.data.compress),
                (s.stretch = s.data.stretch);
              return;
            case A.first:
              (s.mix += (s.data.mix - s.mix) * i),
                (s.bendDirection = s.data.bendDirection),
                (s.compress = s.data.compress),
                (s.stretch = s.data.stretch);
          }
          return;
        }
        if (n >= l[l.length - ht.ENTRIES]) {
          r == A.setup
            ? ((s.mix =
                s.data.mix + (l[l.length + ht.PREV_MIX] - s.data.mix) * i),
              h == J.mixOut
                ? ((s.bendDirection = s.data.bendDirection),
                  (s.compress = s.data.compress),
                  (s.stretch = s.data.stretch))
                : ((s.bendDirection = l[l.length + ht.PREV_BEND_DIRECTION]),
                  (s.compress = l[l.length + ht.PREV_COMPRESS] != 0),
                  (s.stretch = l[l.length + ht.PREV_STRETCH] != 0)))
            : ((s.mix += (l[l.length + ht.PREV_MIX] - s.mix) * i),
              h == J.mixIn &&
                ((s.bendDirection = l[l.length + ht.PREV_BEND_DIRECTION]),
                (s.compress = l[l.length + ht.PREV_COMPRESS] != 0),
                (s.stretch = l[l.length + ht.PREV_STRETCH] != 0)));
          return;
        }
        const a = Ct.binarySearch(l, n, ht.ENTRIES),
          o = l[a + ht.PREV_MIX],
          d = l[a],
          f = this.getCurvePercent(
            a / ht.ENTRIES - 1,
            1 - (n - d) / (l[a + ht.PREV_TIME] - d)
          );
        r == A.setup
          ? ((s.mix =
              s.data.mix + (o + (l[a + ht.MIX] - o) * f - s.data.mix) * i),
            h == J.mixOut
              ? ((s.bendDirection = s.data.bendDirection),
                (s.compress = s.data.compress),
                (s.stretch = s.data.stretch))
              : ((s.bendDirection = l[a + ht.PREV_BEND_DIRECTION]),
                (s.compress = l[a + ht.PREV_COMPRESS] != 0),
                (s.stretch = l[a + ht.PREV_STRETCH] != 0)))
          : ((s.mix += (o + (l[a + ht.MIX] - o) * f - s.mix) * i),
            h == J.mixIn &&
              ((s.bendDirection = l[a + ht.PREV_BEND_DIRECTION]),
              (s.compress = l[a + ht.PREV_COMPRESS] != 0),
              (s.stretch = l[a + ht.PREV_STRETCH] != 0)));
      }
    };
    let ie = ht;
    (ie.ENTRIES = 5),
      (ie.PREV_TIME = -5),
      (ie.PREV_MIX = -4),
      (ie.PREV_BEND_DIRECTION = -3),
      (ie.PREV_COMPRESS = -2),
      (ie.PREV_STRETCH = -1),
      (ie.MIX = 1),
      (ie.BEND_DIRECTION = 2),
      (ie.COMPRESS = 3),
      (ie.STRETCH = 4);
    const xt = class extends jt {
      constructor(c) {
        super(c), (this.frames = v.newFloatArray(c * xt.ENTRIES));
      }
      getPropertyId() {
        return (10 << 24) + this.transformConstraintIndex;
      }
      setFrame(c, t, n, e, i, r) {
        (c *= xt.ENTRIES),
          (this.frames[c] = t),
          (this.frames[c + xt.ROTATE] = n),
          (this.frames[c + xt.TRANSLATE] = e),
          (this.frames[c + xt.SCALE] = i),
          (this.frames[c + xt.SHEAR] = r);
      }
      apply(c, t, n, e, i, r, h) {
        const l = this.frames,
          s = c.transformConstraints[this.transformConstraintIndex];
        if (n < l[0]) {
          const u = s.data;
          switch (r) {
            case A.setup:
              (s.rotateMix = u.rotateMix),
                (s.translateMix = u.translateMix),
                (s.scaleMix = u.scaleMix),
                (s.shearMix = u.shearMix);
              return;
            case A.first:
              (s.rotateMix += (u.rotateMix - s.rotateMix) * i),
                (s.translateMix += (u.translateMix - s.translateMix) * i),
                (s.scaleMix += (u.scaleMix - s.scaleMix) * i),
                (s.shearMix += (u.shearMix - s.shearMix) * i);
          }
          return;
        }
        let a = 0,
          o = 0,
          d = 0,
          f = 0;
        if (n >= l[l.length - xt.ENTRIES]) {
          const u = l.length;
          (a = l[u + xt.PREV_ROTATE]),
            (o = l[u + xt.PREV_TRANSLATE]),
            (d = l[u + xt.PREV_SCALE]),
            (f = l[u + xt.PREV_SHEAR]);
        } else {
          const u = Ct.binarySearch(l, n, xt.ENTRIES);
          (a = l[u + xt.PREV_ROTATE]),
            (o = l[u + xt.PREV_TRANSLATE]),
            (d = l[u + xt.PREV_SCALE]),
            (f = l[u + xt.PREV_SHEAR]);
          const m = l[u],
            g = this.getCurvePercent(
              u / xt.ENTRIES - 1,
              1 - (n - m) / (l[u + xt.PREV_TIME] - m)
            );
          (a += (l[u + xt.ROTATE] - a) * g),
            (o += (l[u + xt.TRANSLATE] - o) * g),
            (d += (l[u + xt.SCALE] - d) * g),
            (f += (l[u + xt.SHEAR] - f) * g);
        }
        if (r == A.setup) {
          const u = s.data;
          (s.rotateMix = u.rotateMix + (a - u.rotateMix) * i),
            (s.translateMix = u.translateMix + (o - u.translateMix) * i),
            (s.scaleMix = u.scaleMix + (d - u.scaleMix) * i),
            (s.shearMix = u.shearMix + (f - u.shearMix) * i);
        } else
          (s.rotateMix += (a - s.rotateMix) * i),
            (s.translateMix += (o - s.translateMix) * i),
            (s.scaleMix += (d - s.scaleMix) * i),
            (s.shearMix += (f - s.shearMix) * i);
      }
    };
    let re = xt;
    (re.ENTRIES = 5),
      (re.PREV_TIME = -5),
      (re.PREV_ROTATE = -4),
      (re.PREV_TRANSLATE = -3),
      (re.PREV_SCALE = -2),
      (re.PREV_SHEAR = -1),
      (re.ROTATE = 1),
      (re.TRANSLATE = 2),
      (re.SCALE = 3),
      (re.SHEAR = 4);
    const xe = class extends jt {
      constructor(c) {
        super(c), (this.frames = v.newFloatArray(c * xe.ENTRIES));
      }
      getPropertyId() {
        return (11 << 24) + this.pathConstraintIndex;
      }
      setFrame(c, t, n) {
        (c *= xe.ENTRIES),
          (this.frames[c] = t),
          (this.frames[c + xe.VALUE] = n);
      }
      apply(c, t, n, e, i, r, h) {
        const l = this.frames,
          s = c.pathConstraints[this.pathConstraintIndex];
        if (n < l[0]) {
          switch (r) {
            case A.setup:
              s.position = s.data.position;
              return;
            case A.first:
              s.position += (s.data.position - s.position) * i;
          }
          return;
        }
        let a = 0;
        if (n >= l[l.length - xe.ENTRIES]) a = l[l.length + xe.PREV_VALUE];
        else {
          const o = Ct.binarySearch(l, n, xe.ENTRIES);
          a = l[o + xe.PREV_VALUE];
          const d = l[o],
            f = this.getCurvePercent(
              o / xe.ENTRIES - 1,
              1 - (n - d) / (l[o + xe.PREV_TIME] - d)
            );
          a += (l[o + xe.VALUE] - a) * f;
        }
        r == A.setup
          ? (s.position = s.data.position + (a - s.data.position) * i)
          : (s.position += (a - s.position) * i);
      }
    };
    let Ze = xe;
    (Ze.ENTRIES = 2), (Ze.PREV_TIME = -2), (Ze.PREV_VALUE = -1), (Ze.VALUE = 1);
    let Xe = class extends Ze {
      constructor(t) {
        super(t);
      }
      getPropertyId() {
        return (12 << 24) + this.pathConstraintIndex;
      }
      apply(t, n, e, i, r, h, l) {
        const s = this.frames,
          a = t.pathConstraints[this.pathConstraintIndex];
        if (e < s[0]) {
          switch (h) {
            case A.setup:
              a.spacing = a.data.spacing;
              return;
            case A.first:
              a.spacing += (a.data.spacing - a.spacing) * r;
          }
          return;
        }
        let o = 0;
        if (e >= s[s.length - Xe.ENTRIES]) o = s[s.length + Xe.PREV_VALUE];
        else {
          const d = Ct.binarySearch(s, e, Xe.ENTRIES);
          o = s[d + Xe.PREV_VALUE];
          const f = s[d],
            u = this.getCurvePercent(
              d / Xe.ENTRIES - 1,
              1 - (e - f) / (s[d + Xe.PREV_TIME] - f)
            );
          o += (s[d + Xe.VALUE] - o) * u;
        }
        h == A.setup
          ? (a.spacing = a.data.spacing + (o - a.data.spacing) * r)
          : (a.spacing += (o - a.spacing) * r);
      }
    };
    const qt = class extends jt {
      constructor(c) {
        super(c), (this.frames = v.newFloatArray(c * qt.ENTRIES));
      }
      getPropertyId() {
        return (13 << 24) + this.pathConstraintIndex;
      }
      setFrame(c, t, n, e) {
        (c *= qt.ENTRIES),
          (this.frames[c] = t),
          (this.frames[c + qt.ROTATE] = n),
          (this.frames[c + qt.TRANSLATE] = e);
      }
      apply(c, t, n, e, i, r, h) {
        const l = this.frames,
          s = c.pathConstraints[this.pathConstraintIndex];
        if (n < l[0]) {
          switch (r) {
            case A.setup:
              (s.rotateMix = s.data.rotateMix),
                (s.translateMix = s.data.translateMix);
              return;
            case A.first:
              (s.rotateMix += (s.data.rotateMix - s.rotateMix) * i),
                (s.translateMix += (s.data.translateMix - s.translateMix) * i);
          }
          return;
        }
        let a = 0,
          o = 0;
        if (n >= l[l.length - qt.ENTRIES])
          (a = l[l.length + qt.PREV_ROTATE]),
            (o = l[l.length + qt.PREV_TRANSLATE]);
        else {
          const d = Ct.binarySearch(l, n, qt.ENTRIES);
          (a = l[d + qt.PREV_ROTATE]), (o = l[d + qt.PREV_TRANSLATE]);
          const f = l[d],
            u = this.getCurvePercent(
              d / qt.ENTRIES - 1,
              1 - (n - f) / (l[d + qt.PREV_TIME] - f)
            );
          (a += (l[d + qt.ROTATE] - a) * u),
            (o += (l[d + qt.TRANSLATE] - o) * u);
        }
        r == A.setup
          ? ((s.rotateMix = s.data.rotateMix + (a - s.data.rotateMix) * i),
            (s.translateMix =
              s.data.translateMix + (o - s.data.translateMix) * i))
          : ((s.rotateMix += (a - s.rotateMix) * i),
            (s.translateMix += (o - s.translateMix) * i));
      }
    };
    let Ne = qt;
    (Ne.ENTRIES = 3),
      (Ne.PREV_TIME = -3),
      (Ne.PREV_ROTATE = -2),
      (Ne.PREV_TRANSLATE = -1),
      (Ne.ROTATE = 1),
      (Ne.TRANSLATE = 2);
    const Pt = class {
      constructor(t) {
        (this.tracks = new Array()),
          (this.events = new Array()),
          (this.listeners = new Array()),
          (this.queue = new Ps(this)),
          (this.propertyIDs = new ns()),
          (this.animationsChanged = !1),
          (this.timeScale = 1),
          (this.trackEntryPool = new An(() => new _n())),
          (this.data = t);
      }
      update(t) {
        t *= this.timeScale;
        const n = this.tracks;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r == null) continue;
          (r.animationLast = r.nextAnimationLast),
            (r.trackLast = r.nextTrackLast);
          let h = t * r.timeScale;
          if (r.delay > 0) {
            if (((r.delay -= h), r.delay > 0)) continue;
            (h = -r.delay), (r.delay = 0);
          }
          let l = r.next;
          if (l != null) {
            const s = r.trackLast - l.delay;
            if (s >= 0) {
              for (
                l.delay = 0,
                  l.trackTime =
                    r.timeScale == 0 ? 0 : (s / r.timeScale + t) * l.timeScale,
                  r.trackTime += h,
                  this.setCurrent(e, l, !0);
                l.mixingFrom != null;

              )
                (l.mixTime += t), (l = l.mixingFrom);
              continue;
            }
          } else if (r.trackLast >= r.trackEnd && r.mixingFrom == null) {
            (n[e] = null), this.queue.end(r), this.disposeNext(r);
            continue;
          }
          if (r.mixingFrom != null && this.updateMixingFrom(r, t)) {
            let s = r.mixingFrom;
            for (
              r.mixingFrom = null, s != null && (s.mixingTo = null);
              s != null;

            )
              this.queue.end(s), (s = s.mixingFrom);
          }
          r.trackTime += h;
        }
        this.queue.drain();
      }
      updateMixingFrom(t, n) {
        const e = t.mixingFrom;
        if (e == null) return !0;
        const i = this.updateMixingFrom(e, n);
        return (
          (e.animationLast = e.nextAnimationLast),
          (e.trackLast = e.nextTrackLast),
          t.mixTime > 0 && t.mixTime >= t.mixDuration
            ? ((e.totalAlpha == 0 || t.mixDuration == 0) &&
                ((t.mixingFrom = e.mixingFrom),
                e.mixingFrom != null && (e.mixingFrom.mixingTo = t),
                (t.interruptAlpha = e.interruptAlpha),
                this.queue.end(e)),
              i)
            : ((e.trackTime += n * e.timeScale), (t.mixTime += n), !1)
        );
      }
      apply(t) {
        if (t == null) throw new Error("skeleton cannot be null.");
        this.animationsChanged && this._animationsChanged();
        const n = this.events,
          e = this.tracks;
        let i = !1;
        for (let r = 0, h = e.length; r < h; r++) {
          const l = e[r];
          if (l == null || l.delay > 0) continue;
          i = !0;
          const s = r == 0 ? A.first : l.mixBlend;
          let a = l.alpha;
          l.mixingFrom != null
            ? (a *= this.applyMixingFrom(l, t, s))
            : l.trackTime >= l.trackEnd && l.next == null && (a = 0);
          const o = l.animationLast,
            d = l.getAnimationTime(),
            f = l.animation.timelines.length,
            u = l.animation.timelines;
          if ((r == 0 && a == 1) || s == A.add)
            for (let m = 0; m < f; m++)
              v.webkit602BugfixHelper(a, s),
                u[m].apply(t, o, d, n, a, s, J.mixIn);
          else {
            const m = l.timelineMode,
              g = l.timelinesRotation.length == 0;
            g && v.setArraySize(l.timelinesRotation, f << 1, null);
            const x = l.timelinesRotation;
            for (let E = 0; E < f; E++) {
              const w = u[E],
                b = m[E] == Pt.SUBSEQUENT ? s : A.setup;
              w instanceof $t
                ? this.applyRotateTimeline(w, t, d, a, b, x, E << 1, g)
                : (v.webkit602BugfixHelper(a, s),
                  w.apply(t, o, d, n, a, b, J.mixIn));
            }
          }
          this.queueEvents(l, d),
            (n.length = 0),
            (l.nextAnimationLast = d),
            (l.nextTrackLast = l.trackTime);
        }
        return this.queue.drain(), i;
      }
      applyMixingFrom(t, n, e) {
        const i = t.mixingFrom;
        i.mixingFrom != null && this.applyMixingFrom(i, n, e);
        let r = 0;
        t.mixDuration == 0
          ? ((r = 1), e == A.first && (e = A.setup))
          : ((r = t.mixTime / t.mixDuration),
            r > 1 && (r = 1),
            e != A.first && (e = i.mixBlend));
        const h = r < i.eventThreshold ? this.events : null,
          l = r < i.attachmentThreshold,
          s = r < i.drawOrderThreshold,
          a = i.animationLast,
          o = i.getAnimationTime(),
          d = i.animation.timelines.length,
          f = i.animation.timelines,
          u = i.alpha * t.interruptAlpha,
          m = u * (1 - r);
        if (e == A.add)
          for (let g = 0; g < d; g++) f[g].apply(n, a, o, h, m, e, J.mixOut);
        else {
          const g = i.timelineMode,
            x = i.timelineHoldMix,
            E = i.timelinesRotation.length == 0;
          E && v.setArraySize(i.timelinesRotation, d << 1, null);
          const w = i.timelinesRotation;
          i.totalAlpha = 0;
          for (let b = 0; b < d; b++) {
            const p = f[b];
            let S = J.mixOut,
              y,
              M = 0;
            switch (g[b]) {
              case Pt.SUBSEQUENT:
                if ((!l && p instanceof Dn) || (!s && p instanceof Ln))
                  continue;
                (y = e), (M = m);
                break;
              case Pt.FIRST:
                (y = A.setup), (M = m);
                break;
              case Pt.HOLD:
                (y = A.setup), (M = u);
                break;
              default:
                y = A.setup;
                const T = x[b];
                M = u * Math.max(0, 1 - T.mixTime / T.mixDuration);
                break;
            }
            (i.totalAlpha += M),
              p instanceof $t
                ? this.applyRotateTimeline(p, n, o, M, y, w, b << 1, E)
                : (v.webkit602BugfixHelper(M, e),
                  y == A.setup &&
                    (p instanceof Dn
                      ? l && (S = J.mixOut)
                      : p instanceof Ln && s && (S = J.mixOut)),
                  p.apply(n, a, o, h, M, y, S));
          }
        }
        return (
          t.mixDuration > 0 && this.queueEvents(i, o),
          (this.events.length = 0),
          (i.nextAnimationLast = o),
          (i.nextTrackLast = i.trackTime),
          r
        );
      }
      applyRotateTimeline(t, n, e, i, r, h, l, s) {
        if ((s && (h[l] = 0), i == 1)) {
          t.apply(n, 0, e, null, 1, r, J.mixIn);
          return;
        }
        const a = t,
          o = a.frames,
          d = n.bones[a.boneIndex];
        let f = 0,
          u = 0;
        if (e < o[0])
          switch (r) {
            case A.setup:
              d.rotation = d.data.rotation;
            default:
              return;
            case A.first:
              (f = d.rotation), (u = d.data.rotation);
          }
        else if (
          ((f = r == A.setup ? d.data.rotation : d.rotation),
          e >= o[o.length - $t.ENTRIES])
        )
          u = d.data.rotation + o[o.length + $t.PREV_ROTATION];
        else {
          const x = Ct.binarySearch(o, e, $t.ENTRIES),
            E = o[x + $t.PREV_ROTATION],
            w = o[x],
            b = a.getCurvePercent(
              (x >> 1) - 1,
              1 - (e - w) / (o[x + $t.PREV_TIME] - w)
            );
          (u = o[x + $t.ROTATION] - E),
            (u -= (16384 - ((16384.499999999996 - u / 360) | 0)) * 360),
            (u = E + u * b + d.data.rotation),
            (u -= (16384 - ((16384.499999999996 - u / 360) | 0)) * 360);
        }
        let m = 0,
          g = u - f;
        if (
          ((g -= (16384 - ((16384.499999999996 - g / 360) | 0)) * 360), g == 0)
        )
          m = h[l];
        else {
          let x = 0,
            E = 0;
          s ? ((x = 0), (E = g)) : ((x = h[l]), (E = h[l + 1]));
          const w = g > 0;
          let b = x >= 0;
          C.signum(E) != C.signum(g) &&
            Math.abs(E) <= 90 &&
            (Math.abs(x) > 180 && (x += 360 * C.signum(x)), (b = w)),
            (m = g + x - (x % 360)),
            b != w && (m += 360 * C.signum(x)),
            (h[l] = m);
        }
        (h[l + 1] = g),
          (f += m * i),
          (d.rotation =
            f - (16384 - ((16384.499999999996 - f / 360) | 0)) * 360);
      }
      queueEvents(t, n) {
        const e = t.animationStart,
          i = t.animationEnd,
          r = i - e,
          h = t.trackLast % r,
          l = this.events;
        let s = 0;
        const a = l.length;
        for (; s < a; s++) {
          const d = l[s];
          if (d.time < h) break;
          d.time > i || this.queue.event(t, d);
        }
        let o = !1;
        for (
          t.loop
            ? (o = r == 0 || h > t.trackTime % r)
            : (o = n >= i && t.animationLast < i),
            o && this.queue.complete(t);
          s < a;
          s++
        )
          l[s].time < e || this.queue.event(t, l[s]);
      }
      clearTracks() {
        const t = this.queue.drainDisabled;
        this.queue.drainDisabled = !0;
        for (let n = 0, e = this.tracks.length; n < e; n++) this.clearTrack(n);
        (this.tracks.length = 0),
          (this.queue.drainDisabled = t),
          this.queue.drain();
      }
      clearTrack(t) {
        if (t >= this.tracks.length) return;
        const n = this.tracks[t];
        if (n == null) return;
        this.queue.end(n), this.disposeNext(n);
        let e = n;
        for (;;) {
          const i = e.mixingFrom;
          if (i == null) break;
          this.queue.end(i),
            (e.mixingFrom = null),
            (e.mixingTo = null),
            (e = i);
        }
        (this.tracks[n.trackIndex] = null), this.queue.drain();
      }
      setCurrent(t, n, e) {
        const i = this.expandToIndex(t);
        (this.tracks[t] = n),
          i != null &&
            (e && this.queue.interrupt(i),
            (n.mixingFrom = i),
            (i.mixingTo = n),
            (n.mixTime = 0),
            i.mixingFrom != null &&
              i.mixDuration > 0 &&
              (n.interruptAlpha *= Math.min(1, i.mixTime / i.mixDuration)),
            (i.timelinesRotation.length = 0)),
          this.queue.start(n);
      }
      setAnimation(t, n, e) {
        const i = this.data.skeletonData.findAnimation(n);
        if (i == null) throw new Error(`Animation not found: ${n}`);
        return this.setAnimationWith(t, i, e);
      }
      setAnimationWith(t, n, e) {
        if (n == null) throw new Error("animation cannot be null.");
        let i = !0,
          r = this.expandToIndex(t);
        r != null &&
          (r.nextTrackLast == -1
            ? ((this.tracks[t] = r.mixingFrom),
              this.queue.interrupt(r),
              this.queue.end(r),
              this.disposeNext(r),
              (r = r.mixingFrom),
              (i = !1))
            : this.disposeNext(r));
        const h = this.trackEntry(t, n, e, r);
        return this.setCurrent(t, h, i), this.queue.drain(), h;
      }
      addAnimation(t, n, e, i) {
        const r = this.data.skeletonData.findAnimation(n);
        if (r == null) throw new Error(`Animation not found: ${n}`);
        return this.addAnimationWith(t, r, e, i);
      }
      addAnimationWith(t, n, e, i) {
        if (n == null) throw new Error("animation cannot be null.");
        let r = this.expandToIndex(t);
        if (r != null) for (; r.next != null; ) r = r.next;
        const h = this.trackEntry(t, n, e, r);
        if (r == null) this.setCurrent(t, h, !0), this.queue.drain();
        else if (((r.next = h), i <= 0)) {
          const l = r.animationEnd - r.animationStart;
          l != 0
            ? (r.loop
                ? (i += l * (1 + ((r.trackTime / l) | 0)))
                : (i += Math.max(l, r.trackTime)),
              (i -= this.data.getMix(r.animation, n)))
            : (i = r.trackTime);
        }
        return (h.delay = i), h;
      }
      setEmptyAnimation(t, n) {
        const e = this.setAnimationWith(t, Pt.emptyAnimation, !1);
        return (e.mixDuration = n), (e.trackEnd = n), e;
      }
      addEmptyAnimation(t, n, e) {
        e <= 0 && (e -= n);
        const i = this.addAnimationWith(t, Pt.emptyAnimation, !1, e);
        return (i.mixDuration = n), (i.trackEnd = n), i;
      }
      setEmptyAnimations(t) {
        const n = this.queue.drainDisabled;
        this.queue.drainDisabled = !0;
        for (let e = 0, i = this.tracks.length; e < i; e++) {
          const r = this.tracks[e];
          r != null && this.setEmptyAnimation(r.trackIndex, t);
        }
        (this.queue.drainDisabled = n), this.queue.drain();
      }
      expandToIndex(t) {
        return t < this.tracks.length
          ? this.tracks[t]
          : (v.ensureArrayCapacity(
              this.tracks,
              t - this.tracks.length + 1,
              null
            ),
            (this.tracks.length = t + 1),
            null);
      }
      trackEntry(t, n, e, i) {
        const r = this.trackEntryPool.obtain();
        return (
          (r.trackIndex = t),
          (r.animation = n),
          (r.loop = e),
          (r.holdPrevious = !1),
          (r.eventThreshold = 0),
          (r.attachmentThreshold = 0),
          (r.drawOrderThreshold = 0),
          (r.animationStart = 0),
          (r.animationEnd = n.duration),
          (r.animationLast = -1),
          (r.nextAnimationLast = -1),
          (r.delay = 0),
          (r.trackTime = 0),
          (r.trackLast = -1),
          (r.nextTrackLast = -1),
          (r.trackEnd = Number.MAX_VALUE),
          (r.timeScale = 1),
          (r.alpha = 1),
          (r.interruptAlpha = 1),
          (r.mixTime = 0),
          (r.mixDuration = i == null ? 0 : this.data.getMix(i.animation, n)),
          r
        );
      }
      disposeNext(t) {
        let n = t.next;
        for (; n != null; ) this.queue.dispose(n), (n = n.next);
        t.next = null;
      }
      _animationsChanged() {
        (this.animationsChanged = !1), this.propertyIDs.clear();
        for (let t = 0, n = this.tracks.length; t < n; t++) {
          let e = this.tracks[t];
          if (e != null) {
            for (; e.mixingFrom != null; ) e = e.mixingFrom;
            do
              (e.mixingFrom == null || e.mixBlend != A.add) &&
                this.setTimelineModes(e),
                (e = e.mixingTo);
            while (e != null);
          }
        }
      }
      setTimelineModes(t) {
        const n = t.mixingTo,
          e = t.animation.timelines,
          i = t.animation.timelines.length,
          r = v.setArraySize(t.timelineMode, i);
        t.timelineHoldMix.length = 0;
        const h = v.setArraySize(t.timelineHoldMix, i),
          l = this.propertyIDs;
        if (n != null && n.holdPrevious) {
          for (let s = 0; s < i; s++)
            l.add(e[s].getPropertyId()), (r[s] = Pt.HOLD);
          return;
        }
        t: for (let s = 0; s < i; s++) {
          const a = e[s].getPropertyId();
          if (!l.add(a)) r[s] = Pt.SUBSEQUENT;
          else if (n == null || !this.hasTimeline(n, a)) r[s] = Pt.FIRST;
          else {
            for (let o = n.mixingTo; o != null; o = o.mixingTo)
              if (!this.hasTimeline(o, a)) {
                if (t.mixDuration > 0) {
                  (r[s] = Pt.HOLD_MIX), (h[s] = o);
                  continue t;
                }
                break;
              }
            r[s] = Pt.HOLD;
          }
        }
      }
      hasTimeline(t, n) {
        const e = t.animation.timelines;
        for (let i = 0, r = e.length; i < r; i++)
          if (e[i].getPropertyId() == n) return !0;
        return !1;
      }
      getCurrent(t) {
        return t >= this.tracks.length ? null : this.tracks[t];
      }
      addListener(t) {
        if (t == null) throw new Error("listener cannot be null.");
        this.listeners.push(t);
      }
      removeListener(t) {
        const n = this.listeners.indexOf(t);
        n >= 0 && this.listeners.splice(n, 1);
      }
      clearListeners() {
        this.listeners.length = 0;
      }
      clearListenerNotifications() {
        this.queue.clear();
      }
      setAnimationByName(t, n, e) {
        Pt.deprecatedWarning1 ||
          ((Pt.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: AnimationState.setAnimationByName is deprecated, please use setAnimation from now on."
          )),
          this.setAnimation(t, n, e);
      }
      addAnimationByName(t, n, e, i) {
        Pt.deprecatedWarning2 ||
          ((Pt.deprecatedWarning2 = !0),
          console.warn(
            "Spine Deprecation Warning: AnimationState.addAnimationByName is deprecated, please use addAnimation from now on."
          )),
          this.addAnimation(t, n, e, i);
      }
      hasAnimation(t) {
        return this.data.skeletonData.findAnimation(t) !== null;
      }
      hasAnimationByName(t) {
        return (
          Pt.deprecatedWarning3 ||
            ((Pt.deprecatedWarning3 = !0),
            console.warn(
              "Spine Deprecation Warning: AnimationState.hasAnimationByName is deprecated, please use hasAnimation from now on."
            )),
          this.hasAnimation(t)
        );
      }
    };
    let Ie = Pt;
    (Ie.emptyAnimation = new Ct("<empty>", [], 0)),
      (Ie.SUBSEQUENT = 0),
      (Ie.FIRST = 1),
      (Ie.HOLD = 2),
      (Ie.HOLD_MIX = 3),
      (Ie.deprecatedWarning1 = !1),
      (Ie.deprecatedWarning2 = !1),
      (Ie.deprecatedWarning3 = !1);
    const Be = class {
      constructor() {
        (this.mixBlend = A.replace),
          (this.timelineMode = new Array()),
          (this.timelineHoldMix = new Array()),
          (this.timelinesRotation = new Array());
      }
      reset() {
        (this.next = null),
          (this.mixingFrom = null),
          (this.mixingTo = null),
          (this.animation = null),
          (this.listener = null),
          (this.timelineMode.length = 0),
          (this.timelineHoldMix.length = 0),
          (this.timelinesRotation.length = 0);
      }
      getAnimationTime() {
        if (this.loop) {
          const t = this.animationEnd - this.animationStart;
          return t == 0
            ? this.animationStart
            : (this.trackTime % t) + this.animationStart;
        }
        return Math.min(
          this.trackTime + this.animationStart,
          this.animationEnd
        );
      }
      setAnimationLast(t) {
        (this.animationLast = t), (this.nextAnimationLast = t);
      }
      isComplete() {
        return this.trackTime >= this.animationEnd - this.animationStart;
      }
      resetRotationDirections() {
        this.timelinesRotation.length = 0;
      }
      get time() {
        return (
          Be.deprecatedWarning1 ||
            ((Be.deprecatedWarning1 = !0),
            console.warn(
              "Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on."
            )),
          this.trackTime
        );
      }
      set time(t) {
        Be.deprecatedWarning1 ||
          ((Be.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on."
          )),
          (this.trackTime = t);
      }
      get endTime() {
        return (
          Be.deprecatedWarning2 ||
            ((Be.deprecatedWarning2 = !0),
            console.warn(
              "Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on."
            )),
          this.trackTime
        );
      }
      set endTime(t) {
        Be.deprecatedWarning2 ||
          ((Be.deprecatedWarning2 = !0),
          console.warn(
            "Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on."
          )),
          (this.trackTime = t);
      }
      loopsCount() {
        return Math.floor(this.trackTime / this.trackEnd);
      }
    };
    let _n = Be;
    (_n.deprecatedWarning1 = !1), (_n.deprecatedWarning2 = !1);
    const vs = class {
      constructor(c) {
        (this.objects = []), (this.drainDisabled = !1), (this.animState = c);
      }
      start(c) {
        this.objects.push(Zt.start),
          this.objects.push(c),
          (this.animState.animationsChanged = !0);
      }
      interrupt(c) {
        this.objects.push(Zt.interrupt), this.objects.push(c);
      }
      end(c) {
        this.objects.push(Zt.end),
          this.objects.push(c),
          (this.animState.animationsChanged = !0);
      }
      dispose(c) {
        this.objects.push(Zt.dispose), this.objects.push(c);
      }
      complete(c) {
        this.objects.push(Zt.complete), this.objects.push(c);
      }
      event(c, t) {
        this.objects.push(Zt.event), this.objects.push(c), this.objects.push(t);
      }
      deprecateStuff() {
        return (
          vs.deprecatedWarning1 ||
            ((vs.deprecatedWarning1 = !0),
            console.warn(
              "Spine Deprecation Warning: onComplete, onStart, onEnd, onEvent art deprecated, please use listeners from now on. 'state.addListener({ complete: function(track, event) { } })'"
            )),
          !0
        );
      }
      drain() {
        if (this.drainDisabled) return;
        this.drainDisabled = !0;
        const c = this.objects,
          t = this.animState.listeners;
        for (let n = 0; n < c.length; n += 2) {
          const e = c[n],
            i = c[n + 1];
          switch (e) {
            case Zt.start:
              i.listener != null && i.listener.start && i.listener.start(i);
              for (let l = 0; l < t.length; l++) t[l].start && t[l].start(i);
              i.onStart && this.deprecateStuff() && i.onStart(i.trackIndex),
                this.animState.onStart &&
                  this.deprecateStuff() &&
                  this.deprecateStuff &&
                  this.animState.onStart(i.trackIndex);
              break;
            case Zt.interrupt:
              i.listener != null &&
                i.listener.interrupt &&
                i.listener.interrupt(i);
              for (let l = 0; l < t.length; l++)
                t[l].interrupt && t[l].interrupt(i);
              break;
            case Zt.end:
              i.listener != null && i.listener.end && i.listener.end(i);
              for (let l = 0; l < t.length; l++) t[l].end && t[l].end(i);
              i.onEnd && this.deprecateStuff() && i.onEnd(i.trackIndex),
                this.animState.onEnd &&
                  this.deprecateStuff() &&
                  this.animState.onEnd(i.trackIndex);
            case Zt.dispose:
              i.listener != null && i.listener.dispose && i.listener.dispose(i);
              for (let l = 0; l < t.length; l++)
                t[l].dispose && t[l].dispose(i);
              this.animState.trackEntryPool.free(i);
              break;
            case Zt.complete:
              i.listener != null &&
                i.listener.complete &&
                i.listener.complete(i);
              for (let l = 0; l < t.length; l++)
                t[l].complete && t[l].complete(i);
              const r = C.toInt(i.loopsCount());
              i.onComplete &&
                this.deprecateStuff() &&
                i.onComplete(i.trackIndex, r),
                this.animState.onComplete &&
                  this.deprecateStuff() &&
                  this.animState.onComplete(i.trackIndex, r);
              break;
            case Zt.event:
              const h = c[n++ + 2];
              i.listener != null && i.listener.event && i.listener.event(i, h);
              for (let l = 0; l < t.length; l++) t[l].event && t[l].event(i, h);
              i.onEvent && this.deprecateStuff() && i.onEvent(i.trackIndex, h),
                this.animState.onEvent &&
                  this.deprecateStuff() &&
                  this.animState.onEvent(i.trackIndex, h);
              break;
          }
        }
        this.clear(), (this.drainDisabled = !1);
      }
      clear() {
        this.objects.length = 0;
      }
    };
    let Ps = vs;
    Ps.deprecatedWarning1 = !1;
    var Zt = ((c) => (
      (c[(c.start = 0)] = "start"),
      (c[(c.interrupt = 1)] = "interrupt"),
      (c[(c.end = 2)] = "end"),
      (c[(c.dispose = 3)] = "dispose"),
      (c[(c.complete = 4)] = "complete"),
      (c[(c.event = 5)] = "event"),
      c
    ))(Zt || {});
    class Dr {
      start(t) {}
      interrupt(t) {}
      end(t) {}
      dispose(t) {}
      complete(t) {}
      event(t, n) {}
    }
    const Vs = class {
      constructor(c) {
        if (((this.animationToMixTime = {}), (this.defaultMix = 0), c == null))
          throw new Error("skeletonData cannot be null.");
        this.skeletonData = c;
      }
      setMix(c, t, n) {
        const e = this.skeletonData.findAnimation(c);
        if (e == null) throw new Error(`Animation not found: ${c}`);
        const i = this.skeletonData.findAnimation(t);
        if (i == null) throw new Error(`Animation not found: ${t}`);
        this.setMixWith(e, i, n);
      }
      setMixByName(c, t, n) {
        Vs.deprecatedWarning1 ||
          ((Vs.deprecatedWarning1 = !0),
          console.warn(
            "Deprecation Warning: AnimationStateData.setMixByName is deprecated, please use setMix from now on."
          )),
          this.setMix(c, t, n);
      }
      setMixWith(c, t, n) {
        if (c == null) throw new Error("from cannot be null.");
        if (t == null) throw new Error("to cannot be null.");
        const e = `${c.name}.${t.name}`;
        this.animationToMixTime[e] = n;
      }
      getMix(c, t) {
        const n = `${c.name}.${t.name}`,
          e = this.animationToMixTime[n];
        return e === void 0 ? this.defaultMix : e;
      }
    };
    let Fs = Vs;
    Fs.deprecatedWarning1 = !1;
    let Ui = class {
        constructor(t) {
          this.atlas = t;
        }
        newRegionAttachment(t, n, e) {
          const i = this.atlas.findRegion(e);
          if (i == null)
            throw new Error(
              `Region not found in atlas: ${e} (region attachment: ${n})`
            );
          const r = new K(n);
          return (r.region = i), r;
        }
        newMeshAttachment(t, n, e) {
          const i = this.atlas.findRegion(e);
          if (i == null)
            throw new Error(
              `Region not found in atlas: ${e} (mesh attachment: ${n})`
            );
          const r = new Is(n);
          return (r.region = i), r;
        }
        newBoundingBoxAttachment(t, n) {
          return new Ni(n);
        }
        newPathAttachment(t, n) {
          return new kn(n);
        }
        newPointAttachment(t, n) {
          return new Di(n);
        }
        newClippingAttachment(t, n) {
          return new Bi(n);
        }
      },
      Ys = class {
        constructor(t, n, e) {
          if (
            ((this.matrix = new H.Matrix()),
            (this.children = new Array()),
            (this.x = 0),
            (this.y = 0),
            (this.rotation = 0),
            (this.scaleX = 0),
            (this.scaleY = 0),
            (this.shearX = 0),
            (this.shearY = 0),
            (this.ax = 0),
            (this.ay = 0),
            (this.arotation = 0),
            (this.ascaleX = 0),
            (this.ascaleY = 0),
            (this.ashearX = 0),
            (this.ashearY = 0),
            (this.appliedValid = !1),
            (this.sorted = !1),
            (this.active = !0),
            t == null)
          )
            throw new Error("data cannot be null.");
          if (n == null) throw new Error("skeleton cannot be null.");
          (this.data = t),
            (this.skeleton = n),
            (this.parent = e),
            this.setToSetupPose();
        }
        get worldX() {
          return this.matrix.tx;
        }
        get worldY() {
          return this.matrix.ty;
        }
        update() {
          this.updateWorldTransformWith(
            this.x,
            this.y,
            this.rotation,
            this.scaleX,
            this.scaleY,
            this.shearX,
            this.shearY
          );
        }
        updateWorldTransform() {
          this.updateWorldTransformWith(
            this.x,
            this.y,
            this.rotation,
            this.scaleX,
            this.scaleY,
            this.shearX,
            this.shearY
          );
        }
        updateWorldTransformWith(t, n, e, i, r, h, l) {
          (this.ax = t),
            (this.ay = n),
            (this.arotation = e),
            (this.ascaleX = i),
            (this.ascaleY = r),
            (this.ashearX = h),
            (this.ashearY = l),
            (this.appliedValid = !0);
          const s = this.parent,
            a = this.matrix,
            o = this.skeleton.scaleX,
            d = zt.yDown ? -this.skeleton.scaleY : this.skeleton.scaleY;
          if (s == null) {
            const x = this.skeleton,
              E = e + 90 + l;
            (a.a = C.cosDeg(e + h) * i * o),
              (a.c = C.cosDeg(E) * r * o),
              (a.b = C.sinDeg(e + h) * i * d),
              (a.d = C.sinDeg(E) * r * d),
              (a.tx = t * o + x.x),
              (a.ty = n * d + x.y);
            return;
          }
          let f = s.matrix.a,
            u = s.matrix.c,
            m = s.matrix.b,
            g = s.matrix.d;
          switch (
            ((a.tx = f * t + u * n + s.matrix.tx),
            (a.ty = m * t + g * n + s.matrix.ty),
            this.data.transformMode)
          ) {
            case j.Normal: {
              const x = e + 90 + l,
                E = C.cosDeg(e + h) * i,
                w = C.cosDeg(x) * r,
                b = C.sinDeg(e + h) * i,
                p = C.sinDeg(x) * r;
              (a.a = f * E + u * b),
                (a.c = f * w + u * p),
                (a.b = m * E + g * b),
                (a.d = m * w + g * p);
              return;
            }
            case j.OnlyTranslation: {
              const x = e + 90 + l;
              (a.a = C.cosDeg(e + h) * i),
                (a.c = C.cosDeg(x) * r),
                (a.b = C.sinDeg(e + h) * i),
                (a.d = C.sinDeg(x) * r);
              break;
            }
            case j.NoRotationOrReflection: {
              let x = f * f + m * m,
                E = 0;
              x > 1e-4
                ? ((x = Math.abs(f * g - u * m) / x),
                  (u = m * x),
                  (g = f * x),
                  (E = Math.atan2(m, f) * C.radDeg))
                : ((f = 0), (m = 0), (E = 90 - Math.atan2(g, u) * C.radDeg));
              const w = e + h - E,
                b = e + l - E + 90,
                p = C.cosDeg(w) * i,
                S = C.cosDeg(b) * r,
                y = C.sinDeg(w) * i,
                M = C.sinDeg(b) * r;
              (a.a = f * p - u * y),
                (a.c = f * S - u * M),
                (a.b = m * p + g * y),
                (a.d = m * S + g * M);
              break;
            }
            case j.NoScale:
            case j.NoScaleOrReflection: {
              const x = C.cosDeg(e),
                E = C.sinDeg(e);
              let w = (f * x + u * E) / o,
                b = (m * x + g * E) / d,
                p = Math.sqrt(w * w + b * b);
              p > 1e-5 && (p = 1 / p),
                (w *= p),
                (b *= p),
                (p = Math.sqrt(w * w + b * b)),
                this.data.transformMode == j.NoScale &&
                  f * g - u * m < 0 !=
                    (zt.yDown
                      ? this.skeleton.scaleX < 0 != this.skeleton.scaleY > 0
                      : this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0) &&
                  (p = -p);
              const S = Math.PI / 2 + Math.atan2(b, w),
                y = Math.cos(S) * p,
                M = Math.sin(S) * p,
                T = C.cosDeg(h) * i,
                k = C.cosDeg(90 + l) * r,
                I = C.sinDeg(h) * i,
                R = C.sinDeg(90 + l) * r;
              (a.a = w * T + y * I),
                (a.c = w * k + y * R),
                (a.b = b * T + M * I),
                (a.d = b * k + M * R);
              break;
            }
          }
          (a.a *= o), (a.c *= o), (a.b *= d), (a.d *= d);
        }
        setToSetupPose() {
          const t = this.data;
          (this.x = t.x),
            (this.y = t.y),
            (this.rotation = t.rotation),
            (this.scaleX = t.scaleX),
            (this.scaleY = t.scaleY),
            (this.shearX = t.shearX),
            (this.shearY = t.shearY);
        }
        getWorldRotationX() {
          return Math.atan2(this.matrix.b, this.matrix.a) * C.radDeg;
        }
        getWorldRotationY() {
          return Math.atan2(this.matrix.d, this.matrix.c) * C.radDeg;
        }
        getWorldScaleX() {
          const t = this.matrix;
          return Math.sqrt(t.a * t.a + t.c * t.c);
        }
        getWorldScaleY() {
          const t = this.matrix;
          return Math.sqrt(t.b * t.b + t.d * t.d);
        }
        updateAppliedTransform() {
          this.appliedValid = !0;
          const t = this.parent,
            n = this.matrix;
          if (t == null) {
            (this.ax = n.tx),
              (this.ay = n.ty),
              (this.arotation = Math.atan2(n.b, n.a) * C.radDeg),
              (this.ascaleX = Math.sqrt(n.a * n.a + n.b * n.b)),
              (this.ascaleY = Math.sqrt(n.c * n.c + n.d * n.d)),
              (this.ashearX = 0),
              (this.ashearY =
                Math.atan2(n.a * n.c + n.b * n.d, n.a * n.d - n.b * n.c) *
                C.radDeg);
            return;
          }
          const e = t.matrix,
            i = 1 / (e.a * e.d - e.b * e.c),
            r = n.tx - e.tx,
            h = n.ty - e.ty;
          (this.ax = r * e.d * i - h * e.c * i),
            (this.ay = h * e.a * i - r * e.b * i);
          const l = i * e.d,
            s = i * e.a,
            a = i * e.c,
            o = i * e.b,
            d = l * n.a - a * n.b,
            f = l * n.c - a * n.d,
            u = s * n.b - o * n.a,
            m = s * n.d - o * n.c;
          if (
            ((this.ashearX = 0),
            (this.ascaleX = Math.sqrt(d * d + u * u)),
            this.ascaleX > 1e-4)
          ) {
            const g = d * m - f * u;
            (this.ascaleY = g / this.ascaleX),
              (this.ashearY = Math.atan2(d * f + u * m, g) * C.radDeg),
              (this.arotation = Math.atan2(u, d) * C.radDeg);
          } else
            (this.ascaleX = 0),
              (this.ascaleY = Math.sqrt(f * f + m * m)),
              (this.ashearY = 0),
              (this.arotation = 90 - Math.atan2(m, f) * C.radDeg);
        }
        worldToLocal(t) {
          const n = this.matrix,
            e = n.a,
            i = n.c,
            r = n.b,
            h = n.d,
            l = 1 / (e * h - i * r),
            s = t.x - n.tx,
            a = t.y - n.ty;
          return (
            (t.x = s * h * l - a * i * l), (t.y = a * e * l - s * r * l), t
          );
        }
        localToWorld(t) {
          const n = this.matrix,
            e = t.x,
            i = t.y;
          return (
            (t.x = e * n.a + i * n.c + n.tx),
            (t.y = e * n.b + i * n.d + n.ty),
            t
          );
        }
        worldToLocalRotation(t) {
          const n = C.sinDeg(t),
            e = C.cosDeg(t),
            i = this.matrix;
          return Math.atan2(i.a * n - i.b * e, i.d * e - i.c * n) * C.radDeg;
        }
        localToWorldRotation(t) {
          const n = C.sinDeg(t),
            e = C.cosDeg(t),
            i = this.matrix;
          return Math.atan2(e * i.b + n * i.d, e * i.a + n * i.c) * C.radDeg;
        }
        rotateWorld(t) {
          const n = this.matrix,
            e = n.a,
            i = n.c,
            r = n.b,
            h = n.d,
            l = C.cosDeg(t),
            s = C.sinDeg(t);
          (n.a = l * e - s * r),
            (n.c = l * i - s * h),
            (n.b = s * e + l * r),
            (n.d = s * i + l * h),
            (this.appliedValid = !1);
        }
      },
      zi = class {
        constructor(t, n, e) {
          if (
            ((this.x = 0),
            (this.y = 0),
            (this.rotation = 0),
            (this.scaleX = 1),
            (this.scaleY = 1),
            (this.shearX = 0),
            (this.shearY = 0),
            (this.transformMode = j.Normal),
            t < 0)
          )
            throw new Error("index must be >= 0.");
          if (n == null) throw new Error("name cannot be null.");
          (this.index = t), (this.name = n), (this.parent = e);
        }
      },
      Hi = class {
        constructor(t, n) {
          if (n == null) throw new Error("data cannot be null.");
          (this.time = t), (this.data = n);
        }
      },
      Gi = class {
        constructor(t) {
          this.name = t;
        }
      },
      ji = class {
        constructor(t, n) {
          if (
            ((this.bendDirection = 0),
            (this.compress = !1),
            (this.stretch = !1),
            (this.mix = 1),
            t == null)
          )
            throw new Error("data cannot be null.");
          if (n == null) throw new Error("skeleton cannot be null.");
          (this.data = t),
            (this.mix = t.mix),
            (this.bendDirection = t.bendDirection),
            (this.compress = t.compress),
            (this.stretch = t.stretch),
            (this.bones = new Array());
          for (let e = 0; e < t.bones.length; e++)
            this.bones.push(n.findBone(t.bones[e].name));
          this.target = n.findBone(t.target.name);
        }
        getOrder() {
          return this.data.order;
        }
        apply() {
          this.update();
        }
        update() {
          const t = this.target,
            n = this.bones;
          switch (n.length) {
            case 1:
              this.apply1(
                n[0],
                t.worldX,
                t.worldY,
                this.compress,
                this.stretch,
                this.data.uniform,
                this.mix
              );
              break;
            case 2:
              this.apply2(
                n[0],
                n[1],
                t.worldX,
                t.worldY,
                this.bendDirection,
                this.stretch,
                this.mix
              );
              break;
          }
        }
        apply1(t, n, e, i, r, h, l) {
          t.appliedValid || t.updateAppliedTransform();
          const s = t.parent.matrix,
            a = 1 / (s.a * s.d - s.b * s.c),
            o = n - s.tx,
            d = e - s.ty,
            f = (o * s.d - d * s.c) * a - t.ax,
            u = (d * s.a - o * s.b) * a - t.ay;
          let m = Math.atan2(u, f) * C.radDeg - t.ashearX - t.arotation;
          t.ascaleX < 0 && (m += 180),
            m > 180 ? (m -= 360) : m < -180 && (m += 360);
          let g = t.ascaleX,
            x = t.ascaleY;
          if (i || r) {
            const E = t.data.length * g,
              w = Math.sqrt(f * f + u * u);
            if ((i && w < E) || (r && w > E && E > 1e-4)) {
              const b = (w / E - 1) * l + 1;
              (g *= b), h && (x *= b);
            }
          }
          t.updateWorldTransformWith(
            t.ax,
            t.ay,
            t.arotation + m * l,
            g,
            x,
            t.ashearX,
            t.ashearY
          );
        }
        apply2(t, n, e, i, r, h, l) {
          if (l == 0) {
            n.updateWorldTransform();
            return;
          }
          t.appliedValid || t.updateAppliedTransform(),
            n.appliedValid || n.updateAppliedTransform();
          const s = t.ax,
            a = t.ay;
          let o = t.ascaleX,
            d = o,
            f = t.ascaleY,
            u = n.ascaleX;
          const m = t.matrix;
          let g = 0,
            x = 0,
            E = 0;
          o < 0 ? ((o = -o), (g = 180), (E = -1)) : ((g = 0), (E = 1)),
            f < 0 && ((f = -f), (E = -E)),
            u < 0 ? ((u = -u), (x = 180)) : (x = 0);
          const w = n.ax;
          let b = 0,
            p = 0,
            S = 0,
            y = m.a,
            M = m.c,
            T = m.b,
            k = m.d;
          const I = Math.abs(o - f) <= 1e-4;
          I
            ? ((b = n.ay),
              (p = y * w + M * b + m.tx),
              (S = T * w + k * b + m.ty))
            : ((b = 0), (p = y * w + m.tx), (S = T * w + m.ty));
          const R = t.parent.matrix;
          (y = R.a), (M = R.c), (T = R.b), (k = R.d);
          const V = 1 / (y * k - M * T);
          let F = e - R.tx,
            B = i - R.ty;
          const Y = (F * k - B * M) * V - s,
            N = (B * y - F * T) * V - a,
            q = Y * Y + N * N;
          (F = p - R.tx), (B = S - R.ty);
          const z = (F * k - B * M) * V - s,
            D = (B * y - F * T) * V - a,
            X = Math.sqrt(z * z + D * D);
          let L = n.data.length * u,
            O = 0,
            W = 0;
          t: if (I) {
            L *= o;
            let G = (q - X * X - L * L) / (2 * X * L);
            G < -1
              ? (G = -1)
              : G > 1 &&
                ((G = 1),
                h &&
                  X + L > 1e-4 &&
                  (d *= (Math.sqrt(q) / (X + L) - 1) * l + 1)),
              (W = Math.acos(G) * r),
              (y = X + L * G),
              (M = L * Math.sin(W)),
              (O = Math.atan2(N * y - Y * M, Y * y + N * M));
          } else {
            (y = o * L), (M = f * L);
            const G = y * y,
              lt = M * M,
              It = Math.atan2(N, Y);
            T = lt * X * X + G * q - G * lt;
            const ct = -2 * lt * X,
              Xt = lt - G;
            if (((k = ct * ct - 4 * Xt * T), k >= 0)) {
              let Kt = Math.sqrt(k);
              ct < 0 && (Kt = -Kt), (Kt = -(ct + Kt) / 2);
              const ae = Kt / Xt,
                Ke = T / Kt,
                Nt = Math.abs(ae) < Math.abs(Ke) ? ae : Ke;
              if (Nt * Nt <= q) {
                (B = Math.sqrt(q - Nt * Nt) * r),
                  (O = It - Math.atan2(B, Nt)),
                  (W = Math.atan2(B / f, (Nt - X) / o));
                break t;
              }
            }
            let Ut = C.PI,
              de = X - y,
              Me = de * de,
              Oe = 0,
              Ve = 0,
              Ae = X + y,
              Ce = Ae * Ae,
              $e = 0;
            (T = (-y * X) / (G - lt)),
              T >= -1 &&
                T <= 1 &&
                ((T = Math.acos(T)),
                (F = y * Math.cos(T) + X),
                (B = M * Math.sin(T)),
                (k = F * F + B * B),
                k < Me && ((Ut = T), (Me = k), (de = F), (Oe = B)),
                k > Ce && ((Ve = T), (Ce = k), (Ae = F), ($e = B))),
              q <= (Me + Ce) / 2
                ? ((O = It - Math.atan2(Oe * r, de)), (W = Ut * r))
                : ((O = It - Math.atan2($e * r, Ae)), (W = Ve * r));
          }
          const U = Math.atan2(b, w) * E;
          let $ = t.arotation;
          (O = (O - U) * C.radDeg + g - $),
            O > 180 ? (O -= 360) : O < -180 && (O += 360),
            t.updateWorldTransformWith(s, a, $ + O * l, d, t.ascaleY, 0, 0),
            ($ = n.arotation),
            (W = ((W + U) * C.radDeg - n.ashearX) * E + x - $),
            W > 180 ? (W -= 360) : W < -180 && (W += 360),
            n.updateWorldTransformWith(
              w,
              b,
              $ + W * l,
              n.ascaleX,
              n.ascaleY,
              n.ashearX,
              n.ashearY
            );
        }
      },
      Zi = class {
        constructor(t) {
          (this.order = 0),
            (this.bones = new Array()),
            (this.bendDirection = 1),
            (this.compress = !1),
            (this.stretch = !1),
            (this.uniform = !1),
            (this.mix = 1),
            (this.name = t);
        }
      },
      Qi = class {
        constructor(t) {
          (this.order = 0), (this.bones = new Array()), (this.name = t);
        }
      };
    var pe = ((c) => (
      (c[(c.Length = 0)] = "Length"),
      (c[(c.Fixed = 1)] = "Fixed"),
      (c[(c.Percent = 2)] = "Percent"),
      c
    ))(pe || {});
    const rn = class {
      constructor(t, n) {
        if (
          ((this.position = 0),
          (this.spacing = 0),
          (this.rotateMix = 0),
          (this.translateMix = 0),
          (this.spaces = new Array()),
          (this.positions = new Array()),
          (this.world = new Array()),
          (this.curves = new Array()),
          (this.lengths = new Array()),
          (this.segments = new Array()),
          t == null)
        )
          throw new Error("data cannot be null.");
        if (n == null) throw new Error("skeleton cannot be null.");
        (this.data = t), (this.bones = new Array());
        for (let e = 0, i = t.bones.length; e < i; e++)
          this.bones.push(n.findBone(t.bones[e].name));
        (this.target = n.findSlot(t.target.name)),
          (this.position = t.position),
          (this.spacing = t.spacing),
          (this.rotateMix = t.rotateMix),
          (this.translateMix = t.translateMix);
      }
      apply() {
        this.update();
      }
      update() {
        const t = this.target.getAttachment();
        if (!(t instanceof kn)) return;
        const n = this.rotateMix,
          e = this.translateMix,
          i = e > 0,
          r = n > 0;
        if (!i && !r) return;
        const h = this.data,
          l = h.spacingMode,
          s = l == pe.Length,
          a = h.rotateMode,
          o = a == pt.Tangent,
          d = a == pt.ChainScale,
          f = this.bones.length,
          u = o ? f : f + 1,
          m = this.bones,
          g = v.setArraySize(this.spaces, u);
        let x = null;
        const E = this.spacing;
        if (d || s) {
          d && (x = v.setArraySize(this.lengths, f));
          for (let M = 0, T = u - 1; M < T; ) {
            const k = m[M],
              I = k.data.length;
            if (I < rn.epsilon) d && (x[M] = 0), (g[++M] = 0);
            else {
              const R = I * k.matrix.a,
                V = I * k.matrix.b,
                F = Math.sqrt(R * R + V * V);
              d && (x[M] = F), (g[++M] = ((s ? I + E : E) * F) / I);
            }
          }
        } else for (let M = 1; M < u; M++) g[M] = E;
        const w = this.computeWorldPositions(
          t,
          u,
          o,
          h.positionMode == dt.Percent,
          l == pe.Percent
        );
        let b = w[0],
          p = w[1],
          S = h.offsetRotation,
          y = !1;
        if (S == 0) y = a == pt.Chain;
        else {
          y = !1;
          const M = this.target.bone.matrix;
          S *= M.a * M.d - M.b * M.c > 0 ? C.degRad : -C.degRad;
        }
        for (let M = 0, T = 3; M < f; M++, T += 3) {
          const k = m[M],
            I = k.matrix;
          (I.tx += (b - I.tx) * e), (I.ty += (p - I.ty) * e);
          const R = w[T],
            V = w[T + 1],
            F = R - b,
            B = V - p;
          if (d) {
            const Y = x[M];
            if (Y != 0) {
              const N = (Math.sqrt(F * F + B * B) / Y - 1) * n + 1;
              (I.a *= N), (I.b *= N);
            }
          }
          if (((b = R), (p = V), r)) {
            const Y = I.a,
              N = I.c,
              q = I.b,
              z = I.d;
            let D = 0,
              X = 0,
              L = 0;
            if (
              (o &&
                (o
                  ? (D = w[T - 1])
                  : g[M + 1] == 0
                  ? (D = w[T + 2])
                  : (D = Math.atan2(B, F))),
              (D -= Math.atan2(q, Y)),
              y)
            ) {
              (X = Math.cos(D)), (L = Math.sin(D));
              const O = k.data.length;
              (b += (O * (X * Y - L * q) - F) * n),
                (p += (O * (L * Y + X * q) - B) * n);
            } else D += S;
            D > C.PI ? (D -= C.PI2) : D < -C.PI && (D += C.PI2),
              (D *= n),
              (X = Math.cos(D)),
              (L = Math.sin(D)),
              (I.a = X * Y - L * q),
              (I.c = X * N - L * z),
              (I.b = L * Y + X * q),
              (I.d = L * N + X * z);
          }
          k.appliedValid = !1;
        }
      }
      computeWorldPositions(t, n, e, i, r) {
        const h = this.target;
        let l = this.position;
        const s = this.spaces,
          a = v.setArraySize(this.positions, n * 3 + 2);
        let o = null;
        const d = t.closed;
        let f = t.worldVerticesLength,
          u = f / 6,
          m = rn.NONE;
        if (!t.constantSpeed) {
          const D = t.lengths;
          u -= d ? 1 : 2;
          const X = D[u];
          if ((i && (l *= X), r)) for (let L = 0; L < n; L++) s[L] *= X;
          o = v.setArraySize(this.world, 8);
          for (let L = 0, O = 0, W = 0; L < n; L++, O += 3) {
            const U = s[L];
            l += U;
            let $ = l;
            if (d) ($ %= X), $ < 0 && ($ += X), (W = 0);
            else if ($ < 0) {
              m != rn.BEFORE &&
                ((m = rn.BEFORE), t.computeWorldVertices(h, 2, 4, o, 0, 2)),
                this.addBeforePosition($, o, 0, a, O);
              continue;
            } else if ($ > X) {
              m != rn.AFTER &&
                ((m = rn.AFTER), t.computeWorldVertices(h, f - 6, 4, o, 0, 2)),
                this.addAfterPosition($ - X, o, 0, a, O);
              continue;
            }
            for (; ; W++) {
              const G = D[W];
              if (!($ > G)) {
                if (W == 0) $ /= G;
                else {
                  const lt = D[W - 1];
                  $ = ($ - lt) / (G - lt);
                }
                break;
              }
            }
            W != m &&
              ((m = W),
              d && W == u
                ? (t.computeWorldVertices(h, f - 4, 4, o, 0, 2),
                  t.computeWorldVertices(h, 0, 4, o, 4, 2))
                : t.computeWorldVertices(h, W * 6 + 2, 8, o, 0, 2)),
              this.addCurvePosition(
                $,
                o[0],
                o[1],
                o[2],
                o[3],
                o[4],
                o[5],
                o[6],
                o[7],
                a,
                O,
                e || (L > 0 && U == 0)
              );
          }
          return a;
        }
        d
          ? ((f += 2),
            (o = v.setArraySize(this.world, f)),
            t.computeWorldVertices(h, 2, f - 4, o, 0, 2),
            t.computeWorldVertices(h, 0, 2, o, f - 4, 2),
            (o[f - 2] = o[0]),
            (o[f - 1] = o[1]))
          : (u--,
            (f -= 4),
            (o = v.setArraySize(this.world, f)),
            t.computeWorldVertices(h, 2, f, o, 0, 2));
        const g = v.setArraySize(this.curves, u);
        let x = 0,
          E = o[0],
          w = o[1],
          b = 0,
          p = 0,
          S = 0,
          y = 0,
          M = 0,
          T = 0,
          k = 0,
          I = 0,
          R = 0,
          V = 0,
          F = 0,
          B = 0,
          Y = 0,
          N = 0;
        for (let D = 0, X = 2; D < u; D++, X += 6)
          (b = o[X]),
            (p = o[X + 1]),
            (S = o[X + 2]),
            (y = o[X + 3]),
            (M = o[X + 4]),
            (T = o[X + 5]),
            (k = (E - b * 2 + S) * 0.1875),
            (I = (w - p * 2 + y) * 0.1875),
            (R = ((b - S) * 3 - E + M) * 0.09375),
            (V = ((p - y) * 3 - w + T) * 0.09375),
            (F = k * 2 + R),
            (B = I * 2 + V),
            (Y = (b - E) * 0.75 + k + R * 0.16666667),
            (N = (p - w) * 0.75 + I + V * 0.16666667),
            (x += Math.sqrt(Y * Y + N * N)),
            (Y += F),
            (N += B),
            (F += R),
            (B += V),
            (x += Math.sqrt(Y * Y + N * N)),
            (Y += F),
            (N += B),
            (x += Math.sqrt(Y * Y + N * N)),
            (Y += F + R),
            (N += B + V),
            (x += Math.sqrt(Y * Y + N * N)),
            (g[D] = x),
            (E = M),
            (w = T);
        if ((i && (l *= x), r)) for (let D = 0; D < n; D++) s[D] *= x;
        const q = this.segments;
        let z = 0;
        for (let D = 0, X = 0, L = 0, O = 0; D < n; D++, X += 3) {
          const W = s[D];
          l += W;
          let U = l;
          if (d) (U %= x), U < 0 && (U += x), (L = 0);
          else if (U < 0) {
            this.addBeforePosition(U, o, 0, a, X);
            continue;
          } else if (U > x) {
            this.addAfterPosition(U - x, o, f - 4, a, X);
            continue;
          }
          for (; ; L++) {
            const $ = g[L];
            if (!(U > $)) {
              if (L == 0) U /= $;
              else {
                const G = g[L - 1];
                U = (U - G) / ($ - G);
              }
              break;
            }
          }
          if (L != m) {
            m = L;
            let $ = L * 6;
            for (
              E = o[$],
                w = o[$ + 1],
                b = o[$ + 2],
                p = o[$ + 3],
                S = o[$ + 4],
                y = o[$ + 5],
                M = o[$ + 6],
                T = o[$ + 7],
                k = (E - b * 2 + S) * 0.03,
                I = (w - p * 2 + y) * 0.03,
                R = ((b - S) * 3 - E + M) * 0.006,
                V = ((p - y) * 3 - w + T) * 0.006,
                F = k * 2 + R,
                B = I * 2 + V,
                Y = (b - E) * 0.3 + k + R * 0.16666667,
                N = (p - w) * 0.3 + I + V * 0.16666667,
                z = Math.sqrt(Y * Y + N * N),
                q[0] = z,
                $ = 1;
              $ < 8;
              $++
            )
              (Y += F),
                (N += B),
                (F += R),
                (B += V),
                (z += Math.sqrt(Y * Y + N * N)),
                (q[$] = z);
            (Y += F),
              (N += B),
              (z += Math.sqrt(Y * Y + N * N)),
              (q[8] = z),
              (Y += F + R),
              (N += B + V),
              (z += Math.sqrt(Y * Y + N * N)),
              (q[9] = z),
              (O = 0);
          }
          for (U *= z; ; O++) {
            const $ = q[O];
            if (!(U > $)) {
              if (O == 0) U /= $;
              else {
                const G = q[O - 1];
                U = O + (U - G) / ($ - G);
              }
              break;
            }
          }
          this.addCurvePosition(
            U * 0.1,
            E,
            w,
            b,
            p,
            S,
            y,
            M,
            T,
            a,
            X,
            e || (D > 0 && W == 0)
          );
        }
        return a;
      }
      addBeforePosition(t, n, e, i, r) {
        const h = n[e],
          l = n[e + 1],
          s = n[e + 2] - h,
          a = n[e + 3] - l,
          o = Math.atan2(a, s);
        (i[r] = h + t * Math.cos(o)),
          (i[r + 1] = l + t * Math.sin(o)),
          (i[r + 2] = o);
      }
      addAfterPosition(t, n, e, i, r) {
        const h = n[e + 2],
          l = n[e + 3],
          s = h - n[e],
          a = l - n[e + 1],
          o = Math.atan2(a, s);
        (i[r] = h + t * Math.cos(o)),
          (i[r + 1] = l + t * Math.sin(o)),
          (i[r + 2] = o);
      }
      addCurvePosition(t, n, e, i, r, h, l, s, a, o, d, f) {
        (t == 0 || isNaN(t)) && (t = 1e-4);
        const u = t * t,
          m = u * t,
          g = 1 - t,
          x = g * g,
          E = x * g,
          w = g * t,
          b = w * 3,
          p = g * b,
          S = b * t,
          y = n * E + i * p + h * S + s * m,
          M = e * E + r * p + l * S + a * m;
        (o[d] = y),
          (o[d + 1] = M),
          f &&
            (o[d + 2] = Math.atan2(
              M - (e * x + r * w * 2 + l * u),
              y - (n * x + i * w * 2 + h * u)
            ));
      }
      getOrder() {
        return this.data.order;
      }
    };
    let wn = rn;
    (wn.NONE = -1), (wn.BEFORE = -2), (wn.AFTER = -3), (wn.epsilon = 1e-5);
    let Ki = class {
      constructor(t, n) {
        if (
          ((this.rotateMix = 0),
          (this.translateMix = 0),
          (this.scaleMix = 0),
          (this.shearMix = 0),
          (this.temp = new un()),
          t == null)
        )
          throw new Error("data cannot be null.");
        if (n == null) throw new Error("skeleton cannot be null.");
        (this.data = t),
          (this.rotateMix = t.rotateMix),
          (this.translateMix = t.translateMix),
          (this.scaleMix = t.scaleMix),
          (this.shearMix = t.shearMix),
          (this.bones = new Array());
        for (let e = 0; e < t.bones.length; e++)
          this.bones.push(n.findBone(t.bones[e].name));
        this.target = n.findBone(t.target.name);
      }
      apply() {
        this.update();
      }
      update() {
        this.data.local
          ? this.data.relative
            ? this.applyRelativeLocal()
            : this.applyAbsoluteLocal()
          : this.data.relative
          ? this.applyRelativeWorld()
          : this.applyAbsoluteWorld();
      }
      applyAbsoluteWorld() {
        const t = this.rotateMix,
          n = this.translateMix,
          e = this.scaleMix,
          i = this.shearMix,
          r = this.target,
          h = r.matrix,
          l = h.a,
          s = h.c,
          a = h.b,
          o = h.d,
          d = l * o - s * a > 0 ? C.degRad : -C.degRad,
          f = this.data.offsetRotation * d,
          u = this.data.offsetShearY * d,
          m = this.bones;
        for (let g = 0, x = m.length; g < x; g++) {
          const E = m[g];
          let w = !1;
          const b = E.matrix;
          if (t != 0) {
            const p = b.a,
              S = b.c,
              y = b.b,
              M = b.d;
            let T = Math.atan2(a, l) - Math.atan2(y, p) + f;
            T > C.PI ? (T -= C.PI2) : T < -C.PI && (T += C.PI2), (T *= t);
            const k = Math.cos(T),
              I = Math.sin(T);
            (b.a = k * p - I * y),
              (b.c = k * S - I * M),
              (b.b = I * p + k * y),
              (b.d = I * S + k * M),
              (w = !0);
          }
          if (n != 0) {
            const p = this.temp;
            r.localToWorld(p.set(this.data.offsetX, this.data.offsetY)),
              (b.tx += (p.x - b.tx) * n),
              (b.ty += (p.y - b.ty) * n),
              (w = !0);
          }
          if (e > 0) {
            let p = Math.sqrt(b.a * b.a + b.b * b.b),
              S = Math.sqrt(l * l + a * a);
            p > 1e-5 && (p = (p + (S - p + this.data.offsetScaleX) * e) / p),
              (b.a *= p),
              (b.b *= p),
              (p = Math.sqrt(b.c * b.c + b.d * b.d)),
              (S = Math.sqrt(s * s + o * o)),
              p > 1e-5 && (p = (p + (S - p + this.data.offsetScaleY) * e) / p),
              (b.c *= p),
              (b.d *= p),
              (w = !0);
          }
          if (i > 0) {
            const p = b.c,
              S = b.d,
              y = Math.atan2(S, p);
            let M =
              Math.atan2(o, s) - Math.atan2(a, l) - (y - Math.atan2(b.b, b.a));
            M > C.PI ? (M -= C.PI2) : M < -C.PI && (M += C.PI2),
              (M = y + (M + u) * i);
            const T = Math.sqrt(p * p + S * S);
            (b.c = Math.cos(M) * T), (b.d = Math.sin(M) * T), (w = !0);
          }
          w && (E.appliedValid = !1);
        }
      }
      applyRelativeWorld() {
        const t = this.rotateMix,
          n = this.translateMix,
          e = this.scaleMix,
          i = this.shearMix,
          r = this.target,
          h = r.matrix,
          l = h.a,
          s = h.c,
          a = h.b,
          o = h.d,
          d = l * o - s * a > 0 ? C.degRad : -C.degRad,
          f = this.data.offsetRotation * d,
          u = this.data.offsetShearY * d,
          m = this.bones;
        for (let g = 0, x = m.length; g < x; g++) {
          const E = m[g];
          let w = !1;
          const b = E.matrix;
          if (t != 0) {
            const p = b.a,
              S = b.c,
              y = b.b,
              M = b.d;
            let T = Math.atan2(a, l) + f;
            T > C.PI ? (T -= C.PI2) : T < -C.PI && (T += C.PI2), (T *= t);
            const k = Math.cos(T),
              I = Math.sin(T);
            (b.a = k * p - I * y),
              (b.c = k * S - I * M),
              (b.b = I * p + k * y),
              (b.d = I * S + k * M),
              (w = !0);
          }
          if (n != 0) {
            const p = this.temp;
            r.localToWorld(p.set(this.data.offsetX, this.data.offsetY)),
              (b.tx += p.x * n),
              (b.ty += p.y * n),
              (w = !0);
          }
          if (e > 0) {
            let p =
              (Math.sqrt(l * l + a * a) - 1 + this.data.offsetScaleX) * e + 1;
            (b.a *= p),
              (b.b *= p),
              (p =
                (Math.sqrt(s * s + o * o) - 1 + this.data.offsetScaleY) * e +
                1),
              (b.c *= p),
              (b.d *= p),
              (w = !0);
          }
          if (i > 0) {
            let p = Math.atan2(o, s) - Math.atan2(a, l);
            p > C.PI ? (p -= C.PI2) : p < -C.PI && (p += C.PI2);
            const S = b.c,
              y = b.d;
            p = Math.atan2(y, S) + (p - C.PI / 2 + u) * i;
            const M = Math.sqrt(S * S + y * y);
            (b.c = Math.cos(p) * M), (b.d = Math.sin(p) * M), (w = !0);
          }
          w && (E.appliedValid = !1);
        }
      }
      applyAbsoluteLocal() {
        const t = this.rotateMix,
          n = this.translateMix,
          e = this.scaleMix,
          i = this.shearMix,
          r = this.target;
        r.appliedValid || r.updateAppliedTransform();
        const h = this.bones;
        for (let l = 0, s = h.length; l < s; l++) {
          const a = h[l];
          a.appliedValid || a.updateAppliedTransform();
          let o = a.arotation;
          if (t != 0) {
            let x = r.arotation - o + this.data.offsetRotation;
            (x -= (16384 - ((16384.499999999996 - x / 360) | 0)) * 360),
              (o += x * t);
          }
          let d = a.ax,
            f = a.ay;
          n != 0 &&
            ((d += (r.ax - d + this.data.offsetX) * n),
            (f += (r.ay - f + this.data.offsetY) * n));
          let u = a.ascaleX,
            m = a.ascaleY;
          e > 0 &&
            (u > 1e-5 &&
              (u = (u + (r.ascaleX - u + this.data.offsetScaleX) * e) / u),
            m > 1e-5 &&
              (m = (m + (r.ascaleY - m + this.data.offsetScaleY) * e) / m));
          const g = a.ashearY;
          if (i > 0) {
            let x = r.ashearY - g + this.data.offsetShearY;
            (x -= (16384 - ((16384.499999999996 - x / 360) | 0)) * 360),
              (a.shearY += x * i);
          }
          a.updateWorldTransformWith(d, f, o, u, m, a.ashearX, g);
        }
      }
      applyRelativeLocal() {
        const t = this.rotateMix,
          n = this.translateMix,
          e = this.scaleMix,
          i = this.shearMix,
          r = this.target;
        r.appliedValid || r.updateAppliedTransform();
        const h = this.bones;
        for (let l = 0, s = h.length; l < s; l++) {
          const a = h[l];
          a.appliedValid || a.updateAppliedTransform();
          let o = a.arotation;
          t != 0 && (o += (r.arotation + this.data.offsetRotation) * t);
          let d = a.ax,
            f = a.ay;
          n != 0 &&
            ((d += (r.ax + this.data.offsetX) * n),
            (f += (r.ay + this.data.offsetY) * n));
          let u = a.ascaleX,
            m = a.ascaleY;
          e > 0 &&
            (u > 1e-5 &&
              (u *= (r.ascaleX - 1 + this.data.offsetScaleX) * e + 1),
            m > 1e-5 &&
              (m *= (r.ascaleY - 1 + this.data.offsetScaleY) * e + 1));
          let g = a.ashearY;
          i > 0 && (g += (r.ashearY + this.data.offsetShearY) * i),
            a.updateWorldTransformWith(d, f, o, u, m, a.ashearX, g);
        }
      }
      getOrder() {
        return this.data.order;
      }
    };
    const In = class {
      constructor(t) {
        if (
          ((this._updateCache = new Array()),
          (this.updateCacheReset = new Array()),
          (this.time = 0),
          (this.scaleX = 1),
          (this.scaleY = 1),
          (this.x = 0),
          (this.y = 0),
          t == null)
        )
          throw new Error("data cannot be null.");
        (this.data = t), (this.bones = new Array());
        for (let n = 0; n < t.bones.length; n++) {
          const e = t.bones[n];
          let i;
          if (e.parent == null) i = new Ys(e, this, null);
          else {
            const r = this.bones[e.parent.index];
            (i = new Ys(e, this, r)), r.children.push(i);
          }
          this.bones.push(i);
        }
        (this.slots = new Array()), (this.drawOrder = new Array());
        for (let n = 0; n < t.slots.length; n++) {
          const e = t.slots[n],
            i = this.bones[e.boneData.index],
            r = new Rs(e, i);
          this.slots.push(r), this.drawOrder.push(r);
        }
        this.ikConstraints = new Array();
        for (let n = 0; n < t.ikConstraints.length; n++) {
          const e = t.ikConstraints[n];
          this.ikConstraints.push(new ji(e, this));
        }
        this.transformConstraints = new Array();
        for (let n = 0; n < t.transformConstraints.length; n++) {
          const e = t.transformConstraints[n];
          this.transformConstraints.push(new Ki(e, this));
        }
        this.pathConstraints = new Array();
        for (let n = 0; n < t.pathConstraints.length; n++) {
          const e = t.pathConstraints[n];
          this.pathConstraints.push(new wn(e, this));
        }
        (this.color = new _(1, 1, 1, 1)), this.updateCache();
      }
      updateCache() {
        const t = this._updateCache;
        (t.length = 0), (this.updateCacheReset.length = 0);
        const n = this.bones;
        for (let o = 0, d = n.length; o < d; o++) n[o].sorted = !1;
        const e = this.ikConstraints,
          i = this.transformConstraints,
          r = this.pathConstraints,
          h = e.length,
          l = i.length,
          s = r.length,
          a = h + l + s;
        t: for (let o = 0; o < a; o++) {
          for (let d = 0; d < h; d++) {
            const f = e[d];
            if (f.data.order == o) {
              this.sortIkConstraint(f);
              continue t;
            }
          }
          for (let d = 0; d < l; d++) {
            const f = i[d];
            if (f.data.order == o) {
              this.sortTransformConstraint(f);
              continue t;
            }
          }
          for (let d = 0; d < s; d++) {
            const f = r[d];
            if (f.data.order == o) {
              this.sortPathConstraint(f);
              continue t;
            }
          }
        }
        for (let o = 0, d = n.length; o < d; o++) this.sortBone(n[o]);
      }
      sortIkConstraint(t) {
        const n = t.target;
        this.sortBone(n);
        const e = t.bones,
          i = e[0];
        if ((this.sortBone(i), e.length > 1)) {
          const r = e[e.length - 1];
          this._updateCache.indexOf(r) > -1 || this.updateCacheReset.push(r);
        }
        this._updateCache.push(t),
          this.sortReset(i.children),
          (e[e.length - 1].sorted = !0);
      }
      sortPathConstraint(t) {
        const n = t.target,
          e = n.data.index,
          i = n.bone;
        this.skin != null && this.sortPathConstraintAttachment(this.skin, e, i),
          this.data.defaultSkin != null &&
            this.data.defaultSkin != this.skin &&
            this.sortPathConstraintAttachment(this.data.defaultSkin, e, i);
        for (let s = 0, a = this.data.skins.length; s < a; s++)
          this.sortPathConstraintAttachment(this.data.skins[s], e, i);
        const r = n.getAttachment();
        r instanceof kn && this.sortPathConstraintAttachmentWith(r, i);
        const h = t.bones,
          l = h.length;
        for (let s = 0; s < l; s++) this.sortBone(h[s]);
        this._updateCache.push(t);
        for (let s = 0; s < l; s++) this.sortReset(h[s].children);
        for (let s = 0; s < l; s++) h[s].sorted = !0;
      }
      sortTransformConstraint(t) {
        this.sortBone(t.target);
        const n = t.bones,
          e = n.length;
        if (t.data.local)
          for (let i = 0; i < e; i++) {
            const r = n[i];
            this.sortBone(r.parent),
              this._updateCache.indexOf(r) > -1 ||
                this.updateCacheReset.push(r);
          }
        else for (let i = 0; i < e; i++) this.sortBone(n[i]);
        this._updateCache.push(t);
        for (let i = 0; i < e; i++) this.sortReset(n[i].children);
        for (let i = 0; i < e; i++) n[i].sorted = !0;
      }
      sortPathConstraintAttachment(t, n, e) {
        const i = t.attachments[n];
        if (i)
          for (const r in i) this.sortPathConstraintAttachmentWith(i[r], e);
      }
      sortPathConstraintAttachmentWith(t, n) {
        if (!(t instanceof kn)) return;
        const e = t.bones;
        if (e == null) this.sortBone(n);
        else {
          const i = this.bones;
          let r = 0;
          for (; r < e.length; ) {
            const h = e[r++];
            for (let l = r + h; r < l; r++) {
              const s = e[r];
              this.sortBone(i[s]);
            }
          }
        }
      }
      sortBone(t) {
        if (t.sorted) return;
        const n = t.parent;
        n != null && this.sortBone(n),
          (t.sorted = !0),
          this._updateCache.push(t);
      }
      sortReset(t) {
        for (let n = 0, e = t.length; n < e; n++) {
          const i = t[n];
          i.sorted && this.sortReset(i.children), (i.sorted = !1);
        }
      }
      updateWorldTransform() {
        const t = this.updateCacheReset;
        for (let e = 0, i = t.length; e < i; e++) {
          const r = t[e];
          (r.ax = r.x),
            (r.ay = r.y),
            (r.arotation = r.rotation),
            (r.ascaleX = r.scaleX),
            (r.ascaleY = r.scaleY),
            (r.ashearX = r.shearX),
            (r.ashearY = r.shearY),
            (r.appliedValid = !0);
        }
        const n = this._updateCache;
        for (let e = 0, i = n.length; e < i; e++) n[e].update();
      }
      setToSetupPose() {
        this.setBonesToSetupPose(), this.setSlotsToSetupPose();
      }
      setBonesToSetupPose() {
        const t = this.bones;
        for (let r = 0, h = t.length; r < h; r++) t[r].setToSetupPose();
        const n = this.ikConstraints;
        for (let r = 0, h = n.length; r < h; r++) {
          const l = n[r];
          (l.bendDirection = l.data.bendDirection), (l.mix = l.data.mix);
        }
        const e = this.transformConstraints;
        for (let r = 0, h = e.length; r < h; r++) {
          const l = e[r],
            s = l.data;
          (l.rotateMix = s.rotateMix),
            (l.translateMix = s.translateMix),
            (l.scaleMix = s.scaleMix),
            (l.shearMix = s.shearMix);
        }
        const i = this.pathConstraints;
        for (let r = 0, h = i.length; r < h; r++) {
          const l = i[r],
            s = l.data;
          (l.position = s.position),
            (l.spacing = s.spacing),
            (l.rotateMix = s.rotateMix),
            (l.translateMix = s.translateMix);
        }
      }
      setSlotsToSetupPose() {
        const t = this.slots;
        v.arrayCopy(t, 0, this.drawOrder, 0, t.length);
        for (let n = 0, e = t.length; n < e; n++) t[n].setToSetupPose();
      }
      getRootBone() {
        return this.bones.length == 0 ? null : this.bones[0];
      }
      findBone(t) {
        if (t == null) throw new Error("boneName cannot be null.");
        const n = this.bones;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      findBoneIndex(t) {
        if (t == null) throw new Error("boneName cannot be null.");
        const n = this.bones;
        for (let e = 0, i = n.length; e < i; e++)
          if (n[e].data.name == t) return e;
        return -1;
      }
      findSlot(t) {
        if (t == null) throw new Error("slotName cannot be null.");
        const n = this.slots;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      findSlotIndex(t) {
        if (t == null) throw new Error("slotName cannot be null.");
        const n = this.slots;
        for (let e = 0, i = n.length; e < i; e++)
          if (n[e].data.name == t) return e;
        return -1;
      }
      setSkinByName(t) {
        const n = this.data.findSkin(t);
        if (n == null) throw new Error(`Skin not found: ${t}`);
        this.setSkin(n);
      }
      setSkin(t) {
        if (t != null)
          if (this.skin != null) t.attachAll(this, this.skin);
          else {
            const n = this.slots;
            for (let e = 0, i = n.length; e < i; e++) {
              const r = n[e],
                h = r.data.attachmentName;
              if (h != null) {
                const l = t.getAttachment(e, h);
                l != null && r.setAttachment(l);
              }
            }
          }
        this.skin = t;
      }
      getAttachmentByName(t, n) {
        return this.getAttachment(this.data.findSlotIndex(t), n);
      }
      getAttachment(t, n) {
        if (n == null) throw new Error("attachmentName cannot be null.");
        if (this.skin != null) {
          const e = this.skin.getAttachment(t, n);
          if (e != null) return e;
        }
        return this.data.defaultSkin != null
          ? this.data.defaultSkin.getAttachment(t, n)
          : null;
      }
      setAttachment(t, n) {
        if (t == null) throw new Error("slotName cannot be null.");
        const e = this.slots;
        for (let i = 0, r = e.length; i < r; i++) {
          const h = e[i];
          if (h.data.name == t) {
            let l = null;
            if (n != null && ((l = this.getAttachment(i, n)), l == null))
              throw new Error(`Attachment not found: ${n}, for slot: ${t}`);
            h.setAttachment(l);
            return;
          }
        }
        throw new Error(`Slot not found: ${t}`);
      }
      findIkConstraint(t) {
        if (t == null) throw new Error("constraintName cannot be null.");
        const n = this.ikConstraints;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      findTransformConstraint(t) {
        if (t == null) throw new Error("constraintName cannot be null.");
        const n = this.transformConstraints;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      findPathConstraint(t) {
        if (t == null) throw new Error("constraintName cannot be null.");
        const n = this.pathConstraints;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == t) return r;
        }
        return null;
      }
      getBounds(t, n, e) {
        if (t == null) throw new Error("offset cannot be null.");
        if (n == null) throw new Error("size cannot be null.");
        const i = this.drawOrder;
        let r = Number.POSITIVE_INFINITY,
          h = Number.POSITIVE_INFINITY,
          l = Number.NEGATIVE_INFINITY,
          s = Number.NEGATIVE_INFINITY;
        for (let a = 0, o = i.length; a < o; a++) {
          const d = i[a];
          let f = 0,
            u = null;
          const m = d.getAttachment();
          if (m instanceof K)
            (f = 8),
              (u = v.setArraySize(e, f, 0)),
              m.computeWorldVertices(d.bone, u, 0, 2);
          else if (m instanceof Is) {
            const g = m;
            (f = g.worldVerticesLength),
              (u = v.setArraySize(e, f, 0)),
              g.computeWorldVertices(d, 0, f, u, 0, 2);
          }
          if (u != null)
            for (let g = 0, x = u.length; g < x; g += 2) {
              const E = u[g],
                w = u[g + 1];
              (r = Math.min(r, E)),
                (h = Math.min(h, w)),
                (l = Math.max(l, E)),
                (s = Math.max(s, w));
            }
        }
        t.set(r, h), n.set(l - r, s - h);
      }
      update(t) {
        this.time += t;
      }
      get flipX() {
        return this.scaleX == -1;
      }
      set flipX(t) {
        In.deprecatedWarning1 ||
          ((In.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY"
          )),
          (this.scaleX = t ? 1 : -1);
      }
      get flipY() {
        return this.scaleY == -1;
      }
      set flipY(t) {
        In.deprecatedWarning1 ||
          ((In.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY"
          )),
          (this.scaleY = t ? 1 : -1);
      }
    };
    let Xs = In;
    Xs.deprecatedWarning1 = !1;
    let Lr = class extends Cn {},
      Ji = class {
        constructor() {
          (this.bones = new Array()),
            (this.slots = new Array()),
            (this.skins = new Array()),
            (this.events = new Array()),
            (this.animations = new Array()),
            (this.ikConstraints = new Array()),
            (this.transformConstraints = new Array()),
            (this.pathConstraints = new Array()),
            (this.fps = 0);
        }
        findBone(t) {
          if (t == null) throw new Error("boneName cannot be null.");
          const n = this.bones;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findBoneIndex(t) {
          if (t == null) throw new Error("boneName cannot be null.");
          const n = this.bones;
          for (let e = 0, i = n.length; e < i; e++)
            if (n[e].name == t) return e;
          return -1;
        }
        findSlot(t) {
          if (t == null) throw new Error("slotName cannot be null.");
          const n = this.slots;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findSlotIndex(t) {
          if (t == null) throw new Error("slotName cannot be null.");
          const n = this.slots;
          for (let e = 0, i = n.length; e < i; e++)
            if (n[e].name == t) return e;
          return -1;
        }
        findSkin(t) {
          if (t == null) throw new Error("skinName cannot be null.");
          const n = this.skins;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findEvent(t) {
          if (t == null) throw new Error("eventDataName cannot be null.");
          const n = this.events;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findAnimation(t) {
          if (t == null) throw new Error("animationName cannot be null.");
          const n = this.animations;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findIkConstraint(t) {
          if (t == null) throw new Error("constraintName cannot be null.");
          const n = this.ikConstraints;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findTransformConstraint(t) {
          if (t == null) throw new Error("constraintName cannot be null.");
          const n = this.transformConstraints;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findPathConstraint(t) {
          if (t == null) throw new Error("constraintName cannot be null.");
          const n = this.pathConstraints;
          for (let e = 0, i = n.length; e < i; e++) {
            const r = n[e];
            if (r.name == t) return r;
          }
          return null;
        }
        findPathConstraintIndex(t) {
          if (t == null) throw new Error("pathConstraintName cannot be null.");
          const n = this.pathConstraints;
          for (let e = 0, i = n.length; e < i; e++)
            if (n[e].name == t) return e;
          return -1;
        }
      },
      tr = class {
        constructor(t, n, e) {
          if (((this.color = new _(1, 1, 1, 1)), t < 0))
            throw new Error("index must be >= 0.");
          if (n == null) throw new Error("name cannot be null.");
          if (e == null) throw new Error("boneData cannot be null.");
          (this.index = t), (this.name = n), (this.boneData = e);
        }
      },
      er = class {
        constructor(t) {
          if (
            ((this.order = 0),
            (this.bones = new Array()),
            (this.rotateMix = 0),
            (this.translateMix = 0),
            (this.scaleMix = 0),
            (this.shearMix = 0),
            (this.offsetRotation = 0),
            (this.offsetX = 0),
            (this.offsetY = 0),
            (this.offsetScaleX = 0),
            (this.offsetScaleY = 0),
            (this.offsetShearY = 0),
            (this.relative = !1),
            (this.local = !1),
            t == null)
          )
            throw new Error("name cannot be null.");
          this.name = t;
        }
      },
      nr = class {
        constructor(t) {
          if (((this.attachments = new Array()), t == null))
            throw new Error("name cannot be null.");
          this.name = t;
        }
        addAttachment(t, n, e) {
          if (e == null) throw new Error("attachment cannot be null.");
          const i = this.attachments;
          t >= i.length && (i.length = t + 1),
            i[t] || (i[t] = {}),
            (i[t][n] = e);
        }
        getAttachment(t, n) {
          const e = this.attachments[t];
          return e ? e[n] : null;
        }
        attachAll(t, n) {
          let e = 0;
          for (let i = 0; i < t.slots.length; i++) {
            const r = t.slots[i],
              h = r.getAttachment();
            if (h && e < n.attachments.length) {
              const l = n.attachments[e];
              for (const s in l) {
                const a = l[s];
                if (h == a) {
                  const o = this.getAttachment(e, s);
                  o != null && r.setAttachment(o);
                  break;
                }
              }
            }
            e++;
          }
        }
      },
      an = class {
        constructor(t) {
          (this.scale = 1),
            (this.linkedMeshes = new Array()),
            (this.attachmentLoader = t);
        }
        readSkeletonData(t) {
          const n = this.scale,
            e = new Ji(),
            i = typeof t == "string" ? JSON.parse(t) : t,
            r = i.skeleton;
          if (
            (r != null &&
              ((e.hash = r.hash),
              (e.version = r.spine),
              (e.width = r.width),
              (e.height = r.height),
              (e.fps = r.fps),
              (e.imagesPath = r.images)),
            i.bones)
          )
            for (let h = 0; h < i.bones.length; h++) {
              const l = i.bones[h];
              let s = null;
              const a = this.getValue(l, "parent", null);
              if (a != null && ((s = e.findBone(a)), s == null))
                throw new Error(`Parent bone not found: ${a}`);
              const o = new zi(e.bones.length, l.name, s);
              (o.length = this.getValue(l, "length", 0) * n),
                (o.x = this.getValue(l, "x", 0) * n),
                (o.y = this.getValue(l, "y", 0) * n),
                (o.rotation = this.getValue(l, "rotation", 0)),
                (o.scaleX = this.getValue(l, "scaleX", 1)),
                (o.scaleY = this.getValue(l, "scaleY", 1)),
                (o.shearX = this.getValue(l, "shearX", 0)),
                (o.shearY = this.getValue(l, "shearY", 0)),
                (o.transformMode = an.transformModeFromString(
                  this.getValue(l, "transform", "normal")
                )),
                e.bones.push(o);
            }
          if (i.slots)
            for (let h = 0; h < i.slots.length; h++) {
              const l = i.slots[h],
                s = l.name,
                a = l.bone,
                o = e.findBone(a);
              if (o == null) throw new Error(`Slot bone not found: ${a}`);
              const d = new tr(e.slots.length, s, o),
                f = this.getValue(l, "color", null);
              f != null && d.color.setFromString(f);
              const u = this.getValue(l, "dark", null);
              u != null &&
                ((d.darkColor = new _(1, 1, 1, 1)),
                d.darkColor.setFromString(u)),
                (d.attachmentName = this.getValue(l, "attachment", null)),
                (d.blendMode = an.blendModeFromString(
                  this.getValue(l, "blend", "normal")
                )),
                e.slots.push(d);
            }
          if (i.ik)
            for (let h = 0; h < i.ik.length; h++) {
              const l = i.ik[h],
                s = new Zi(l.name);
              s.order = this.getValue(l, "order", 0);
              for (let o = 0; o < l.bones.length; o++) {
                const d = l.bones[o],
                  f = e.findBone(d);
                if (f == null) throw new Error(`IK bone not found: ${d}`);
                s.bones.push(f);
              }
              const a = l.target;
              if (((s.target = e.findBone(a)), s.target == null))
                throw new Error(`IK target bone not found: ${a}`);
              (s.bendDirection = this.getValue(l, "bendPositive", !0) ? 1 : -1),
                (s.mix = this.getValue(l, "mix", 1)),
                e.ikConstraints.push(s);
            }
          if (i.transform)
            for (let h = 0; h < i.transform.length; h++) {
              const l = i.transform[h],
                s = new er(l.name);
              s.order = this.getValue(l, "order", 0);
              for (let o = 0; o < l.bones.length; o++) {
                const d = l.bones[o],
                  f = e.findBone(d);
                if (f == null)
                  throw new Error(`Transform constraint bone not found: ${d}`);
                s.bones.push(f);
              }
              const a = l.target;
              if (((s.target = e.findBone(a)), s.target == null))
                throw new Error(
                  `Transform constraint target bone not found: ${a}`
                );
              (s.local = this.getValue(l, "local", !1)),
                (s.relative = this.getValue(l, "relative", !1)),
                (s.offsetRotation = this.getValue(l, "rotation", 0)),
                (s.offsetX = this.getValue(l, "x", 0) * n),
                (s.offsetY = this.getValue(l, "y", 0) * n),
                (s.offsetScaleX = this.getValue(l, "scaleX", 0)),
                (s.offsetScaleY = this.getValue(l, "scaleY", 0)),
                (s.offsetShearY = this.getValue(l, "shearY", 0)),
                (s.rotateMix = this.getValue(l, "rotateMix", 1)),
                (s.translateMix = this.getValue(l, "translateMix", 1)),
                (s.scaleMix = this.getValue(l, "scaleMix", 1)),
                (s.shearMix = this.getValue(l, "shearMix", 1)),
                e.transformConstraints.push(s);
            }
          if (i.path)
            for (let h = 0; h < i.path.length; h++) {
              const l = i.path[h],
                s = new Qi(l.name);
              s.order = this.getValue(l, "order", 0);
              for (let o = 0; o < l.bones.length; o++) {
                const d = l.bones[o],
                  f = e.findBone(d);
                if (f == null)
                  throw new Error(`Transform constraint bone not found: ${d}`);
                s.bones.push(f);
              }
              const a = l.target;
              if (((s.target = e.findSlot(a)), s.target == null))
                throw new Error(`Path target slot not found: ${a}`);
              (s.positionMode = an.positionModeFromString(
                this.getValue(l, "positionMode", "percent")
              )),
                (s.spacingMode = an.spacingModeFromString(
                  this.getValue(l, "spacingMode", "length")
                )),
                (s.rotateMode = an.rotateModeFromString(
                  this.getValue(l, "rotateMode", "tangent")
                )),
                (s.offsetRotation = this.getValue(l, "rotation", 0)),
                (s.position = this.getValue(l, "position", 0)),
                s.positionMode == dt.Fixed && (s.position *= n),
                (s.spacing = this.getValue(l, "spacing", 0)),
                (s.spacingMode == pe.Length || s.spacingMode == pe.Fixed) &&
                  (s.spacing *= n),
                (s.rotateMix = this.getValue(l, "rotateMix", 1)),
                (s.translateMix = this.getValue(l, "translateMix", 1)),
                e.pathConstraints.push(s);
            }
          if (i.skins)
            for (const h in i.skins) {
              const l = i.skins[h],
                s = new nr(h);
              for (const a in l) {
                const o = e.findSlotIndex(a);
                if (o == -1) throw new Error(`Slot not found: ${a}`);
                const d = l[a];
                for (const f in d) {
                  const u = this.readAttachment(d[f], s, o, f, e);
                  u != null && s.addAttachment(o, f, u);
                }
              }
              e.skins.push(s), s.name == "default" && (e.defaultSkin = s);
            }
          for (let h = 0, l = this.linkedMeshes.length; h < l; h++) {
            const s = this.linkedMeshes[h],
              a = s.skin == null ? e.defaultSkin : e.findSkin(s.skin);
            if (a == null) throw new Error(`Skin not found: ${s.skin}`);
            const o = a.getAttachment(s.slotIndex, s.parent);
            if (o == null)
              throw new Error(`Parent mesh not found: ${s.parent}`);
            s.mesh.setParentMesh(o);
          }
          if (((this.linkedMeshes.length = 0), i.events))
            for (const h in i.events) {
              const l = i.events[h],
                s = new Gi(h);
              (s.intValue = this.getValue(l, "int", 0)),
                (s.floatValue = this.getValue(l, "float", 0)),
                (s.stringValue = this.getValue(l, "string", "")),
                (s.audioPath = this.getValue(l, "audio", null)),
                s.audioPath != null &&
                  ((s.volume = this.getValue(l, "volume", 1)),
                  (s.balance = this.getValue(l, "balance", 0))),
                e.events.push(s);
            }
          if (i.animations)
            for (const h in i.animations) {
              const l = i.animations[h];
              this.readAnimation(l, h, e);
            }
          return e;
        }
        readAttachment(t, n, e, i, r) {
          const h = this.scale;
          switch (
            ((i = this.getValue(t, "name", i)),
            this.getValue(t, "type", "region"))
          ) {
            case "region": {
              const s = this.getValue(t, "path", i),
                a = this.attachmentLoader.newRegionAttachment(n, i, s);
              if (a == null) return null;
              (a.path = s),
                (a.x = this.getValue(t, "x", 0) * h),
                (a.y = this.getValue(t, "y", 0) * h),
                (a.scaleX = this.getValue(t, "scaleX", 1)),
                (a.scaleY = this.getValue(t, "scaleY", 1)),
                (a.rotation = this.getValue(t, "rotation", 0)),
                (a.width = t.width * h),
                (a.height = t.height * h);
              const o = this.getValue(t, "color", null);
              return o != null && a.color.setFromString(o), a;
            }
            case "boundingbox": {
              const s = this.attachmentLoader.newBoundingBoxAttachment(n, i);
              if (s == null) return null;
              this.readVertices(t, s, t.vertexCount << 1);
              const a = this.getValue(t, "color", null);
              return a != null && s.color.setFromString(a), s;
            }
            case "mesh":
            case "linkedmesh": {
              const s = this.getValue(t, "path", i),
                a = this.attachmentLoader.newMeshAttachment(n, i, s);
              if (a == null) return null;
              a.path = s;
              const o = this.getValue(t, "color", null);
              o != null && a.color.setFromString(o);
              const d = this.getValue(t, "parent", null);
              if (d != null)
                return (
                  (a.inheritDeform = this.getValue(t, "deform", !0)),
                  this.linkedMeshes.push(
                    new _r(a, this.getValue(t, "skin", null), e, d)
                  ),
                  a
                );
              const f = t.uvs;
              return (
                this.readVertices(t, a, f.length),
                (a.triangles = t.triangles),
                (a.regionUVs = new Float32Array(f)),
                (a.hullLength = this.getValue(t, "hull", 0) * 2),
                a
              );
            }
            case "path": {
              const s = this.attachmentLoader.newPathAttachment(n, i);
              if (s == null) return null;
              (s.closed = this.getValue(t, "closed", !1)),
                (s.constantSpeed = this.getValue(t, "constantSpeed", !0));
              const a = t.vertexCount;
              this.readVertices(t, s, a << 1);
              const o = v.newArray(a / 3, 0);
              for (let f = 0; f < t.lengths.length; f++)
                o[f] = t.lengths[f] * h;
              s.lengths = o;
              const d = this.getValue(t, "color", null);
              return d != null && s.color.setFromString(d), s;
            }
            case "point": {
              const s = this.attachmentLoader.newPointAttachment(n, i);
              if (s == null) return null;
              (s.x = this.getValue(t, "x", 0) * h),
                (s.y = this.getValue(t, "y", 0) * h),
                (s.rotation = this.getValue(t, "rotation", 0));
              const a = this.getValue(t, "color", null);
              return a != null && s.color.setFromString(a), s;
            }
            case "clipping": {
              const s = this.attachmentLoader.newClippingAttachment(n, i);
              if (s == null) return null;
              const a = this.getValue(t, "end", null);
              if (a != null) {
                const f = r.findSlot(a);
                if (f == null)
                  throw new Error(`Clipping end slot not found: ${a}`);
                s.endSlot = f;
              }
              const o = t.vertexCount;
              this.readVertices(t, s, o << 1);
              const d = this.getValue(t, "color", null);
              return d != null && s.color.setFromString(d), s;
            }
          }
          return null;
        }
        readVertices(t, n, e) {
          const i = this.scale;
          n.worldVerticesLength = e;
          const r = t.vertices;
          if (e == r.length) {
            const s = v.toFloatArray(r);
            if (i != 1) for (let a = 0, o = r.length; a < o; a++) s[a] *= i;
            n.vertices = s;
            return;
          }
          const h = new Array(),
            l = new Array();
          for (let s = 0, a = r.length; s < a; ) {
            const o = r[s++];
            l.push(o);
            for (let d = s + o * 4; s < d; s += 4)
              l.push(r[s]),
                h.push(r[s + 1] * i),
                h.push(r[s + 2] * i),
                h.push(r[s + 3]);
          }
          (n.bones = l), (n.vertices = v.toFloatArray(h));
        }
        readAnimation(t, n, e) {
          const i = this.scale,
            r = new Array();
          let h = 0;
          if (t.slots)
            for (const s in t.slots) {
              const a = t.slots[s],
                o = e.findSlotIndex(s);
              if (o == -1) throw new Error(`Slot not found: ${s}`);
              for (const d in a) {
                const f = a[d];
                if (d == "attachment") {
                  const u = new Dn(f.length);
                  u.slotIndex = o;
                  let m = 0;
                  for (let g = 0; g < f.length; g++) {
                    const x = f[g];
                    u.setFrame(m++, x.time, x.name);
                  }
                  r.push(u), (h = Math.max(h, u.frames[u.getFrameCount() - 1]));
                } else if (d == "color") {
                  const u = new se(f.length);
                  u.slotIndex = o;
                  let m = 0;
                  for (let g = 0; g < f.length; g++) {
                    const x = f[g],
                      E = new _();
                    E.setFromString(x.color || "ffffffff"),
                      u.setFrame(m, x.time, E.r, E.g, E.b, E.a),
                      this.readCurve(x, u, m),
                      m++;
                  }
                  r.push(u),
                    (h = Math.max(
                      h,
                      u.frames[(u.getFrameCount() - 1) * se.ENTRIES]
                    ));
                } else if (d == "twoColor") {
                  const u = new Tt(f.length);
                  u.slotIndex = o;
                  let m = 0;
                  for (let g = 0; g < f.length; g++) {
                    const x = f[g],
                      E = new _(),
                      w = new _();
                    E.setFromString(x.light),
                      w.setFromString(x.dark),
                      u.setFrame(m, x.time, E.r, E.g, E.b, E.a, w.r, w.g, w.b),
                      this.readCurve(x, u, m),
                      m++;
                  }
                  r.push(u),
                    (h = Math.max(
                      h,
                      u.frames[(u.getFrameCount() - 1) * Tt.ENTRIES]
                    ));
                } else
                  throw new Error(
                    `Invalid timeline type for a slot: ${d} (${s})`
                  );
              }
            }
          if (t.bones)
            for (const s in t.bones) {
              const a = t.bones[s],
                o = e.findBoneIndex(s);
              if (o == -1) throw new Error(`Bone not found: ${s}`);
              for (const d in a) {
                const f = a[d];
                if (d === "rotate") {
                  const u = new $t(f.length);
                  u.boneIndex = o;
                  let m = 0;
                  for (let g = 0; g < f.length; g++) {
                    const x = f[g];
                    u.setFrame(m, x.time, x.angle),
                      this.readCurve(x, u, m),
                      m++;
                  }
                  r.push(u),
                    (h = Math.max(
                      h,
                      u.frames[(u.getFrameCount() - 1) * $t.ENTRIES]
                    ));
                } else if (
                  d === "translate" ||
                  d === "scale" ||
                  d === "shear"
                ) {
                  let u = null,
                    m = 1;
                  d === "scale"
                    ? (u = new le(f.length))
                    : d === "shear"
                    ? (u = new ce(f.length))
                    : ((u = new ge(f.length)), (m = i)),
                    (u.boneIndex = o);
                  let g = 0;
                  for (let x = 0; x < f.length; x++) {
                    const E = f[x],
                      w = this.getValue(E, "x", 0),
                      b = this.getValue(E, "y", 0);
                    u.setFrame(g, E.time, w * m, b * m),
                      this.readCurve(E, u, g),
                      g++;
                  }
                  r.push(u),
                    (h = Math.max(
                      h,
                      u.frames[(u.getFrameCount() - 1) * ge.ENTRIES]
                    ));
                } else
                  throw new Error(
                    `Invalid timeline type for a bone: ${d} (${s})`
                  );
              }
            }
          if (t.ik)
            for (const s in t.ik) {
              const a = t.ik[s],
                o = e.findIkConstraint(s),
                d = new ie(a.length);
              d.ikConstraintIndex = e.ikConstraints.indexOf(o);
              let f = 0;
              for (let u = 0; u < a.length; u++) {
                const m = a[u];
                d.setFrame(
                  f,
                  m.time,
                  this.getValue(m, "mix", 1),
                  this.getValue(m, "bendPositive", !0) ? 1 : -1,
                  this.getValue(m, "compress", !1),
                  this.getValue(m, "stretch", !1)
                ),
                  this.readCurve(m, d, f),
                  f++;
              }
              r.push(d),
                (h = Math.max(
                  h,
                  d.frames[(d.getFrameCount() - 1) * ie.ENTRIES]
                ));
            }
          if (t.transform)
            for (const s in t.transform) {
              const a = t.transform[s],
                o = e.findTransformConstraint(s),
                d = new re(a.length);
              d.transformConstraintIndex = e.transformConstraints.indexOf(o);
              let f = 0;
              for (let u = 0; u < a.length; u++) {
                const m = a[u];
                d.setFrame(
                  f,
                  m.time,
                  this.getValue(m, "rotateMix", 1),
                  this.getValue(m, "translateMix", 1),
                  this.getValue(m, "scaleMix", 1),
                  this.getValue(m, "shearMix", 1)
                ),
                  this.readCurve(m, d, f),
                  f++;
              }
              r.push(d),
                (h = Math.max(
                  h,
                  d.frames[(d.getFrameCount() - 1) * re.ENTRIES]
                ));
            }
          if (t.paths)
            for (const s in t.paths) {
              const a = t.paths[s],
                o = e.findPathConstraintIndex(s);
              if (o == -1) throw new Error(`Path constraint not found: ${s}`);
              const d = e.pathConstraints[o];
              for (const f in a) {
                const u = a[f];
                if (f === "position" || f === "spacing") {
                  let m = null,
                    g = 1;
                  f === "spacing"
                    ? ((m = new Xe(u.length)),
                      (d.spacingMode == pe.Length ||
                        d.spacingMode == pe.Fixed) &&
                        (g = i))
                    : ((m = new Ze(u.length)),
                      d.positionMode == dt.Fixed && (g = i)),
                    (m.pathConstraintIndex = o);
                  let x = 0;
                  for (let E = 0; E < u.length; E++) {
                    const w = u[E];
                    m.setFrame(x, w.time, this.getValue(w, f, 0) * g),
                      this.readCurve(w, m, x),
                      x++;
                  }
                  r.push(m),
                    (h = Math.max(
                      h,
                      m.frames[(m.getFrameCount() - 1) * Ze.ENTRIES]
                    ));
                } else if (f === "mix") {
                  const m = new Ne(u.length);
                  m.pathConstraintIndex = o;
                  let g = 0;
                  for (let x = 0; x < u.length; x++) {
                    const E = u[x];
                    m.setFrame(
                      g,
                      E.time,
                      this.getValue(E, "rotateMix", 1),
                      this.getValue(E, "translateMix", 1)
                    ),
                      this.readCurve(E, m, g),
                      g++;
                  }
                  r.push(m),
                    (h = Math.max(
                      h,
                      m.frames[(m.getFrameCount() - 1) * Ne.ENTRIES]
                    ));
                }
              }
            }
          if (t.deform)
            for (const s in t.deform) {
              const a = t.deform[s],
                o = e.findSkin(s);
              if (o == null) {
                if (zt.FAIL_ON_NON_EXISTING_SKIN)
                  throw new Error(`Skin not found: ${s}`);
                continue;
              }
              for (const d in a) {
                const f = a[d],
                  u = e.findSlotIndex(d);
                if (u == -1) throw new Error(`Slot not found: ${f.name}`);
                for (const m in f) {
                  const g = f[m],
                    x = o.getAttachment(u, m);
                  if (x == null)
                    throw new Error(`Deform attachment not found: ${g.name}`);
                  const E = x.bones != null,
                    w = x.vertices,
                    b = E ? (w.length / 3) * 2 : w.length,
                    p = new Wi(g.length);
                  (p.slotIndex = u), (p.attachment = x);
                  let S = 0;
                  for (let y = 0; y < g.length; y++) {
                    const M = g[y];
                    let T;
                    const k = this.getValue(M, "vertices", null);
                    if (k == null) T = E ? v.newFloatArray(b) : w;
                    else {
                      T = v.newFloatArray(b);
                      const I = this.getValue(M, "offset", 0);
                      if ((v.arrayCopy(k, 0, T, I, k.length), i != 1))
                        for (let R = I, V = R + k.length; R < V; R++) T[R] *= i;
                      if (!E) for (let R = 0; R < b; R++) T[R] += w[R];
                    }
                    p.setFrame(S, M.time, T), this.readCurve(M, p, S), S++;
                  }
                  r.push(p), (h = Math.max(h, p.frames[p.getFrameCount() - 1]));
                }
              }
            }
          let l = t.drawOrder;
          if ((l == null && (l = t.draworder), l != null)) {
            const s = new Ln(l.length),
              a = e.slots.length;
            let o = 0;
            for (let d = 0; d < l.length; d++) {
              const f = l[d];
              let u = null;
              const m = this.getValue(f, "offsets", null);
              if (m != null) {
                u = v.newArray(a, -1);
                const g = v.newArray(a - m.length, 0);
                let x = 0,
                  E = 0;
                for (let w = 0; w < m.length; w++) {
                  const b = m[w],
                    p = e.findSlotIndex(b.slot);
                  if (p == -1) throw new Error(`Slot not found: ${b.slot}`);
                  for (; x != p; ) g[E++] = x++;
                  u[x + b.offset] = x++;
                }
                for (; x < a; ) g[E++] = x++;
                for (let w = a - 1; w >= 0; w--) u[w] == -1 && (u[w] = g[--E]);
              }
              s.setFrame(o++, f.time, u);
            }
            r.push(s), (h = Math.max(h, s.frames[s.getFrameCount() - 1]));
          }
          if (t.events) {
            const s = new qi(t.events.length);
            let a = 0;
            for (let o = 0; o < t.events.length; o++) {
              const d = t.events[o],
                f = e.findEvent(d.name);
              if (f == null) throw new Error(`Event not found: ${d.name}`);
              const u = new Hi(v.toSinglePrecision(d.time), f);
              (u.intValue = this.getValue(d, "int", f.intValue)),
                (u.floatValue = this.getValue(d, "float", f.floatValue)),
                (u.stringValue = this.getValue(d, "string", f.stringValue)),
                u.data.audioPath != null &&
                  ((u.volume = this.getValue(d, "volume", 1)),
                  (u.balance = this.getValue(d, "balance", 0))),
                s.setFrame(a++, u);
            }
            r.push(s), (h = Math.max(h, s.frames[s.getFrameCount() - 1]));
          }
          if (isNaN(h))
            throw new Error("Error while parsing animation, duration is NaN");
          e.animations.push(new Ct(n, r, h));
        }
        readCurve(t, n, e) {
          if (t.curve) {
            if (t.curve === "stepped") n.setStepped(e);
            else if (
              Object.prototype.toString.call(t.curve) === "[object Array]"
            ) {
              const i = t.curve;
              n.setCurve(e, i[0], i[1], i[2], i[3]);
            }
          }
        }
        getValue(t, n, e) {
          return t[n] !== void 0 ? t[n] : e;
        }
        static blendModeFromString(t) {
          if (((t = t.toLowerCase()), t == "normal"))
            return H.BLEND_MODES.NORMAL;
          if (t == "additive") return H.BLEND_MODES.ADD;
          if (t == "multiply") return H.BLEND_MODES.MULTIPLY;
          if (t == "screen") return H.BLEND_MODES.SCREEN;
          throw new Error(`Unknown blend mode: ${t}`);
        }
        static positionModeFromString(t) {
          if (((t = t.toLowerCase()), t == "fixed")) return dt.Fixed;
          if (t == "percent") return dt.Percent;
          throw new Error(`Unknown position mode: ${t}`);
        }
        static spacingModeFromString(t) {
          if (((t = t.toLowerCase()), t == "length")) return pe.Length;
          if (t == "fixed") return pe.Fixed;
          if (t == "percent") return pe.Percent;
          throw new Error(`Unknown position mode: ${t}`);
        }
        static rotateModeFromString(t) {
          if (((t = t.toLowerCase()), t == "tangent")) return pt.Tangent;
          if (t == "chain") return pt.Chain;
          if (t == "chainscale") return pt.ChainScale;
          throw new Error(`Unknown rotate mode: ${t}`);
        }
        static transformModeFromString(t) {
          if (((t = t.toLowerCase()), t == "normal")) return j.Normal;
          if (t == "onlytranslation") return j.OnlyTranslation;
          if (t == "norotationorreflection") return j.NoRotationOrReflection;
          if (t == "noscale") return j.NoScale;
          if (t == "noscaleorreflection") return j.NoScaleOrReflection;
          throw new Error(`Unknown transform mode: ${t}`);
        }
      },
      _r = class {
        constructor(t, n, e, i) {
          (this.mesh = t),
            (this.skin = n),
            (this.slotIndex = e),
            (this.parent = i);
        }
      };
    var Or = Object.freeze({
      __proto__: null,
      Animation: Ct,
      AnimationState: Ie,
      AnimationStateAdapter2: Dr,
      AnimationStateData: Fs,
      AtlasAttachmentLoader: Ui,
      Attachment: ks,
      AttachmentTimeline: Dn,
      Bone: Ys,
      BoneData: zi,
      BoundingBoxAttachment: Ni,
      ClippingAttachment: Bi,
      ColorTimeline: se,
      CurveTimeline: jt,
      DeformTimeline: Wi,
      DrawOrderTimeline: Ln,
      Event: Hi,
      EventData: Gi,
      EventQueue: Ps,
      EventTimeline: qi,
      EventType: Zt,
      IkConstraint: ji,
      IkConstraintData: Zi,
      IkConstraintTimeline: ie,
      JitterEffect: Br,
      MeshAttachment: Is,
      PathAttachment: kn,
      PathConstraint: wn,
      PathConstraintData: Qi,
      PathConstraintMixTimeline: Ne,
      PathConstraintPositionTimeline: Ze,
      PathConstraintSpacingTimeline: Xe,
      PointAttachment: Di,
      RegionAttachment: K,
      RotateTimeline: $t,
      ScaleTimeline: le,
      ShearTimeline: ce,
      Skeleton: Xs,
      SkeletonBounds: Lr,
      SkeletonData: Ji,
      SkeletonJson: an,
      Skin: nr,
      Slot: Rs,
      SlotData: tr,
      SpacingMode: pe,
      Spine: class extends tn {
        createSkeleton(t) {
          (this.skeleton = new Xs(t)),
            this.skeleton.updateWorldTransform(),
            (this.stateData = new Fs(t)),
            (this.state = new Ie(this.stateData));
        }
      },
      SwirlEffect: _i,
      TimelineType: Oi,
      TrackEntry: _n,
      TransformConstraint: Ki,
      TransformConstraintData: er,
      TransformConstraintTimeline: re,
      TranslateTimeline: ge,
      TwoColorTimeline: Tt,
      VertexAttachment: Ge,
    });
    class Ns {
      constructor(t) {
        if (!t) throw new Error("name cannot be null.");
        this.name = t;
      }
    }
    const sr = class extends Ns {
      constructor(c) {
        super(c),
          (this.id = sr.nextID++),
          (this.bones = null),
          (this.vertices = []),
          (this.worldVerticesLength = 0),
          (this.timelineAttachment = this);
      }
      computeWorldVerticesOld(c, t) {
        this.computeWorldVertices(c, 0, this.worldVerticesLength, t, 0, 2);
      }
      computeWorldVertices(c, t, n, e, i, r) {
        n = i + (n >> 1) * r;
        const h = c.bone.skeleton,
          l = c.deform;
        let s = this.vertices;
        const a = this.bones;
        if (!a) {
          l.length > 0 && (s = l);
          const u = c.bone.matrix,
            m = u.tx,
            g = u.ty,
            x = u.a,
            E = u.c,
            w = u.b,
            b = u.d;
          for (let p = t, S = i; S < n; p += 2, S += r) {
            const y = s[p],
              M = s[p + 1];
            (e[S] = y * x + M * E + m), (e[S + 1] = y * w + M * b + g);
          }
          return;
        }
        let o = 0,
          d = 0;
        for (let u = 0; u < t; u += 2) {
          const m = a[o];
          (o += m + 1), (d += m);
        }
        const f = h.bones;
        if (l.length == 0)
          for (let u = i, m = d * 3; u < n; u += r) {
            let g = 0,
              x = 0,
              E = a[o++];
            for (E += o; o < E; o++, m += 3) {
              const w = f[a[o]].matrix,
                b = s[m],
                p = s[m + 1],
                S = s[m + 2];
              (g += (b * w.a + p * w.c + w.tx) * S),
                (x += (b * w.b + p * w.d + w.ty) * S);
            }
            (e[u] = g), (e[u + 1] = x);
          }
        else {
          const u = l;
          for (let m = i, g = d * 3, x = d << 1; m < n; m += r) {
            let E = 0,
              w = 0,
              b = a[o++];
            for (b += o; o < b; o++, g += 3, x += 2) {
              const p = f[a[o]].matrix,
                S = s[g] + u[x],
                y = s[g + 1] + u[x + 1],
                M = s[g + 2];
              (E += (S * p.a + y * p.c + p.tx) * M),
                (w += (S * p.b + y * p.d + p.ty) * M);
            }
            (e[m] = E), (e[m + 1] = w);
          }
        }
      }
      copyTo(c) {
        this.bones
          ? ((c.bones = new Array(this.bones.length)),
            v.arrayCopy(this.bones, 0, c.bones, 0, this.bones.length))
          : (c.bones = null),
          this.vertices &&
            ((c.vertices = v.newFloatArray(this.vertices.length)),
            v.arrayCopy(this.vertices, 0, c.vertices, 0, this.vertices.length)),
          (c.worldVerticesLength = this.worldVerticesLength),
          (c.timelineAttachment = this.timelineAttachment);
      }
    };
    let we = sr;
    we.nextID = 0;
    class On extends we {
      constructor(t) {
        super(t), (this.type = Z.BoundingBox), (this.color = new _(1, 1, 1, 1));
      }
      copy() {
        const t = new On(this.name);
        return this.copyTo(t), t.color.setFromColor(this.color), t;
      }
    }
    class $n extends we {
      constructor(t) {
        super(t),
          (this.type = Z.Clipping),
          (this.endSlot = null),
          (this.color = new _(0.2275, 0.2275, 0.8078, 1));
      }
      copy() {
        const t = new $n(this.name);
        return (
          this.copyTo(t),
          (t.endSlot = this.endSlot),
          t.color.setFromColor(this.color),
          t
        );
      }
    }
    class on extends we {
      constructor(t, n) {
        super(t),
          (this.type = Z.Mesh),
          (this.region = null),
          (this.triangles = []),
          (this.color = new _(1, 1, 1, 1)),
          (this.width = 0),
          (this.height = 0),
          (this.hullLength = 0),
          (this.edges = []),
          (this.parentMesh = null),
          (this.sequence = null),
          (this.tempColor = new _(0, 0, 0, 0)),
          (this.path = n);
      }
      getParentMesh() {
        return this.parentMesh;
      }
      setParentMesh(t) {
        (this.parentMesh = t),
          t &&
            ((this.bones = t.bones),
            (this.vertices = t.vertices),
            (this.worldVerticesLength = t.worldVerticesLength),
            (this.regionUVs = t.regionUVs),
            (this.triangles = t.triangles),
            (this.hullLength = t.hullLength),
            (this.worldVerticesLength = t.worldVerticesLength));
      }
      copy() {
        if (this.parentMesh) return this.newLinkedMesh();
        const t = new on(this.name, this.path);
        return (
          (t.region = this.region),
          t.color.setFromColor(this.color),
          this.copyTo(t),
          (t.regionUVs = new Float32Array(this.regionUVs.length)),
          v.arrayCopy(this.regionUVs, 0, t.regionUVs, 0, this.regionUVs.length),
          (t.triangles = new Array(this.triangles.length)),
          v.arrayCopy(this.triangles, 0, t.triangles, 0, this.triangles.length),
          (t.hullLength = this.hullLength),
          (t.sequence = this.sequence != null ? this.sequence.copy() : null),
          this.edges &&
            ((t.edges = new Array(this.edges.length)),
            v.arrayCopy(this.edges, 0, t.edges, 0, this.edges.length)),
          (t.width = this.width),
          (t.height = this.height),
          t
        );
      }
      computeWorldVertices(t, n, e, i, r, h) {
        this.sequence != null && this.sequence.apply(t, this),
          super.computeWorldVertices(t, n, e, i, r, h);
      }
      newLinkedMesh() {
        const t = new on(this.name, this.path);
        return (
          (t.region = this.region),
          t.color.setFromColor(this.color),
          (t.timelineAttachment = this.timelineAttachment),
          t.setParentMesh(this.parentMesh ? this.parentMesh : this),
          t
        );
      }
    }
    class ln extends we {
      constructor(t) {
        super(t),
          (this.type = Z.Path),
          (this.lengths = []),
          (this.closed = !1),
          (this.constantSpeed = !1),
          (this.color = new _(1, 1, 1, 1));
      }
      copy() {
        const t = new ln(this.name);
        return (
          this.copyTo(t),
          (t.lengths = new Array(this.lengths.length)),
          v.arrayCopy(this.lengths, 0, t.lengths, 0, this.lengths.length),
          (t.closed = closed),
          (t.constantSpeed = this.constantSpeed),
          t.color.setFromColor(this.color),
          t
        );
      }
    }
    class Wn extends we {
      constructor(t) {
        super(t),
          (this.type = Z.Point),
          (this.x = 0),
          (this.y = 0),
          (this.rotation = 0),
          (this.color = new _(0.38, 0.94, 0, 1));
      }
      computeWorldPosition(t, n) {
        const e = t.matrix;
        return (
          (n.x = this.x * e.a + this.y * e.c + t.worldX),
          (n.y = this.x * e.b + this.y * e.d + t.worldY),
          n
        );
      }
      computeWorldRotation(t) {
        const n = t.matrix,
          e = C.cosDeg(this.rotation),
          i = C.sinDeg(this.rotation),
          r = e * n.a + i * n.c,
          h = e * n.b + i * n.d;
        return Math.atan2(h, r) * C.radDeg;
      }
      copy() {
        const t = new Wn(this.name);
        return (
          (t.x = this.x),
          (t.y = this.y),
          (t.rotation = this.rotation),
          t.color.setFromColor(this.color),
          t
        );
      }
    }
    const ir = class extends Ns {
      constructor(c, t) {
        super(c),
          (this.type = Z.Region),
          (this.x = 0),
          (this.y = 0),
          (this.scaleX = 1),
          (this.scaleY = 1),
          (this.rotation = 0),
          (this.width = 0),
          (this.height = 0),
          (this.color = new _(1, 1, 1, 1)),
          (this.rendererObject = null),
          (this.region = null),
          (this.sequence = null),
          (this.offset = v.newFloatArray(8)),
          (this.uvs = v.newFloatArray(8)),
          (this.tempColor = new _(1, 1, 1, 1)),
          (this.path = t);
      }
      updateRegion() {
        if (!this.region) throw new Error("Region not set.");
        const c = this.region,
          t = (this.width / this.region.originalWidth) * this.scaleX,
          n = (this.height / this.region.originalHeight) * this.scaleY,
          e = (-this.width / 2) * this.scaleX + this.region.offsetX * t,
          i = (-this.height / 2) * this.scaleY + this.region.offsetY * n,
          r = e + this.region.width * t,
          h = i + this.region.height * n,
          l = (this.rotation * Math.PI) / 180,
          s = Math.cos(l),
          a = Math.sin(l),
          o = this.x,
          d = this.y,
          f = e * s + o,
          u = e * a,
          m = i * s + d,
          g = i * a,
          x = r * s + o,
          E = r * a,
          w = h * s + d,
          b = h * a,
          p = this.offset;
        (p[0] = f - g),
          (p[1] = m + u),
          (p[2] = f - b),
          (p[3] = w + u),
          (p[4] = x - b),
          (p[5] = w + E),
          (p[6] = x - g),
          (p[7] = m + E);
        const S = this.uvs;
        c.degrees == 90
          ? ((S[2] = c.u),
            (S[3] = c.v2),
            (S[4] = c.u),
            (S[5] = c.v),
            (S[6] = c.u2),
            (S[7] = c.v),
            (S[0] = c.u2),
            (S[1] = c.v2))
          : ((S[0] = c.u),
            (S[1] = c.v2),
            (S[2] = c.u),
            (S[3] = c.v),
            (S[4] = c.u2),
            (S[5] = c.v),
            (S[6] = c.u2),
            (S[7] = c.v2));
      }
      computeWorldVertices(c, t, n, e) {
        this.sequence != null && this.sequence.apply(c, this);
        const i = c.bone,
          r = this.offset,
          h = i.matrix,
          l = h.tx,
          s = h.ty,
          a = h.a,
          o = h.c,
          d = h.b,
          f = h.d;
        let u = 0,
          m = 0;
        (u = r[0]),
          (m = r[1]),
          (t[n] = u * a + m * o + l),
          (t[n + 1] = u * d + m * f + s),
          (n += e),
          (u = r[2]),
          (m = r[3]),
          (t[n] = u * a + m * o + l),
          (t[n + 1] = u * d + m * f + s),
          (n += e),
          (u = r[4]),
          (m = r[5]),
          (t[n] = u * a + m * o + l),
          (t[n + 1] = u * d + m * f + s),
          (n += e),
          (u = r[6]),
          (m = r[7]),
          (t[n] = u * a + m * o + l),
          (t[n + 1] = u * d + m * f + s);
      }
      copy() {
        const c = new ir(this.name, this.path);
        return (
          (c.region = this.region),
          (c.rendererObject = this.rendererObject),
          (c.x = this.x),
          (c.y = this.y),
          (c.scaleX = this.scaleX),
          (c.scaleY = this.scaleY),
          (c.rotation = this.rotation),
          (c.width = this.width),
          (c.height = this.height),
          v.arrayCopy(this.uvs, 0, c.uvs, 0, 8),
          v.arrayCopy(this.offset, 0, c.offset, 0, 8),
          c.color.setFromColor(this.color),
          (c.sequence = this.sequence != null ? this.sequence.copy() : null),
          c
        );
      }
    };
    let it = ir;
    (it.X1 = 0),
      (it.Y1 = 1),
      (it.C1R = 2),
      (it.C1G = 3),
      (it.C1B = 4),
      (it.C1A = 5),
      (it.U1 = 6),
      (it.V1 = 7),
      (it.X2 = 8),
      (it.Y2 = 9),
      (it.C2R = 10),
      (it.C2G = 11),
      (it.C2B = 12),
      (it.C2A = 13),
      (it.U2 = 14),
      (it.V2 = 15),
      (it.X3 = 16),
      (it.Y3 = 17),
      (it.C3R = 18),
      (it.C3G = 19),
      (it.C3B = 20),
      (it.C3A = 21),
      (it.U3 = 22),
      (it.V3 = 23),
      (it.X4 = 24),
      (it.Y4 = 25),
      (it.C4R = 26),
      (it.C4G = 27),
      (it.C4B = 28),
      (it.C4A = 29),
      (it.U4 = 30),
      (it.V4 = 31);
    const qn = class {
      constructor(c) {
        (this.id = qn.nextID()),
          (this.start = 0),
          (this.digits = 0),
          (this.setupIndex = 0),
          (this.regions = new Array(c));
      }
      copy() {
        const c = new qn(this.regions.length);
        return (
          v.arrayCopy(this.regions, 0, c.regions, 0, this.regions.length),
          (c.start = this.start),
          (c.digits = this.digits),
          (c.setupIndex = this.setupIndex),
          c
        );
      }
      apply(c, t) {
        let n = c.sequenceIndex;
        n == -1 && (n = this.setupIndex),
          n >= this.regions.length && (n = this.regions.length - 1);
        const e = this.regions[n];
        t.region != e && (t.region = e);
      }
      getPath(c, t) {
        let n = c;
        const e = (this.start + t).toString();
        for (let i = this.digits - e.length; i > 0; i--) n += "0";
        return (n += e), n;
      }
      static nextID() {
        return qn._nextID++;
      }
    };
    let Un = qn;
    Un._nextID = 0;
    var Re = ((c) => (
      (c[(c.hold = 0)] = "hold"),
      (c[(c.once = 1)] = "once"),
      (c[(c.loop = 2)] = "loop"),
      (c[(c.pingpong = 3)] = "pingpong"),
      (c[(c.onceReverse = 4)] = "onceReverse"),
      (c[(c.loopReverse = 5)] = "loopReverse"),
      (c[(c.pingpongReverse = 6)] = "pingpongReverse"),
      c
    ))(Re || {});
    const Bs = [0, 1, 2, 3, 4, 5, 6];
    class zn {
      constructor(t, n, e) {
        if (((this.timelines = []), (this.timelineIds = new ss()), !t))
          throw new Error("name cannot be null.");
        (this.name = t), this.setTimelines(n), (this.duration = e);
      }
      setTimelines(t) {
        if (!t) throw new Error("timelines cannot be null.");
        (this.timelines = t), this.timelineIds.clear();
        for (let n = 0; n < t.length; n++)
          this.timelineIds.addAll(t[n].getPropertyIds());
      }
      hasTimeline(t) {
        for (let n = 0; n < t.length; n++)
          if (this.timelineIds.contains(t[n])) return !0;
        return !1;
      }
      apply(t, n, e, i, r, h, l, s) {
        if (!t) throw new Error("skeleton cannot be null.");
        i &&
          this.duration != 0 &&
          ((e %= this.duration), n > 0 && (n %= this.duration));
        const a = this.timelines;
        for (let o = 0, d = a.length; o < d; o++)
          a[o].apply(t, n, e, r, h, l, s);
      }
    }
    const ot = {
      rotate: 0,
      x: 1,
      y: 2,
      scaleX: 3,
      scaleY: 4,
      shearX: 5,
      shearY: 6,
      rgb: 7,
      alpha: 8,
      rgb2: 9,
      attachment: 10,
      deform: 11,
      event: 12,
      drawOrder: 13,
      ikConstraint: 14,
      transformConstraint: 15,
      pathConstraintPosition: 16,
      pathConstraintSpacing: 17,
      pathConstraintMix: 18,
      sequence: 19,
    };
    class bt {
      constructor(t, n) {
        (this.propertyIds = n),
          (this.frames = v.newFloatArray(t * this.getFrameEntries()));
      }
      getPropertyIds() {
        return this.propertyIds;
      }
      getFrameEntries() {
        return 1;
      }
      getFrameCount() {
        return this.frames.length / this.getFrameEntries();
      }
      getDuration() {
        return this.frames[this.frames.length - this.getFrameEntries()];
      }
      static search1(t, n) {
        const e = t.length;
        for (let i = 1; i < e; i++) if (t[i] > n) return i - 1;
        return e - 1;
      }
      static search(t, n, e) {
        const i = t.length;
        for (let r = e; r < i; r += e) if (t[r] > n) return r - e;
        return i - e;
      }
    }
    class be extends bt {
      constructor(t, n, e) {
        super(t, e),
          (this.curves = v.newFloatArray(t + n * 18)),
          (this.curves[t - 1] = 1);
      }
      setLinear(t) {
        this.curves[t] = 0;
      }
      setStepped(t) {
        this.curves[t] = 1;
      }
      shrink(t) {
        const n = this.getFrameCount() + t * 18;
        if (this.curves.length > n) {
          const e = v.newFloatArray(n);
          v.arrayCopy(this.curves, 0, e, 0, n), (this.curves = e);
        }
      }
      setBezier(t, n, e, i, r, h, l, s, a, o, d) {
        const f = this.curves;
        let u = this.getFrameCount() + t * 18;
        e == 0 && (f[n] = 2 + u);
        const m = (i - h * 2 + s) * 0.03,
          g = (r - l * 2 + a) * 0.03,
          x = ((h - s) * 3 - i + o) * 0.006,
          E = ((l - a) * 3 - r + d) * 0.006;
        let w = m * 2 + x,
          b = g * 2 + E,
          p = (h - i) * 0.3 + m + x * 0.16666667,
          S = (l - r) * 0.3 + g + E * 0.16666667,
          y = i + p,
          M = r + S;
        for (let T = u + 18; u < T; u += 2)
          (f[u] = y),
            (f[u + 1] = M),
            (p += w),
            (S += b),
            (w += x),
            (b += E),
            (y += p),
            (M += S);
      }
      getBezierValue(t, n, e, i) {
        const r = this.curves;
        if (r[i] > t) {
          const a = this.frames[n],
            o = this.frames[n + e];
          return o + ((t - a) / (r[i] - a)) * (r[i + 1] - o);
        }
        const h = i + 18;
        for (i += 2; i < h; i += 2)
          if (r[i] >= t) {
            const a = r[i - 2],
              o = r[i - 1];
            return o + ((t - a) / (r[i] - a)) * (r[i + 1] - o);
          }
        n += this.getFrameEntries();
        const l = r[h - 2],
          s = r[h - 1];
        return s + ((t - l) / (this.frames[n] - l)) * (this.frames[n + e] - s);
      }
    }
    class Ee extends be {
      constructor(t, n, e) {
        super(t, n, [e]);
      }
      getFrameEntries() {
        return 2;
      }
      setFrame(t, n, e) {
        (t <<= 1), (this.frames[t] = n), (this.frames[t + 1] = e);
      }
      getCurveValue(t) {
        const n = this.frames;
        let e = n.length - 2;
        for (let r = 2; r <= e; r += 2)
          if (n[r] > t) {
            e = r - 2;
            break;
          }
        const i = this.curves[e >> 1];
        switch (i) {
          case 0:
            const r = n[e],
              h = n[e + 1];
            return h + ((t - r) / (n[e + 2] - r)) * (n[e + 2 + 1] - h);
          case 1:
            return n[e + 1];
        }
        return this.getBezierValue(t, e, 1, i - 2);
      }
    }
    class Hn extends be {
      constructor(t, n, e, i) {
        super(t, n, [e, i]);
      }
      getFrameEntries() {
        return 3;
      }
      setFrame(t, n, e, i) {
        (t *= 3),
          (this.frames[t] = n),
          (this.frames[t + 1] = e),
          (this.frames[t + 2] = i);
      }
    }
    class Rn extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.rotate}|${e}`),
          (this.boneIndex = 0),
          (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.rotation = s.data.rotation;
              return;
            case A.first:
              s.rotation += (s.data.rotation - s.rotation) * r;
          }
          return;
        }
        let o = this.getCurveValue(e);
        switch (h) {
          case A.setup:
            s.rotation = s.data.rotation + o * r;
            break;
          case A.first:
          case A.replace:
            o += s.data.rotation - s.rotation;
          case A.add:
            s.rotation += o * r;
        }
      }
    }
    class Ds extends Hn {
      constructor(t, n, e) {
        super(t, n, `${ot.x}|${e}`, `${ot.y}|${e}`),
          (this.boneIndex = 0),
          (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              (s.x = s.data.x), (s.y = s.data.y);
              return;
            case A.first:
              (s.x += (s.data.x - s.x) * r), (s.y += (s.data.y - s.y) * r);
          }
          return;
        }
        let o = 0,
          d = 0;
        const f = bt.search(a, e, 3),
          u = this.curves[f / 3];
        switch (u) {
          case 0:
            const m = a[f];
            (o = a[f + 1]), (d = a[f + 2]);
            const g = (e - m) / (a[f + 3] - m);
            (o += (a[f + 3 + 1] - o) * g), (d += (a[f + 3 + 2] - d) * g);
            break;
          case 1:
            (o = a[f + 1]), (d = a[f + 2]);
            break;
          default:
            (o = this.getBezierValue(e, f, 1, u - 2)),
              (d = this.getBezierValue(e, f, 2, u + 18 - 2));
        }
        switch (h) {
          case A.setup:
            (s.x = s.data.x + o * r), (s.y = s.data.y + d * r);
            break;
          case A.first:
          case A.replace:
            (s.x += (s.data.x + o - s.x) * r),
              (s.y += (s.data.y + d - s.y) * r);
            break;
          case A.add:
            (s.x += o * r), (s.y += d * r);
        }
      }
    }
    class Ls extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.x}|${e}`), (this.boneIndex = 0), (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.x = s.data.x;
              return;
            case A.first:
              s.x += (s.data.x - s.x) * r;
          }
          return;
        }
        const o = this.getCurveValue(e);
        switch (h) {
          case A.setup:
            s.x = s.data.x + o * r;
            break;
          case A.first:
          case A.replace:
            s.x += (s.data.x + o - s.x) * r;
            break;
          case A.add:
            s.x += o * r;
        }
      }
    }
    class _s extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.y}|${e}`), (this.boneIndex = 0), (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.y = s.data.y;
              return;
            case A.first:
              s.y += (s.data.y - s.y) * r;
          }
          return;
        }
        const o = this.getCurveValue(e);
        switch (h) {
          case A.setup:
            s.y = s.data.y + o * r;
            break;
          case A.first:
          case A.replace:
            s.y += (s.data.y + o - s.y) * r;
            break;
          case A.add:
            s.y += o * r;
        }
      }
    }
    class Os extends Hn {
      constructor(t, n, e) {
        super(t, n, `${ot.scaleX}|${e}`, `${ot.scaleY}|${e}`),
          (this.boneIndex = 0),
          (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              (s.scaleX = s.data.scaleX), (s.scaleY = s.data.scaleY);
              return;
            case A.first:
              (s.scaleX += (s.data.scaleX - s.scaleX) * r),
                (s.scaleY += (s.data.scaleY - s.scaleY) * r);
          }
          return;
        }
        let o, d;
        const f = bt.search(a, e, 3),
          u = this.curves[f / 3];
        switch (u) {
          case 0:
            const m = a[f];
            (o = a[f + 1]), (d = a[f + 2]);
            const g = (e - m) / (a[f + 3] - m);
            (o += (a[f + 3 + 1] - o) * g), (d += (a[f + 3 + 2] - d) * g);
            break;
          case 1:
            (o = a[f + 1]), (d = a[f + 2]);
            break;
          default:
            (o = this.getBezierValue(e, f, 1, u - 2)),
              (d = this.getBezierValue(e, f, 2, u + 18 - 2));
        }
        if (((o *= s.data.scaleX), (d *= s.data.scaleY), r == 1))
          h == A.add
            ? ((s.scaleX += o - s.data.scaleX), (s.scaleY += d - s.data.scaleY))
            : ((s.scaleX = o), (s.scaleY = d));
        else {
          let m = 0,
            g = 0;
          if (l == J.mixOut)
            switch (h) {
              case A.setup:
                (m = s.data.scaleX),
                  (g = s.data.scaleY),
                  (s.scaleX = m + (Math.abs(o) * C.signum(m) - m) * r),
                  (s.scaleY = g + (Math.abs(d) * C.signum(g) - g) * r);
                break;
              case A.first:
              case A.replace:
                (m = s.scaleX),
                  (g = s.scaleY),
                  (s.scaleX = m + (Math.abs(o) * C.signum(m) - m) * r),
                  (s.scaleY = g + (Math.abs(d) * C.signum(g) - g) * r);
                break;
              case A.add:
                (s.scaleX += (o - s.data.scaleX) * r),
                  (s.scaleY += (d - s.data.scaleY) * r);
            }
          else
            switch (h) {
              case A.setup:
                (m = Math.abs(s.data.scaleX) * C.signum(o)),
                  (g = Math.abs(s.data.scaleY) * C.signum(d)),
                  (s.scaleX = m + (o - m) * r),
                  (s.scaleY = g + (d - g) * r);
                break;
              case A.first:
              case A.replace:
                (m = Math.abs(s.scaleX) * C.signum(o)),
                  (g = Math.abs(s.scaleY) * C.signum(d)),
                  (s.scaleX = m + (o - m) * r),
                  (s.scaleY = g + (d - g) * r);
                break;
              case A.add:
                (s.scaleX += (o - s.data.scaleX) * r),
                  (s.scaleY += (d - s.data.scaleY) * r);
            }
        }
      }
    }
    class $s extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.scaleX}|${e}`),
          (this.boneIndex = 0),
          (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.scaleX = s.data.scaleX;
              return;
            case A.first:
              s.scaleX += (s.data.scaleX - s.scaleX) * r;
          }
          return;
        }
        const o = this.getCurveValue(e) * s.data.scaleX;
        if (r == 1)
          h == A.add ? (s.scaleX += o - s.data.scaleX) : (s.scaleX = o);
        else {
          let d = 0;
          if (l == J.mixOut)
            switch (h) {
              case A.setup:
                (d = s.data.scaleX),
                  (s.scaleX = d + (Math.abs(o) * C.signum(d) - d) * r);
                break;
              case A.first:
              case A.replace:
                (d = s.scaleX),
                  (s.scaleX = d + (Math.abs(o) * C.signum(d) - d) * r);
                break;
              case A.add:
                s.scaleX += (o - s.data.scaleX) * r;
            }
          else
            switch (h) {
              case A.setup:
                (d = Math.abs(s.data.scaleX) * C.signum(o)),
                  (s.scaleX = d + (o - d) * r);
                break;
              case A.first:
              case A.replace:
                (d = Math.abs(s.scaleX) * C.signum(o)),
                  (s.scaleX = d + (o - d) * r);
                break;
              case A.add:
                s.scaleX += (o - s.data.scaleX) * r;
            }
        }
      }
    }
    class Ws extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.scaleY}|${e}`),
          (this.boneIndex = 0),
          (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.scaleY = s.data.scaleY;
              return;
            case A.first:
              s.scaleY += (s.data.scaleY - s.scaleY) * r;
          }
          return;
        }
        const o = this.getCurveValue(e) * s.data.scaleY;
        if (r == 1)
          h == A.add ? (s.scaleY += o - s.data.scaleY) : (s.scaleY = o);
        else {
          let d = 0;
          if (l == J.mixOut)
            switch (h) {
              case A.setup:
                (d = s.data.scaleY),
                  (s.scaleY = d + (Math.abs(o) * C.signum(d) - d) * r);
                break;
              case A.first:
              case A.replace:
                (d = s.scaleY),
                  (s.scaleY = d + (Math.abs(o) * C.signum(d) - d) * r);
                break;
              case A.add:
                s.scaleY += (o - s.data.scaleY) * r;
            }
          else
            switch (h) {
              case A.setup:
                (d = Math.abs(s.data.scaleY) * C.signum(o)),
                  (s.scaleY = d + (o - d) * r);
                break;
              case A.first:
              case A.replace:
                (d = Math.abs(s.scaleY) * C.signum(o)),
                  (s.scaleY = d + (o - d) * r);
                break;
              case A.add:
                s.scaleY += (o - s.data.scaleY) * r;
            }
        }
      }
    }
    class qs extends Hn {
      constructor(t, n, e) {
        super(t, n, `${ot.shearX}|${e}`, `${ot.shearY}|${e}`),
          (this.boneIndex = 0),
          (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              (s.shearX = s.data.shearX), (s.shearY = s.data.shearY);
              return;
            case A.first:
              (s.shearX += (s.data.shearX - s.shearX) * r),
                (s.shearY += (s.data.shearY - s.shearY) * r);
          }
          return;
        }
        let o = 0,
          d = 0;
        const f = bt.search(a, e, 3),
          u = this.curves[f / 3];
        switch (u) {
          case 0:
            const m = a[f];
            (o = a[f + 1]), (d = a[f + 2]);
            const g = (e - m) / (a[f + 3] - m);
            (o += (a[f + 3 + 1] - o) * g), (d += (a[f + 3 + 2] - d) * g);
            break;
          case 1:
            (o = a[f + 1]), (d = a[f + 2]);
            break;
          default:
            (o = this.getBezierValue(e, f, 1, u - 2)),
              (d = this.getBezierValue(e, f, 2, u + 18 - 2));
        }
        switch (h) {
          case A.setup:
            (s.shearX = s.data.shearX + o * r),
              (s.shearY = s.data.shearY + d * r);
            break;
          case A.first:
          case A.replace:
            (s.shearX += (s.data.shearX + o - s.shearX) * r),
              (s.shearY += (s.data.shearY + d - s.shearY) * r);
            break;
          case A.add:
            (s.shearX += o * r), (s.shearY += d * r);
        }
      }
    }
    class Us extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.shearX}|${e}`),
          (this.boneIndex = 0),
          (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.shearX = s.data.shearX;
              return;
            case A.first:
              s.shearX += (s.data.shearX - s.shearX) * r;
          }
          return;
        }
        const o = this.getCurveValue(e);
        switch (h) {
          case A.setup:
            s.shearX = s.data.shearX + o * r;
            break;
          case A.first:
          case A.replace:
            s.shearX += (s.data.shearX + o - s.shearX) * r;
            break;
          case A.add:
            s.shearX += o * r;
        }
      }
    }
    class zs extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.shearY}|${e}`),
          (this.boneIndex = 0),
          (this.boneIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.bones[this.boneIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.shearY = s.data.shearY;
              return;
            case A.first:
              s.shearY += (s.data.shearY - s.shearY) * r;
          }
          return;
        }
        const o = this.getCurveValue(e);
        switch (h) {
          case A.setup:
            s.shearY = s.data.shearY + o * r;
            break;
          case A.first:
          case A.replace:
            s.shearY += (s.data.shearY + o - s.shearY) * r;
            break;
          case A.add:
            s.shearY += o * r;
        }
      }
    }
    class Hs extends be {
      constructor(t, n, e) {
        super(t, n, [`${ot.rgb}|${e}`, `${ot.alpha}|${e}`]),
          (this.slotIndex = 0),
          (this.slotIndex = e);
      }
      getFrameEntries() {
        return 5;
      }
      setFrame(t, n, e, i, r, h) {
        (t *= 5),
          (this.frames[t] = n),
          (this.frames[t + 1] = e),
          (this.frames[t + 2] = i),
          (this.frames[t + 3] = r),
          (this.frames[t + 4] = h);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.slots[this.slotIndex];
        if (!s.bone.active) return;
        const a = this.frames,
          o = s.color;
        if (e < a[0]) {
          const E = s.data.color;
          switch (h) {
            case A.setup:
              o.setFromColor(E);
              return;
            case A.first:
              o.add(
                (E.r - o.r) * r,
                (E.g - o.g) * r,
                (E.b - o.b) * r,
                (E.a - o.a) * r
              );
          }
          return;
        }
        let d = 0,
          f = 0,
          u = 0,
          m = 0;
        const g = bt.search(a, e, 5),
          x = this.curves[g / 5];
        switch (x) {
          case 0:
            const E = a[g];
            (d = a[g + 1]), (f = a[g + 2]), (u = a[g + 3]), (m = a[g + 4]);
            const w = (e - E) / (a[g + 5] - E);
            (d += (a[g + 5 + 1] - d) * w),
              (f += (a[g + 5 + 2] - f) * w),
              (u += (a[g + 5 + 3] - u) * w),
              (m += (a[g + 5 + 4] - m) * w);
            break;
          case 1:
            (d = a[g + 1]), (f = a[g + 2]), (u = a[g + 3]), (m = a[g + 4]);
            break;
          default:
            (d = this.getBezierValue(e, g, 1, x - 2)),
              (f = this.getBezierValue(e, g, 2, x + 18 - 2)),
              (u = this.getBezierValue(e, g, 3, x + 18 * 2 - 2)),
              (m = this.getBezierValue(e, g, 4, x + 18 * 3 - 2));
        }
        r == 1
          ? o.set(d, f, u, m)
          : (h == A.setup && o.setFromColor(s.data.color),
            o.add((d - o.r) * r, (f - o.g) * r, (u - o.b) * r, (m - o.a) * r));
      }
    }
    class Gs extends be {
      constructor(t, n, e) {
        super(t, n, [`${ot.rgb}|${e}`]),
          (this.slotIndex = 0),
          (this.slotIndex = e);
      }
      getFrameEntries() {
        return 4;
      }
      setFrame(t, n, e, i, r) {
        (t <<= 2),
          (this.frames[t] = n),
          (this.frames[t + 1] = e),
          (this.frames[t + 2] = i),
          (this.frames[t + 3] = r);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.slots[this.slotIndex];
        if (!s.bone.active) return;
        const a = this.frames,
          o = s.color;
        if (e < a[0]) {
          const x = s.data.color;
          switch (h) {
            case A.setup:
              (o.r = x.r), (o.g = x.g), (o.b = x.b);
              return;
            case A.first:
              (o.r += (x.r - o.r) * r),
                (o.g += (x.g - o.g) * r),
                (o.b += (x.b - o.b) * r);
          }
          return;
        }
        let d = 0,
          f = 0,
          u = 0;
        const m = bt.search(a, e, 4),
          g = this.curves[m >> 2];
        switch (g) {
          case 0:
            const x = a[m];
            (d = a[m + 1]), (f = a[m + 2]), (u = a[m + 3]);
            const E = (e - x) / (a[m + 4] - x);
            (d += (a[m + 4 + 1] - d) * E),
              (f += (a[m + 4 + 2] - f) * E),
              (u += (a[m + 4 + 3] - u) * E);
            break;
          case 1:
            (d = a[m + 1]), (f = a[m + 2]), (u = a[m + 3]);
            break;
          default:
            (d = this.getBezierValue(e, m, 1, g - 2)),
              (f = this.getBezierValue(e, m, 2, g + 18 - 2)),
              (u = this.getBezierValue(e, m, 3, g + 18 * 2 - 2));
        }
        if (r == 1) (o.r = d), (o.g = f), (o.b = u);
        else {
          if (h == A.setup) {
            const x = s.data.color;
            (o.r = x.r), (o.g = x.g), (o.b = x.b);
          }
          (o.r += (d - o.r) * r),
            (o.g += (f - o.g) * r),
            (o.b += (u - o.b) * r);
        }
      }
    }
    class js extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.alpha}|${e}`),
          (this.slotIndex = 0),
          (this.slotIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.slots[this.slotIndex];
        if (!s.bone.active) return;
        const a = s.color;
        if (e < this.frames[0]) {
          const d = s.data.color;
          switch (h) {
            case A.setup:
              a.a = d.a;
              return;
            case A.first:
              a.a += (d.a - a.a) * r;
          }
          return;
        }
        const o = this.getCurveValue(e);
        r == 1
          ? (a.a = o)
          : (h == A.setup && (a.a = s.data.color.a), (a.a += (o - a.a) * r));
      }
    }
    class Zs extends be {
      constructor(t, n, e) {
        super(t, n, [`${ot.rgb}|${e}`, `${ot.alpha}|${e}`, `${ot.rgb2}|${e}`]),
          (this.slotIndex = 0),
          (this.slotIndex = e);
      }
      getFrameEntries() {
        return 8;
      }
      setFrame(t, n, e, i, r, h, l, s, a) {
        (t <<= 3),
          (this.frames[t] = n),
          (this.frames[t + 1] = e),
          (this.frames[t + 2] = i),
          (this.frames[t + 3] = r),
          (this.frames[t + 4] = h),
          (this.frames[t + 5] = l),
          (this.frames[t + 6] = s),
          (this.frames[t + 7] = a);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.slots[this.slotIndex];
        if (!s.bone.active) return;
        const a = this.frames,
          o = s.color,
          d = s.darkColor;
        if (e < a[0]) {
          const S = s.data.color,
            y = s.data.darkColor;
          switch (h) {
            case A.setup:
              o.setFromColor(S), (d.r = y.r), (d.g = y.g), (d.b = y.b);
              return;
            case A.first:
              o.add(
                (S.r - o.r) * r,
                (S.g - o.g) * r,
                (S.b - o.b) * r,
                (S.a - o.a) * r
              ),
                (d.r += (y.r - d.r) * r),
                (d.g += (y.g - d.g) * r),
                (d.b += (y.b - d.b) * r);
          }
          return;
        }
        let f = 0,
          u = 0,
          m = 0,
          g = 0,
          x = 0,
          E = 0,
          w = 0;
        const b = bt.search(a, e, 8),
          p = this.curves[b >> 3];
        switch (p) {
          case 0:
            const S = a[b];
            (f = a[b + 1]),
              (u = a[b + 2]),
              (m = a[b + 3]),
              (g = a[b + 4]),
              (x = a[b + 5]),
              (E = a[b + 6]),
              (w = a[b + 7]);
            const y = (e - S) / (a[b + 8] - S);
            (f += (a[b + 8 + 1] - f) * y),
              (u += (a[b + 8 + 2] - u) * y),
              (m += (a[b + 8 + 3] - m) * y),
              (g += (a[b + 8 + 4] - g) * y),
              (x += (a[b + 8 + 5] - x) * y),
              (E += (a[b + 8 + 6] - E) * y),
              (w += (a[b + 8 + 7] - w) * y);
            break;
          case 1:
            (f = a[b + 1]),
              (u = a[b + 2]),
              (m = a[b + 3]),
              (g = a[b + 4]),
              (x = a[b + 5]),
              (E = a[b + 6]),
              (w = a[b + 7]);
            break;
          default:
            (f = this.getBezierValue(e, b, 1, p - 2)),
              (u = this.getBezierValue(e, b, 2, p + 18 - 2)),
              (m = this.getBezierValue(e, b, 3, p + 18 * 2 - 2)),
              (g = this.getBezierValue(e, b, 4, p + 18 * 3 - 2)),
              (x = this.getBezierValue(e, b, 5, p + 18 * 4 - 2)),
              (E = this.getBezierValue(e, b, 6, p + 18 * 5 - 2)),
              (w = this.getBezierValue(e, b, 7, p + 18 * 6 - 2));
        }
        if (r == 1) o.set(f, u, m, g), (d.r = x), (d.g = E), (d.b = w);
        else {
          if (h == A.setup) {
            o.setFromColor(s.data.color);
            const S = s.data.darkColor;
            (d.r = S.r), (d.g = S.g), (d.b = S.b);
          }
          o.add((f - o.r) * r, (u - o.g) * r, (m - o.b) * r, (g - o.a) * r),
            (d.r += (x - d.r) * r),
            (d.g += (E - d.g) * r),
            (d.b += (w - d.b) * r);
        }
      }
    }
    class Qs extends be {
      constructor(t, n, e) {
        super(t, n, [`${ot.rgb}|${e}`, `${ot.rgb2}|${e}`]),
          (this.slotIndex = 0),
          (this.slotIndex = e);
      }
      getFrameEntries() {
        return 7;
      }
      setFrame(t, n, e, i, r, h, l, s) {
        (t *= 7),
          (this.frames[t] = n),
          (this.frames[t + 1] = e),
          (this.frames[t + 2] = i),
          (this.frames[t + 3] = r),
          (this.frames[t + 4] = h),
          (this.frames[t + 5] = l),
          (this.frames[t + 6] = s);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.slots[this.slotIndex];
        if (!s.bone.active) return;
        const a = this.frames,
          o = s.color,
          d = s.darkColor;
        if (e < a[0]) {
          const p = s.data.color,
            S = s.data.darkColor;
          switch (h) {
            case A.setup:
              (o.r = p.r),
                (o.g = p.g),
                (o.b = p.b),
                (d.r = S.r),
                (d.g = S.g),
                (d.b = S.b);
              return;
            case A.first:
              (o.r += (p.r - o.r) * r),
                (o.g += (p.g - o.g) * r),
                (o.b += (p.b - o.b) * r),
                (d.r += (S.r - d.r) * r),
                (d.g += (S.g - d.g) * r),
                (d.b += (S.b - d.b) * r);
          }
          return;
        }
        let f = 0,
          u = 0,
          m = 0,
          g = 0,
          x = 0,
          E = 0;
        const w = bt.search(a, e, 7),
          b = this.curves[w / 7];
        switch (b) {
          case 0:
            const p = a[w];
            (f = a[w + 1]),
              (u = a[w + 2]),
              (m = a[w + 3]),
              (g = a[w + 4]),
              (x = a[w + 5]),
              (E = a[w + 6]);
            const S = (e - p) / (a[w + 7] - p);
            (f += (a[w + 7 + 1] - f) * S),
              (u += (a[w + 7 + 2] - u) * S),
              (m += (a[w + 7 + 3] - m) * S),
              (g += (a[w + 7 + 4] - g) * S),
              (x += (a[w + 7 + 5] - x) * S),
              (E += (a[w + 7 + 6] - E) * S);
            break;
          case 1:
            (f = a[w + 1]),
              (u = a[w + 2]),
              (m = a[w + 3]),
              (g = a[w + 4]),
              (x = a[w + 5]),
              (E = a[w + 6]);
            break;
          default:
            (f = this.getBezierValue(e, w, 1, b - 2)),
              (u = this.getBezierValue(e, w, 2, b + 18 - 2)),
              (m = this.getBezierValue(e, w, 3, b + 18 * 2 - 2)),
              (g = this.getBezierValue(e, w, 4, b + 18 * 3 - 2)),
              (x = this.getBezierValue(e, w, 5, b + 18 * 4 - 2)),
              (E = this.getBezierValue(e, w, 6, b + 18 * 5 - 2));
        }
        if (r == 1)
          (o.r = f), (o.g = u), (o.b = m), (d.r = g), (d.g = x), (d.b = E);
        else {
          if (h == A.setup) {
            const p = s.data.color,
              S = s.data.darkColor;
            (o.r = p.r),
              (o.g = p.g),
              (o.b = p.b),
              (d.r = S.r),
              (d.g = S.g),
              (d.b = S.b);
          }
          (o.r += (f - o.r) * r),
            (o.g += (u - o.g) * r),
            (o.b += (m - o.b) * r),
            (d.r += (g - d.r) * r),
            (d.g += (x - d.g) * r),
            (d.b += (E - d.b) * r);
        }
      }
    }
    class cn extends bt {
      constructor(t, n) {
        super(t, [`${ot.attachment}|${n}`]),
          (this.slotIndex = 0),
          (this.slotIndex = n),
          (this.attachmentNames = new Array(t));
      }
      getFrameCount() {
        return this.frames.length;
      }
      setFrame(t, n, e) {
        (this.frames[t] = n), (this.attachmentNames[t] = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.slots[this.slotIndex];
        if (s.bone.active) {
          if (l == J.mixOut) {
            h == A.setup && this.setAttachment(t, s, s.data.attachmentName);
            return;
          }
          if (e < this.frames[0]) {
            (h == A.setup || h == A.first) &&
              this.setAttachment(t, s, s.data.attachmentName);
            return;
          }
          this.setAttachment(
            t,
            s,
            this.attachmentNames[bt.search1(this.frames, e)]
          );
        }
      }
      setAttachment(t, n, e) {
        n.setAttachment(e ? t.getAttachment(this.slotIndex, e) : null);
      }
    }
    class Ks extends be {
      constructor(t, n, e, i) {
        super(t, n, [`${ot.deform}|${e}|${i.id}`]),
          (this.slotIndex = 0),
          (this.slotIndex = e),
          (this.attachment = i),
          (this.vertices = new Array(t));
      }
      getFrameCount() {
        return this.frames.length;
      }
      setFrame(t, n, e) {
        (this.frames[t] = n), (this.vertices[t] = e);
      }
      setBezier(t, n, e, i, r, h, l, s, a, o, d) {
        const f = this.curves;
        let u = this.getFrameCount() + t * 18;
        e == 0 && (f[n] = 2 + u);
        const m = (i - h * 2 + s) * 0.03,
          g = a * 0.03 - l * 0.06,
          x = ((h - s) * 3 - i + o) * 0.006,
          E = (l - a + 0.33333333) * 0.018;
        let w = m * 2 + x,
          b = g * 2 + E,
          p = (h - i) * 0.3 + m + x * 0.16666667,
          S = l * 0.3 + g + E * 0.16666667,
          y = i + p,
          M = S;
        for (let T = u + 18; u < T; u += 2)
          (f[u] = y),
            (f[u + 1] = M),
            (p += w),
            (S += b),
            (w += x),
            (b += E),
            (y += p),
            (M += S);
      }
      getCurvePercent(t, n) {
        const e = this.curves;
        let i = e[n];
        switch (i) {
          case 0:
            const s = this.frames[n];
            return (t - s) / (this.frames[n + this.getFrameEntries()] - s);
          case 1:
            return 0;
        }
        if (((i -= 2), e[i] > t)) {
          const s = this.frames[n];
          return (e[i + 1] * (t - s)) / (e[i] - s);
        }
        const r = i + 18;
        for (i += 2; i < r; i += 2)
          if (e[i] >= t) {
            const s = e[i - 2],
              a = e[i - 1];
            return a + ((t - s) / (e[i] - s)) * (e[i + 1] - a);
          }
        const h = e[r - 2],
          l = e[r - 1];
        return (
          l +
          ((1 - l) * (t - h)) / (this.frames[n + this.getFrameEntries()] - h)
        );
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.slots[this.slotIndex];
        if (!s.bone.active) return;
        const a = s.getAttachment();
        if (!a || !(a instanceof we) || a.timelineAttachment != this.attachment)
          return;
        const o = s.deform;
        o.length == 0 && (h = A.setup);
        const d = this.vertices,
          f = d[0].length,
          u = this.frames;
        if (e < u[0]) {
          switch (h) {
            case A.setup:
              o.length = 0;
              return;
            case A.first:
              if (r == 1) {
                o.length = 0;
                return;
              }
              o.length = f;
              const w = a;
              if (w.bones) {
                r = 1 - r;
                for (let b = 0; b < f; b++) o[b] *= r;
              } else {
                const b = w.vertices;
                for (let p = 0; p < f; p++) o[p] += (b[p] - o[p]) * r;
              }
          }
          return;
        }
        if (((o.length = f), e >= u[u.length - 1])) {
          const w = d[u.length - 1];
          if (r == 1)
            if (h == A.add) {
              const b = a;
              if (b.bones) for (let p = 0; p < f; p++) o[p] += w[p];
              else {
                const p = b.vertices;
                for (let S = 0; S < f; S++) o[S] += w[S] - p[S];
              }
            } else v.arrayCopy(w, 0, o, 0, f);
          else
            switch (h) {
              case A.setup: {
                const p = a;
                if (p.bones) for (let S = 0; S < f; S++) o[S] = w[S] * r;
                else {
                  const S = p.vertices;
                  for (let y = 0; y < f; y++) {
                    const M = S[y];
                    o[y] = M + (w[y] - M) * r;
                  }
                }
                break;
              }
              case A.first:
              case A.replace:
                for (let p = 0; p < f; p++) o[p] += (w[p] - o[p]) * r;
                break;
              case A.add:
                const b = a;
                if (b.bones) for (let p = 0; p < f; p++) o[p] += w[p] * r;
                else {
                  const p = b.vertices;
                  for (let S = 0; S < f; S++) o[S] += (w[S] - p[S]) * r;
                }
            }
          return;
        }
        const m = bt.search1(u, e),
          g = this.getCurvePercent(e, m),
          x = d[m],
          E = d[m + 1];
        if (r == 1)
          if (h == A.add) {
            const w = a;
            if (w.bones)
              for (let b = 0; b < f; b++) {
                const p = x[b];
                o[b] += p + (E[b] - p) * g;
              }
            else {
              const b = w.vertices;
              for (let p = 0; p < f; p++) {
                const S = x[p];
                o[p] += S + (E[p] - S) * g - b[p];
              }
            }
          } else
            for (let w = 0; w < f; w++) {
              const b = x[w];
              o[w] = b + (E[w] - b) * g;
            }
        else
          switch (h) {
            case A.setup: {
              const b = a;
              if (b.bones)
                for (let p = 0; p < f; p++) {
                  const S = x[p];
                  o[p] = (S + (E[p] - S) * g) * r;
                }
              else {
                const p = b.vertices;
                for (let S = 0; S < f; S++) {
                  const y = x[S],
                    M = p[S];
                  o[S] = M + (y + (E[S] - y) * g - M) * r;
                }
              }
              break;
            }
            case A.first:
            case A.replace:
              for (let b = 0; b < f; b++) {
                const p = x[b];
                o[b] += (p + (E[b] - p) * g - o[b]) * r;
              }
              break;
            case A.add:
              const w = a;
              if (w.bones)
                for (let b = 0; b < f; b++) {
                  const p = x[b];
                  o[b] += (p + (E[b] - p) * g) * r;
                }
              else {
                const b = w.vertices;
                for (let p = 0; p < f; p++) {
                  const S = x[p];
                  o[p] += (S + (E[p] - S) * g - b[p]) * r;
                }
              }
          }
      }
    }
    const rr = class extends bt {
      constructor(c) {
        super(c, rr.propertyIds), (this.events = new Array(c));
      }
      getFrameCount() {
        return this.frames.length;
      }
      setFrame(c, t) {
        (this.frames[c] = t.time), (this.events[c] = t);
      }
      apply(c, t, n, e, i, r, h) {
        if (!e) return;
        const l = this.frames,
          s = this.frames.length;
        if (t > n) this.apply(c, t, Number.MAX_VALUE, e, i, r, h), (t = -1);
        else if (t >= l[s - 1]) return;
        if (n < l[0]) return;
        let a = 0;
        if (t < l[0]) a = 0;
        else {
          a = bt.search1(l, t) + 1;
          const o = l[a];
          for (; a > 0 && l[a - 1] == o; ) a--;
        }
        for (; a < s && n >= l[a]; a++) e.push(this.events[a]);
      }
    };
    let vn = rr;
    vn.propertyIds = [`${ot.event}`];
    const ar = class extends bt {
      constructor(c) {
        super(c, ar.propertyIds), (this.drawOrders = new Array(c));
      }
      getFrameCount() {
        return this.frames.length;
      }
      setFrame(c, t, n) {
        (this.frames[c] = t), (this.drawOrders[c] = n);
      }
      apply(c, t, n, e, i, r, h) {
        if (h == J.mixOut) {
          r == A.setup &&
            v.arrayCopy(c.slots, 0, c.drawOrder, 0, c.slots.length);
          return;
        }
        if (n < this.frames[0]) {
          (r == A.setup || r == A.first) &&
            v.arrayCopy(c.slots, 0, c.drawOrder, 0, c.slots.length);
          return;
        }
        const l = bt.search1(this.frames, n),
          s = this.drawOrders[l];
        if (!s) v.arrayCopy(c.slots, 0, c.drawOrder, 0, c.slots.length);
        else {
          const a = c.drawOrder,
            o = c.slots;
          for (let d = 0, f = s.length; d < f; d++) a[d] = o[s[d]];
        }
      }
    };
    let hn = ar;
    hn.propertyIds = [`${ot.drawOrder}`];
    class Js extends be {
      constructor(t, n, e) {
        super(t, n, [`${ot.ikConstraint}|${e}`]),
          (this.ikConstraintIndex = 0),
          (this.ikConstraintIndex = e);
      }
      getFrameEntries() {
        return 6;
      }
      setFrame(t, n, e, i, r, h, l) {
        (t *= 6),
          (this.frames[t] = n),
          (this.frames[t + 1] = e),
          (this.frames[t + 2] = i),
          (this.frames[t + 3] = r),
          (this.frames[t + 4] = h ? 1 : 0),
          (this.frames[t + 5] = l ? 1 : 0);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.ikConstraints[this.ikConstraintIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              (s.mix = s.data.mix),
                (s.softness = s.data.softness),
                (s.bendDirection = s.data.bendDirection),
                (s.compress = s.data.compress),
                (s.stretch = s.data.stretch);
              return;
            case A.first:
              (s.mix += (s.data.mix - s.mix) * r),
                (s.softness += (s.data.softness - s.softness) * r),
                (s.bendDirection = s.data.bendDirection),
                (s.compress = s.data.compress),
                (s.stretch = s.data.stretch);
          }
          return;
        }
        let o = 0,
          d = 0;
        const f = bt.search(a, e, 6),
          u = this.curves[f / 6];
        switch (u) {
          case 0:
            const m = a[f];
            (o = a[f + 1]), (d = a[f + 2]);
            const g = (e - m) / (a[f + 6] - m);
            (o += (a[f + 6 + 1] - o) * g), (d += (a[f + 6 + 2] - d) * g);
            break;
          case 1:
            (o = a[f + 1]), (d = a[f + 2]);
            break;
          default:
            (o = this.getBezierValue(e, f, 1, u - 2)),
              (d = this.getBezierValue(e, f, 2, u + 18 - 2));
        }
        h == A.setup
          ? ((s.mix = s.data.mix + (o - s.data.mix) * r),
            (s.softness = s.data.softness + (d - s.data.softness) * r),
            l == J.mixOut
              ? ((s.bendDirection = s.data.bendDirection),
                (s.compress = s.data.compress),
                (s.stretch = s.data.stretch))
              : ((s.bendDirection = a[f + 3]),
                (s.compress = a[f + 4] != 0),
                (s.stretch = a[f + 5] != 0)))
          : ((s.mix += (o - s.mix) * r),
            (s.softness += (d - s.softness) * r),
            l == J.mixIn &&
              ((s.bendDirection = a[f + 3]),
              (s.compress = a[f + 4] != 0),
              (s.stretch = a[f + 5] != 0)));
      }
    }
    class ti extends be {
      constructor(t, n, e) {
        super(t, n, [`${ot.transformConstraint}|${e}`]),
          (this.transformConstraintIndex = 0),
          (this.transformConstraintIndex = e);
      }
      getFrameEntries() {
        return 7;
      }
      setFrame(t, n, e, i, r, h, l, s) {
        const a = this.frames;
        (t *= 7),
          (a[t] = n),
          (a[t + 1] = e),
          (a[t + 2] = i),
          (a[t + 3] = r),
          (a[t + 4] = h),
          (a[t + 5] = l),
          (a[t + 6] = s);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.transformConstraints[this.transformConstraintIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          const w = s.data;
          switch (h) {
            case A.setup:
              (s.mixRotate = w.mixRotate),
                (s.mixX = w.mixX),
                (s.mixY = w.mixY),
                (s.mixScaleX = w.mixScaleX),
                (s.mixScaleY = w.mixScaleY),
                (s.mixShearY = w.mixShearY);
              return;
            case A.first:
              (s.mixRotate += (w.mixRotate - s.mixRotate) * r),
                (s.mixX += (w.mixX - s.mixX) * r),
                (s.mixY += (w.mixY - s.mixY) * r),
                (s.mixScaleX += (w.mixScaleX - s.mixScaleX) * r),
                (s.mixScaleY += (w.mixScaleY - s.mixScaleY) * r),
                (s.mixShearY += (w.mixShearY - s.mixShearY) * r);
          }
          return;
        }
        let o, d, f, u, m, g;
        const x = bt.search(a, e, 7),
          E = this.curves[x / 7];
        switch (E) {
          case 0:
            const w = a[x];
            (o = a[x + 1]),
              (d = a[x + 2]),
              (f = a[x + 3]),
              (u = a[x + 4]),
              (m = a[x + 5]),
              (g = a[x + 6]);
            const b = (e - w) / (a[x + 7] - w);
            (o += (a[x + 7 + 1] - o) * b),
              (d += (a[x + 7 + 2] - d) * b),
              (f += (a[x + 7 + 3] - f) * b),
              (u += (a[x + 7 + 4] - u) * b),
              (m += (a[x + 7 + 5] - m) * b),
              (g += (a[x + 7 + 6] - g) * b);
            break;
          case 1:
            (o = a[x + 1]),
              (d = a[x + 2]),
              (f = a[x + 3]),
              (u = a[x + 4]),
              (m = a[x + 5]),
              (g = a[x + 6]);
            break;
          default:
            (o = this.getBezierValue(e, x, 1, E - 2)),
              (d = this.getBezierValue(e, x, 2, E + 18 - 2)),
              (f = this.getBezierValue(e, x, 3, E + 18 * 2 - 2)),
              (u = this.getBezierValue(e, x, 4, E + 18 * 3 - 2)),
              (m = this.getBezierValue(e, x, 5, E + 18 * 4 - 2)),
              (g = this.getBezierValue(e, x, 6, E + 18 * 5 - 2));
        }
        if (h == A.setup) {
          const w = s.data;
          (s.mixRotate = w.mixRotate + (o - w.mixRotate) * r),
            (s.mixX = w.mixX + (d - w.mixX) * r),
            (s.mixY = w.mixY + (f - w.mixY) * r),
            (s.mixScaleX = w.mixScaleX + (u - w.mixScaleX) * r),
            (s.mixScaleY = w.mixScaleY + (m - w.mixScaleY) * r),
            (s.mixShearY = w.mixShearY + (g - w.mixShearY) * r);
        } else
          (s.mixRotate += (o - s.mixRotate) * r),
            (s.mixX += (d - s.mixX) * r),
            (s.mixY += (f - s.mixY) * r),
            (s.mixScaleX += (u - s.mixScaleX) * r),
            (s.mixScaleY += (m - s.mixScaleY) * r),
            (s.mixShearY += (g - s.mixShearY) * r);
      }
    }
    class ei extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.pathConstraintPosition}|${e}`),
          (this.pathConstraintIndex = 0),
          (this.pathConstraintIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.pathConstraints[this.pathConstraintIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.position = s.data.position;
              return;
            case A.first:
              s.position += (s.data.position - s.position) * r;
          }
          return;
        }
        const o = this.getCurveValue(e);
        h == A.setup
          ? (s.position = s.data.position + (o - s.data.position) * r)
          : (s.position += (o - s.position) * r);
      }
    }
    class ni extends Ee {
      constructor(t, n, e) {
        super(t, n, `${ot.pathConstraintSpacing}|${e}`),
          (this.pathConstraintIndex = 0),
          (this.pathConstraintIndex = e);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.pathConstraints[this.pathConstraintIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              s.spacing = s.data.spacing;
              return;
            case A.first:
              s.spacing += (s.data.spacing - s.spacing) * r;
          }
          return;
        }
        const o = this.getCurveValue(e);
        h == A.setup
          ? (s.spacing = s.data.spacing + (o - s.data.spacing) * r)
          : (s.spacing += (o - s.spacing) * r);
      }
    }
    class si extends be {
      constructor(t, n, e) {
        super(t, n, [`${ot.pathConstraintMix}|${e}`]),
          (this.pathConstraintIndex = 0),
          (this.pathConstraintIndex = e);
      }
      getFrameEntries() {
        return 4;
      }
      setFrame(t, n, e, i, r) {
        const h = this.frames;
        (t <<= 2), (h[t] = n), (h[t + 1] = e), (h[t + 2] = i), (h[t + 3] = r);
      }
      apply(t, n, e, i, r, h, l) {
        const s = t.pathConstraints[this.pathConstraintIndex];
        if (!s.active) return;
        const a = this.frames;
        if (e < a[0]) {
          switch (h) {
            case A.setup:
              (s.mixRotate = s.data.mixRotate),
                (s.mixX = s.data.mixX),
                (s.mixY = s.data.mixY);
              return;
            case A.first:
              (s.mixRotate += (s.data.mixRotate - s.mixRotate) * r),
                (s.mixX += (s.data.mixX - s.mixX) * r),
                (s.mixY += (s.data.mixY - s.mixY) * r);
          }
          return;
        }
        let o, d, f;
        const u = bt.search(a, e, 4),
          m = this.curves[u >> 2];
        switch (m) {
          case 0:
            const g = a[u];
            (o = a[u + 1]), (d = a[u + 2]), (f = a[u + 3]);
            const x = (e - g) / (a[u + 4] - g);
            (o += (a[u + 4 + 1] - o) * x),
              (d += (a[u + 4 + 2] - d) * x),
              (f += (a[u + 4 + 3] - f) * x);
            break;
          case 1:
            (o = a[u + 1]), (d = a[u + 2]), (f = a[u + 3]);
            break;
          default:
            (o = this.getBezierValue(e, u, 1, m - 2)),
              (d = this.getBezierValue(e, u, 2, m + 18 - 2)),
              (f = this.getBezierValue(e, u, 3, m + 18 * 2 - 2));
        }
        if (h == A.setup) {
          const g = s.data;
          (s.mixRotate = g.mixRotate + (o - g.mixRotate) * r),
            (s.mixX = g.mixX + (d - g.mixX) * r),
            (s.mixY = g.mixY + (f - g.mixY) * r);
        } else
          (s.mixRotate += (o - s.mixRotate) * r),
            (s.mixX += (d - s.mixX) * r),
            (s.mixY += (f - s.mixY) * r);
      }
    }
    const Qe = class extends bt {
      constructor(c, t, n) {
        super(c, [`${ot.sequence}|${t}|${n.sequence.id}`]),
          (this.slotIndex = t),
          (this.attachment = n);
      }
      getFrameEntries() {
        return Qe.ENTRIES;
      }
      getSlotIndex() {
        return this.slotIndex;
      }
      getAttachment() {
        return this.attachment;
      }
      setFrame(c, t, n, e, i) {
        const r = this.frames;
        (c *= Qe.ENTRIES),
          (r[c] = t),
          (r[c + Qe.MODE] = n | (e << 4)),
          (r[c + Qe.DELAY] = i);
      }
      apply(c, t, n, e, i, r, h) {
        const l = c.slots[this.slotIndex];
        if (!l.bone.active) return;
        const s = l.attachment,
          a = this.attachment;
        if (s != a && (!(s instanceof we) || s.timelineAttachment != a)) return;
        const o = this.frames;
        if (n < o[0]) {
          (r == A.setup || r == A.first) && (l.sequenceIndex = -1);
          return;
        }
        const d = bt.search(o, n, Qe.ENTRIES),
          f = o[d],
          u = o[d + Qe.MODE],
          m = o[d + Qe.DELAY];
        if (!this.attachment.sequence) return;
        let g = u >> 4;
        const x = this.attachment.sequence.regions.length,
          E = Bs[u & 15];
        if (E != Re.hold)
          switch (((g += ((n - f) / m + 1e-5) | 0), E)) {
            case Re.once:
              g = Math.min(x - 1, g);
              break;
            case Re.loop:
              g %= x;
              break;
            case Re.pingpong: {
              const w = (x << 1) - 2;
              (g = w == 0 ? 0 : g % w), g >= x && (g = w - g);
              break;
            }
            case Re.onceReverse:
              g = Math.max(x - 1 - g, 0);
              break;
            case Re.loopReverse:
              g = x - 1 - (g % x);
              break;
            case Re.pingpongReverse: {
              const w = (x << 1) - 2;
              (g = w == 0 ? 0 : (g + x - 1) % w), g >= x && (g = w - g);
            }
          }
        l.sequenceIndex = g;
      }
    };
    let bn = Qe;
    (bn.ENTRIES = 3), (bn.MODE = 1), (bn.DELAY = 2);
    const ve = class {
      constructor(c) {
        (this.tracks = new Array()),
          (this.timeScale = 1),
          (this.unkeyedState = 0),
          (this.events = new Array()),
          (this.listeners = new Array()),
          (this.queue = new or(this)),
          (this.propertyIDs = new ss()),
          (this.animationsChanged = !1),
          (this.trackEntryPool = new An(() => new Gn())),
          (this.data = c);
      }
      static emptyAnimation() {
        return ve._emptyAnimation;
      }
      update(c) {
        c *= this.timeScale;
        const t = this.tracks;
        for (let n = 0, e = t.length; n < e; n++) {
          const i = t[n];
          if (!i) continue;
          (i.animationLast = i.nextAnimationLast),
            (i.trackLast = i.nextTrackLast);
          let r = c * i.timeScale;
          if (i.delay > 0) {
            if (((i.delay -= r), i.delay > 0)) continue;
            (r = -i.delay), (i.delay = 0);
          }
          let h = i.next;
          if (h) {
            const l = i.trackLast - h.delay;
            if (l >= 0) {
              for (
                h.delay = 0,
                  h.trackTime +=
                    i.timeScale == 0 ? 0 : (l / i.timeScale + c) * h.timeScale,
                  i.trackTime += r,
                  this.setCurrent(n, h, !0);
                h.mixingFrom;

              )
                (h.mixTime += c), (h = h.mixingFrom);
              continue;
            }
          } else if (i.trackLast >= i.trackEnd && !i.mixingFrom) {
            (t[n] = null), this.queue.end(i), this.clearNext(i);
            continue;
          }
          if (i.mixingFrom && this.updateMixingFrom(i, c)) {
            let l = i.mixingFrom;
            for (i.mixingFrom = null, l && (l.mixingTo = null); l; )
              this.queue.end(l), (l = l.mixingFrom);
          }
          i.trackTime += r;
        }
        this.queue.drain();
      }
      updateMixingFrom(c, t) {
        const n = c.mixingFrom;
        if (!n) return !0;
        const e = this.updateMixingFrom(n, t);
        return (
          (n.animationLast = n.nextAnimationLast),
          (n.trackLast = n.nextTrackLast),
          c.mixTime > 0 && c.mixTime >= c.mixDuration
            ? ((n.totalAlpha == 0 || c.mixDuration == 0) &&
                ((c.mixingFrom = n.mixingFrom),
                n.mixingFrom && (n.mixingFrom.mixingTo = c),
                (c.interruptAlpha = n.interruptAlpha),
                this.queue.end(n)),
              e)
            : ((n.trackTime += t * n.timeScale), (c.mixTime += t), !1)
        );
      }
      apply(c) {
        if (!c) throw new Error("skeleton cannot be null.");
        this.animationsChanged && this._animationsChanged();
        const t = this.events,
          n = this.tracks;
        let e = !1;
        for (let h = 0, l = n.length; h < l; h++) {
          const s = n[h];
          if (!s || s.delay > 0) continue;
          e = !0;
          const a = h == 0 ? A.first : s.mixBlend;
          let o = s.alpha;
          s.mixingFrom
            ? (o *= this.applyMixingFrom(s, c, a))
            : s.trackTime >= s.trackEnd && !s.next && (o = 0);
          const d = s.animationLast,
            f = s.getAnimationTime();
          let u = f,
            m = t;
          s.reverse && ((u = s.animation.duration - u), (m = null));
          const g = s.animation.timelines,
            x = g.length;
          if ((h == 0 && o == 1) || a == A.add)
            for (let E = 0; E < x; E++) {
              v.webkit602BugfixHelper(o, a);
              const w = g[E];
              w instanceof cn
                ? this.applyAttachmentTimeline(w, c, u, a, !0)
                : w.apply(c, d, u, m, o, a, J.mixIn);
            }
          else {
            const E = s.timelineMode,
              w = s.shortestRotation,
              b = !w && s.timelinesRotation.length != x << 1;
            b && (s.timelinesRotation.length = x << 1);
            for (let p = 0; p < x; p++) {
              const S = g[p],
                y = E[p] == ii ? a : A.setup;
              !w && S instanceof Rn
                ? this.applyRotateTimeline(
                    S,
                    c,
                    u,
                    o,
                    y,
                    s.timelinesRotation,
                    p << 1,
                    b
                  )
                : S instanceof cn
                ? this.applyAttachmentTimeline(S, c, u, a, !0)
                : (v.webkit602BugfixHelper(o, a),
                  S.apply(c, d, u, m, o, y, J.mixIn));
            }
          }
          this.queueEvents(s, f),
            (t.length = 0),
            (s.nextAnimationLast = f),
            (s.nextTrackLast = s.trackTime);
        }
        const i = this.unkeyedState + hr,
          r = c.slots;
        for (let h = 0, l = c.slots.length; h < l; h++) {
          const s = r[h];
          if (s.attachmentState == i) {
            const a = s.data.attachmentName;
            s.setAttachment(a ? c.getAttachment(s.data.index, a) : null);
          }
        }
        return (this.unkeyedState += 2), this.queue.drain(), e;
      }
      applyMixingFrom(c, t, n) {
        const e = c.mixingFrom;
        e.mixingFrom && this.applyMixingFrom(e, t, n);
        let i = 0;
        c.mixDuration == 0
          ? ((i = 1), n == A.first && (n = A.setup))
          : ((i = c.mixTime / c.mixDuration),
            i > 1 && (i = 1),
            n != A.first && (n = e.mixBlend));
        const r = i < e.attachmentThreshold,
          h = i < e.drawOrderThreshold,
          l = e.animation.timelines,
          s = l.length,
          a = e.alpha * c.interruptAlpha,
          o = a * (1 - i),
          d = e.animationLast,
          f = e.getAnimationTime();
        let u = f,
          m = null;
        if (
          (e.reverse
            ? (u = e.animation.duration - u)
            : i < e.eventThreshold && (m = this.events),
          n == A.add)
        )
          for (let g = 0; g < s; g++) l[g].apply(t, d, u, m, o, n, J.mixOut);
        else {
          const g = e.timelineMode,
            x = e.timelineHoldMix,
            E = e.shortestRotation,
            w = !E && e.timelinesRotation.length != s << 1;
          w && (e.timelinesRotation.length = s << 1), (e.totalAlpha = 0);
          for (let b = 0; b < s; b++) {
            const p = l[b];
            let S = J.mixOut,
              y,
              M = 0;
            switch (g[b]) {
              case ii:
                if (!h && p instanceof hn) continue;
                (y = n), (M = o);
                break;
              case lr:
                (y = A.setup), (M = o);
                break;
              case cr:
                (y = n), (M = a);
                break;
              case ri:
                (y = A.setup), (M = a);
                break;
              default:
                y = A.setup;
                const T = x[b];
                M = a * Math.max(0, 1 - T.mixTime / T.mixDuration);
                break;
            }
            (e.totalAlpha += M),
              !E && p instanceof Rn
                ? this.applyRotateTimeline(
                    p,
                    t,
                    u,
                    M,
                    y,
                    e.timelinesRotation,
                    b << 1,
                    w
                  )
                : p instanceof cn
                ? this.applyAttachmentTimeline(p, t, u, y, r)
                : (v.webkit602BugfixHelper(M, n),
                  h && p instanceof hn && y == A.setup && (S = J.mixIn),
                  p.apply(t, d, u, m, M, y, S));
          }
        }
        return (
          c.mixDuration > 0 && this.queueEvents(e, f),
          (this.events.length = 0),
          (e.nextAnimationLast = f),
          (e.nextTrackLast = e.trackTime),
          i
        );
      }
      applyAttachmentTimeline(c, t, n, e, i) {
        const r = t.slots[c.slotIndex];
        r.bone.active &&
          (n < c.frames[0]
            ? (e == A.setup || e == A.first) &&
              this.setAttachment(t, r, r.data.attachmentName, i)
            : this.setAttachment(
                t,
                r,
                c.attachmentNames[bt.search1(c.frames, n)],
                i
              ),
          r.attachmentState <= this.unkeyedState &&
            (r.attachmentState = this.unkeyedState + hr));
      }
      setAttachment(c, t, n, e) {
        t.setAttachment(n ? c.getAttachment(t.data.index, n) : null),
          e && (t.attachmentState = this.unkeyedState + qr);
      }
      applyRotateTimeline(c, t, n, e, i, r, h, l) {
        if ((l && (r[h] = 0), e == 1)) {
          c.apply(t, 0, n, null, 1, i, J.mixIn);
          return;
        }
        const s = t.bones[c.boneIndex];
        if (!s.active) return;
        const a = c.frames;
        let o = 0,
          d = 0;
        if (n < a[0])
          switch (i) {
            case A.setup:
              s.rotation = s.data.rotation;
            default:
              return;
            case A.first:
              (o = s.rotation), (d = s.data.rotation);
          }
        else
          (o = i == A.setup ? s.data.rotation : s.rotation),
            (d = s.data.rotation + c.getCurveValue(n));
        let f = 0,
          u = d - o;
        if (
          ((u -= (16384 - ((16384.499999999996 - u / 360) | 0)) * 360), u == 0)
        )
          f = r[h];
        else {
          let m = 0,
            g = 0;
          l ? ((m = 0), (g = u)) : ((m = r[h]), (g = r[h + 1]));
          const x = u > 0;
          let E = m >= 0;
          C.signum(g) != C.signum(u) &&
            Math.abs(g) <= 90 &&
            (Math.abs(m) > 180 && (m += 360 * C.signum(m)), (E = x)),
            (f = u + m - (m % 360)),
            E != x && (f += 360 * C.signum(m)),
            (r[h] = f);
        }
        (r[h + 1] = u), (s.rotation = o + f * e);
      }
      queueEvents(c, t) {
        const n = c.animationStart,
          e = c.animationEnd,
          i = e - n,
          r = c.trackLast % i,
          h = this.events;
        let l = 0;
        const s = h.length;
        for (; l < s; l++) {
          const o = h[l];
          if (o.time < r) break;
          o.time > e || this.queue.event(c, o);
        }
        let a = !1;
        for (
          c.loop
            ? (a = i == 0 || r > c.trackTime % i)
            : (a = t >= e && c.animationLast < e),
            a && this.queue.complete(c);
          l < s;
          l++
        ) {
          const o = h[l];
          o.time < n || this.queue.event(c, o);
        }
      }
      clearTracks() {
        const c = this.queue.drainDisabled;
        this.queue.drainDisabled = !0;
        for (let t = 0, n = this.tracks.length; t < n; t++) this.clearTrack(t);
        (this.tracks.length = 0),
          (this.queue.drainDisabled = c),
          this.queue.drain();
      }
      clearTrack(c) {
        if (c >= this.tracks.length) return;
        const t = this.tracks[c];
        if (!t) return;
        this.queue.end(t), this.clearNext(t);
        let n = t;
        for (;;) {
          const e = n.mixingFrom;
          if (!e) break;
          this.queue.end(e),
            (n.mixingFrom = null),
            (n.mixingTo = null),
            (n = e);
        }
        (this.tracks[t.trackIndex] = null), this.queue.drain();
      }
      setCurrent(c, t, n) {
        const e = this.expandToIndex(c);
        (this.tracks[c] = t),
          (t.previous = null),
          e &&
            (n && this.queue.interrupt(e),
            (t.mixingFrom = e),
            (e.mixingTo = t),
            (t.mixTime = 0),
            e.mixingFrom &&
              e.mixDuration > 0 &&
              (t.interruptAlpha *= Math.min(1, e.mixTime / e.mixDuration)),
            (e.timelinesRotation.length = 0)),
          this.queue.start(t);
      }
      setAnimation(c, t, n = !1) {
        const e = this.data.skeletonData.findAnimation(t);
        if (!e) throw new Error(`Animation not found: ${t}`);
        return this.setAnimationWith(c, e, n);
      }
      setAnimationWith(c, t, n = !1) {
        if (!t) throw new Error("animation cannot be null.");
        let e = !0,
          i = this.expandToIndex(c);
        i &&
          (i.nextTrackLast == -1
            ? ((this.tracks[c] = i.mixingFrom),
              this.queue.interrupt(i),
              this.queue.end(i),
              this.clearNext(i),
              (i = i.mixingFrom),
              (e = !1))
            : this.clearNext(i));
        const r = this.trackEntry(c, t, n, i);
        return this.setCurrent(c, r, e), this.queue.drain(), r;
      }
      addAnimation(c, t, n = !1, e = 0) {
        const i = this.data.skeletonData.findAnimation(t);
        if (!i) throw new Error(`Animation not found: ${t}`);
        return this.addAnimationWith(c, i, n, e);
      }
      addAnimationWith(c, t, n = !1, e = 0) {
        if (!t) throw new Error("animation cannot be null.");
        let i = this.expandToIndex(c);
        if (i) for (; i.next; ) i = i.next;
        const r = this.trackEntry(c, t, n, i);
        return (
          i
            ? ((i.next = r),
              (r.previous = i),
              e <= 0 && (e += i.getTrackComplete() - r.mixDuration))
            : (this.setCurrent(c, r, !0), this.queue.drain()),
          (r.delay = e),
          r
        );
      }
      setEmptyAnimation(c, t = 0) {
        const n = this.setAnimationWith(c, ve.emptyAnimation(), !1);
        return (n.mixDuration = t), (n.trackEnd = t), n;
      }
      addEmptyAnimation(c, t = 0, n = 0) {
        const e = this.addAnimationWith(c, ve.emptyAnimation(), !1, n);
        return (
          n <= 0 && (e.delay += e.mixDuration - t),
          (e.mixDuration = t),
          (e.trackEnd = t),
          e
        );
      }
      setEmptyAnimations(c = 0) {
        const t = this.queue.drainDisabled;
        this.queue.drainDisabled = !0;
        for (let n = 0, e = this.tracks.length; n < e; n++) {
          const i = this.tracks[n];
          i && this.setEmptyAnimation(i.trackIndex, c);
        }
        (this.queue.drainDisabled = t), this.queue.drain();
      }
      expandToIndex(c) {
        return c < this.tracks.length
          ? this.tracks[c]
          : (v.ensureArrayCapacity(this.tracks, c + 1, null),
            (this.tracks.length = c + 1),
            null);
      }
      trackEntry(c, t, n, e) {
        const i = this.trackEntryPool.obtain();
        return (
          i.reset(),
          (i.trackIndex = c),
          (i.animation = t),
          (i.loop = n),
          (i.holdPrevious = !1),
          (i.reverse = !1),
          (i.shortestRotation = !1),
          (i.eventThreshold = 0),
          (i.attachmentThreshold = 0),
          (i.drawOrderThreshold = 0),
          (i.animationStart = 0),
          (i.animationEnd = t.duration),
          (i.animationLast = -1),
          (i.nextAnimationLast = -1),
          (i.delay = 0),
          (i.trackTime = 0),
          (i.trackLast = -1),
          (i.nextTrackLast = -1),
          (i.trackEnd = Number.MAX_VALUE),
          (i.timeScale = 1),
          (i.alpha = 1),
          (i.mixTime = 0),
          (i.mixDuration = e ? this.data.getMix(e.animation, t) : 0),
          (i.interruptAlpha = 1),
          (i.totalAlpha = 0),
          (i.mixBlend = A.replace),
          i
        );
      }
      clearNext(c) {
        let t = c.next;
        for (; t; ) this.queue.dispose(t), (t = t.next);
        c.next = null;
      }
      _animationsChanged() {
        (this.animationsChanged = !1), this.propertyIDs.clear();
        const c = this.tracks;
        for (let t = 0, n = c.length; t < n; t++) {
          let e = c[t];
          if (e) {
            for (; e.mixingFrom; ) e = e.mixingFrom;
            do
              (!e.mixingTo || e.mixBlend != A.add) && this.computeHold(e),
                (e = e.mixingTo);
            while (e);
          }
        }
      }
      computeHold(c) {
        const t = c.mixingTo,
          n = c.animation.timelines,
          e = c.animation.timelines.length,
          i = c.timelineMode;
        i.length = e;
        const r = c.timelineHoldMix;
        r.length = 0;
        const h = this.propertyIDs;
        if (t && t.holdPrevious) {
          for (let l = 0; l < e; l++)
            i[l] = h.addAll(n[l].getPropertyIds()) ? ri : cr;
          return;
        }
        t: for (let l = 0; l < e; l++) {
          const s = n[l],
            a = s.getPropertyIds();
          if (!h.addAll(a)) i[l] = ii;
          else if (
            !t ||
            s instanceof cn ||
            s instanceof hn ||
            s instanceof vn ||
            !t.animation.hasTimeline(a)
          )
            i[l] = lr;
          else {
            for (let o = t.mixingTo; o; o = o.mixingTo)
              if (!o.animation.hasTimeline(a)) {
                if (c.mixDuration > 0) {
                  (i[l] = Wr), (r[l] = o);
                  continue t;
                }
                break;
              }
            i[l] = ri;
          }
        }
      }
      getCurrent(c) {
        return c >= this.tracks.length ? null : this.tracks[c];
      }
      addListener(c) {
        if (!c) throw new Error("listener cannot be null.");
        this.listeners.push(c);
      }
      removeListener(c) {
        const t = this.listeners.indexOf(c);
        t >= 0 && this.listeners.splice(t, 1);
      }
      clearListeners() {
        this.listeners.length = 0;
      }
      clearListenerNotifications() {
        this.queue.clear();
      }
      setAnimationByName(c, t, n) {
        ve.deprecatedWarning1 ||
          ((ve.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: AnimationState.setAnimationByName is deprecated, please use setAnimation from now on."
          )),
          this.setAnimation(c, t, n);
      }
      addAnimationByName(c, t, n, e) {
        ve.deprecatedWarning2 ||
          ((ve.deprecatedWarning2 = !0),
          console.warn(
            "Spine Deprecation Warning: AnimationState.addAnimationByName is deprecated, please use addAnimation from now on."
          )),
          this.addAnimation(c, t, n, e);
      }
      hasAnimation(c) {
        return this.data.skeletonData.findAnimation(c) !== null;
      }
      hasAnimationByName(c) {
        return (
          ve.deprecatedWarning3 ||
            ((ve.deprecatedWarning3 = !0),
            console.warn(
              "Spine Deprecation Warning: AnimationState.hasAnimationByName is deprecated, please use hasAnimation from now on."
            )),
          this.hasAnimation(c)
        );
      }
    };
    let En = ve;
    (En._emptyAnimation = new zn("<empty>", [], 0)),
      (En.deprecatedWarning1 = !1),
      (En.deprecatedWarning2 = !1),
      (En.deprecatedWarning3 = !1);
    const De = class {
      constructor() {
        (this.animation = null),
          (this.previous = null),
          (this.next = null),
          (this.mixingFrom = null),
          (this.mixingTo = null),
          (this.listener = null),
          (this.trackIndex = 0),
          (this.loop = !1),
          (this.holdPrevious = !1),
          (this.reverse = !1),
          (this.shortestRotation = !1),
          (this.eventThreshold = 0),
          (this.attachmentThreshold = 0),
          (this.drawOrderThreshold = 0),
          (this.animationStart = 0),
          (this.animationEnd = 0),
          (this.animationLast = 0),
          (this.nextAnimationLast = 0),
          (this.delay = 0),
          (this.trackTime = 0),
          (this.trackLast = 0),
          (this.nextTrackLast = 0),
          (this.trackEnd = 0),
          (this.timeScale = 0),
          (this.alpha = 0),
          (this.mixTime = 0),
          (this.mixDuration = 0),
          (this.interruptAlpha = 0),
          (this.totalAlpha = 0),
          (this.mixBlend = A.replace),
          (this.timelineMode = new Array()),
          (this.timelineHoldMix = new Array()),
          (this.timelinesRotation = new Array());
      }
      reset() {
        (this.next = null),
          (this.previous = null),
          (this.mixingFrom = null),
          (this.mixingTo = null),
          (this.animation = null),
          (this.listener = null),
          (this.timelineMode.length = 0),
          (this.timelineHoldMix.length = 0),
          (this.timelinesRotation.length = 0);
      }
      getAnimationTime() {
        if (this.loop) {
          const c = this.animationEnd - this.animationStart;
          return c == 0
            ? this.animationStart
            : (this.trackTime % c) + this.animationStart;
        }
        return Math.min(
          this.trackTime + this.animationStart,
          this.animationEnd
        );
      }
      setAnimationLast(c) {
        (this.animationLast = c), (this.nextAnimationLast = c);
      }
      isComplete() {
        return this.trackTime >= this.animationEnd - this.animationStart;
      }
      resetRotationDirections() {
        this.timelinesRotation.length = 0;
      }
      getTrackComplete() {
        const c = this.animationEnd - this.animationStart;
        if (c != 0) {
          if (this.loop) return c * (1 + ((this.trackTime / c) | 0));
          if (this.trackTime < c) return c;
        }
        return this.trackTime;
      }
      get time() {
        return (
          De.deprecatedWarning1 ||
            ((De.deprecatedWarning1 = !0),
            console.warn(
              "Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on."
            )),
          this.trackTime
        );
      }
      set time(c) {
        De.deprecatedWarning1 ||
          ((De.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on."
          )),
          (this.trackTime = c);
      }
      get endTime() {
        return (
          De.deprecatedWarning2 ||
            ((De.deprecatedWarning2 = !0),
            console.warn(
              "Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on."
            )),
          this.trackTime
        );
      }
      set endTime(c) {
        De.deprecatedWarning2 ||
          ((De.deprecatedWarning2 = !0),
          console.warn(
            "Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on."
          )),
          (this.trackTime = c);
      }
      loopsCount() {
        return Math.floor(this.trackTime / this.trackEnd);
      }
    };
    let Gn = De;
    (Gn.deprecatedWarning1 = !1), (Gn.deprecatedWarning2 = !1);
    class or {
      constructor(t) {
        (this.objects = []), (this.drainDisabled = !1), (this.animState = t);
      }
      start(t) {
        this.objects.push(Qt.start),
          this.objects.push(t),
          (this.animState.animationsChanged = !0);
      }
      interrupt(t) {
        this.objects.push(Qt.interrupt), this.objects.push(t);
      }
      end(t) {
        this.objects.push(Qt.end),
          this.objects.push(t),
          (this.animState.animationsChanged = !0);
      }
      dispose(t) {
        this.objects.push(Qt.dispose), this.objects.push(t);
      }
      complete(t) {
        this.objects.push(Qt.complete), this.objects.push(t);
      }
      event(t, n) {
        this.objects.push(Qt.event), this.objects.push(t), this.objects.push(n);
      }
      drain() {
        if (this.drainDisabled) return;
        this.drainDisabled = !0;
        const t = this.objects,
          n = this.animState.listeners;
        for (let e = 0; e < t.length; e += 2) {
          const i = t[e],
            r = t[e + 1];
          switch (i) {
            case Qt.start:
              r.listener && r.listener.start && r.listener.start(r);
              for (let l = 0; l < n.length; l++) {
                const s = n[l];
                s.start && s.start(r);
              }
              break;
            case Qt.interrupt:
              r.listener && r.listener.interrupt && r.listener.interrupt(r);
              for (let l = 0; l < n.length; l++) {
                const s = n[l];
                s.interrupt && s.interrupt(r);
              }
              break;
            case Qt.end:
              r.listener && r.listener.end && r.listener.end(r);
              for (let l = 0; l < n.length; l++) {
                const s = n[l];
                s.end && s.end(r);
              }
            case Qt.dispose:
              r.listener && r.listener.dispose && r.listener.dispose(r);
              for (let l = 0; l < n.length; l++) {
                const s = n[l];
                s.dispose && s.dispose(r);
              }
              this.animState.trackEntryPool.free(r);
              break;
            case Qt.complete:
              r.listener && r.listener.complete && r.listener.complete(r);
              for (let l = 0; l < n.length; l++) {
                const s = n[l];
                s.complete && s.complete(r);
              }
              break;
            case Qt.event:
              const h = t[e++ + 2];
              r.listener && r.listener.event && r.listener.event(r, h);
              for (let l = 0; l < n.length; l++) {
                const s = n[l];
                s.event && s.event(r, h);
              }
              break;
          }
        }
        this.clear(), (this.drainDisabled = !1);
      }
      clear() {
        this.objects.length = 0;
      }
    }
    var Qt = ((c) => (
      (c[(c.start = 0)] = "start"),
      (c[(c.interrupt = 1)] = "interrupt"),
      (c[(c.end = 2)] = "end"),
      (c[(c.dispose = 3)] = "dispose"),
      (c[(c.complete = 4)] = "complete"),
      (c[(c.event = 5)] = "event"),
      c
    ))(Qt || {});
    class $r {
      start(t) {}
      interrupt(t) {}
      end(t) {}
      dispose(t) {}
      complete(t) {}
      event(t, n) {}
    }
    const ii = 0,
      lr = 1,
      cr = 2,
      ri = 3,
      Wr = 4,
      hr = 1,
      qr = 2;
    class dr {
      constructor(t) {
        if (((this.animationToMixTime = {}), (this.defaultMix = 0), !t))
          throw new Error("skeletonData cannot be null.");
        this.skeletonData = t;
      }
      setMix(t, n, e) {
        const i = this.skeletonData.findAnimation(t);
        if (!i) throw new Error(`Animation not found: ${t}`);
        const r = this.skeletonData.findAnimation(n);
        if (!r) throw new Error(`Animation not found: ${n}`);
        this.setMixWith(i, r, e);
      }
      setMixWith(t, n, e) {
        if (!t) throw new Error("from cannot be null.");
        if (!n) throw new Error("to cannot be null.");
        const i = `${t.name}.${n.name}`;
        this.animationToMixTime[i] = e;
      }
      getMix(t, n) {
        const e = `${t.name}.${n.name}`,
          i = this.animationToMixTime[e];
        return i === void 0 ? this.defaultMix : i;
      }
    }
    class ai {
      constructor(t) {
        this.atlas = t;
      }
      loadSequence(t, n, e) {
        const i = e.regions;
        for (let r = 0, h = i.length; r < h; r++) {
          const l = e.getPath(n, r),
            s = this.atlas.findRegion(l);
          if (s == null)
            throw new Error(`Region not found in atlas: ${l} (sequence: ${t})`);
          (i[r] = s), (i[r].renderObject = i[r]);
        }
      }
      newRegionAttachment(t, n, e, i) {
        const r = new it(n, e);
        if (i != null) this.loadSequence(n, e, i);
        else {
          const h = this.atlas.findRegion(e);
          if (!h)
            throw new Error(
              `Region not found in atlas: ${e} (region attachment: ${n})`
            );
          (h.renderObject = h), (r.region = h);
        }
        return r;
      }
      newMeshAttachment(t, n, e, i) {
        const r = new on(n, e);
        if (i != null) this.loadSequence(n, e, i);
        else {
          const h = this.atlas.findRegion(e);
          if (!h)
            throw new Error(
              `Region not found in atlas: ${e} (mesh attachment: ${n})`
            );
          (h.renderObject = h), (r.region = h);
        }
        return r;
      }
      newBoundingBoxAttachment(t, n) {
        return new On(n);
      }
      newPathAttachment(t, n) {
        return new ln(n);
      }
      newPointAttachment(t, n) {
        return new Wn(n);
      }
      newClippingAttachment(t, n) {
        return new $n(n);
      }
    }
    class oi {
      constructor(t, n, e) {
        if (
          ((this.matrix = new H.Matrix()),
          (this.parent = null),
          (this.children = new Array()),
          (this.x = 0),
          (this.y = 0),
          (this.rotation = 0),
          (this.scaleX = 0),
          (this.scaleY = 0),
          (this.shearX = 0),
          (this.shearY = 0),
          (this.ax = 0),
          (this.ay = 0),
          (this.arotation = 0),
          (this.ascaleX = 0),
          (this.ascaleY = 0),
          (this.ashearX = 0),
          (this.ashearY = 0),
          (this.sorted = !1),
          (this.active = !1),
          !t)
        )
          throw new Error("data cannot be null.");
        if (!n) throw new Error("skeleton cannot be null.");
        (this.data = t),
          (this.skeleton = n),
          (this.parent = e),
          this.setToSetupPose();
      }
      get worldX() {
        return this.matrix.tx;
      }
      get worldY() {
        return this.matrix.ty;
      }
      isActive() {
        return this.active;
      }
      update() {
        this.updateWorldTransformWith(
          this.ax,
          this.ay,
          this.arotation,
          this.ascaleX,
          this.ascaleY,
          this.ashearX,
          this.ashearY
        );
      }
      updateWorldTransform() {
        this.updateWorldTransformWith(
          this.x,
          this.y,
          this.rotation,
          this.scaleX,
          this.scaleY,
          this.shearX,
          this.shearY
        );
      }
      updateWorldTransformWith(t, n, e, i, r, h, l) {
        (this.ax = t),
          (this.ay = n),
          (this.arotation = e),
          (this.ascaleX = i),
          (this.ascaleY = r),
          (this.ashearX = h),
          (this.ashearY = l);
        const s = this.parent,
          a = this.matrix,
          o = this.skeleton.scaleX,
          d = zt.yDown ? -this.skeleton.scaleY : this.skeleton.scaleY;
        if (!s) {
          const x = this.skeleton,
            E = e + 90 + l;
          (a.a = C.cosDeg(e + h) * i * o),
            (a.c = C.cosDeg(E) * r * o),
            (a.b = C.sinDeg(e + h) * i * d),
            (a.d = C.sinDeg(E) * r * d),
            (a.tx = t * o + x.x),
            (a.ty = n * d + x.y);
          return;
        }
        let f = s.matrix.a,
          u = s.matrix.c,
          m = s.matrix.b,
          g = s.matrix.d;
        switch (
          ((a.tx = f * t + u * n + s.matrix.tx),
          (a.ty = m * t + g * n + s.matrix.ty),
          this.data.transformMode)
        ) {
          case j.Normal: {
            const x = e + 90 + l,
              E = C.cosDeg(e + h) * i,
              w = C.cosDeg(x) * r,
              b = C.sinDeg(e + h) * i,
              p = C.sinDeg(x) * r;
            (a.a = f * E + u * b),
              (a.c = f * w + u * p),
              (a.b = m * E + g * b),
              (a.d = m * w + g * p);
            return;
          }
          case j.OnlyTranslation: {
            const x = e + 90 + l;
            (a.a = C.cosDeg(e + h) * i),
              (a.c = C.cosDeg(x) * r),
              (a.b = C.sinDeg(e + h) * i),
              (a.d = C.sinDeg(x) * r);
            break;
          }
          case j.NoRotationOrReflection: {
            let x = f * f + m * m,
              E = 0;
            x > 1e-4
              ? ((x = Math.abs(f * g - u * m) / x),
                (f /= o),
                (m /= d),
                (u = m * x),
                (g = f * x),
                (E = Math.atan2(m, f) * C.radDeg))
              : ((f = 0), (m = 0), (E = 90 - Math.atan2(g, u) * C.radDeg));
            const w = e + h - E,
              b = e + l - E + 90,
              p = C.cosDeg(w) * i,
              S = C.cosDeg(b) * r,
              y = C.sinDeg(w) * i,
              M = C.sinDeg(b) * r;
            (a.a = f * p - u * y),
              (a.c = f * S - u * M),
              (a.b = m * p + g * y),
              (a.d = m * S + g * M);
            break;
          }
          case j.NoScale:
          case j.NoScaleOrReflection: {
            const x = C.cosDeg(e),
              E = C.sinDeg(e);
            let w = (f * x + u * E) / o,
              b = (m * x + g * E) / d,
              p = Math.sqrt(w * w + b * b);
            p > 1e-5 && (p = 1 / p),
              (w *= p),
              (b *= p),
              (p = Math.sqrt(w * w + b * b)),
              this.data.transformMode == j.NoScale &&
                f * g - u * m < 0 != (o < 0 != d < 0) &&
                (p = -p);
            const S = Math.PI / 2 + Math.atan2(b, w),
              y = Math.cos(S) * p,
              M = Math.sin(S) * p,
              T = C.cosDeg(h) * i,
              k = C.cosDeg(90 + l) * r,
              I = C.sinDeg(h) * i,
              R = C.sinDeg(90 + l) * r;
            (a.a = w * T + y * I),
              (a.c = w * k + y * R),
              (a.b = b * T + M * I),
              (a.d = b * k + M * R);
            break;
          }
        }
        (a.a *= o), (a.c *= o), (a.b *= d), (a.d *= d);
      }
      setToSetupPose() {
        const t = this.data;
        (this.x = t.x),
          (this.y = t.y),
          (this.rotation = t.rotation),
          (this.scaleX = t.scaleX),
          (this.scaleY = t.scaleY),
          (this.shearX = t.shearX),
          (this.shearY = t.shearY);
      }
      getWorldRotationX() {
        return Math.atan2(this.matrix.b, this.matrix.a) * C.radDeg;
      }
      getWorldRotationY() {
        return Math.atan2(this.matrix.d, this.matrix.c) * C.radDeg;
      }
      getWorldScaleX() {
        const t = this.matrix;
        return Math.sqrt(t.a * t.a + t.b * t.b);
      }
      getWorldScaleY() {
        const t = this.matrix;
        return Math.sqrt(t.c * t.c + t.d * t.d);
      }
      updateAppliedTransform() {
        const t = this.parent,
          n = this.matrix;
        if (!t) {
          (this.ax = n.tx - this.skeleton.x),
            (this.ay = n.ty - this.skeleton.y),
            (this.arotation = Math.atan2(n.b, n.a) * C.radDeg),
            (this.ascaleX = Math.sqrt(n.a * n.a + n.b * n.b)),
            (this.ascaleY = Math.sqrt(n.c * n.c + n.d * n.d)),
            (this.ashearX = 0),
            (this.ashearY =
              Math.atan2(n.a * n.c + n.b * n.d, n.a * n.d - n.b * n.c) *
              C.radDeg);
          return;
        }
        const e = t.matrix,
          i = 1 / (e.a * e.d - e.b * e.c),
          r = n.tx - e.tx,
          h = n.ty - e.ty;
        (this.ax = r * e.d * i - h * e.c * i),
          (this.ay = h * e.a * i - r * e.b * i);
        const l = i * e.d,
          s = i * e.a,
          a = i * e.c,
          o = i * e.b,
          d = l * n.a - a * n.b,
          f = l * n.c - a * n.d,
          u = s * n.b - o * n.a,
          m = s * n.d - o * n.c;
        if (
          ((this.ashearX = 0),
          (this.ascaleX = Math.sqrt(d * d + u * u)),
          this.ascaleX > 1e-4)
        ) {
          const g = d * m - f * u;
          (this.ascaleY = g / this.ascaleX),
            (this.ashearY = Math.atan2(d * f + u * m, g) * C.radDeg),
            (this.arotation = Math.atan2(u, d) * C.radDeg);
        } else
          (this.ascaleX = 0),
            (this.ascaleY = Math.sqrt(f * f + m * m)),
            (this.ashearY = 0),
            (this.arotation = 90 - Math.atan2(m, f) * C.radDeg);
      }
      worldToLocal(t) {
        const n = this.matrix,
          e = n.a,
          i = n.c,
          r = n.b,
          h = n.d,
          l = 1 / (e * h - i * r),
          s = t.x - n.tx,
          a = t.y - n.ty;
        return (t.x = s * h * l - a * i * l), (t.y = a * e * l - s * r * l), t;
      }
      localToWorld(t) {
        const n = this.matrix,
          e = t.x,
          i = t.y;
        return (
          (t.x = e * n.a + i * n.c + n.tx), (t.y = e * n.b + i * n.d + n.ty), t
        );
      }
      worldToLocalRotation(t) {
        const n = C.sinDeg(t),
          e = C.cosDeg(t),
          i = this.matrix;
        return Math.atan2(i.a * n - i.b * e, i.d * e - i.c * n) * C.radDeg;
      }
      localToWorldRotation(t) {
        t -= this.rotation - this.shearX;
        const n = C.sinDeg(t),
          e = C.cosDeg(t),
          i = this.matrix;
        return Math.atan2(e * i.b + n * i.d, e * i.a + n * i.c) * C.radDeg;
      }
      rotateWorld(t) {
        const n = this.matrix,
          e = n.a,
          i = n.c,
          r = n.b,
          h = n.d,
          l = C.cosDeg(t),
          s = C.sinDeg(t);
        (n.a = l * e - s * r),
          (n.c = l * i - s * h),
          (n.b = s * e + l * r),
          (n.d = s * i + l * h);
      }
    }
    class li {
      constructor(t, n, e) {
        if (
          ((this.index = 0),
          (this.parent = null),
          (this.length = 0),
          (this.x = 0),
          (this.y = 0),
          (this.rotation = 0),
          (this.scaleX = 1),
          (this.scaleY = 1),
          (this.shearX = 0),
          (this.shearY = 0),
          (this.transformMode = j.Normal),
          (this.skinRequired = !1),
          (this.color = new _()),
          t < 0)
        )
          throw new Error("index must be >= 0.");
        if (!n) throw new Error("name cannot be null.");
        (this.index = t), (this.name = n), (this.parent = e);
      }
    }
    class jn {
      constructor(t, n, e) {
        (this.name = t), (this.order = n), (this.skinRequired = e);
      }
    }
    class ci {
      constructor(t, n) {
        if (
          ((this.intValue = 0),
          (this.floatValue = 0),
          (this.stringValue = null),
          (this.time = 0),
          (this.volume = 0),
          (this.balance = 0),
          !n)
        )
          throw new Error("data cannot be null.");
        (this.time = t), (this.data = n);
      }
    }
    class hi {
      constructor(t) {
        (this.intValue = 0),
          (this.floatValue = 0),
          (this.stringValue = null),
          (this.audioPath = null),
          (this.volume = 0),
          (this.balance = 0),
          (this.name = t);
      }
    }
    class fr {
      constructor(t, n) {
        if (
          ((this.bendDirection = 0),
          (this.compress = !1),
          (this.stretch = !1),
          (this.mix = 1),
          (this.softness = 0),
          (this.active = !1),
          !t)
        )
          throw new Error("data cannot be null.");
        if (!n) throw new Error("skeleton cannot be null.");
        (this.data = t),
          (this.mix = t.mix),
          (this.softness = t.softness),
          (this.bendDirection = t.bendDirection),
          (this.compress = t.compress),
          (this.stretch = t.stretch),
          (this.bones = new Array());
        for (let i = 0; i < t.bones.length; i++) {
          const r = n.findBone(t.bones[i].name);
          if (!r) throw new Error(`Couldn't find bone ${t.bones[i].name}`);
          this.bones.push(r);
        }
        const e = n.findBone(t.target.name);
        if (!e) throw new Error(`Couldn't find bone ${t.target.name}`);
        this.target = e;
      }
      isActive() {
        return this.active;
      }
      update() {
        if (this.mix == 0) return;
        const t = this.target,
          n = this.bones;
        switch (n.length) {
          case 1:
            this.apply1(
              n[0],
              t.worldX,
              t.worldY,
              this.compress,
              this.stretch,
              this.data.uniform,
              this.mix
            );
            break;
          case 2:
            this.apply2(
              n[0],
              n[1],
              t.worldX,
              t.worldY,
              this.bendDirection,
              this.stretch,
              this.data.uniform,
              this.softness,
              this.mix
            );
            break;
        }
      }
      apply1(t, n, e, i, r, h, l) {
        const s = t.parent.matrix;
        if (!s) throw new Error("IK bone must have parent.");
        const a = s.a;
        let o = s.c;
        const d = s.b;
        let f = s.d,
          u = -t.ashearX - t.arotation,
          m = 0,
          g = 0;
        const x = t.skeleton.scaleX,
          E = zt.yDown ? -t.skeleton.scaleY : t.skeleton.scaleY;
        switch (t.data.transformMode) {
          case j.OnlyTranslation:
            (m = n - t.worldX), (g = e - t.worldY), zt.yDown && (g = -g);
            break;
          case j.NoRotationOrReflection:
            const p = Math.abs(a * f - o * d) / (a * a + d * d),
              S = a / x,
              y = d / E;
            (o = -y * p * x),
              (f = S * p * E),
              (u += Math.atan2(y, S) * C.radDeg);
          default:
            const M = n - s.tx,
              T = e - s.ty,
              k = a * f - o * d;
            (m = (M * f - T * o) / k - t.ax), (g = (T * a - M * d) / k - t.ay);
        }
        (u += Math.atan2(g, m) * C.radDeg),
          t.ascaleX < 0 && (u += 180),
          u > 180 ? (u -= 360) : u < -180 && (u += 360);
        let w = t.ascaleX,
          b = t.ascaleY;
        if (i || r) {
          switch (t.data.transformMode) {
            case j.NoScale:
            case j.NoScaleOrReflection:
              (m = n - t.worldX), (g = e - t.worldY);
          }
          const p = t.data.length * w,
            S = Math.sqrt(m * m + g * g);
          if ((i && S < p) || (r && S > p && p > 1e-4)) {
            const y = (S / p - 1) * l + 1;
            (w *= y), h && (b *= y);
          }
        }
        t.updateWorldTransformWith(
          t.ax,
          t.ay,
          t.arotation + u * l,
          w,
          b,
          t.ashearX,
          t.ashearY
        );
      }
      apply2(t, n, e, i, r, h, l, s, a) {
        const o = t.ax,
          d = t.ay;
        let f = t.ascaleX,
          u = t.ascaleY,
          m = f,
          g = u,
          x = n.ascaleX;
        const E = t.matrix;
        let w = 0,
          b = 0,
          p = 0;
        f < 0 ? ((f = -f), (w = 180), (p = -1)) : ((w = 0), (p = 1)),
          u < 0 && ((u = -u), (p = -p)),
          x < 0 ? ((x = -x), (b = 180)) : (b = 0);
        const S = n.ax;
        let y = 0,
          M = 0,
          T = 0,
          k = E.a,
          I = E.c,
          R = E.b,
          V = E.d;
        const F = Math.abs(f - u) <= 1e-4;
        !F || h
          ? ((y = 0), (M = k * S + E.tx), (T = R * S + E.ty))
          : ((y = n.ay),
            (M = k * S + I * y + E.tx),
            (T = R * S + V * y + E.ty));
        const B = t.parent.matrix;
        if (!B) throw new Error("IK parent must itself have a parent.");
        (k = B.a), (I = B.c), (R = B.b), (V = B.d);
        const Y = 1 / (k * V - I * R);
        let N = M - B.tx,
          q = T - B.ty;
        const z = (N * V - q * I) * Y - o,
          D = (q * k - N * R) * Y - d,
          X = Math.sqrt(z * z + D * D);
        let L = n.data.length * x,
          O,
          W;
        if (X < 1e-4) {
          this.apply1(t, e, i, !1, h, !1, a),
            n.updateWorldTransformWith(
              S,
              y,
              0,
              n.ascaleX,
              n.ascaleY,
              n.ashearX,
              n.ashearY
            );
          return;
        }
        (N = e - B.tx), (q = i - B.ty);
        let U = (N * V - q * I) * Y - o,
          $ = (q * k - N * R) * Y - d,
          G = U * U + $ * $;
        if (s != 0) {
          s *= f * (x + 1) * 0.5;
          const ct = Math.sqrt(G),
            Xt = ct - X - L * f + s;
          if (Xt > 0) {
            let Ut = Math.min(1, Xt / (s * 2)) - 1;
            (Ut = (Xt - s * (1 - Ut * Ut)) / ct),
              (U -= Ut * U),
              ($ -= Ut * $),
              (G = U * U + $ * $);
          }
        }
        t: if (F) {
          L *= f;
          let ct = (G - X * X - L * L) / (2 * X * L);
          ct < -1
            ? ((ct = -1), (W = Math.PI * r))
            : ct > 1
            ? ((ct = 1),
              (W = 0),
              h &&
                ((k = (Math.sqrt(G) / (X + L) - 1) * a + 1),
                (m *= k),
                l && (g *= k)))
            : (W = Math.acos(ct) * r),
            (k = X + L * ct),
            (I = L * Math.sin(W)),
            (O = Math.atan2($ * k - U * I, U * k + $ * I));
        } else {
          (k = f * L), (I = u * L);
          const ct = k * k,
            Xt = I * I,
            Ut = Math.atan2($, U);
          R = Xt * X * X + ct * G - ct * Xt;
          const de = -2 * Xt * X,
            Me = Xt - ct;
          if (((V = de * de - 4 * Me * R), V >= 0)) {
            let Nt = Math.sqrt(V);
            de < 0 && (Nt = -Nt), (Nt = -(de + Nt) * 0.5);
            const We = Nt / Me,
              pr = R / Nt,
              yn = Math.abs(We) < Math.abs(pr) ? We : pr;
            if (yn * yn <= G) {
              (q = Math.sqrt(G - yn * yn) * r),
                (O = Ut - Math.atan2(q, yn)),
                (W = Math.atan2(q / u, (yn - X) / f));
              break t;
            }
          }
          let Oe = C.PI,
            Ve = X - k,
            Ae = Ve * Ve,
            Ce = 0,
            $e = 0,
            Kt = X + k,
            ae = Kt * Kt,
            Ke = 0;
          (R = (-k * X) / (ct - Xt)),
            R >= -1 &&
              R <= 1 &&
              ((R = Math.acos(R)),
              (N = k * Math.cos(R) + X),
              (q = I * Math.sin(R)),
              (V = N * N + q * q),
              V < Ae && ((Oe = R), (Ae = V), (Ve = N), (Ce = q)),
              V > ae && (($e = R), (ae = V), (Kt = N), (Ke = q))),
            G <= (Ae + ae) * 0.5
              ? ((O = Ut - Math.atan2(Ce * r, Ve)), (W = Oe * r))
              : ((O = Ut - Math.atan2(Ke * r, Kt)), (W = $e * r));
        }
        const lt = Math.atan2(y, S) * p;
        let It = t.arotation;
        (O = (O - lt) * C.radDeg + w - It),
          O > 180 ? (O -= 360) : O < -180 && (O += 360),
          t.updateWorldTransformWith(o, d, It + O * a, m, g, 0, 0),
          (It = n.arotation),
          (W = ((W + lt) * C.radDeg - n.ashearX) * p + b - It),
          W > 180 ? (W -= 360) : W < -180 && (W += 360),
          n.updateWorldTransformWith(
            S,
            y,
            It + W * a,
            n.ascaleX,
            n.ascaleY,
            n.ashearX,
            n.ashearY
          );
      }
    }
    class di extends jn {
      constructor(t) {
        super(t, 0, !1),
          (this.bones = new Array()),
          (this._target = null),
          (this.bendDirection = 1),
          (this.compress = !1),
          (this.stretch = !1),
          (this.uniform = !1),
          (this.mix = 1),
          (this.softness = 0);
      }
      set target(t) {
        this._target = t;
      }
      get target() {
        if (this._target) return this._target;
        throw new Error("BoneData not set.");
      }
    }
    class fi extends jn {
      constructor(t) {
        super(t, 0, !1),
          (this.bones = new Array()),
          (this._target = null),
          (this.positionMode = dt.Fixed),
          (this.spacingMode = kt.Fixed),
          (this.rotateMode = pt.Chain),
          (this.offsetRotation = 0),
          (this.position = 0),
          (this.spacing = 0),
          (this.mixRotate = 0),
          (this.mixX = 0),
          (this.mixY = 0);
      }
      set target(t) {
        this._target = t;
      }
      get target() {
        if (this._target) return this._target;
        throw new Error("SlotData not set.");
      }
    }
    var kt = ((c) => (
      (c[(c.Length = 0)] = "Length"),
      (c[(c.Fixed = 1)] = "Fixed"),
      (c[(c.Percent = 2)] = "Percent"),
      (c[(c.Proportional = 3)] = "Proportional"),
      c
    ))(kt || {});
    const Le = class {
      constructor(c, t) {
        if (
          ((this.position = 0),
          (this.spacing = 0),
          (this.mixRotate = 0),
          (this.mixX = 0),
          (this.mixY = 0),
          (this.spaces = new Array()),
          (this.positions = new Array()),
          (this.world = new Array()),
          (this.curves = new Array()),
          (this.lengths = new Array()),
          (this.segments = new Array()),
          (this.active = !1),
          !c)
        )
          throw new Error("data cannot be null.");
        if (!t) throw new Error("skeleton cannot be null.");
        (this.data = c), (this.bones = new Array());
        for (let e = 0, i = c.bones.length; e < i; e++) {
          const r = t.findBone(c.bones[e].name);
          if (!r) throw new Error(`Couldn't find bone ${c.bones[e].name}.`);
          this.bones.push(r);
        }
        const n = t.findSlot(c.target.name);
        if (!n) throw new Error(`Couldn't find target bone ${c.target.name}`);
        (this.target = n),
          (this.position = c.position),
          (this.spacing = c.spacing),
          (this.mixRotate = c.mixRotate),
          (this.mixX = c.mixX),
          (this.mixY = c.mixY);
      }
      isActive() {
        return this.active;
      }
      update() {
        const c = this.target.getAttachment();
        if (!(c instanceof ln)) return;
        const t = this.mixRotate,
          n = this.mixX,
          e = this.mixY;
        if (t == 0 && n == 0 && e == 0) return;
        const i = this.data,
          r = i.rotateMode == pt.Tangent,
          h = i.rotateMode == pt.ChainScale,
          l = this.bones,
          s = l.length,
          a = r ? s : s + 1,
          o = v.setArraySize(this.spaces, a),
          d = h ? (this.lengths = v.setArraySize(this.lengths, s)) : [],
          f = this.spacing;
        switch (i.spacingMode) {
          case kt.Percent:
            if (h)
              for (let p = 0, S = a - 1; p < S; p++) {
                const y = l[p],
                  M = y.data.length;
                if (M < Le.epsilon) d[p] = 0;
                else {
                  const T = M * y.matrix.a,
                    k = M * y.matrix.b;
                  d[p] = Math.sqrt(T * T + k * k);
                }
              }
            v.arrayFill(o, 1, a, f);
            break;
          case kt.Proportional:
            let w = 0;
            for (let p = 0, S = a - 1; p < S; ) {
              const y = l[p],
                M = y.data.length;
              if (M < Le.epsilon) h && (d[p] = 0), (o[++p] = f);
              else {
                const T = M * y.matrix.a,
                  k = M * y.matrix.b,
                  I = Math.sqrt(T * T + k * k);
                h && (d[p] = I), (o[++p] = I), (w += I);
              }
            }
            if (w > 0) {
              w = (a / w) * f;
              for (let p = 1; p < a; p++) o[p] *= w;
            }
            break;
          default:
            const b = i.spacingMode == kt.Length;
            for (let p = 0, S = a - 1; p < S; ) {
              const y = l[p],
                M = y.data.length;
              if (M < Le.epsilon) h && (d[p] = 0), (o[++p] = f);
              else {
                const T = M * y.matrix.a,
                  k = M * y.matrix.b,
                  I = Math.sqrt(T * T + k * k);
                h && (d[p] = I), (o[++p] = ((b ? M + f : f) * I) / M);
              }
            }
        }
        const u = this.computeWorldPositions(c, a, r);
        let m = u[0],
          g = u[1],
          x = i.offsetRotation,
          E = !1;
        if (x == 0) E = i.rotateMode == pt.Chain;
        else {
          E = !1;
          const w = this.target.bone.matrix;
          x *= w.a * w.d - w.b * w.c > 0 ? C.degRad : -C.degRad;
        }
        for (let w = 0, b = 3; w < s; w++, b += 3) {
          const p = l[w],
            S = p.matrix;
          (S.tx += (m - S.tx) * n), (S.ty += (g - S.ty) * e);
          const y = u[b],
            M = u[b + 1],
            T = y - m,
            k = M - g;
          if (h) {
            const I = d[w];
            if (I != 0) {
              const R = (Math.sqrt(T * T + k * k) / I - 1) * t + 1;
              (S.a *= R), (S.b *= R);
            }
          }
          if (((m = y), (g = M), t > 0)) {
            const I = S.a,
              R = S.c,
              V = S.b,
              F = S.d;
            let B = 0,
              Y = 0,
              N = 0;
            if (
              (r
                ? (B = u[b - 1])
                : o[w + 1] == 0
                ? (B = u[b + 2])
                : (B = Math.atan2(k, T)),
              (B -= Math.atan2(V, I)),
              E)
            ) {
              (Y = Math.cos(B)), (N = Math.sin(B));
              const q = p.data.length;
              (m += (q * (Y * I - N * V) - T) * t),
                (g += (q * (N * I + Y * V) - k) * t);
            } else B += x;
            B > C.PI ? (B -= C.PI2) : B < -C.PI && (B += C.PI2),
              (B *= t),
              (Y = Math.cos(B)),
              (N = Math.sin(B)),
              (S.a = Y * I - N * V),
              (S.c = Y * R - N * F),
              (S.b = N * I + Y * V),
              (S.d = N * R + Y * F);
          }
          p.updateAppliedTransform();
        }
      }
      computeWorldPositions(c, t, n) {
        const e = this.target;
        let i = this.position;
        const r = this.spaces,
          h = v.setArraySize(this.positions, t * 3 + 2);
        let l = this.world;
        const s = c.closed;
        let a = c.worldVerticesLength,
          o = a / 6,
          d = Le.NONE;
        if (!c.constantSpeed) {
          const q = c.lengths;
          o -= s ? 1 : 2;
          const z = q[o];
          this.data.positionMode == dt.Percent && (i *= z);
          let D;
          switch (this.data.spacingMode) {
            case kt.Percent:
              D = z;
              break;
            case kt.Proportional:
              D = z / t;
              break;
            default:
              D = 1;
          }
          l = v.setArraySize(this.world, 8);
          for (let X = 0, L = 0, O = 0; X < t; X++, L += 3) {
            const W = r[X] * D;
            i += W;
            let U = i;
            if (s) (U %= z), U < 0 && (U += z), (O = 0);
            else if (U < 0) {
              d != Le.BEFORE &&
                ((d = Le.BEFORE), c.computeWorldVertices(e, 2, 4, l, 0, 2)),
                this.addBeforePosition(U, l, 0, h, L);
              continue;
            } else if (U > z) {
              d != Le.AFTER &&
                ((d = Le.AFTER), c.computeWorldVertices(e, a - 6, 4, l, 0, 2)),
                this.addAfterPosition(U - z, l, 0, h, L);
              continue;
            }
            for (; ; O++) {
              const $ = q[O];
              if (!(U > $)) {
                if (O == 0) U /= $;
                else {
                  const G = q[O - 1];
                  U = (U - G) / ($ - G);
                }
                break;
              }
            }
            O != d &&
              ((d = O),
              s && O == o
                ? (c.computeWorldVertices(e, a - 4, 4, l, 0, 2),
                  c.computeWorldVertices(e, 0, 4, l, 4, 2))
                : c.computeWorldVertices(e, O * 6 + 2, 8, l, 0, 2)),
              this.addCurvePosition(
                U,
                l[0],
                l[1],
                l[2],
                l[3],
                l[4],
                l[5],
                l[6],
                l[7],
                h,
                L,
                n || (X > 0 && W == 0)
              );
          }
          return h;
        }
        s
          ? ((a += 2),
            (l = v.setArraySize(this.world, a)),
            c.computeWorldVertices(e, 2, a - 4, l, 0, 2),
            c.computeWorldVertices(e, 0, 2, l, a - 4, 2),
            (l[a - 2] = l[0]),
            (l[a - 1] = l[1]))
          : (o--,
            (a -= 4),
            (l = v.setArraySize(this.world, a)),
            c.computeWorldVertices(e, 2, a, l, 0, 2));
        const f = v.setArraySize(this.curves, o);
        let u = 0,
          m = l[0],
          g = l[1],
          x = 0,
          E = 0,
          w = 0,
          b = 0,
          p = 0,
          S = 0,
          y = 0,
          M = 0,
          T = 0,
          k = 0,
          I = 0,
          R = 0,
          V = 0,
          F = 0;
        for (let q = 0, z = 2; q < o; q++, z += 6)
          (x = l[z]),
            (E = l[z + 1]),
            (w = l[z + 2]),
            (b = l[z + 3]),
            (p = l[z + 4]),
            (S = l[z + 5]),
            (y = (m - x * 2 + w) * 0.1875),
            (M = (g - E * 2 + b) * 0.1875),
            (T = ((x - w) * 3 - m + p) * 0.09375),
            (k = ((E - b) * 3 - g + S) * 0.09375),
            (I = y * 2 + T),
            (R = M * 2 + k),
            (V = (x - m) * 0.75 + y + T * 0.16666667),
            (F = (E - g) * 0.75 + M + k * 0.16666667),
            (u += Math.sqrt(V * V + F * F)),
            (V += I),
            (F += R),
            (I += T),
            (R += k),
            (u += Math.sqrt(V * V + F * F)),
            (V += I),
            (F += R),
            (u += Math.sqrt(V * V + F * F)),
            (V += I + T),
            (F += R + k),
            (u += Math.sqrt(V * V + F * F)),
            (f[q] = u),
            (m = p),
            (g = S);
        this.data.positionMode == dt.Percent && (i *= u);
        let B;
        switch (this.data.spacingMode) {
          case kt.Percent:
            B = u;
            break;
          case kt.Proportional:
            B = u / t;
            break;
          default:
            B = 1;
        }
        const Y = this.segments;
        let N = 0;
        for (let q = 0, z = 0, D = 0, X = 0; q < t; q++, z += 3) {
          const L = r[q] * B;
          i += L;
          let O = i;
          if (s) (O %= u), O < 0 && (O += u), (D = 0);
          else if (O < 0) {
            this.addBeforePosition(O, l, 0, h, z);
            continue;
          } else if (O > u) {
            this.addAfterPosition(O - u, l, a - 4, h, z);
            continue;
          }
          for (; ; D++) {
            const W = f[D];
            if (!(O > W)) {
              if (D == 0) O /= W;
              else {
                const U = f[D - 1];
                O = (O - U) / (W - U);
              }
              break;
            }
          }
          if (D != d) {
            d = D;
            let W = D * 6;
            for (
              m = l[W],
                g = l[W + 1],
                x = l[W + 2],
                E = l[W + 3],
                w = l[W + 4],
                b = l[W + 5],
                p = l[W + 6],
                S = l[W + 7],
                y = (m - x * 2 + w) * 0.03,
                M = (g - E * 2 + b) * 0.03,
                T = ((x - w) * 3 - m + p) * 0.006,
                k = ((E - b) * 3 - g + S) * 0.006,
                I = y * 2 + T,
                R = M * 2 + k,
                V = (x - m) * 0.3 + y + T * 0.16666667,
                F = (E - g) * 0.3 + M + k * 0.16666667,
                N = Math.sqrt(V * V + F * F),
                Y[0] = N,
                W = 1;
              W < 8;
              W++
            )
              (V += I),
                (F += R),
                (I += T),
                (R += k),
                (N += Math.sqrt(V * V + F * F)),
                (Y[W] = N);
            (V += I),
              (F += R),
              (N += Math.sqrt(V * V + F * F)),
              (Y[8] = N),
              (V += I + T),
              (F += R + k),
              (N += Math.sqrt(V * V + F * F)),
              (Y[9] = N),
              (X = 0);
          }
          for (O *= N; ; X++) {
            const W = Y[X];
            if (!(O > W)) {
              if (X == 0) O /= W;
              else {
                const U = Y[X - 1];
                O = X + (O - U) / (W - U);
              }
              break;
            }
          }
          this.addCurvePosition(
            O * 0.1,
            m,
            g,
            x,
            E,
            w,
            b,
            p,
            S,
            h,
            z,
            n || (q > 0 && L == 0)
          );
        }
        return h;
      }
      addBeforePosition(c, t, n, e, i) {
        const r = t[n],
          h = t[n + 1],
          l = t[n + 2] - r,
          s = t[n + 3] - h,
          a = Math.atan2(s, l);
        (e[i] = r + c * Math.cos(a)),
          (e[i + 1] = h + c * Math.sin(a)),
          (e[i + 2] = a);
      }
      addAfterPosition(c, t, n, e, i) {
        const r = t[n + 2],
          h = t[n + 3],
          l = r - t[n],
          s = h - t[n + 1],
          a = Math.atan2(s, l);
        (e[i] = r + c * Math.cos(a)),
          (e[i + 1] = h + c * Math.sin(a)),
          (e[i + 2] = a);
      }
      addCurvePosition(c, t, n, e, i, r, h, l, s, a, o, d) {
        if (c == 0 || isNaN(c)) {
          (a[o] = t), (a[o + 1] = n), (a[o + 2] = Math.atan2(i - n, e - t));
          return;
        }
        const f = c * c,
          u = f * c,
          m = 1 - c,
          g = m * m,
          x = g * m,
          E = m * c,
          w = E * 3,
          b = m * w,
          p = w * c,
          S = t * x + e * b + r * p + l * u,
          y = n * x + i * b + h * p + s * u;
        (a[o] = S),
          (a[o + 1] = y),
          d &&
            (c < 0.001
              ? (a[o + 2] = Math.atan2(i - n, e - t))
              : (a[o + 2] = Math.atan2(
                  y - (n * g + i * E * 2 + h * f),
                  S - (t * g + e * E * 2 + r * f)
                )));
      }
    };
    let Sn = Le;
    (Sn.NONE = -1), (Sn.BEFORE = -2), (Sn.AFTER = -3), (Sn.epsilon = 1e-5);
    class ur {
      constructor(t, n) {
        if (
          ((this.darkColor = null),
          (this.attachment = null),
          (this.attachmentState = 0),
          (this.sequenceIndex = -1),
          (this.deform = new Array()),
          !t)
        )
          throw new Error("data cannot be null.");
        if (!n) throw new Error("bone cannot be null.");
        (this.data = t),
          (this.bone = n),
          (this.color = new _()),
          (this.darkColor = t.darkColor ? new _() : null),
          this.setToSetupPose(),
          (this.blendMode = this.data.blendMode);
      }
      getSkeleton() {
        return this.bone.skeleton;
      }
      getAttachment() {
        return this.attachment;
      }
      setAttachment(t) {
        this.attachment != t &&
          ((!(t instanceof we) ||
            !(this.attachment instanceof we) ||
            t.timelineAttachment != this.attachment.timelineAttachment) &&
            (this.deform.length = 0),
          (this.attachment = t),
          (this.sequenceIndex = -1));
      }
      setToSetupPose() {
        this.color.setFromColor(this.data.color),
          this.darkColor && this.darkColor.setFromColor(this.data.darkColor),
          this.data.attachmentName
            ? ((this.attachment = null),
              this.setAttachment(
                this.bone.skeleton.getAttachment(
                  this.data.index,
                  this.data.attachmentName
                )
              ))
            : (this.attachment = null);
      }
    }
    class mr {
      constructor(t, n) {
        if (
          ((this.mixRotate = 0),
          (this.mixX = 0),
          (this.mixY = 0),
          (this.mixScaleX = 0),
          (this.mixScaleY = 0),
          (this.mixShearY = 0),
          (this.temp = new un()),
          (this.active = !1),
          !t)
        )
          throw new Error("data cannot be null.");
        if (!n) throw new Error("skeleton cannot be null.");
        (this.data = t),
          (this.mixRotate = t.mixRotate),
          (this.mixX = t.mixX),
          (this.mixY = t.mixY),
          (this.mixScaleX = t.mixScaleX),
          (this.mixScaleY = t.mixScaleY),
          (this.mixShearY = t.mixShearY),
          (this.bones = new Array());
        for (let i = 0; i < t.bones.length; i++) {
          const r = n.findBone(t.bones[i].name);
          if (!r) throw new Error(`Couldn't find bone ${t.bones[i].name}.`);
          this.bones.push(r);
        }
        const e = n.findBone(t.target.name);
        if (!e) throw new Error(`Couldn't find target bone ${t.target.name}.`);
        this.target = e;
      }
      isActive() {
        return this.active;
      }
      update() {
        (this.mixRotate == 0 &&
          this.mixX == 0 &&
          this.mixY == 0 &&
          this.mixScaleX == 0 &&
          this.mixScaleX == 0 &&
          this.mixShearY == 0) ||
          (this.data.local
            ? this.data.relative
              ? this.applyRelativeLocal()
              : this.applyAbsoluteLocal()
            : this.data.relative
            ? this.applyRelativeWorld()
            : this.applyAbsoluteWorld());
      }
      applyAbsoluteWorld() {
        const t = this.mixRotate,
          n = this.mixX,
          e = this.mixY,
          i = this.mixScaleX,
          r = this.mixScaleY,
          h = this.mixShearY,
          l = n != 0 || e != 0,
          s = this.target,
          a = s.matrix,
          o = a.a,
          d = a.c,
          f = a.b,
          u = a.d,
          m = o * u - d * f > 0 ? C.degRad : -C.degRad,
          g = this.data.offsetRotation * m,
          x = this.data.offsetShearY * m,
          E = this.bones;
        for (let w = 0, b = E.length; w < b; w++) {
          const p = E[w],
            S = p.matrix;
          if (t != 0) {
            const y = S.a,
              M = S.c,
              T = S.b,
              k = S.d;
            let I = Math.atan2(f, o) - Math.atan2(T, y) + g;
            I > C.PI ? (I -= C.PI2) : I < -C.PI && (I += C.PI2), (I *= t);
            const R = Math.cos(I),
              V = Math.sin(I);
            (S.a = R * y - V * T),
              (S.c = R * M - V * k),
              (S.b = V * y + R * T),
              (S.d = V * M + R * k);
          }
          if (l) {
            const y = this.temp;
            s.localToWorld(y.set(this.data.offsetX, this.data.offsetY)),
              (S.tx += (y.x - S.tx) * n),
              (S.ty += (y.y - S.ty) * e);
          }
          if (i != 0) {
            let y = Math.sqrt(S.a * S.a + S.b * S.b);
            y != 0 &&
              (y =
                (y +
                  (Math.sqrt(o * o + f * f) - y + this.data.offsetScaleX) * i) /
                y),
              (S.a *= y),
              (S.b *= y);
          }
          if (r != 0) {
            let y = Math.sqrt(S.c * S.c + S.d * S.d);
            y != 0 &&
              (y =
                (y +
                  (Math.sqrt(d * d + u * u) - y + this.data.offsetScaleY) * r) /
                y),
              (S.c *= y),
              (S.d *= y);
          }
          if (h > 0) {
            const y = S.c,
              M = S.d,
              T = Math.atan2(M, y);
            let k =
              Math.atan2(u, d) - Math.atan2(f, o) - (T - Math.atan2(S.b, S.a));
            k > C.PI ? (k -= C.PI2) : k < -C.PI && (k += C.PI2),
              (k = T + (k + x) * h);
            const I = Math.sqrt(y * y + M * M);
            (S.c = Math.cos(k) * I), (S.d = Math.sin(k) * I);
          }
          p.updateAppliedTransform();
        }
      }
      applyRelativeWorld() {
        const t = this.mixRotate,
          n = this.mixX,
          e = this.mixY,
          i = this.mixScaleX,
          r = this.mixScaleY,
          h = this.mixShearY,
          l = n != 0 || e != 0,
          s = this.target,
          a = s.matrix,
          o = a.a,
          d = a.c,
          f = a.b,
          u = a.d,
          m = o * u - d * f > 0 ? C.degRad : -C.degRad,
          g = this.data.offsetRotation * m,
          x = this.data.offsetShearY * m,
          E = this.bones;
        for (let w = 0, b = E.length; w < b; w++) {
          const p = E[w],
            S = p.matrix;
          if (t != 0) {
            const y = S.a,
              M = S.c,
              T = S.b,
              k = S.d;
            let I = Math.atan2(f, o) + g;
            I > C.PI ? (I -= C.PI2) : I < -C.PI && (I += C.PI2), (I *= t);
            const R = Math.cos(I),
              V = Math.sin(I);
            (S.a = R * y - V * T),
              (S.c = R * M - V * k),
              (S.b = V * y + R * T),
              (S.d = V * M + R * k);
          }
          if (l) {
            const y = this.temp;
            s.localToWorld(y.set(this.data.offsetX, this.data.offsetY)),
              (S.tx += y.x * n),
              (S.ty += y.y * e);
          }
          if (i != 0) {
            const y =
              (Math.sqrt(o * o + f * f) - 1 + this.data.offsetScaleX) * i + 1;
            (S.a *= y), (S.b *= y);
          }
          if (r != 0) {
            const y =
              (Math.sqrt(d * d + u * u) - 1 + this.data.offsetScaleY) * r + 1;
            (S.c *= y), (S.d *= y);
          }
          if (h > 0) {
            let y = Math.atan2(u, d) - Math.atan2(f, o);
            y > C.PI ? (y -= C.PI2) : y < -C.PI && (y += C.PI2);
            const M = S.c,
              T = S.d;
            y = Math.atan2(T, M) + (y - C.PI / 2 + x) * h;
            const k = Math.sqrt(M * M + T * T);
            (S.c = Math.cos(y) * k), (S.d = Math.sin(y) * k);
          }
          p.updateAppliedTransform();
        }
      }
      applyAbsoluteLocal() {
        const t = this.mixRotate,
          n = this.mixX,
          e = this.mixY,
          i = this.mixScaleX,
          r = this.mixScaleY,
          h = this.mixShearY,
          l = this.target,
          s = this.bones;
        for (let a = 0, o = s.length; a < o; a++) {
          const d = s[a];
          let f = d.arotation;
          if (t != 0) {
            let w = l.arotation - f + this.data.offsetRotation;
            (w -= (16384 - ((16384.499999999996 - w / 360) | 0)) * 360),
              (f += w * t);
          }
          let u = d.ax,
            m = d.ay;
          (u += (l.ax - u + this.data.offsetX) * n),
            (m += (l.ay - m + this.data.offsetY) * e);
          let g = d.ascaleX,
            x = d.ascaleY;
          i != 0 &&
            g != 0 &&
            (g = (g + (l.ascaleX - g + this.data.offsetScaleX) * i) / g),
            r != 0 &&
              x != 0 &&
              (x = (x + (l.ascaleY - x + this.data.offsetScaleY) * r) / x);
          let E = d.ashearY;
          if (h != 0) {
            let w = l.ashearY - E + this.data.offsetShearY;
            (w -= (16384 - ((16384.499999999996 - w / 360) | 0)) * 360),
              (E += w * h);
          }
          d.updateWorldTransformWith(u, m, f, g, x, d.ashearX, E);
        }
      }
      applyRelativeLocal() {
        const t = this.mixRotate,
          n = this.mixX,
          e = this.mixY,
          i = this.mixScaleX,
          r = this.mixScaleY,
          h = this.mixShearY,
          l = this.target,
          s = this.bones;
        for (let a = 0, o = s.length; a < o; a++) {
          const d = s[a],
            f = d.arotation + (l.arotation + this.data.offsetRotation) * t,
            u = d.ax + (l.ax + this.data.offsetX) * n,
            m = d.ay + (l.ay + this.data.offsetY) * e,
            g = d.ascaleX * ((l.ascaleX - 1 + this.data.offsetScaleX) * i + 1),
            x = d.ascaleY * ((l.ascaleY - 1 + this.data.offsetScaleY) * r + 1),
            E = d.ashearY + (l.ashearY + this.data.offsetShearY) * h;
          d.updateWorldTransformWith(u, m, f, g, x, d.ashearX, E);
        }
      }
    }
    const Pn = class {
      constructor(c) {
        if (
          ((this._updateCache = new Array()),
          (this.skin = null),
          (this.scaleX = 1),
          (this.scaleY = 1),
          (this.x = 0),
          (this.y = 0),
          !c)
        )
          throw new Error("data cannot be null.");
        (this.data = c), (this.bones = new Array());
        for (let t = 0; t < c.bones.length; t++) {
          const n = c.bones[t];
          let e;
          if (!n.parent) e = new oi(n, this, null);
          else {
            const i = this.bones[n.parent.index];
            (e = new oi(n, this, i)), i.children.push(e);
          }
          this.bones.push(e);
        }
        (this.slots = new Array()), (this.drawOrder = new Array());
        for (let t = 0; t < c.slots.length; t++) {
          const n = c.slots[t],
            e = this.bones[n.boneData.index],
            i = new ur(n, e);
          this.slots.push(i), this.drawOrder.push(i);
        }
        this.ikConstraints = new Array();
        for (let t = 0; t < c.ikConstraints.length; t++) {
          const n = c.ikConstraints[t];
          this.ikConstraints.push(new fr(n, this));
        }
        this.transformConstraints = new Array();
        for (let t = 0; t < c.transformConstraints.length; t++) {
          const n = c.transformConstraints[t];
          this.transformConstraints.push(new mr(n, this));
        }
        this.pathConstraints = new Array();
        for (let t = 0; t < c.pathConstraints.length; t++) {
          const n = c.pathConstraints[t];
          this.pathConstraints.push(new Sn(n, this));
        }
        (this.color = new _(1, 1, 1, 1)), this.updateCache();
      }
      updateCache() {
        const c = this._updateCache;
        c.length = 0;
        const t = this.bones;
        for (let a = 0, o = t.length; a < o; a++) {
          const d = t[a];
          (d.sorted = d.data.skinRequired), (d.active = !d.sorted);
        }
        if (this.skin) {
          const a = this.skin.bones;
          for (let o = 0, d = this.skin.bones.length; o < d; o++) {
            let f = this.bones[a[o].index];
            do (f.sorted = !1), (f.active = !0), (f = f.parent);
            while (f);
          }
        }
        const n = this.ikConstraints,
          e = this.transformConstraints,
          i = this.pathConstraints,
          r = n.length,
          h = e.length,
          l = i.length,
          s = r + h + l;
        t: for (let a = 0; a < s; a++) {
          for (let o = 0; o < r; o++) {
            const d = n[o];
            if (d.data.order == a) {
              this.sortIkConstraint(d);
              continue t;
            }
          }
          for (let o = 0; o < h; o++) {
            const d = e[o];
            if (d.data.order == a) {
              this.sortTransformConstraint(d);
              continue t;
            }
          }
          for (let o = 0; o < l; o++) {
            const d = i[o];
            if (d.data.order == a) {
              this.sortPathConstraint(d);
              continue t;
            }
          }
        }
        for (let a = 0, o = t.length; a < o; a++) this.sortBone(t[a]);
      }
      sortIkConstraint(c) {
        if (
          ((c.active =
            c.target.isActive() &&
            (!c.data.skinRequired ||
              (this.skin && v.contains(this.skin.constraints, c.data, !0)))),
          !c.active)
        )
          return;
        const t = c.target;
        this.sortBone(t);
        const n = c.bones,
          e = n[0];
        if ((this.sortBone(e), n.length == 1))
          this._updateCache.push(c), this.sortReset(e.children);
        else {
          const i = n[n.length - 1];
          this.sortBone(i),
            this._updateCache.push(c),
            this.sortReset(e.children),
            (i.sorted = !0);
        }
      }
      sortPathConstraint(c) {
        if (
          ((c.active =
            c.target.bone.isActive() &&
            (!c.data.skinRequired ||
              (this.skin && v.contains(this.skin.constraints, c.data, !0)))),
          !c.active)
        )
          return;
        const t = c.target,
          n = t.data.index,
          e = t.bone;
        this.skin && this.sortPathConstraintAttachment(this.skin, n, e),
          this.data.defaultSkin &&
            this.data.defaultSkin != this.skin &&
            this.sortPathConstraintAttachment(this.data.defaultSkin, n, e);
        for (let l = 0, s = this.data.skins.length; l < s; l++)
          this.sortPathConstraintAttachment(this.data.skins[l], n, e);
        const i = t.getAttachment();
        i instanceof ln && this.sortPathConstraintAttachmentWith(i, e);
        const r = c.bones,
          h = r.length;
        for (let l = 0; l < h; l++) this.sortBone(r[l]);
        this._updateCache.push(c);
        for (let l = 0; l < h; l++) this.sortReset(r[l].children);
        for (let l = 0; l < h; l++) r[l].sorted = !0;
      }
      sortTransformConstraint(c) {
        if (
          ((c.active =
            c.target.isActive() &&
            (!c.data.skinRequired ||
              (this.skin && v.contains(this.skin.constraints, c.data, !0)))),
          !c.active)
        )
          return;
        this.sortBone(c.target);
        const t = c.bones,
          n = t.length;
        if (c.data.local)
          for (let e = 0; e < n; e++) {
            const i = t[e];
            this.sortBone(i.parent), this.sortBone(i);
          }
        else for (let e = 0; e < n; e++) this.sortBone(t[e]);
        this._updateCache.push(c);
        for (let e = 0; e < n; e++) this.sortReset(t[e].children);
        for (let e = 0; e < n; e++) t[e].sorted = !0;
      }
      sortPathConstraintAttachment(c, t, n) {
        const e = c.attachments[t];
        if (e)
          for (const i in e) this.sortPathConstraintAttachmentWith(e[i], n);
      }
      sortPathConstraintAttachmentWith(c, t) {
        if (!(c instanceof ln)) return;
        const n = c.bones;
        if (!n) this.sortBone(t);
        else {
          const e = this.bones;
          for (let i = 0, r = n.length; i < r; ) {
            let h = n[i++];
            for (h += i; i < h; ) this.sortBone(e[n[i++]]);
          }
        }
      }
      sortBone(c) {
        if (!c || c.sorted) return;
        const t = c.parent;
        t && this.sortBone(t), (c.sorted = !0), this._updateCache.push(c);
      }
      sortReset(c) {
        for (let t = 0, n = c.length; t < n; t++) {
          const e = c[t];
          e.active && (e.sorted && this.sortReset(e.children), (e.sorted = !1));
        }
      }
      updateWorldTransform() {
        const c = this.bones;
        for (let n = 0, e = c.length; n < e; n++) {
          const i = c[n];
          (i.ax = i.x),
            (i.ay = i.y),
            (i.arotation = i.rotation),
            (i.ascaleX = i.scaleX),
            (i.ascaleY = i.scaleY),
            (i.ashearX = i.shearX),
            (i.ashearY = i.shearY);
        }
        const t = this._updateCache;
        for (let n = 0, e = t.length; n < e; n++) t[n].update();
      }
      updateWorldTransformWith(c) {
        const t = this.getRootBone(),
          n = c.matrix.a,
          e = c.matrix.c,
          i = c.matrix.b,
          r = c.matrix.d;
        (t.matrix.tx = n * this.x + e * this.y + c.worldX),
          (t.matrix.ty = i * this.x + r * this.y + c.worldY);
        const h = t.rotation + 90 + t.shearY,
          l = C.cosDeg(t.rotation + t.shearX) * t.scaleX,
          s = C.cosDeg(h) * t.scaleY,
          a = C.sinDeg(t.rotation + t.shearX) * t.scaleX,
          o = C.sinDeg(h) * t.scaleY,
          d = this.scaleX,
          f = zt.yDown ? -this.scaleY : this.scaleY;
        (t.matrix.a = (n * l + e * a) * d),
          (t.matrix.c = (n * s + e * o) * d),
          (t.matrix.b = (i * l + r * a) * f),
          (t.matrix.d = (i * s + r * o) * f);
        const u = this._updateCache;
        for (let m = 0, g = u.length; m < g; m++) {
          const x = u[m];
          x != t && x.update();
        }
      }
      setToSetupPose() {
        this.setBonesToSetupPose(), this.setSlotsToSetupPose();
      }
      setBonesToSetupPose() {
        const c = this.bones;
        for (let i = 0, r = c.length; i < r; i++) c[i].setToSetupPose();
        const t = this.ikConstraints;
        for (let i = 0, r = t.length; i < r; i++) {
          const h = t[i];
          (h.mix = h.data.mix),
            (h.softness = h.data.softness),
            (h.bendDirection = h.data.bendDirection),
            (h.compress = h.data.compress),
            (h.stretch = h.data.stretch);
        }
        const n = this.transformConstraints;
        for (let i = 0, r = n.length; i < r; i++) {
          const h = n[i],
            l = h.data;
          (h.mixRotate = l.mixRotate),
            (h.mixX = l.mixX),
            (h.mixY = l.mixY),
            (h.mixScaleX = l.mixScaleX),
            (h.mixScaleY = l.mixScaleY),
            (h.mixShearY = l.mixShearY);
        }
        const e = this.pathConstraints;
        for (let i = 0, r = e.length; i < r; i++) {
          const h = e[i],
            l = h.data;
          (h.position = l.position),
            (h.spacing = l.spacing),
            (h.mixRotate = l.mixRotate),
            (h.mixX = l.mixX),
            (h.mixY = l.mixY);
        }
      }
      setSlotsToSetupPose() {
        const c = this.slots;
        v.arrayCopy(c, 0, this.drawOrder, 0, c.length);
        for (let t = 0, n = c.length; t < n; t++) c[t].setToSetupPose();
      }
      getRootBone() {
        return this.bones.length == 0 ? null : this.bones[0];
      }
      findBone(c) {
        if (!c) throw new Error("boneName cannot be null.");
        const t = this.bones;
        for (let n = 0, e = t.length; n < e; n++) {
          const i = t[n];
          if (i.data.name == c) return i;
        }
        return null;
      }
      findBoneIndex(c) {
        if (!c) throw new Error("boneName cannot be null.");
        const t = this.bones;
        for (let n = 0, e = t.length; n < e; n++)
          if (t[n].data.name == c) return n;
        return -1;
      }
      findSlot(c) {
        if (!c) throw new Error("slotName cannot be null.");
        const t = this.slots;
        for (let n = 0, e = t.length; n < e; n++) {
          const i = t[n];
          if (i.data.name == c) return i;
        }
        return null;
      }
      findSlotIndex(c) {
        if (!c) throw new Error("slotName cannot be null.");
        const t = this.slots;
        for (let n = 0, e = t.length; n < e; n++)
          if (t[n].data.name == c) return n;
        return -1;
      }
      setSkinByName(c) {
        const t = this.data.findSkin(c);
        if (!t) throw new Error(`Skin not found: ${c}`);
        this.setSkin(t);
      }
      setSkin(c) {
        if (c != this.skin) {
          if (c)
            if (this.skin) c.attachAll(this, this.skin);
            else {
              const t = this.slots;
              for (let n = 0, e = t.length; n < e; n++) {
                const i = t[n],
                  r = i.data.attachmentName;
                if (r) {
                  const h = c.getAttachment(n, r);
                  h && i.setAttachment(h);
                }
              }
            }
          (this.skin = c), this.updateCache();
        }
      }
      getAttachmentByName(c, t) {
        const n = this.data.findSlot(c);
        if (!n) throw new Error(`Can't find slot with name ${c}`);
        return this.getAttachment(n.index, t);
      }
      getAttachment(c, t) {
        if (!t) throw new Error("attachmentName cannot be null.");
        if (this.skin) {
          const n = this.skin.getAttachment(c, t);
          if (n) return n;
        }
        return this.data.defaultSkin
          ? this.data.defaultSkin.getAttachment(c, t)
          : null;
      }
      setAttachment(c, t) {
        if (!c) throw new Error("slotName cannot be null.");
        const n = this.slots;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.data.name == c) {
            let h = null;
            if (t && ((h = this.getAttachment(e, t)), !h))
              throw new Error(`Attachment not found: ${t}, for slot: ${c}`);
            r.setAttachment(h);
            return;
          }
        }
        throw new Error(`Slot not found: ${c}`);
      }
      findIkConstraint(c) {
        if (!c) throw new Error("constraintName cannot be null.");
        const t = this.ikConstraints;
        for (let n = 0, e = t.length; n < e; n++) {
          const i = t[n];
          if (i.data.name == c) return i;
        }
        return null;
      }
      findTransformConstraint(c) {
        if (!c) throw new Error("constraintName cannot be null.");
        const t = this.transformConstraints;
        for (let n = 0, e = t.length; n < e; n++) {
          const i = t[n];
          if (i.data.name == c) return i;
        }
        return null;
      }
      findPathConstraint(c) {
        if (!c) throw new Error("constraintName cannot be null.");
        const t = this.pathConstraints;
        for (let n = 0, e = t.length; n < e; n++) {
          const i = t[n];
          if (i.data.name == c) return i;
        }
        return null;
      }
      getBoundsRect() {
        const c = new un(),
          t = new un();
        return (
          this.getBounds(c, t), { x: c.x, y: c.y, width: t.x, height: t.y }
        );
      }
      getBounds(c, t, n = new Array(2)) {
        if (!c) throw new Error("offset cannot be null.");
        if (!t) throw new Error("size cannot be null.");
        const e = this.drawOrder;
        let i = Number.POSITIVE_INFINITY,
          r = Number.POSITIVE_INFINITY,
          h = Number.NEGATIVE_INFINITY,
          l = Number.NEGATIVE_INFINITY;
        for (let s = 0, a = e.length; s < a; s++) {
          const o = e[s];
          if (!o.bone.active) continue;
          let d = 0,
            f = null;
          const u = o.getAttachment();
          if (u instanceof it)
            (d = 8),
              (f = v.setArraySize(n, d, 0)),
              u.computeWorldVertices(o, f, 0, 2);
          else if (u instanceof on) {
            const m = u;
            (d = m.worldVerticesLength),
              (f = v.setArraySize(n, d, 0)),
              m.computeWorldVertices(o, 0, d, f, 0, 2);
          }
          if (f)
            for (let m = 0, g = f.length; m < g; m += 2) {
              const x = f[m],
                E = f[m + 1];
              (i = Math.min(i, x)),
                (r = Math.min(r, E)),
                (h = Math.max(h, x)),
                (l = Math.max(l, E));
            }
        }
        c.set(i, r), t.set(h - i, l - r);
      }
      get flipX() {
        return this.scaleX == -1;
      }
      set flipX(c) {
        Pn.deprecatedWarning1 ||
          ((Pn.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY"
          )),
          (this.scaleX = c ? 1 : -1);
      }
      get flipY() {
        return this.scaleY == -1;
      }
      set flipY(c) {
        Pn.deprecatedWarning1 ||
          ((Pn.deprecatedWarning1 = !0),
          console.warn(
            "Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY"
          )),
          (this.scaleY = c ? 1 : -1);
      }
    };
    let ui = Pn;
    ui.deprecatedWarning1 = !1;
    class mi {
      constructor() {
        (this.name = null),
          (this.bones = new Array()),
          (this.slots = new Array()),
          (this.skins = new Array()),
          (this.defaultSkin = null),
          (this.events = new Array()),
          (this.animations = new Array()),
          (this.ikConstraints = new Array()),
          (this.transformConstraints = new Array()),
          (this.pathConstraints = new Array()),
          (this.x = 0),
          (this.y = 0),
          (this.width = 0),
          (this.height = 0),
          (this.version = null),
          (this.hash = null),
          (this.fps = 0),
          (this.imagesPath = null),
          (this.audioPath = null);
      }
      findBone(t) {
        if (!t) throw new Error("boneName cannot be null.");
        const n = this.bones;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.name == t) return r;
        }
        return null;
      }
      findBoneIndex(t) {
        if (!t) throw new Error("boneName cannot be null.");
        const n = this.bones;
        for (let e = 0, i = n.length; e < i; e++) if (n[e].name == t) return e;
        return -1;
      }
      findSlot(t) {
        if (!t) throw new Error("slotName cannot be null.");
        const n = this.slots;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.name == t) return r;
        }
        return null;
      }
      findSlotIndex(t) {
        if (!t) throw new Error("slotName cannot be null.");
        const n = this.slots;
        for (let e = 0, i = n.length; e < i; e++) if (n[e].name == t) return e;
        return -1;
      }
      findSkin(t) {
        if (!t) throw new Error("skinName cannot be null.");
        const n = this.skins;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.name == t) return r;
        }
        return null;
      }
      findEvent(t) {
        if (!t) throw new Error("eventDataName cannot be null.");
        const n = this.events;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.name == t) return r;
        }
        return null;
      }
      findAnimation(t) {
        if (!t) throw new Error("animationName cannot be null.");
        const n = this.animations;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.name == t) return r;
        }
        return null;
      }
      findIkConstraint(t) {
        if (!t) throw new Error("constraintName cannot be null.");
        const n = this.ikConstraints;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.name == t) return r;
        }
        return null;
      }
      findTransformConstraint(t) {
        if (!t) throw new Error("constraintName cannot be null.");
        const n = this.transformConstraints;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.name == t) return r;
        }
        return null;
      }
      findPathConstraint(t) {
        if (!t) throw new Error("constraintName cannot be null.");
        const n = this.pathConstraints;
        for (let e = 0, i = n.length; e < i; e++) {
          const r = n[e];
          if (r.name == t) return r;
        }
        return null;
      }
      findPathConstraintIndex(t) {
        if (t == null) throw new Error("pathConstraintName cannot be null.");
        const n = this.pathConstraints;
        for (let e = 0, i = n.length; e < i; e++) if (n[e].name == t) return e;
        return -1;
      }
    }
    class gi {
      constructor(t, n, e) {
        if (
          ((this.index = 0),
          (this.color = new _(1, 1, 1, 1)),
          (this.darkColor = null),
          (this.attachmentName = null),
          (this.blendMode = H.BLEND_MODES.NORMAL),
          t < 0)
        )
          throw new Error("index must be >= 0.");
        if (!n) throw new Error("name cannot be null.");
        if (!e) throw new Error("boneData cannot be null.");
        (this.index = t), (this.name = n), (this.boneData = e);
      }
    }
    class xi extends jn {
      constructor(t) {
        super(t, 0, !1),
          (this.bones = new Array()),
          (this._target = null),
          (this.mixRotate = 0),
          (this.mixX = 0),
          (this.mixY = 0),
          (this.mixScaleX = 0),
          (this.mixScaleY = 0),
          (this.mixShearY = 0),
          (this.offsetRotation = 0),
          (this.offsetX = 0),
          (this.offsetY = 0),
          (this.offsetScaleX = 0),
          (this.offsetScaleY = 0),
          (this.offsetShearY = 0),
          (this.relative = !1),
          (this.local = !1);
      }
      set target(t) {
        this._target = t;
      }
      get target() {
        if (this._target) return this._target;
        throw new Error("BoneData not set.");
      }
    }
    class pi {
      constructor(t, n, e) {
        (this.slotIndex = t), (this.name = n), (this.attachment = e);
      }
    }
    class Zn {
      constructor(t) {
        if (
          ((this.attachments = new Array()),
          (this.bones = Array()),
          (this.constraints = new Array()),
          !t)
        )
          throw new Error("name cannot be null.");
        this.name = t;
      }
      setAttachment(t, n, e) {
        if (!e) throw new Error("attachment cannot be null.");
        const i = this.attachments;
        t >= i.length && (i.length = t + 1), i[t] || (i[t] = {}), (i[t][n] = e);
      }
      addSkin(t) {
        for (let e = 0; e < t.bones.length; e++) {
          const i = t.bones[e];
          let r = !1;
          for (let h = 0; h < this.bones.length; h++)
            if (this.bones[h] == i) {
              r = !0;
              break;
            }
          r || this.bones.push(i);
        }
        for (let e = 0; e < t.constraints.length; e++) {
          const i = t.constraints[e];
          let r = !1;
          for (let h = 0; h < this.constraints.length; h++)
            if (this.constraints[h] == i) {
              r = !0;
              break;
            }
          r || this.constraints.push(i);
        }
        const n = t.getAttachments();
        for (let e = 0; e < n.length; e++) {
          const i = n[e];
          this.setAttachment(i.slotIndex, i.name, i.attachment);
        }
      }
      copySkin(t) {
        for (let e = 0; e < t.bones.length; e++) {
          const i = t.bones[e];
          let r = !1;
          for (let h = 0; h < this.bones.length; h++)
            if (this.bones[h] == i) {
              r = !0;
              break;
            }
          r || this.bones.push(i);
        }
        for (let e = 0; e < t.constraints.length; e++) {
          const i = t.constraints[e];
          let r = !1;
          for (let h = 0; h < this.constraints.length; h++)
            if (this.constraints[h] == i) {
              r = !0;
              break;
            }
          r || this.constraints.push(i);
        }
        const n = t.getAttachments();
        for (let e = 0; e < n.length; e++) {
          const i = n[e];
          i.attachment &&
            (i.attachment instanceof on
              ? ((i.attachment = i.attachment.newLinkedMesh()),
                this.setAttachment(i.slotIndex, i.name, i.attachment))
              : ((i.attachment = i.attachment.copy()),
                this.setAttachment(i.slotIndex, i.name, i.attachment)));
        }
      }
      getAttachment(t, n) {
        const e = this.attachments[t];
        return e ? e[n] : null;
      }
      removeAttachment(t, n) {
        const e = this.attachments[t];
        e && delete e[n];
      }
      getAttachments() {
        const t = new Array();
        for (let n = 0; n < this.attachments.length; n++) {
          const e = this.attachments[n];
          if (e)
            for (const i in e) {
              const r = e[i];
              r && t.push(new pi(n, i, r));
            }
        }
        return t;
      }
      getAttachmentsForSlot(t, n) {
        const e = this.attachments[t];
        if (e)
          for (const i in e) {
            const r = e[i];
            r && n.push(new pi(t, i, r));
          }
      }
      clear() {
        (this.attachments.length = 0),
          (this.bones.length = 0),
          (this.constraints.length = 0);
      }
      attachAll(t, n) {
        let e = 0;
        for (let i = 0; i < t.slots.length; i++) {
          const r = t.slots[i],
            h = r.getAttachment();
          if (h && e < n.attachments.length) {
            const l = n.attachments[e];
            for (const s in l) {
              const a = l[s];
              if (h == a) {
                const o = this.getAttachment(e, s);
                o && r.setAttachment(o);
                break;
              }
            }
          }
          e++;
        }
      }
    }
    class wi {
      constructor(t) {
        (this.ver40 = !1),
          (this.scale = 1),
          (this.linkedMeshes = new Array()),
          (this.attachmentLoader = t);
      }
      readSkeletonData(t) {
        const n = this.scale,
          e = new mi();
        e.name = "";
        const i = new Mn(t),
          r = i.readInt32(),
          h = i.readInt32();
        (e.hash = h == 0 && r == 0 ? null : h.toString(16) + r.toString(16)),
          (e.version = i.readString());
        const l = e.version.substr(0, 3);
        if (l !== "4.0" && l !== "4.1") {
          const d = `Spine 4.1 loader cant load version ${e.version}. Please configure your pixi-spine bundle`;
          console.error(d);
        }
        (this.ver40 = l === "4.0"),
          (e.x = i.readFloat()),
          (e.y = i.readFloat()),
          (e.width = i.readFloat()),
          (e.height = i.readFloat());
        const s = i.readBoolean();
        s &&
          ((e.fps = i.readFloat()),
          (e.imagesPath = i.readString()),
          (e.audioPath = i.readString()));
        let a = 0;
        a = i.readInt(!0);
        for (let d = 0; d < a; d++) {
          const f = i.readString();
          if (!f) throw new Error("String in string table must not be null.");
          i.strings.push(f);
        }
        a = i.readInt(!0);
        for (let d = 0; d < a; d++) {
          const f = i.readString();
          if (!f) throw new Error("Bone name must not be null.");
          const u = d == 0 ? null : e.bones[i.readInt(!0)],
            m = new li(d, f, u);
          (m.rotation = i.readFloat()),
            (m.x = i.readFloat() * n),
            (m.y = i.readFloat() * n),
            (m.scaleX = i.readFloat()),
            (m.scaleY = i.readFloat()),
            (m.shearX = i.readFloat()),
            (m.shearY = i.readFloat()),
            (m.length = i.readFloat() * n),
            (m.transformMode = i.readInt(!0)),
            (m.skinRequired = i.readBoolean()),
            s && _.rgba8888ToColor(m.color, i.readInt32()),
            e.bones.push(m);
        }
        a = i.readInt(!0);
        for (let d = 0; d < a; d++) {
          const f = i.readString();
          if (!f) throw new Error("Slot name must not be null.");
          const u = e.bones[i.readInt(!0)],
            m = new gi(d, f, u);
          _.rgba8888ToColor(m.color, i.readInt32());
          const g = i.readInt32();
          g != -1 && _.rgb888ToColor((m.darkColor = new _()), g),
            (m.attachmentName = i.readStringRef()),
            (m.blendMode = i.readInt(!0)),
            e.slots.push(m);
        }
        a = i.readInt(!0);
        for (let d = 0, f; d < a; d++) {
          const u = i.readString();
          if (!u) throw new Error("IK constraint data name must not be null.");
          const m = new di(u);
          (m.order = i.readInt(!0)),
            (m.skinRequired = i.readBoolean()),
            (f = i.readInt(!0));
          for (let g = 0; g < f; g++) m.bones.push(e.bones[i.readInt(!0)]);
          (m.target = e.bones[i.readInt(!0)]),
            (m.mix = i.readFloat()),
            (m.softness = i.readFloat() * n),
            (m.bendDirection = i.readByte()),
            (m.compress = i.readBoolean()),
            (m.stretch = i.readBoolean()),
            (m.uniform = i.readBoolean()),
            e.ikConstraints.push(m);
        }
        a = i.readInt(!0);
        for (let d = 0, f; d < a; d++) {
          const u = i.readString();
          if (!u)
            throw new Error("Transform constraint data name must not be null.");
          const m = new xi(u);
          (m.order = i.readInt(!0)),
            (m.skinRequired = i.readBoolean()),
            (f = i.readInt(!0));
          for (let g = 0; g < f; g++) m.bones.push(e.bones[i.readInt(!0)]);
          (m.target = e.bones[i.readInt(!0)]),
            (m.local = i.readBoolean()),
            (m.relative = i.readBoolean()),
            (m.offsetRotation = i.readFloat()),
            (m.offsetX = i.readFloat() * n),
            (m.offsetY = i.readFloat() * n),
            (m.offsetScaleX = i.readFloat()),
            (m.offsetScaleY = i.readFloat()),
            (m.offsetShearY = i.readFloat()),
            (m.mixRotate = i.readFloat()),
            (m.mixX = i.readFloat()),
            (m.mixY = i.readFloat()),
            (m.mixScaleX = i.readFloat()),
            (m.mixScaleY = i.readFloat()),
            (m.mixShearY = i.readFloat()),
            e.transformConstraints.push(m);
        }
        a = i.readInt(!0);
        for (let d = 0, f; d < a; d++) {
          const u = i.readString();
          if (!u)
            throw new Error("Path constraint data name must not be null.");
          const m = new fi(u);
          (m.order = i.readInt(!0)),
            (m.skinRequired = i.readBoolean()),
            (f = i.readInt(!0));
          for (let g = 0; g < f; g++) m.bones.push(e.bones[i.readInt(!0)]);
          (m.target = e.slots[i.readInt(!0)]),
            (m.positionMode = i.readInt(!0)),
            (m.spacingMode = i.readInt(!0)),
            (m.rotateMode = i.readInt(!0)),
            (m.offsetRotation = i.readFloat()),
            (m.position = i.readFloat()),
            m.positionMode == dt.Fixed && (m.position *= n),
            (m.spacing = i.readFloat()),
            (m.spacingMode == kt.Length || m.spacingMode == kt.Fixed) &&
              (m.spacing *= n),
            (m.mixRotate = i.readFloat()),
            (m.mixX = i.readFloat()),
            (m.mixY = i.readFloat()),
            e.pathConstraints.push(m);
        }
        const o = this.readSkin(i, e, !0, s);
        o && ((e.defaultSkin = o), e.skins.push(o));
        {
          let d = e.skins.length;
          for (v.setArraySize(e.skins, (a = d + i.readInt(!0))); d < a; d++) {
            const f = this.readSkin(i, e, !1, s);
            if (!f)
              throw new Error("readSkin() should not have returned null.");
            e.skins[d] = f;
          }
        }
        a = this.linkedMeshes.length;
        for (let d = 0; d < a; d++) {
          const f = this.linkedMeshes[d],
            u = f.skin ? e.findSkin(f.skin) : e.defaultSkin;
          if (!u) throw new Error("Not skin found for linked mesh.");
          if (!f.parent) throw new Error("Linked mesh parent must not be null");
          const m = u.getAttachment(f.slotIndex, f.parent);
          if (!m) throw new Error(`Parent mesh not found: ${f.parent}`);
          (f.mesh.timelineAttachment = f.inheritTimeline ? m : f.mesh),
            f.mesh.setParentMesh(m);
        }
        (this.linkedMeshes.length = 0), (a = i.readInt(!0));
        for (let d = 0; d < a; d++) {
          const f = i.readStringRef();
          if (!f) throw new Error();
          const u = new hi(f);
          (u.intValue = i.readInt(!1)),
            (u.floatValue = i.readFloat()),
            (u.stringValue = i.readString()),
            (u.audioPath = i.readString()),
            u.audioPath &&
              ((u.volume = i.readFloat()), (u.balance = i.readFloat())),
            e.events.push(u);
        }
        a = i.readInt(!0);
        for (let d = 0; d < a; d++) {
          const f = i.readString();
          if (!f) throw new Error("Animatio name must not be null.");
          e.animations.push(this.readAnimation(i, f, e));
        }
        return e;
      }
      readSkin(t, n, e, i) {
        let r = null,
          h = 0;
        if (e) {
          if (((h = t.readInt(!0)), h == 0)) return null;
          r = new Zn("default");
        } else {
          const l = t.readStringRef();
          if (!l) throw new Error("Skin name must not be null.");
          (r = new Zn(l)), (r.bones.length = t.readInt(!0));
          for (let s = 0, a = r.bones.length; s < a; s++)
            r.bones[s] = n.bones[t.readInt(!0)];
          for (let s = 0, a = t.readInt(!0); s < a; s++)
            r.constraints.push(n.ikConstraints[t.readInt(!0)]);
          for (let s = 0, a = t.readInt(!0); s < a; s++)
            r.constraints.push(n.transformConstraints[t.readInt(!0)]);
          for (let s = 0, a = t.readInt(!0); s < a; s++)
            r.constraints.push(n.pathConstraints[t.readInt(!0)]);
          h = t.readInt(!0);
        }
        for (let l = 0; l < h; l++) {
          const s = t.readInt(!0);
          for (let a = 0, o = t.readInt(!0); a < o; a++) {
            const d = t.readStringRef();
            if (!d) throw new Error("Attachment name must not be null");
            const f = this.readAttachment(t, n, r, s, d, i);
            f && r.setAttachment(s, d, f);
          }
        }
        return r;
      }
      readAttachment(t, n, e, i, r, h) {
        const l = this.scale;
        let s = t.readStringRef();
        switch ((s || (s = r), t.readByte())) {
          case Z.Region: {
            let a = t.readStringRef();
            const o = t.readFloat(),
              d = t.readFloat(),
              f = t.readFloat(),
              u = t.readFloat(),
              m = t.readFloat(),
              g = t.readFloat(),
              x = t.readFloat(),
              E = t.readInt32(),
              w = this.readSequence(t);
            a || (a = s);
            const b = this.attachmentLoader.newRegionAttachment(e, s, a, w);
            return b
              ? ((b.path = a),
                (b.x = d * l),
                (b.y = f * l),
                (b.scaleX = u),
                (b.scaleY = m),
                (b.rotation = o),
                (b.width = g * l),
                (b.height = x * l),
                _.rgba8888ToColor(b.color, E),
                (b.sequence = w),
                w == null && b.updateRegion(),
                b)
              : null;
          }
          case Z.BoundingBox: {
            const a = t.readInt(!0),
              o = this.readVertices(t, a),
              d = h ? t.readInt32() : 0,
              f = this.attachmentLoader.newBoundingBoxAttachment(e, s);
            return f
              ? ((f.worldVerticesLength = a << 1),
                (f.vertices = o.vertices),
                (f.bones = o.bones),
                h && _.rgba8888ToColor(f.color, d),
                f)
              : null;
          }
          case Z.Mesh: {
            let a = t.readStringRef();
            const o = t.readInt32(),
              d = t.readInt(!0),
              f = this.readFloatArray(t, d << 1, 1),
              u = this.readShortArray(t),
              m = this.readVertices(t, d),
              g = t.readInt(!0),
              x = this.readSequence(t);
            let E = [],
              w = 0,
              b = 0;
            h &&
              ((E = this.readShortArray(t)),
              (w = t.readFloat()),
              (b = t.readFloat())),
              a || (a = s);
            const p = this.attachmentLoader.newMeshAttachment(e, s, a, x);
            return p
              ? ((p.path = a),
                _.rgba8888ToColor(p.color, o),
                (p.bones = m.bones),
                (p.vertices = m.vertices),
                (p.worldVerticesLength = d << 1),
                (p.triangles = u),
                (p.regionUVs = new Float32Array(f)),
                (p.hullLength = g << 1),
                (p.sequence = x),
                h && ((p.edges = E), (p.width = w * l), (p.height = b * l)),
                p)
              : null;
          }
          case Z.LinkedMesh: {
            let a = t.readStringRef();
            const o = t.readInt32(),
              d = t.readStringRef(),
              f = t.readStringRef(),
              u = t.readBoolean(),
              m = this.readSequence(t);
            let g = 0,
              x = 0;
            h && ((g = t.readFloat()), (x = t.readFloat())), a || (a = s);
            const E = this.attachmentLoader.newMeshAttachment(e, s, a, m);
            return E
              ? ((E.path = a),
                _.rgba8888ToColor(E.color, o),
                (E.sequence = m),
                h && ((E.width = g * l), (E.height = x * l)),
                this.linkedMeshes.push(new Ur(E, d, i, f, u)),
                E)
              : null;
          }
          case Z.Path: {
            const a = t.readBoolean(),
              o = t.readBoolean(),
              d = t.readInt(!0),
              f = this.readVertices(t, d),
              u = v.newArray(d / 3, 0);
            for (let x = 0, E = u.length; x < E; x++) u[x] = t.readFloat() * l;
            const m = h ? t.readInt32() : 0,
              g = this.attachmentLoader.newPathAttachment(e, s);
            return g
              ? ((g.closed = a),
                (g.constantSpeed = o),
                (g.worldVerticesLength = d << 1),
                (g.vertices = f.vertices),
                (g.bones = f.bones),
                (g.lengths = u),
                h && _.rgba8888ToColor(g.color, m),
                g)
              : null;
          }
          case Z.Point: {
            const a = t.readFloat(),
              o = t.readFloat(),
              d = t.readFloat(),
              f = h ? t.readInt32() : 0,
              u = this.attachmentLoader.newPointAttachment(e, s);
            return u
              ? ((u.x = o * l),
                (u.y = d * l),
                (u.rotation = a),
                h && _.rgba8888ToColor(u.color, f),
                u)
              : null;
          }
          case Z.Clipping: {
            const a = t.readInt(!0),
              o = t.readInt(!0),
              d = this.readVertices(t, o),
              f = h ? t.readInt32() : 0,
              u = this.attachmentLoader.newClippingAttachment(e, s);
            return u
              ? ((u.endSlot = n.slots[a]),
                (u.worldVerticesLength = o << 1),
                (u.vertices = d.vertices),
                (u.bones = d.bones),
                h && _.rgba8888ToColor(u.color, f),
                u)
              : null;
          }
        }
        return null;
      }
      readSequence(t) {
        if (this.ver40 || !t.readBoolean()) return null;
        const n = new Un(t.readInt(!0));
        return (
          (n.start = t.readInt(!0)),
          (n.digits = t.readInt(!0)),
          (n.setupIndex = t.readInt(!0)),
          n
        );
      }
      readDeformTimelineType(t) {
        return this.ver40 ? gr : t.readByte();
      }
      readVertices(t, n) {
        const e = this.scale,
          i = n << 1,
          r = new zr();
        if (!t.readBoolean())
          return (r.vertices = this.readFloatArray(t, i, e)), r;
        const h = new Array(),
          l = new Array();
        for (let s = 0; s < n; s++) {
          const a = t.readInt(!0);
          l.push(a);
          for (let o = 0; o < a; o++)
            l.push(t.readInt(!0)),
              h.push(t.readFloat() * e),
              h.push(t.readFloat() * e),
              h.push(t.readFloat());
        }
        return (r.vertices = v.toFloatArray(h)), (r.bones = l), r;
      }
      readFloatArray(t, n, e) {
        const i = new Array(n);
        if (e == 1) for (let r = 0; r < n; r++) i[r] = t.readFloat();
        else for (let r = 0; r < n; r++) i[r] = t.readFloat() * e;
        return i;
      }
      readShortArray(t) {
        const n = t.readInt(!0),
          e = new Array(n);
        for (let i = 0; i < n; i++) e[i] = t.readShort();
        return e;
      }
      readAnimation(t, n, e) {
        t.readInt(!0);
        const i = new Array(),
          r = this.scale;
        for (let a = 0, o = t.readInt(!0); a < o; a++) {
          const d = t.readInt(!0);
          for (let f = 0, u = t.readInt(!0); f < u; f++) {
            const m = t.readByte(),
              g = t.readInt(!0),
              x = g - 1;
            switch (m) {
              case sa: {
                const E = new cn(g, d);
                for (let w = 0; w < g; w++)
                  E.setFrame(w, t.readFloat(), t.readStringRef());
                i.push(E);
                break;
              }
              case ia: {
                const E = t.readInt(!0),
                  w = new Hs(g, E, d);
                let b = t.readFloat(),
                  p = t.readUnsignedByte() / 255,
                  S = t.readUnsignedByte() / 255,
                  y = t.readUnsignedByte() / 255,
                  M = t.readUnsignedByte() / 255;
                for (
                  let T = 0, k = 0;
                  w.setFrame(T, b, p, S, y, M), T != x;
                  T++
                ) {
                  const I = t.readFloat(),
                    R = t.readUnsignedByte() / 255,
                    V = t.readUnsignedByte() / 255,
                    F = t.readUnsignedByte() / 255,
                    B = t.readUnsignedByte() / 255;
                  switch (t.readByte()) {
                    case Se:
                      w.setStepped(T);
                      break;
                    case ye:
                      et(t, w, k++, T, 0, b, I, p, R, 1),
                        et(t, w, k++, T, 1, b, I, S, V, 1),
                        et(t, w, k++, T, 2, b, I, y, F, 1),
                        et(t, w, k++, T, 3, b, I, M, B, 1);
                  }
                  (b = I), (p = R), (S = V), (y = F), (M = B);
                }
                i.push(w);
                break;
              }
              case ra: {
                const E = t.readInt(!0),
                  w = new Gs(g, E, d);
                let b = t.readFloat(),
                  p = t.readUnsignedByte() / 255,
                  S = t.readUnsignedByte() / 255,
                  y = t.readUnsignedByte() / 255;
                for (let M = 0, T = 0; w.setFrame(M, b, p, S, y), M != x; M++) {
                  const k = t.readFloat(),
                    I = t.readUnsignedByte() / 255,
                    R = t.readUnsignedByte() / 255,
                    V = t.readUnsignedByte() / 255;
                  switch (t.readByte()) {
                    case Se:
                      w.setStepped(M);
                      break;
                    case ye:
                      et(t, w, T++, M, 0, b, k, p, I, 1),
                        et(t, w, T++, M, 1, b, k, S, R, 1),
                        et(t, w, T++, M, 2, b, k, y, V, 1);
                  }
                  (b = k), (p = I), (S = R), (y = V);
                }
                i.push(w);
                break;
              }
              case aa: {
                const E = t.readInt(!0),
                  w = new Zs(g, E, d);
                let b = t.readFloat(),
                  p = t.readUnsignedByte() / 255,
                  S = t.readUnsignedByte() / 255,
                  y = t.readUnsignedByte() / 255,
                  M = t.readUnsignedByte() / 255,
                  T = t.readUnsignedByte() / 255,
                  k = t.readUnsignedByte() / 255,
                  I = t.readUnsignedByte() / 255;
                for (
                  let R = 0, V = 0;
                  w.setFrame(R, b, p, S, y, M, T, k, I), R != x;
                  R++
                ) {
                  const F = t.readFloat(),
                    B = t.readUnsignedByte() / 255,
                    Y = t.readUnsignedByte() / 255,
                    N = t.readUnsignedByte() / 255,
                    q = t.readUnsignedByte() / 255,
                    z = t.readUnsignedByte() / 255,
                    D = t.readUnsignedByte() / 255,
                    X = t.readUnsignedByte() / 255;
                  switch (t.readByte()) {
                    case Se:
                      w.setStepped(R);
                      break;
                    case ye:
                      et(t, w, V++, R, 0, b, F, p, B, 1),
                        et(t, w, V++, R, 1, b, F, S, Y, 1),
                        et(t, w, V++, R, 2, b, F, y, N, 1),
                        et(t, w, V++, R, 3, b, F, M, q, 1),
                        et(t, w, V++, R, 4, b, F, T, z, 1),
                        et(t, w, V++, R, 5, b, F, k, D, 1),
                        et(t, w, V++, R, 6, b, F, I, X, 1);
                  }
                  (b = F),
                    (p = B),
                    (S = Y),
                    (y = N),
                    (M = q),
                    (T = z),
                    (k = D),
                    (I = X);
                }
                i.push(w);
                break;
              }
              case oa: {
                const E = t.readInt(!0),
                  w = new Qs(g, E, d);
                let b = t.readFloat(),
                  p = t.readUnsignedByte() / 255,
                  S = t.readUnsignedByte() / 255,
                  y = t.readUnsignedByte() / 255,
                  M = t.readUnsignedByte() / 255,
                  T = t.readUnsignedByte() / 255,
                  k = t.readUnsignedByte() / 255;
                for (
                  let I = 0, R = 0;
                  w.setFrame(I, b, p, S, y, M, T, k), I != x;
                  I++
                ) {
                  const V = t.readFloat(),
                    F = t.readUnsignedByte() / 255,
                    B = t.readUnsignedByte() / 255,
                    Y = t.readUnsignedByte() / 255,
                    N = t.readUnsignedByte() / 255,
                    q = t.readUnsignedByte() / 255,
                    z = t.readUnsignedByte() / 255;
                  switch (t.readByte()) {
                    case Se:
                      w.setStepped(I);
                      break;
                    case ye:
                      et(t, w, R++, I, 0, b, V, p, F, 1),
                        et(t, w, R++, I, 1, b, V, S, B, 1),
                        et(t, w, R++, I, 2, b, V, y, Y, 1),
                        et(t, w, R++, I, 3, b, V, M, N, 1),
                        et(t, w, R++, I, 4, b, V, T, q, 1),
                        et(t, w, R++, I, 5, b, V, k, z, 1);
                  }
                  (b = V), (p = F), (S = B), (y = Y), (M = N), (T = q), (k = z);
                }
                i.push(w);
                break;
              }
              case la: {
                const E = new js(g, t.readInt(!0), d);
                let w = t.readFloat(),
                  b = t.readUnsignedByte() / 255;
                for (let p = 0, S = 0; E.setFrame(p, w, b), p != x; p++) {
                  const y = t.readFloat(),
                    M = t.readUnsignedByte() / 255;
                  switch (t.readByte()) {
                    case Se:
                      E.setStepped(p);
                      break;
                    case ye:
                      et(t, E, S++, p, 0, w, y, b, M, 1);
                  }
                  (w = y), (b = M);
                }
                i.push(E);
              }
            }
          }
        }
        for (let a = 0, o = t.readInt(!0); a < o; a++) {
          const d = t.readInt(!0);
          for (let f = 0, u = t.readInt(!0); f < u; f++) {
            const m = t.readByte(),
              g = t.readInt(!0),
              x = t.readInt(!0);
            switch (m) {
              case Hr:
                i.push(_e(t, new Rn(g, x, d), 1));
                break;
              case Gr:
                i.push(bi(t, new Ds(g, x, d), r));
                break;
              case jr:
                i.push(_e(t, new Ls(g, x, d), r));
                break;
              case Zr:
                i.push(_e(t, new _s(g, x, d), r));
                break;
              case Qr:
                i.push(bi(t, new Os(g, x, d), 1));
                break;
              case Kr:
                i.push(_e(t, new $s(g, x, d), 1));
                break;
              case Jr:
                i.push(_e(t, new Ws(g, x, d), 1));
                break;
              case ta:
                i.push(bi(t, new qs(g, x, d), 1));
                break;
              case ea:
                i.push(_e(t, new Us(g, x, d), 1));
                break;
              case na:
                i.push(_e(t, new zs(g, x, d), 1));
            }
          }
        }
        for (let a = 0, o = t.readInt(!0); a < o; a++) {
          const d = t.readInt(!0),
            f = t.readInt(!0),
            u = f - 1,
            m = new Js(f, t.readInt(!0), d);
          let g = t.readFloat(),
            x = t.readFloat(),
            E = t.readFloat() * r;
          for (
            let w = 0, b = 0;
            m.setFrame(
              w,
              g,
              x,
              E,
              t.readByte(),
              t.readBoolean(),
              t.readBoolean()
            ),
              w != u;
            w++
          ) {
            const p = t.readFloat(),
              S = t.readFloat(),
              y = t.readFloat() * r;
            switch (t.readByte()) {
              case Se:
                m.setStepped(w);
                break;
              case ye:
                et(t, m, b++, w, 0, g, p, x, S, 1),
                  et(t, m, b++, w, 1, g, p, E, y, r);
            }
            (g = p), (x = S), (E = y);
          }
          i.push(m);
        }
        for (let a = 0, o = t.readInt(!0); a < o; a++) {
          const d = t.readInt(!0),
            f = t.readInt(!0),
            u = f - 1,
            m = new ti(f, t.readInt(!0), d);
          let g = t.readFloat(),
            x = t.readFloat(),
            E = t.readFloat(),
            w = t.readFloat(),
            b = t.readFloat(),
            p = t.readFloat(),
            S = t.readFloat();
          for (
            let y = 0, M = 0;
            m.setFrame(y, g, x, E, w, b, p, S), y != u;
            y++
          ) {
            const T = t.readFloat(),
              k = t.readFloat(),
              I = t.readFloat(),
              R = t.readFloat(),
              V = t.readFloat(),
              F = t.readFloat(),
              B = t.readFloat();
            switch (t.readByte()) {
              case Se:
                m.setStepped(y);
                break;
              case ye:
                et(t, m, M++, y, 0, g, T, x, k, 1),
                  et(t, m, M++, y, 1, g, T, E, I, 1),
                  et(t, m, M++, y, 2, g, T, w, R, 1),
                  et(t, m, M++, y, 3, g, T, b, V, 1),
                  et(t, m, M++, y, 4, g, T, p, F, 1),
                  et(t, m, M++, y, 5, g, T, S, B, 1);
            }
            (g = T), (x = k), (E = I), (w = R), (b = V), (p = F), (S = B);
          }
          i.push(m);
        }
        for (let a = 0, o = t.readInt(!0); a < o; a++) {
          const d = t.readInt(!0),
            f = e.pathConstraints[d];
          for (let u = 0, m = t.readInt(!0); u < m; u++)
            switch (t.readByte()) {
              case ha:
                i.push(
                  _e(
                    t,
                    new ei(t.readInt(!0), t.readInt(!0), d),
                    f.positionMode == dt.Fixed ? r : 1
                  )
                );
                break;
              case da:
                i.push(
                  _e(
                    t,
                    new ni(t.readInt(!0), t.readInt(!0), d),
                    f.spacingMode == kt.Length || f.spacingMode == kt.Fixed
                      ? r
                      : 1
                  )
                );
                break;
              case fa:
                const g = new si(t.readInt(!0), t.readInt(!0), d);
                let x = t.readFloat(),
                  E = t.readFloat(),
                  w = t.readFloat(),
                  b = t.readFloat();
                for (
                  let p = 0, S = 0, y = g.getFrameCount() - 1;
                  g.setFrame(p, x, E, w, b), p != y;
                  p++
                ) {
                  const M = t.readFloat(),
                    T = t.readFloat(),
                    k = t.readFloat(),
                    I = t.readFloat();
                  switch (t.readByte()) {
                    case Se:
                      g.setStepped(p);
                      break;
                    case ye:
                      et(t, g, S++, p, 0, x, M, E, T, 1),
                        et(t, g, S++, p, 1, x, M, w, k, 1),
                        et(t, g, S++, p, 2, x, M, b, I, 1);
                  }
                  (x = M), (E = T), (w = k), (b = I);
                }
                i.push(g);
            }
        }
        for (let a = 0, o = t.readInt(!0); a < o; a++) {
          const d = e.skins[t.readInt(!0)];
          for (let f = 0, u = t.readInt(!0); f < u; f++) {
            const m = t.readInt(!0);
            for (let g = 0, x = t.readInt(!0); g < x; g++) {
              const E = t.readStringRef();
              if (!E) throw new Error("attachmentName must not be null.");
              const w = d.getAttachment(m, E),
                b = this.readDeformTimelineType(t),
                p = t.readInt(!0),
                S = p - 1;
              switch (b) {
                case gr: {
                  const y = w,
                    M = y.bones,
                    T = y.vertices,
                    k = M ? (T.length / 3) * 2 : T.length,
                    I = t.readInt(!0),
                    R = new Ks(p, I, m, y);
                  let V = t.readFloat();
                  for (let F = 0, B = 0; ; F++) {
                    let Y,
                      N = t.readInt(!0);
                    if (N == 0) Y = M ? v.newFloatArray(k) : T;
                    else {
                      Y = v.newFloatArray(k);
                      const z = t.readInt(!0);
                      if (((N += z), r == 1))
                        for (let D = z; D < N; D++) Y[D] = t.readFloat();
                      else for (let D = z; D < N; D++) Y[D] = t.readFloat() * r;
                      if (!M)
                        for (let D = 0, X = Y.length; D < X; D++) Y[D] += T[D];
                    }
                    if ((R.setFrame(F, V, Y), F == S)) break;
                    const q = t.readFloat();
                    switch (t.readByte()) {
                      case Se:
                        R.setStepped(F);
                        break;
                      case ye:
                        et(t, R, B++, F, 0, V, q, 0, 1, 1);
                    }
                    V = q;
                  }
                  i.push(R);
                  break;
                }
                case ca: {
                  const y = new bn(p, m, w);
                  for (let M = 0; M < p; M++) {
                    const T = t.readFloat(),
                      k = t.readInt32();
                    y.setFrame(M, T, Bs[k & 15], k >> 4, t.readFloat());
                  }
                  i.push(y);
                  break;
                }
              }
            }
          }
        }
        const h = t.readInt(!0);
        if (h > 0) {
          const a = new hn(h),
            o = e.slots.length;
          for (let d = 0; d < h; d++) {
            const f = t.readFloat(),
              u = t.readInt(!0),
              m = v.newArray(o, 0);
            for (let w = o - 1; w >= 0; w--) m[w] = -1;
            const g = v.newArray(o - u, 0);
            let x = 0,
              E = 0;
            for (let w = 0; w < u; w++) {
              const b = t.readInt(!0);
              for (; x != b; ) g[E++] = x++;
              m[x + t.readInt(!0)] = x++;
            }
            for (; x < o; ) g[E++] = x++;
            for (let w = o - 1; w >= 0; w--) m[w] == -1 && (m[w] = g[--E]);
            a.setFrame(d, f, m);
          }
          i.push(a);
        }
        const l = t.readInt(!0);
        if (l > 0) {
          const a = new vn(l);
          for (let o = 0; o < l; o++) {
            const d = t.readFloat(),
              f = e.events[t.readInt(!0)],
              u = new ci(d, f);
            (u.intValue = t.readInt(!1)),
              (u.floatValue = t.readFloat()),
              (u.stringValue = t.readBoolean()
                ? t.readString()
                : f.stringValue),
              u.data.audioPath &&
                ((u.volume = t.readFloat()), (u.balance = t.readFloat())),
              a.setFrame(o, u);
          }
          i.push(a);
        }
        let s = 0;
        for (let a = 0, o = i.length; a < o; a++)
          s = Math.max(s, i[a].getDuration());
        return new zn(n, i, s);
      }
    }
    wi.BlendModeValues = [
      H.BLEND_MODES.NORMAL,
      H.BLEND_MODES.ADD,
      H.BLEND_MODES.MULTIPLY,
      H.BLEND_MODES.SCREEN,
    ];
    let Ur = class {
      constructor(t, n, e, i, r) {
        (this.mesh = t),
          (this.skin = n),
          (this.slotIndex = e),
          (this.parent = i),
          (this.inheritTimeline = r);
      }
    };
    class zr {
      constructor(t = null, n = null) {
        (this.bones = t), (this.vertices = n);
      }
    }
    function _e(c, t, n) {
      let e = c.readFloat(),
        i = c.readFloat() * n;
      for (
        let r = 0, h = 0, l = t.getFrameCount() - 1;
        t.setFrame(r, e, i), r != l;
        r++
      ) {
        const s = c.readFloat(),
          a = c.readFloat() * n;
        switch (c.readByte()) {
          case Se:
            t.setStepped(r);
            break;
          case ye:
            et(c, t, h++, r, 0, e, s, i, a, n);
        }
        (e = s), (i = a);
      }
      return t;
    }
    function bi(c, t, n) {
      let e = c.readFloat(),
        i = c.readFloat() * n,
        r = c.readFloat() * n;
      for (
        let h = 0, l = 0, s = t.getFrameCount() - 1;
        t.setFrame(h, e, i, r), h != s;
        h++
      ) {
        const a = c.readFloat(),
          o = c.readFloat() * n,
          d = c.readFloat() * n;
        switch (c.readByte()) {
          case Se:
            t.setStepped(h);
            break;
          case ye:
            et(c, t, l++, h, 0, e, a, i, o, n),
              et(c, t, l++, h, 1, e, a, r, d, n);
        }
        (e = a), (i = o), (r = d);
      }
      return t;
    }
    function et(c, t, n, e, i, r, h, l, s, a) {
      t.setBezier(
        n,
        e,
        i,
        r,
        l,
        c.readFloat(),
        c.readFloat() * a,
        c.readFloat(),
        c.readFloat() * a,
        h,
        s
      );
    }
    const Hr = 0,
      Gr = 1,
      jr = 2,
      Zr = 3,
      Qr = 4,
      Kr = 5,
      Jr = 6,
      ta = 7,
      ea = 8,
      na = 9,
      sa = 0,
      ia = 1,
      ra = 2,
      aa = 3,
      oa = 4,
      la = 5,
      gr = 0,
      ca = 1,
      ha = 0,
      da = 1,
      fa = 2,
      Se = 1,
      ye = 2;
    class xr extends Cn {}
    class Qn {
      constructor(t) {
        (this.scale = 1),
          (this.linkedMeshes = new Array()),
          (this.attachmentLoader = t);
      }
      readSkeletonData(t) {
        const n = this.scale,
          e = new mi(),
          i = typeof t == "string" ? JSON.parse(t) : t,
          r = i.skeleton;
        if (r) {
          (e.hash = r.hash), (e.version = r.spine);
          const h = e.version.substr(0, 3);
          if (h !== "4.0" && h !== "4.1") {
            const l = `Spine 4.1 loader cant load version ${r.spine}. Please configure your pixi-spine bundle`;
            console.error(l);
          }
          (e.x = r.x),
            (e.y = r.y),
            (e.width = r.width),
            (e.height = r.height),
            (e.fps = r.fps),
            (e.imagesPath = r.images);
        }
        if (i.bones)
          for (let h = 0; h < i.bones.length; h++) {
            const l = i.bones[h];
            let s = null;
            const a = P(l, "parent", null);
            if (a != null && ((s = e.findBone(a)), s == null))
              throw new Error(`Parent bone not found: ${a}`);
            const o = new li(e.bones.length, l.name, s);
            (o.length = P(l, "length", 0) * n),
              (o.x = P(l, "x", 0) * n),
              (o.y = P(l, "y", 0) * n),
              (o.rotation = P(l, "rotation", 0)),
              (o.scaleX = P(l, "scaleX", 1)),
              (o.scaleY = P(l, "scaleY", 1)),
              (o.shearX = P(l, "shearX", 0)),
              (o.shearY = P(l, "shearY", 0)),
              (o.transformMode = v.enumValue(j, P(l, "transform", "Normal"))),
              (o.skinRequired = P(l, "skin", !1));
            const d = P(l, "color", null);
            d && o.color.setFromString(d), e.bones.push(o);
          }
        if (i.slots)
          for (let h = 0; h < i.slots.length; h++) {
            const l = i.slots[h],
              s = e.findBone(l.bone);
            if (!s)
              throw new Error(
                `Couldn't find bone ${l.bone} for slot ${l.name}`
              );
            const a = new gi(e.slots.length, l.name, s),
              o = P(l, "color", null);
            o && a.color.setFromString(o);
            const d = P(l, "dark", null);
            d && (a.darkColor = _.fromString(d)),
              (a.attachmentName = P(l, "attachment", null)),
              (a.blendMode = Qn.blendModeFromString(P(l, "blend", "normal"))),
              e.slots.push(a);
          }
        if (i.ik)
          for (let h = 0; h < i.ik.length; h++) {
            const l = i.ik[h],
              s = new di(l.name);
            (s.order = P(l, "order", 0)), (s.skinRequired = P(l, "skin", !1));
            for (let a = 0; a < l.bones.length; a++) {
              const o = l.bones[a],
                d = e.findBone(o);
              if (d == null) throw new Error(`IK bone not found: ${o}`);
              s.bones.push(d);
            }
            (s.target = e.findBone(l.target)),
              (s.mix = P(l, "mix", 1)),
              (s.softness = P(l, "softness", 0) * n),
              (s.bendDirection = P(l, "bendPositive", !0) ? 1 : -1),
              (s.compress = P(l, "compress", !1)),
              (s.stretch = P(l, "stretch", !1)),
              (s.uniform = P(l, "uniform", !1)),
              e.ikConstraints.push(s);
          }
        if (i.transform)
          for (let h = 0; h < i.transform.length; h++) {
            const l = i.transform[h],
              s = new xi(l.name);
            (s.order = P(l, "order", 0)), (s.skinRequired = P(l, "skin", !1));
            for (let d = 0; d < l.bones.length; d++) {
              const f = l.bones[d],
                u = e.findBone(f);
              if (!u)
                throw new Error(
                  `Couldn't find bone ${f} for transform constraint ${l.name}.`
                );
              s.bones.push(u);
            }
            const a = l.target,
              o = e.findBone(a);
            if (!o)
              throw new Error(
                `Couldn't find target bone ${a} for transform constraint ${l.name}.`
              );
            (s.target = o),
              (s.local = P(l, "local", !1)),
              (s.relative = P(l, "relative", !1)),
              (s.offsetRotation = P(l, "rotation", 0)),
              (s.offsetX = P(l, "x", 0) * n),
              (s.offsetY = P(l, "y", 0) * n),
              (s.offsetScaleX = P(l, "scaleX", 0)),
              (s.offsetScaleY = P(l, "scaleY", 0)),
              (s.offsetShearY = P(l, "shearY", 0)),
              (s.mixRotate = P(l, "mixRotate", 1)),
              (s.mixX = P(l, "mixX", 1)),
              (s.mixY = P(l, "mixY", s.mixX)),
              (s.mixScaleX = P(l, "mixScaleX", 1)),
              (s.mixScaleY = P(l, "mixScaleY", s.mixScaleX)),
              (s.mixShearY = P(l, "mixShearY", 1)),
              e.transformConstraints.push(s);
          }
        if (i.path)
          for (let h = 0; h < i.path.length; h++) {
            const l = i.path[h],
              s = new fi(l.name);
            (s.order = P(l, "order", 0)), (s.skinRequired = P(l, "skin", !1));
            for (let d = 0; d < l.bones.length; d++) {
              const f = l.bones[d],
                u = e.findBone(f);
              if (!u)
                throw new Error(
                  `Couldn't find bone ${f} for path constraint ${l.name}.`
                );
              s.bones.push(u);
            }
            const a = l.target,
              o = e.findSlot(a);
            if (!o)
              throw new Error(
                `Couldn't find target slot ${a} for path constraint ${l.name}.`
              );
            (s.target = o),
              (s.positionMode = v.enumValue(
                dt,
                P(l, "positionMode", "Percent")
              )),
              (s.spacingMode = v.enumValue(kt, P(l, "spacingMode", "Length"))),
              (s.rotateMode = v.enumValue(pt, P(l, "rotateMode", "Tangent"))),
              (s.offsetRotation = P(l, "rotation", 0)),
              (s.position = P(l, "position", 0)),
              s.positionMode == dt.Fixed && (s.position *= n),
              (s.spacing = P(l, "spacing", 0)),
              (s.spacingMode == kt.Length || s.spacingMode == kt.Fixed) &&
                (s.spacing *= n),
              (s.mixRotate = P(l, "mixRotate", 1)),
              (s.mixX = P(l, "mixX", 1)),
              (s.mixY = P(l, "mixY", s.mixX)),
              e.pathConstraints.push(s);
          }
        if (i.skins)
          for (let h = 0; h < i.skins.length; h++) {
            const l = i.skins[h],
              s = new Zn(l.name);
            if (l.bones)
              for (let a = 0; a < l.bones.length; a++) {
                const o = l.bones[a],
                  d = e.findBone(o);
                if (!d)
                  throw new Error(
                    `Couldn't find bone ${o} for skin ${l.name}.`
                  );
                s.bones.push(d);
              }
            if (l.ik)
              for (let a = 0; a < l.ik.length; a++) {
                const o = l.ik[a],
                  d = e.findIkConstraint(o);
                if (!d)
                  throw new Error(
                    `Couldn't find IK constraint ${o} for skin ${l.name}.`
                  );
                s.constraints.push(d);
              }
            if (l.transform)
              for (let a = 0; a < l.transform.length; a++) {
                const o = l.transform[a],
                  d = e.findTransformConstraint(o);
                if (!d)
                  throw new Error(
                    `Couldn't find transform constraint ${o} for skin ${l.name}.`
                  );
                s.constraints.push(d);
              }
            if (l.path)
              for (let a = 0; a < l.path.length; a++) {
                const o = l.path[a],
                  d = e.findPathConstraint(o);
                if (!d)
                  throw new Error(
                    `Couldn't find path constraint ${o} for skin ${l.name}.`
                  );
                s.constraints.push(d);
              }
            for (const a in l.attachments) {
              const o = e.findSlot(a);
              if (!o)
                throw new Error(`Couldn't find slot ${a} for skin ${l.name}.`);
              const d = l.attachments[a];
              for (const f in d) {
                const u = this.readAttachment(d[f], s, o.index, f, e);
                u && s.setAttachment(o.index, f, u);
              }
            }
            e.skins.push(s), s.name == "default" && (e.defaultSkin = s);
          }
        for (let h = 0, l = this.linkedMeshes.length; h < l; h++) {
          const s = this.linkedMeshes[h],
            a = s.skin ? e.findSkin(s.skin) : e.defaultSkin;
          if (!a) throw new Error(`Skin not found: ${s.skin}`);
          const o = a.getAttachment(s.slotIndex, s.parent);
          if (!o) throw new Error(`Parent mesh not found: ${s.parent}`);
          (s.mesh.timelineAttachment = s.inheritTimeline ? o : s.mesh),
            s.mesh.setParentMesh(o);
        }
        if (((this.linkedMeshes.length = 0), i.events))
          for (const h in i.events) {
            const l = i.events[h],
              s = new hi(h);
            (s.intValue = P(l, "int", 0)),
              (s.floatValue = P(l, "float", 0)),
              (s.stringValue = P(l, "string", "")),
              (s.audioPath = P(l, "audio", null)),
              s.audioPath &&
                ((s.volume = P(l, "volume", 1)),
                (s.balance = P(l, "balance", 0))),
              e.events.push(s);
          }
        if (i.animations)
          for (const h in i.animations) {
            const l = i.animations[h];
            this.readAnimation(l, h, e);
          }
        return e;
      }
      readAttachment(t, n, e, i, r) {
        const h = this.scale;
        switch (((i = P(t, "name", i)), P(t, "type", "region"))) {
          case "region": {
            const l = P(t, "path", i),
              s = this.readSequence(P(t, "sequence", null)),
              a = this.attachmentLoader.newRegionAttachment(n, i, l, s);
            if (!a) return null;
            (a.path = l),
              (a.x = P(t, "x", 0) * h),
              (a.y = P(t, "y", 0) * h),
              (a.scaleX = P(t, "scaleX", 1)),
              (a.scaleY = P(t, "scaleY", 1)),
              (a.rotation = P(t, "rotation", 0)),
              (a.width = t.width * h),
              (a.height = t.height * h),
              (a.sequence = s);
            const o = P(t, "color", null);
            return o && a.color.setFromString(o), a;
          }
          case "boundingbox": {
            const l = this.attachmentLoader.newBoundingBoxAttachment(n, i);
            if (!l) return null;
            this.readVertices(t, l, t.vertexCount << 1);
            const s = P(t, "color", null);
            return s && l.color.setFromString(s), l;
          }
          case "mesh":
          case "linkedmesh": {
            const l = P(t, "path", i),
              s = this.readSequence(P(t, "sequence", null)),
              a = this.attachmentLoader.newMeshAttachment(n, i, l, s);
            if (!a) return null;
            a.path = l;
            const o = P(t, "color", null);
            o && a.color.setFromString(o),
              (a.width = P(t, "width", 0) * h),
              (a.height = P(t, "height", 0) * h),
              (a.sequence = s);
            const d = P(t, "parent", null);
            if (d)
              return (
                this.linkedMeshes.push(
                  new ua(a, P(t, "skin", null), e, d, P(t, "timelines", !0))
                ),
                a
              );
            const f = t.uvs;
            return (
              this.readVertices(t, a, f.length),
              (a.triangles = t.triangles),
              (a.regionUVs = new Float32Array(f)),
              (a.edges = P(t, "edges", null)),
              (a.hullLength = P(t, "hull", 0) * 2),
              a
            );
          }
          case "path": {
            const l = this.attachmentLoader.newPathAttachment(n, i);
            if (!l) return null;
            (l.closed = P(t, "closed", !1)),
              (l.constantSpeed = P(t, "constantSpeed", !0));
            const s = t.vertexCount;
            this.readVertices(t, l, s << 1);
            const a = v.newArray(s / 3, 0);
            for (let d = 0; d < t.lengths.length; d++) a[d] = t.lengths[d] * h;
            l.lengths = a;
            const o = P(t, "color", null);
            return o && l.color.setFromString(o), l;
          }
          case "point": {
            const l = this.attachmentLoader.newPointAttachment(n, i);
            if (!l) return null;
            (l.x = P(t, "x", 0) * h),
              (l.y = P(t, "y", 0) * h),
              (l.rotation = P(t, "rotation", 0));
            const s = P(t, "color", null);
            return s && l.color.setFromString(s), l;
          }
          case "clipping": {
            const l = this.attachmentLoader.newClippingAttachment(n, i);
            if (!l) return null;
            const s = P(t, "end", null);
            if (s != null) {
              const d = r.findSlot(s);
              if (d == null)
                throw new Error(`Clipping end slot not found: ${s}`);
              l.endSlot = d;
            }
            const a = t.vertexCount;
            this.readVertices(t, l, a << 1);
            const o = P(t, "color", null);
            return o && l.color.setFromString(o), l;
          }
        }
        return null;
      }
      readSequence(t) {
        if (t == null) return null;
        const n = new Un(P(t, "count", 0));
        return (
          (n.start = P(t, "start", 1)),
          (n.digits = P(t, "digits", 0)),
          (n.setupIndex = P(t, "setup", 0)),
          n
        );
      }
      readVertices(t, n, e) {
        const i = this.scale;
        n.worldVerticesLength = e;
        const r = t.vertices;
        if (e == r.length) {
          const s = v.toFloatArray(r);
          if (i != 1) for (let a = 0, o = r.length; a < o; a++) s[a] *= i;
          n.vertices = s;
          return;
        }
        const h = new Array(),
          l = new Array();
        for (let s = 0, a = r.length; s < a; ) {
          const o = r[s++];
          l.push(o);
          for (let d = s + o * 4; s < d; s += 4)
            l.push(r[s]),
              h.push(r[s + 1] * i),
              h.push(r[s + 2] * i),
              h.push(r[s + 3]);
        }
        (n.bones = l), (n.vertices = v.toFloatArray(h));
      }
      readAnimation(t, n, e) {
        const i = this.scale,
          r = new Array();
        if (t.slots)
          for (const l in t.slots) {
            const s = t.slots[l],
              a = e.findSlot(l);
            if (!a) throw new Error(`Slot not found: ${l}`);
            const o = a.index;
            for (const d in s) {
              const f = s[d];
              if (!f) continue;
              const u = f.length;
              if (d == "attachment") {
                const m = new cn(u, o);
                for (let g = 0; g < u; g++) {
                  const x = f[g];
                  m.setFrame(g, P(x, "time", 0), P(x, "name", null));
                }
                r.push(m);
              } else if (d == "rgba") {
                const m = new Hs(u, u << 2, o);
                let g = f[0],
                  x = P(g, "time", 0),
                  E = _.fromString(g.color);
                for (let w = 0, b = 0; ; w++) {
                  m.setFrame(w, x, E.r, E.g, E.b, E.a);
                  const p = f[w + 1];
                  if (!p) {
                    m.shrink(b);
                    break;
                  }
                  const S = P(p, "time", 0),
                    y = _.fromString(p.color),
                    M = g.curve;
                  M &&
                    ((b = rt(M, m, b, w, 0, x, S, E.r, y.r, 1)),
                    (b = rt(M, m, b, w, 1, x, S, E.g, y.g, 1)),
                    (b = rt(M, m, b, w, 2, x, S, E.b, y.b, 1)),
                    (b = rt(M, m, b, w, 3, x, S, E.a, y.a, 1))),
                    (x = S),
                    (E = y),
                    (g = p);
                }
                r.push(m);
              } else if (d == "rgb") {
                const m = new Gs(u, u * 3, o);
                let g = f[0],
                  x = P(g, "time", 0),
                  E = _.fromString(g.color);
                for (let w = 0, b = 0; ; w++) {
                  m.setFrame(w, x, E.r, E.g, E.b);
                  const p = f[w + 1];
                  if (!p) {
                    m.shrink(b);
                    break;
                  }
                  const S = P(p, "time", 0),
                    y = _.fromString(p.color),
                    M = g.curve;
                  M &&
                    ((b = rt(M, m, b, w, 0, x, S, E.r, y.r, 1)),
                    (b = rt(M, m, b, w, 1, x, S, E.g, y.g, 1)),
                    (b = rt(M, m, b, w, 2, x, S, E.b, y.b, 1))),
                    (x = S),
                    (E = y),
                    (g = p);
                }
                r.push(m);
              } else if (d == "alpha") r.push(Pe(f, new js(u, u, o), 0, 1));
              else if (d == "rgba2") {
                const m = new Zs(u, u * 7, o);
                let g = f[0],
                  x = P(g, "time", 0),
                  E = _.fromString(g.light),
                  w = _.fromString(g.dark);
                for (let b = 0, p = 0; ; b++) {
                  m.setFrame(b, x, E.r, E.g, E.b, E.a, w.r, w.g, w.b);
                  const S = f[b + 1];
                  if (!S) {
                    m.shrink(p);
                    break;
                  }
                  const y = P(S, "time", 0),
                    M = _.fromString(S.light),
                    T = _.fromString(S.dark),
                    k = g.curve;
                  k &&
                    ((p = rt(k, m, p, b, 0, x, y, E.r, M.r, 1)),
                    (p = rt(k, m, p, b, 1, x, y, E.g, M.g, 1)),
                    (p = rt(k, m, p, b, 2, x, y, E.b, M.b, 1)),
                    (p = rt(k, m, p, b, 3, x, y, E.a, M.a, 1)),
                    (p = rt(k, m, p, b, 4, x, y, w.r, T.r, 1)),
                    (p = rt(k, m, p, b, 5, x, y, w.g, T.g, 1)),
                    (p = rt(k, m, p, b, 6, x, y, w.b, T.b, 1))),
                    (x = y),
                    (E = M),
                    (w = T),
                    (g = S);
                }
                r.push(m);
              } else if (d == "rgb2") {
                const m = new Qs(u, u * 6, o);
                let g = f[0],
                  x = P(g, "time", 0),
                  E = _.fromString(g.light),
                  w = _.fromString(g.dark);
                for (let b = 0, p = 0; ; b++) {
                  m.setFrame(b, x, E.r, E.g, E.b, w.r, w.g, w.b);
                  const S = f[b + 1];
                  if (!S) {
                    m.shrink(p);
                    break;
                  }
                  const y = P(S, "time", 0),
                    M = _.fromString(S.light),
                    T = _.fromString(S.dark),
                    k = g.curve;
                  k &&
                    ((p = rt(k, m, p, b, 0, x, y, E.r, M.r, 1)),
                    (p = rt(k, m, p, b, 1, x, y, E.g, M.g, 1)),
                    (p = rt(k, m, p, b, 2, x, y, E.b, M.b, 1)),
                    (p = rt(k, m, p, b, 3, x, y, w.r, T.r, 1)),
                    (p = rt(k, m, p, b, 4, x, y, w.g, T.g, 1)),
                    (p = rt(k, m, p, b, 5, x, y, w.b, T.b, 1))),
                    (x = y),
                    (E = M),
                    (w = T),
                    (g = S);
                }
                r.push(m);
              }
            }
          }
        if (t.bones)
          for (const l in t.bones) {
            const s = t.bones[l],
              a = e.findBone(l);
            if (!a) throw new Error(`Bone not found: ${l}`);
            const o = a.index;
            for (const d in s) {
              const f = s[d],
                u = f.length;
              if (u != 0) {
                if (d === "rotate") r.push(Pe(f, new Rn(u, u, o), 0, 1));
                else if (d === "translate") {
                  const m = new Ds(u, u << 1, o);
                  r.push(Ei(f, m, "x", "y", 0, i));
                } else if (d === "translatex") {
                  const m = new Ls(u, u, o);
                  r.push(Pe(f, m, 0, i));
                } else if (d === "translatey") {
                  const m = new _s(u, u, o);
                  r.push(Pe(f, m, 0, i));
                } else if (d === "scale") {
                  const m = new Os(u, u << 1, o);
                  r.push(Ei(f, m, "x", "y", 1, 1));
                } else if (d === "scalex") {
                  const m = new $s(u, u, o);
                  r.push(Pe(f, m, 1, 1));
                } else if (d === "scaley") {
                  const m = new Ws(u, u, o);
                  r.push(Pe(f, m, 1, 1));
                } else if (d === "shear") {
                  const m = new qs(u, u << 1, o);
                  r.push(Ei(f, m, "x", "y", 0, 1));
                } else if (d === "shearx") {
                  const m = new Us(u, u, o);
                  r.push(Pe(f, m, 0, 1));
                } else if (d === "sheary") {
                  const m = new zs(u, u, o);
                  r.push(Pe(f, m, 0, 1));
                }
              }
            }
          }
        if (t.ik)
          for (const l in t.ik) {
            const s = t.ik[l];
            let a = s[0];
            if (!a) continue;
            const o = e.findIkConstraint(l);
            if (!o) throw new Error(`IK Constraint not found: ${l}`);
            const d = e.ikConstraints.indexOf(o),
              f = new Js(s.length, s.length << 1, d);
            let u = P(a, "time", 0),
              m = P(a, "mix", 1),
              g = P(a, "softness", 0) * i;
            for (let x = 0, E = 0; ; x++) {
              f.setFrame(
                x,
                u,
                m,
                g,
                P(a, "bendPositive", !0) ? 1 : -1,
                P(a, "compress", !1),
                P(a, "stretch", !1)
              );
              const w = s[x + 1];
              if (!w) {
                f.shrink(E);
                break;
              }
              const b = P(w, "time", 0),
                p = P(w, "mix", 1),
                S = P(w, "softness", 0) * i,
                y = a.curve;
              y &&
                ((E = rt(y, f, E, x, 0, u, b, m, p, 1)),
                (E = rt(y, f, E, x, 1, u, b, g, S, i))),
                (u = b),
                (m = p),
                (g = S),
                (a = w);
            }
            r.push(f);
          }
        if (t.transform)
          for (const l in t.transform) {
            const s = t.transform[l];
            let a = s[0];
            if (!a) continue;
            const o = e.findTransformConstraint(l);
            if (!o) throw new Error(`Transform constraint not found: ${l}`);
            const d = e.transformConstraints.indexOf(o),
              f = new ti(s.length, s.length * 6, d);
            let u = P(a, "time", 0),
              m = P(a, "mixRotate", 1),
              g = P(a, "mixX", 1),
              x = P(a, "mixY", g),
              E = P(a, "mixScaleX", 1),
              w = P(a, "mixScaleY", E);
            const b = P(a, "mixShearY", 1);
            for (let p = 0, S = 0; ; p++) {
              f.setFrame(p, u, m, g, x, E, w, b);
              const y = s[p + 1];
              if (!y) {
                f.shrink(S);
                break;
              }
              const M = P(y, "time", 0),
                T = P(y, "mixRotate", 1),
                k = P(y, "mixX", 1),
                I = P(y, "mixY", k),
                R = P(y, "mixScaleX", 1),
                V = P(y, "mixScaleY", R),
                F = P(y, "mixShearY", 1),
                B = a.curve;
              B &&
                ((S = rt(B, f, S, p, 0, u, M, m, T, 1)),
                (S = rt(B, f, S, p, 1, u, M, g, k, 1)),
                (S = rt(B, f, S, p, 2, u, M, x, I, 1)),
                (S = rt(B, f, S, p, 3, u, M, E, R, 1)),
                (S = rt(B, f, S, p, 4, u, M, w, V, 1)),
                (S = rt(B, f, S, p, 5, u, M, b, F, 1))),
                (u = M),
                (m = T),
                (g = k),
                (x = I),
                (E = R),
                (w = V),
                (E = R),
                (a = y);
            }
            r.push(f);
          }
        if (t.path)
          for (const l in t.path) {
            const s = t.path[l],
              a = e.findPathConstraint(l);
            if (!a) throw new Error(`Path constraint not found: ${l}`);
            const o = e.pathConstraints.indexOf(a);
            for (const d in s) {
              const f = s[d];
              let u = f[0];
              if (!u) continue;
              const m = f.length;
              if (d === "position") {
                const g = new ei(m, m, o);
                r.push(Pe(f, g, 0, a.positionMode == dt.Fixed ? i : 1));
              } else if (d === "spacing") {
                const g = new ni(m, m, o);
                r.push(
                  Pe(
                    f,
                    g,
                    0,
                    a.spacingMode == kt.Length || a.spacingMode == kt.Fixed
                      ? i
                      : 1
                  )
                );
              } else if (d === "mix") {
                const g = new si(m, m * 3, o);
                let x = P(u, "time", 0),
                  E = P(u, "mixRotate", 1),
                  w = P(u, "mixX", 1),
                  b = P(u, "mixY", w);
                for (let p = 0, S = 0; ; p++) {
                  g.setFrame(p, x, E, w, b);
                  const y = f[p + 1];
                  if (!y) {
                    g.shrink(S);
                    break;
                  }
                  const M = P(y, "time", 0),
                    T = P(y, "mixRotate", 1),
                    k = P(y, "mixX", 1),
                    I = P(y, "mixY", k),
                    R = u.curve;
                  R &&
                    ((S = rt(R, g, S, p, 0, x, M, E, T, 1)),
                    (S = rt(R, g, S, p, 1, x, M, w, k, 1)),
                    (S = rt(R, g, S, p, 2, x, M, b, I, 1))),
                    (x = M),
                    (E = T),
                    (w = k),
                    (b = I),
                    (u = y);
                }
                r.push(g);
              }
            }
          }
        if (t.deform) {
          t.attachments = {};
          for (const l in t.deform) {
            const s = t.deform[l],
              a = (t.attachments[l] = {});
            for (const o in s) {
              const d = s[o],
                f = (a[o] = {});
              for (const u in d) f[u] = { deform: d[u] };
            }
          }
        }
        if (t.attachments)
          for (const l in t.attachments) {
            const s = t.attachments[l],
              a = e.findSkin(l);
            if (a == null) {
              if (zt.FAIL_ON_NON_EXISTING_SKIN)
                throw new Error(`Skin not found: ${l}`);
              continue;
            }
            for (const o in s) {
              const d = s[o],
                f = e.findSlot(o);
              if (!f) throw new Error(`Slot not found: ${o}`);
              const u = f.index;
              for (const m in d) {
                const g = d[m],
                  x = a.getAttachment(u, m);
                for (const E in g) {
                  const w = g[E];
                  let b = w[0];
                  if (b) {
                    if (E == "deform") {
                      const p = x.bones,
                        S = x.vertices,
                        y = p ? (S.length / 3) * 2 : S.length,
                        M = new Ks(w.length, w.length, u, x);
                      let T = P(b, "time", 0);
                      for (let k = 0, I = 0; ; k++) {
                        let R;
                        const V = P(b, "vertices", null);
                        if (!V) R = p ? v.newFloatArray(y) : S;
                        else {
                          R = v.newFloatArray(y);
                          const N = P(b, "offset", 0);
                          if ((v.arrayCopy(V, 0, R, N, V.length), i != 1))
                            for (let q = N, z = q + V.length; q < z; q++)
                              R[q] *= i;
                          if (!p) for (let q = 0; q < y; q++) R[q] += S[q];
                        }
                        M.setFrame(k, T, R);
                        const F = w[k + 1];
                        if (!F) {
                          M.shrink(I);
                          break;
                        }
                        const B = P(F, "time", 0),
                          Y = b.curve;
                        Y && (I = rt(Y, M, I, k, 0, T, B, 0, 1, 1)),
                          (T = B),
                          (b = F);
                      }
                      r.push(M);
                    } else if (E == "sequence") {
                      const p = new bn(w.length, u, x);
                      let S = 0;
                      for (let y = 0; y < w.length; y++) {
                        const M = P(b, "delay", S),
                          T = P(b, "time", 0),
                          k = Re[P(b, "mode", "hold")],
                          I = P(b, "index", 0);
                        p.setFrame(y, T, k, I, M), (S = M), (b = w[y + 1]);
                      }
                      r.push(p);
                    }
                  }
                }
              }
            }
          }
        if (t.drawOrder) {
          const l = new hn(t.drawOrder.length),
            s = e.slots.length;
          let a = 0;
          for (let o = 0; o < t.drawOrder.length; o++, a++) {
            const d = t.drawOrder[o];
            let f = null;
            const u = P(d, "offsets", null);
            if (u) {
              f = v.newArray(s, -1);
              const m = v.newArray(s - u.length, 0);
              let g = 0,
                x = 0;
              for (let E = 0; E < u.length; E++) {
                const w = u[E],
                  b = e.findSlot(w.slot);
                if (!b) throw new Error(`Slot not found: ${b}`);
                const p = b.index;
                for (; g != p; ) m[x++] = g++;
                f[g + w.offset] = g++;
              }
              for (; g < s; ) m[x++] = g++;
              for (let E = s - 1; E >= 0; E--) f[E] == -1 && (f[E] = m[--x]);
            }
            l.setFrame(a, P(d, "time", 0), f);
          }
          r.push(l);
        }
        if (t.events) {
          const l = new vn(t.events.length);
          let s = 0;
          for (let a = 0; a < t.events.length; a++, s++) {
            const o = t.events[a],
              d = e.findEvent(o.name);
            if (!d) throw new Error(`Event not found: ${o.name}`);
            const f = new ci(v.toSinglePrecision(P(o, "time", 0)), d);
            (f.intValue = P(o, "int", d.intValue)),
              (f.floatValue = P(o, "float", d.floatValue)),
              (f.stringValue = P(o, "string", d.stringValue)),
              f.data.audioPath &&
                ((f.volume = P(o, "volume", 1)),
                (f.balance = P(o, "balance", 0))),
              l.setFrame(s, f);
          }
          r.push(l);
        }
        let h = 0;
        for (let l = 0, s = r.length; l < s; l++)
          h = Math.max(h, r[l].getDuration());
        if (isNaN(h))
          throw new Error("Error while parsing animation, duration is NaN");
        e.animations.push(new zn(n, r, h));
      }
      static blendModeFromString(t) {
        if (((t = t.toLowerCase()), t == "normal")) return H.BLEND_MODES.NORMAL;
        if (t == "additive") return H.BLEND_MODES.ADD;
        if (t == "multiply") return H.BLEND_MODES.MULTIPLY;
        if (t == "screen") return H.BLEND_MODES.SCREEN;
        throw new Error(`Unknown blend mode: ${t}`);
      }
    }
    class ua {
      constructor(t, n, e, i, r) {
        (this.mesh = t),
          (this.skin = n),
          (this.slotIndex = e),
          (this.parent = i),
          (this.inheritTimeline = r);
      }
    }
    function Pe(c, t, n, e) {
      let i = c[0],
        r = P(i, "time", 0),
        h = P(i, "value", n) * e,
        l = 0;
      for (let s = 0; ; s++) {
        t.setFrame(s, r, h);
        const a = c[s + 1];
        if (!a) return t.shrink(l), t;
        const o = P(a, "time", 0),
          d = P(a, "value", n) * e;
        i.curve && (l = rt(i.curve, t, l, s, 0, r, o, h, d, e)),
          (r = o),
          (h = d),
          (i = a);
      }
    }
    function Ei(c, t, n, e, i, r) {
      let h = c[0],
        l = P(h, "time", 0),
        s = P(h, n, i) * r,
        a = P(h, e, i) * r,
        o = 0;
      for (let d = 0; ; d++) {
        t.setFrame(d, l, s, a);
        const f = c[d + 1];
        if (!f) return t.shrink(o), t;
        const u = P(f, "time", 0),
          m = P(f, n, i) * r,
          g = P(f, e, i) * r,
          x = h.curve;
        x &&
          ((o = rt(x, t, o, d, 0, l, u, s, m, r)),
          (o = rt(x, t, o, d, 1, l, u, a, g, r))),
          (l = u),
          (s = m),
          (a = g),
          (h = f);
      }
    }
    function rt(c, t, n, e, i, r, h, l, s, a) {
      if (c == "stepped") return t.setStepped(e), n;
      const o = i << 2,
        d = c[o],
        f = c[o + 1] * a,
        u = c[o + 2],
        m = c[o + 3] * a;
      return t.setBezier(n, e, i, r, l, d, f, u, m, h, s), n + 1;
    }
    function P(c, t, n) {
      return c[t] !== void 0 ? c[t] : n;
    }
    var ma = Object.freeze({
        __proto__: null,
        AlphaTimeline: js,
        Animation: zn,
        AnimationState: En,
        AnimationStateAdapter: $r,
        AnimationStateData: dr,
        AtlasAttachmentLoader: ai,
        Attachment: Ns,
        AttachmentTimeline: cn,
        Bone: oi,
        BoneData: li,
        BoundingBoxAttachment: On,
        ClippingAttachment: $n,
        ConstraintData: jn,
        CurveTimeline: be,
        CurveTimeline1: Ee,
        CurveTimeline2: Hn,
        DeformTimeline: Ks,
        DrawOrderTimeline: hn,
        Event: ci,
        EventData: hi,
        EventQueue: or,
        EventTimeline: vn,
        EventType: Qt,
        IkConstraint: fr,
        IkConstraintData: di,
        IkConstraintTimeline: Js,
        MeshAttachment: on,
        PathAttachment: ln,
        PathConstraint: Sn,
        PathConstraintData: fi,
        PathConstraintMixTimeline: si,
        PathConstraintPositionTimeline: ei,
        PathConstraintSpacingTimeline: ni,
        PointAttachment: Wn,
        RGB2Timeline: Qs,
        RGBA2Timeline: Zs,
        RGBATimeline: Hs,
        RGBTimeline: Gs,
        RegionAttachment: it,
        RotateTimeline: Rn,
        ScaleTimeline: Os,
        ScaleXTimeline: $s,
        ScaleYTimeline: Ws,
        Sequence: Un,
        SequenceMode: Re,
        SequenceModeValues: Bs,
        SequenceTimeline: bn,
        ShearTimeline: qs,
        ShearXTimeline: Us,
        ShearYTimeline: zs,
        Skeleton: ui,
        SkeletonBinary: wi,
        SkeletonBounds: xr,
        SkeletonData: mi,
        SkeletonJson: Qn,
        Skin: Zn,
        SkinEntry: pi,
        Slot: ur,
        SlotData: gi,
        SpacingMode: kt,
        Spine: class extends tn {
          createSkeleton(t) {
            (this.skeleton = new ui(t)),
              this.skeleton.updateWorldTransform(),
              (this.stateData = new dr(t)),
              (this.state = new En(this.stateData));
          }
        },
        Timeline: bt,
        TrackEntry: Gn,
        TransformConstraint: mr,
        TransformConstraintData: xi,
        TransformConstraintTimeline: ti,
        TranslateTimeline: Ds,
        TranslateXTimeline: Ls,
        TranslateYTimeline: _s,
        VertexAttachment: we,
      }),
      he = ((c) => (
        (c[(c.UNKNOWN = 0)] = "UNKNOWN"),
        (c[(c.VER37 = 37)] = "VER37"),
        (c[(c.VER38 = 38)] = "VER38"),
        (c[(c.VER40 = 40)] = "VER40"),
        (c[(c.VER41 = 41)] = "VER41"),
        c
      ))(he || {});
    function Kn(c) {
      const t = c.substr(0, 3),
        n = Math.floor(Number(t) * 10 + 0.001);
      return t === "3.7"
        ? 37
        : t === "3.8"
        ? 38
        : t === "4.0"
        ? 40
        : t === "4.1"
        ? 41
        : n < 37
        ? 37
        : 0;
    }
    class ga {
      constructor() {
        this.scale = 1;
      }
      readSkeletonData(t, n) {
        let e = null,
          i = this.readVersionOldFormat(n),
          r = Kn(i);
        if (
          (r === he.VER38 && (e = new Mt(new gs(t))),
          (i = this.readVersionNewFormat(n)),
          (r = Kn(i)),
          (r === he.VER40 || r === he.VER41) && (e = new wi(new ai(t))),
          !e)
        ) {
          const h = `Unsupported version of spine model ${i}, please update pixi-spine`;
          console.error(h);
        }
        return (e.scale = this.scale), e.readSkeletonData(n);
      }
      readVersionOldFormat(t) {
        const n = new Mn(t);
        let e;
        try {
          n.readString(), (e = n.readString());
        } catch (i) {
          e = "";
        }
        return e || "";
      }
      readVersionNewFormat(t) {
        const n = new Mn(t);
        n.readInt32(), n.readInt32();
        let e;
        try {
          e = n.readString();
        } catch (i) {
          e = "";
        }
        return e || "";
      }
    }
    class xa {
      constructor() {
        this.scale = 1;
      }
      readSkeletonData(t, n) {
        const e = n.skeleton.spine,
          i = Kn(e);
        let r = null;
        if (
          (i === he.VER37 && (r = new an(new Ui(t))),
          i === he.VER38 && (r = new sn(new gs(t))),
          (i === he.VER40 || i === he.VER41) && (r = new Qn(new ai(t))),
          !r)
        ) {
          const h = `Unsupported version of spine model ${e}, please update pixi-spine`;
          console.error(h);
        }
        return (r.scale = this.scale), r.readSkeletonData(n);
      }
    }
    class pa extends Rr {
      createBinaryParser() {
        return new ga();
      }
      createJsonParser() {
        return new xa();
      }
      parseData(t, n, e) {
        return { spineData: t.readSkeletonData(n, e), spineAtlas: n };
      }
    }
    class wa extends tn {
      createSkeleton(t) {
        const n = Kn(t.version);
        let e = null;
        if (
          (n === he.VER37 && (e = Or),
          n === he.VER38 && (e = Nr),
          (n === he.VER40 || n === he.VER41) && (e = ma),
          !e)
        ) {
          const i = `Cant detect version of spine model ${t.version}`;
          console.error(i);
        }
        (this.skeleton = new e.Skeleton(t)),
          this.skeleton.updateWorldTransform(),
          (this.stateData = new e.AnimationStateData(t)),
          (this.state = new e.AnimationState(this.stateData));
      }
    }
    return (
      new pa().installLoader(),
      (tt.AttachmentType = Z),
      (tt.BinaryInput = Mn),
      (tt.Color = _),
      (tt.DebugUtils = Mr),
      (tt.IntSet = ns),
      (tt.Interpolation = Si),
      (tt.MathUtils = C),
      (tt.MixBlend = A),
      (tt.MixDirection = J),
      (tt.Pool = An),
      (tt.PositionMode = dt),
      (tt.Pow = yi),
      (tt.PowOut = is),
      (tt.RotateMode = pt),
      (tt.SkeletonBounds = xr),
      (tt.SkeletonBoundsBase = Cn),
      (tt.Spine = wa),
      (tt.SpineBase = tn),
      (tt.SpineDebugRenderer = Tr),
      (tt.SpineMesh = Ai),
      (tt.SpineSprite = Mi),
      (tt.StringSet = ss),
      (tt.TextureAtlas = Fn),
      (tt.TextureAtlasPage = ts),
      (tt.TextureAtlasRegion = es),
      (tt.TextureFilter = Bt),
      (tt.TextureRegion = Vn),
      (tt.TextureWrap = fe),
      (tt.TimeKeeper = Ar),
      (tt.TransformMode = j),
      (tt.Utils = v),
      (tt.Vector2 = un),
      (tt.WindowedMean = Cr),
      (tt.filterFromString = Jn),
      (tt.settings = zt),
      (tt.wrapFromString = Er),
      tt
    );
  })({}, PIXI_dpbf, PIXI_dpbf, PIXI_dpbf, PIXI_dpbf, PIXI_dpbf, PIXI_dpbf));
//# sourceMappingURL=pixi-spine.js.map
