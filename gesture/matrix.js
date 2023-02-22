
(() => {
  const element = document.querySelector(".box")
  const g = new Gesture({ container: element });
  g.on(Gesture.EVENTS.START, (evt) => {
    console.log("EVENTS.START", evt);
  });
  g.on(Gesture.EVENTS.TAP, (evt) => {
    console.log("EVENTS.TAP", evt);
  });
  g.on(Gesture.EVENTS.DRAG, (evt) => {
    console.log("EVENTS.DRAG", evt);
    evt.originEvent.preventDefault();
    evt.activeElement.style.transform = `matrix(${evt.matrix.join(",")})`;
  });
  g.on(Gesture.EVENTS.END, (evt) => {
    console.log("EVENTS.END", evt);
  });

  /**
   * 矩陣      陣列索引   transform matrix
   * [ a,c,e, [ 0,1,2,  [ sx, skx, tx,
   *   b,d,f,   3,4,5,    sky, sy, ty,
   *   0,0,1]   6,7,8]    0,    0,  1]
  */
  class Mt3 {
    constructor() {
      /**
       * [ x軸縮放[index: 0], x軸錯切[index: 1], x軸位移[index: 2]
       *   y軸錯切[index: 3], y軸縮放[index: 4], y軸位移[index: 5]
       *          0        ,        0        ,         1        ]
      */
      // this.matrix = [
      //   sx, skx, tx,
      //   sky, sy, ty,
      //   0, 0, 1
      // ];
    };

    create({ sx = 1, skx = 0, sky = 0, sy = 1, tx = 0, ty = 0 } = {}) {
      return [
        sx, skx, tx,
        sky, sy, ty,
        0, 0, 1
      ]
    }

    // 取得基礎矩陣
    translation(tx = 0, ty = 0) {
      return [
        1, 0, tx,
        0, 1, ty,
        0, 0, 1
      ]
    }
    scaling(sx = 1, sy = 1) {
      return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1
      ]
    }
    rotation(angle) {
      const c = Math.cos(angle * Math.PI / 180);
      const s = Math.sin(angle * Math.PI / 180);
      return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1
      ]
    }

    // 簡單矩陣運算
    translate(output, tx, ty) {
      output[2] += tx;
      output[5] += ty;
      return this;
    }
    translateX(output, tx) {
      output[2] += tx;
      return this;
    }
    translateY(output, ty) {
      output[5] += ty;
      return this;
    }
    scale(output, sx, sy) {
      output[0] = sx;
      output[4] = sy;
      return this;
    }
    scaleX(output, sx) {
      output[0] = sx;
      return this;
    }
    scaleY(output, sy) {
      output[4] = sy;
      return this;
    }
    rotate(output, angle) {
      const c = Math.cos(angle * Math.PI / 180);
      const s = Math.sin(angle * Math.PI / 180);
      output[0] *= c;
      output[1] = -s;
      output[2] = output[2] * c - output[5] * s;
      output[3] = s;
      output[4] *= c;
      output[5] = output[2] * c + output[5] * s;
      return this;
    }

    // 兩矩陣相乘
    multiply(a, b) {
      const c11 = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
      const c12 = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
      const c13 = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
      const c21 = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
      const c22 = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
      const c23 = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
      const c31 = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
      const c32 = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
      const c33 = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];
      return [
        c11, c12, c13,
        c21, c22, c23,
        c31, c32, c33,
      ]
    }

    // 複製新矩陣
    clone() {
      return this.matrix.map(m => m);
    }

    // 轉換 2d css matrix
    toCssMatrix(m) {
      if (!m) m = this.create();
      // matrix(scaleX, shearY, shearX, scaleY, translateX, translateY)
      return [m[0], m[3], m[1], m[4], m[2], m[5]].join(",");
    }
  };

  const box1 = document.querySelector(".box.id1");
  const box2 = document.querySelector(".box.id2");
  const mt3 = new Mt3();
  const r1 = mt3.rotation(45);
  const t1 = mt3.translation(50, 100);
  const matrix1 = mt3.multiply(t1, r1);

  const r2 = mt3.rotation(45);
  const t2 = mt3.translation(50, 250);
  const matrix2 = mt3.multiply(t2, r2);
  // const matrix2 = mt3.multiply(r2, t2);

  box1.style.transform = `matrix(${mt3.toCssMatrix(matrix1)})`;
  console.log(`🚀 ~ trs1:`, box1.style.transform);
  box2.style.transform = `matrix(${mt3.toCssMatrix(matrix2)})`;
  console.log(`🚀 ~ trs2:`, box2.style.transform);
})()
