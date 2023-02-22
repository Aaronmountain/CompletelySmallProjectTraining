(() => {
  /**
   * TODO: may should use pointer event is better, and add some mouse event
   * TODO: dbClick: 單指，快速點擊兩次
   * 自定義事件，封裝手勢操作
   * P.S. 有依賴 lodash.throttle 請務必引入 lodash(沒有判斷這部分)
   * Events: 
   *  tap: 單指，觸摸螢幕到離開小於默認間隔(250ms)時觸發
   *  longPressed: 單指，觸摸螢幕到離開大於默認間隔(1.5s)時觸發
   *  drag: 單指，拖拉元素
   *  scale: 雙指，縮放元素
   *  rotate: 雙指，旋轉元素
  */
  class Gesture {
    static STATE_STATUS = { INIT: "INIT", NONE: "NONE" }
    static EVENTS = { // 自訂定義事件 enums
      START: 0,
      TAP: 1,
      LONG_PRESSED: 2,
      DRAG: 3,
      PINCH: 4,
      ROTATE: 5,
      END: 6,
    }
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

    constructor({
      container = null,
      targetDataset = null,
      defaultTapTime = 250,
      defaultPressedTime = 500,
    }) {
      const boundaryReact = container.getBoundingClientRect();
      this.container = container; // 註冊事件的容器元素
      this.targetDataset = targetDataset; // 指定要觸發事件的元素(元素需設置 data attribute)
      this.DefaultTapTime = defaultTapTime; // tap 間隔時間
      this.DefaultPressedTime = defaultPressedTime; // longPressed 間隔時間
      this.state = { // 存放 activeElement 資訊
        status: Gesture.STATE_STATUS.NONE, // 是否初始化完畢
        now: null, // 初始化當下的時間
        startMove: { x: 0, y: 0 }, // touch start 初始的 x,y 值
        startCenter: { x: 0, y: 0 }, //
        startTouches: [], // touch start touches
        matrix: [1, 0, 0, 1, 0, 0], // 縮放矩陣
        distance: { start: 0, end: 0 }, // 縮放比率
        dragEdge: {  // 邊界範圍
          top: boundaryReact.top,
          right: boundaryReact.right,
          bottom: boundaryReact.bottom,
          left: boundaryReact.left,
        },
      };

      this.eventMap =
        Object.values(Gesture.EVENTS).reduce((acc, curr) => {
          if (!acc[curr]) acc[curr] = []
          return acc;
        }, {})

      // get destroy function after init
      this.destroy = this.init();
    }

    init() {
      const start = this.handleStart.bind(this);
      const move = this.handleMove.bind(this);
      const end = this.handleEnd.bind(this);
      this.container.addEventListener("touchstart", start);
      this.container.addEventListener("touchmove", move);
      this.container.addEventListener("touchend", end);
      this.container.addEventListener("touchcancel", end);

      return function cleanup() {
        this.container.removeEventListener("touchstart", start);
        this.container.removeEventListener("touchmove", move);
        this.container.removeEventListener("touchend", end);
        this.container.removeEventListener("touchcancel", end);
      }
    };

    handleStart(evt) {
      let el = this.container;
      if (this.targetDataset && !(el = this.getElement(evt))) {
        return;
      }
      const state = this.state;

      state.startTouches = evt.touches;
      state.now = performance.now();
      const { matrix, scale, rotate } = Gesture.matrixTo(el);
      console.log(`🚀 ~ Gesture ~ handleStart ~ matrix:`, matrix);
      state.matrix = matrix;
      state.scale = scale;
      state.rotate = rotate;

      if (evt.touches.length === 1) {
        state.startMove.x = evt.touches[0].pageX;
        state.startMove.y = evt.touches[0].pageY;
      } else if (evt.touches.length === 2) {
        state.distance.start =
          this.getLength(this.getVector(evt.touches[0], evt.touches[1]));
      }

      state.status = Gesture.STATE_STATUS.INIT;
      this.invoke(Gesture.EVENTS.START, {
        containerElement: this.container,
        activeElement: el,
        originEvent: evt,
        matrix: state.matrix,
        startPoint: { x: state.startMove.x, y: state.startMove.y },
      })
    }
    handleMove(evt) {
      let el = this.container;
      if (this.targetDataset && !(el = this.getElement(evt))) {
        return;
      }

      // Not init should be return
      if (this.state.status === Gesture.STATE_STATUS.NONE) return;

      const startTouchesLength = this.state.startTouches.length;
      if (evt.touches.length === 2 && startTouchesLength === 2) {
        this.pinch(el, evt, this.state);
        this.rotate(el, evt, this.state);
      } else if (startTouchesLength === 1) {
        this.drag(el, evt, this.state);
      }
    }
    handleEnd(evt) {
      let el = this.container;
      if (this.targetDataset && !(el = this.getElement(evt))) {
        return;
      }

      const startTouch = this.state.startTouches[0];
      if (
        Math.abs(evt.changedTouches[0].pageX - startTouch.pageX) < 10 &&
        Math.abs(evt.changedTouches[0].pageY - startTouch.pageY) < 10
      ) {
        const diffTime = performance.now() - this.state.now;
        if (diffTime < this.DefaultTapTime) {
          this.tap(el, evt);
        } else if (diffTime < this.DefaultPressedTime) {
          this.longPressed(el, evt);
        }
        return;
      }
      // if (checkIsOverEdge(el, evt, state)) el.style.transform = "";
      this.state.status = Gesture.STATE_STATUS.NONE;
      this.invoke(Gesture.EVENTS.END, {
        containerElement: this.container,
        activeElement: el,
        originEvent: evt,
        matrix: this.state.matrix,
      });
    }

    // Tap
    tap(el, e) {
      this.invoke(Gesture.EVENTS.TAP, {
        containerElement: this.container,
        activeElement: el,
        originEvent: e,
      });
    }

    // 長按事件
    longPressed(el, e) {
      this.invoke(Gesture.EVENTS.LONG_PRESSED, {
        containerElement: this.container,
        activeElement: el,
        originEvent: e,
      });
    }

    // 拖曳事件
    drag(el, e, state) {
      const start = state.startMove;
      const currentX = e.touches[0].pageX;
      const currentY = e.touches[0].pageY;
      const deltaX = currentX - start.x; // x 軸位移數值
      const deltaY = currentY - start.y; // y 軸位移數值
      state.matrix[4] += deltaX;
      state.matrix[5] += deltaY;

      this.invoke(Gesture.EVENTS.DRAG, {
        containerElement: this.container,
        activeElement: el,
        originEvent: e,
        deltaX,
        deltaY,
        oldPoint: { x: state.startMove.x, y: state.startMove.y },
        newPoint: { x: currentX, y: currentY, },
        matrix: state.matrix,
      });
      state.startMove.x = currentX;
      state.startMove.y = currentY;
    };

    // 縮放事件
    pinch = _.throttle((el, e, state) => {
      const oldDistance = state.distance.end;
      state.distance.end =
        this.getLength(this.getVector(e.touches[0], e.touches[1]));
      const scale =
        parseFloat((state.distance.end / state.distance.start).toFixed(2));

      if (state.distance.end - oldDistance < 0) {
        state.matrix[0] -= scale; // x軸縮放
        state.matrix[3] -= scale; // y軸縮放
      } else {
        state.matrix[0] += scale; // x軸縮放
        state.matrix[3] += scale; // y軸縮放
      }

      this.invoke(Gesture.EVENTS.PINCH, {
        containerElement: this.container,
        activeElement: el,
        originEvent: e,
        scale,
        matrix: state.matrix
      });
      state.scale = scale;
    }, 50);

    // 旋轉事件
    rotate = _.throttle((el, e, state) => {
      const v1 = this.getVector(state.startTouches[0], state.startTouches[1]);
      const v2 = this.getVector(e.touches[0], e.touches[1]);
      const rotate = parseFloat(this.getRotateAngle(v1, v2).toFixed(2));

      state.matrix[0] *= Math.cos(rotate);
      state.matrix[1] = -Math.sin(rotate);
      state.matrix[2] = Math.sin(rotate);
      state.matrix[3] *= Math.cos(rotate);

      this.invoke(Gesture.EVENTS.ROTATE, {
        containerElement: this.container,
        activeElement: el,
        originEvent: e,
        rotate,
        matrix: state.matrix,
      });
      state.rotate = rotate;
    }, 50);

    getCenter(p1, p2) { // 計算中心座標
      return { x: (p1.pageX + p2.pageX) / 2, y: (p1.pageY + p2.pageY) / 2 };
    }
    getVector(p1, p2) { // 取得向量座標
      return { x: p1.pageX - p2.pageX, y: p1.pageY - p2.pageY };
    }
    getLength(v) { // 計算向量長度
      return Math.sqrt((v.x ** 2) + (v.y ** 2));
    }
    getDirection(v1, v2) { // 計算正轉or反轉
      return v1.x * v2.y - v2.x * v1.y > 0 ? -1 : 1;
    }
    dot(v1, v2) { // 計算向量積
      return v1.x * v2.x + v1.y * v2.y;
    }
    getRotateAngle(vector1, vector2) {
      const direction = this.getDirection(vector1, vector2);
      const mr = this.getLength(vector1) * this.getLength(vector2);
      if (mr === 0) return 0;

      let r = this.dot(vector1, vector2) / mr;
      if (r > 1) r = 1;
      if (r < -1) r = -1;
      return Math.acos(r) * direction * 180 / Math.PI;
    }

    checkIsOverEdge(el, evt, state) {
      // const touch = evt.touches[0];
      const targetRect = el.getBoundingClientRect();

      // return (
      //   (touch.pageX <= parentRect.left && touch.pageX + targetRect.width >= targetRect.width) ||
      //   (touch.pageY <= parentRect.top && touch.pageY - targetRect.height <= parentRect.top) ||
      //   (touch.pageX >= parentRect.right && touch.pageX + targetRect.width >= parentRect.right) ||
      //   (touch.pageY >= parentRect.bottom && touch.pageY + targetRect.height >= parentRect.bottom)
      // );
      return (
        targetRect.top < state.dragEdge.top ||
        targetRect.bottom > state.dragEdge.bottom ||
        targetRect.left < state.dragEdge.left ||
        targetRect.right > state.dragEdge.right
      )
    }

    getElement(evt) {
      const noTarget = typeof evt.target.dataset[this.targetDataset.toLowerCase()] === 'undefined';
      return noTarget ? null : evt.target;
    }

    on(eventName, callback) {
      if (this.eventMap[eventName].length) {
        this.eventMap[eventName].push(callback);
      } else {
        this.eventMap[eventName] = [callback];
      }

      return () => {
        this.eventMap[eventName].splice(callbacks.length - 1, 1)
      }
    }

    invoke(eventName, eventData) {
      const callbacks = this.eventMap[eventName] || [];

      if (callbacks.length) {
        callbacks.forEach(callback => callback(eventData));
      }
    }

    cancelAll() {
      Object.keys(this.eventMap).forEach(key => {
        this.eventMap[key] = [];
      })
      this.destroy();
    };
  }

  window.Gesture = Object.freeze(Gesture);
})()