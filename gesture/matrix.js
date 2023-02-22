
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
    constructor({ sx = 1, skx = 0, tx = 0, sky = 1, sy = 0, ty = 0 } = {}) {
      this.matrix = [
        sx, skx, tx,
        sky, sy, ty,
        0, 0, 1
      ];
    };

    create({ sx = 1, skx = 0, tx = 0, sky = 1, sy = 0, ty = 0 } = {}) {
      return [
        sx, skx, tx,
        sky, sy, ty,
        0, 0, 1
      ]
    }

    setMatrix({ sx, skx, tx, sky, sy, ty }) {
      this.matrix[0] = sx || 1; // x軸縮放
      this.matrix[1] = skx || 0; // x軸錯切
      this.matrix[2] = tx || 0; // x軸位移
      this.matrix[3] = sky || 0; // y軸錯切
      this.matrix[4] = sy || 1; // y軸縮放
      this.matrix[5] = ty || 0; // y軸位移
      return this;
    }

    to2dCssMatrix(m = this.matrix) {
      // matrix(x軸縮放, y軸錯切, x軸錯切, y軸縮放, x軸位移, y軸位移)
      return [m[0], m[3], m[1], m[4], m[2], m[5]].join(",");
    }
  }

  const mt3 = new Mt3();
  mt3.setMatrix({ tx: 50, ty: 300 });


  element.style.transform = `matrix(${mt3.to2dCssMatrix()})`;
})()