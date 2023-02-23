// @TODO: should refactor
/**
   * 矩陣      陣列索引   transform matrix
   * [ a,c,e, [ 0,1,2,  [ c11, c12, c13,
   *   b,d,f,   3,4,5,    c21, c22, c23,
   *   0,0,1]   6,7,8]    c31, c32, c33]
   */
class Transform {
  static getMatrixArr(el) {
    const style = getComputedStyle(el, null);
    const matrix = (
      style.getPropertyValue("-webkit-transform") ||
      style.getPropertyValue("-moz-transform") ||
      style.getPropertyValue("-ms-transform") ||
      style.getPropertyValue("-o-transform") ||
      style.getPropertyValue("transform") ||
      null
    );

    if (!matrix || matrix === "none") {
      return
    }

    return matrix.split("(")[1].split(")")[0].split(",").map(Number);
  }
  static matrixTo(el, matrixArr = null) {
    const mArr = matrixArr || this.getMatrixArr(el);
    if (!mArr) return;

    return {
      matrix: mArr,
      translate: [mArr[4], mArr[5]],
      translateX: mArr[4],
      translateY: mArr[5],
      scale: Math.sqrt(mArr[0] ** 2, mArr[1] ** 2),
      scaleX: mArr[0],
      scaleY: mArr[3],
      rotate: Math.round(Math.atan2(mArr[1], mArr[0]) * (180 / Math.PI)),
    };
  }

  constructor() {
    /**
     * [ x軸縮放[index: 0], x軸錯切[index: 1], x軸位移[index: 2]
     *   y軸錯切[index: 3], y軸縮放[index: 4], y軸位移[index: 5]
     *          0        ,        0        ,         1        ]
    */
    this.matrix = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  }
  createIMatrix() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  }
  set(c11 = 1, c12 = 0, c13 = 0, c21 = 0, c22 = 1, c23 = 0, c31 = 0, c32 = 0, c33 = 1) {
    const mt3 = this.matrix;
    mt3[0] = c11; mt3[1] = c12; mt3[2] = c13;
    mt3[3] = c21; mt3[4] = c22; mt3[5] = c23;
    mt3[6] = c31; mt3[7] = c32; mt3[8] = c33;
    return this;
  }
  copy(m) {
    const mt3 = this.matrix;
    const me = m.matrix;
    mt3[0] = me[0]; mt3[1] = me[1]; mt3[2] = me[2];
    mt3[3] = me[3]; mt3[4] = me[4]; mt3[5] = me[5];
    mt3[6] = me[6]; mt3[7] = me[7]; mt3[8] = me[8];
  }
  // 取得基礎矩陣
  translation(tx = 0, ty = 0) {
    this.set(
      1, 0, tx,
      0, 1, ty,
      0, 0, 1,
    );
    return this;
  }
  scaling(sx = 1, sy = 1) {
    this.set(
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    );
    return this;
  }
  rotation(angle) {
    const c = Math.cos(this.toRadians(angle));
    const s = Math.sin(this.toRadians(angle));
    this.set(
      c, -s, 0,
      s, c, 0,
      0, 0, 1,
    );
    return this;
  }
  // 矩陣運算
  translate(tx, ty) {
    this.premultiply(this.translation(tx, ty));
    return this;
  }
  scale(sx, sy) {
    this.premultiply(this.scaling(sx, sy));
    return this;
  }
  rotate(angle) {
    this.premultiply(this.rotation(-angle));
    return this;
  }
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }
  premultiply(m) {
    return this.multiplyMatrices(m, this);
  }
  multiplyMatrices(a, b) {
    const am = a.matrix;
    const bm = b.matrix;
    const tm = this.matrix;

    const a11 = am[0], a12 = am[3], a13 = am[6];
    const a21 = am[1], a22 = am[4], a23 = am[7];
    const a31 = am[2], a32 = am[5], a33 = am[8];

    const b11 = bm[0], b12 = bm[3], b13 = bm[6];
    const b21 = bm[1], b22 = bm[4], b23 = bm[7];
    const b31 = bm[2], b32 = bm[5], b33 = bm[8];

    tm[0] = a11 * b11 + a12 * b21 + a13 * b31;
    tm[3] = a11 * b12 + a12 * b22 + a13 * b32;
    tm[6] = a11 * b13 + a12 * b23 + a13 * b33;

    tm[1] = a21 * b11 + a22 * b21 + a23 * b31;
    tm[4] = a21 * b12 + a22 * b22 + a23 * b32;
    tm[7] = a21 * b13 + a22 * b23 + a23 * b33;

    tm[2] = a31 * b11 + a32 * b21 + a33 * b31;
    tm[5] = a31 * b12 + a32 * b22 + a33 * b32;
    tm[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }
  multiplyScalar(s) {
    const tm = this.matrix;

    tm[0] *= s; tm[3] *= s; tm[6] *= s;
    tm[1] *= s; tm[4] *= s; tm[7] *= s;
    tm[2] *= s; tm[5] *= s; tm[8] *= s;

    return this;

  }
  // multiply(a, b, output = this.matrix) {
  //   /* const c11 = */output[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
  //   /* const c12 = */output[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
  //   /* const c13 = */output[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
  //   /* const c21 = */output[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
  //   /* const c22 = */output[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
  //   /* const c23 = */output[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
  //   /* const c31 = */output[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
  //   /* const c32 = */output[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
  //   /* const c33 = */output[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

  //   // return [c11, c12, c13, c21, c22, c23, c31, c32, c33];
  //   return this;
  // }

  // 轉換 2d css matrix
  toCssMatrix(m = this.matrix) {
    // matrix(scaleX, shearY, shearX, scaleY, translateX, translateY)
    return [m[0], m[3], m[1], m[4], m[2], m[5]].join(",");
  }
  // degreesToRadians(theta) {
  //   return theta * (Math.PI / 180)
  // }
  radiansToDegrees(radians) {
    return radians * (180 / Math.PI)
  }
}

export default Transform;