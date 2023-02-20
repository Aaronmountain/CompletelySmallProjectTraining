(() => {
  /**
   * TODO: may should use pointer event is better, and add some mouse event
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
      START: "START",
      TAP: "TAP",
      LONG_PRESSED: "LONG_PRESSED",
      DRAG: "DRAG",
      PINCH: "PINCH",
      ROTATE: "ROTATE",
      END: "END",
    }

    constructor({
      container = null,
      targetDataset = null,
      defaultTapTime = 250,
      defaultPressedTime = 1500,
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
        startTouches: [], // touch start touches
        matrix: [1, 0, 0, 1, 0, 0], // 縮放矩陣
        dragEdge: {  // 邊界範圍
          top: boundaryReact.top,
          right: boundaryReact.right,
          bottom: boundaryReact.bottom,
          left: boundaryReact.left,
        },
      };

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
      let el;
      if (this.targetDataset && !(el = this.#getElement(evt))) {
        return;
      }
      const state = this.state;

      state.startTouches = evt.touches;
      state.startMove.x = evt.touches[0].pageX;
      state.startMove.y = evt.touches[0].pageY;
      state.now = performance.now();
      state.matrix = this.#getTransform(el).matrix;
      state.status = Gesture.STATE_STATUS.INIT;
      this.#dispatchCustomEvent({
        target: document,
        name: Gesture.EVENTS.START,
        data: {
          containerElement: this.container,
          activeElement: el,
          originEvent: evt,
          matrix: state.matrix,
          startPoint: { x: state.startMove.x, y: state.startMove.y },
        }
      })
    }
    handleMove(evt) {
      let el;
      if (this.targetDataset && !(el = this.#getElement(evt))) {
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
      let el;
      if (this.targetDataset && !(el = this.#getElement(evt))) {
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
        } else if (diffTime < this.defaultPressedTime) {
          this.longPressed(el, evt);
        }
        return;
      }

      // if (checkIsOverEdge(el, evt, state)) el.style.transform = "";
      this.state.status = Gesture.STATE_STATUS.NONE;
      this.#dispatchCustomEvent({
        target: document,
        name: Gesture.EVENTS.END,
        data: {
          containerElement: this.container,
          activeElement: el,
          originEvent: evt,
          matrix: this.state.matrix,
        }
      })
    }

    // 點擊事件
    tap(el, e) {
      this.#dispatchCustomEvent({
        target: document,
        name: Gesture.EVENTS.TAP,
        data: {
          containerElement: this.container,
          activeElement: el,
          originEvent: e,
        }
      })
    }

    // 長按事件
    longPressed(el, e) {
      this.#dispatchCustomEvent({
        target: document,
        name: Gesture.EVENTS.LONG_PRESSED,
        data: {
          containerElement: this.container,
          activeElement: el,
          originEvent: e,
        }
      })
    }

    // 拖曳事件
    drag(el, e, state) {
      const start = state.startMove;
      const currentX = e.touches[0].pageX;
      const currentY = e.touches[0].pageY;
      const deltaX = currentX - start.x; // x 軸位移數值
      const deltaY = currentY - start.y; // y 軸位移數值
      const { matrix, translateX, translateY } =
        this.#getTransform(el, ["translateX", "translateY"]);
      matrix[4] = translateX + deltaX;
      matrix[5] = translateY + deltaY;
      state.matrix = matrix;

      this.#dispatchCustomEvent({
        target: document,
        name: Gesture.EVENTS.DRAG,
        data: {
          containerElement: this.container,
          activeElement: el,
          originEvent: e,
          deltaX,
          deltaY,
          oldPoint: { x: state.startMove.x, y: state.startMove.y },
          newPoint: { x: currentX, y: currentY, },
          matrix: state.matrix,
        }
      })
      state.startMove.x = currentX;
      state.startMove.y = currentY;
    };

    // 縮放事件
    pinch = _.throttle((el, e, state) => {
      const preV = {
        x: state.startTouches[1].pageX - state.startTouches[0].pageX,
        y: state.startTouches[1].pageY - state.startTouches[0].pageY,
      };
      const currentV = {
        x: e.touches[1].pageX - e.touches[0].pageX,
        y: e.touches[1].pageY - e.touches[0].pageY
      };

      const scale = this.#getLength(currentV) / this.#getLength(preV);
      const matrix = this.#getTransform(el).matrix;
      matrix[0] = scale; // x軸縮放
      matrix[3] = scale; // y軸縮放
      state.matrix = matrix;

      this.#dispatchCustomEvent({
        target: document,
        name: Gesture.EVENTS.PINCH,
        data: {
          containerElement: this.container,
          activeElement: el,
          originEvent: e,
          scale,
          matrix: state.matrix
        }
      })
      state.scale = scale;
    }, 50);

    // 旋轉事件
    rotate = _.throttle((el, e, state) => {
      const v1 = this.#getVector(state.startTouches[0], state.startTouches[1]);
      const v2 = this.#getVector(e.touches[0], e.touches[1]);
      const rotate = parseFloat(this.#getRotateAngle(v1, v2).toFixed(2));
      const matrix = this.#getTransform(el).matrix;
      matrix[0] *= Math.cos(rotate);
      matrix[1] = -Math.sin(rotate);
      matrix[2] = Math.sin(rotate);
      matrix[3] *= Math.cos(rotate);
      state.matrix = matrix;

      this.#dispatchCustomEvent({
        target: document,
        name: Gesture.EVENTS.ROTATE,
        data: {
          containerElement: this.container,
          activeElement: el,
          originEvent: e,
          rotate,
          matrix: state.matrix,
        }
      })
      state.rotate = rotate;
    }, 50);

    #getVector(p1, p2) { // 取得向量座標
      return { x: p1.pageX - p2.pageX, y: p1.pageY - p2.pageY };
    }
    #getLength(v) { // 計算向量長度
      return Math.sqrt((v.x ** 2) + (v.y ** 2));
    }
    #getDirection(v1, v2) { // 計算正轉or反轉
      return v1.x * v2.y - v2.x * v1.y > 0 ? -1 : 1;
    }
    #dot(v1, v2) { // 計算向量積
      return v1.x * v2.x + v1.y * v2.y;
    }
    #getRotateAngle(vector1, vector2) {
      const direction = this.#getDirection(vector1, vector2);
      const mr = this.#getLength(vector1) * this.#getLength(vector2);
      if (mr === 0) return 0;

      let r = this.#dot(vector1, vector2) / mr;
      if (r > 1) r = 1;
      if (r < -1) r = -1;
      return Math.acos(r) * direction * 180 / Math.PI;
    }

    // TODO: should check drag boundaries;
    #checkIsOverEdge(el, evt, state) {
      // const touch = evt.touches[0];
      const targetRect = el.getBoundingClientRect();

      return (
        targetRect.top < state.dragEdge.top ||
        targetRect.bottom > state.dragEdge.bottom ||
        targetRect.left < state.dragEdge.left ||
        targetRect.right > state.dragEdge.right
      )
    }

    #getElement(evt) {
      const noTarget = typeof evt.target.dataset[this.targetDataset.toLowerCase()] === 'undefined';
      return noTarget ? null : evt.target;
    }

    /**
     * target is dispatch target
     * name is custom event name
     * data is custom event detail
    */
    #dispatchCustomEvent({ target, name, data }) {
      target.dispatchEvent(new CustomEvent(name, { detail: data }));
    };

    /**
      keys:[
        "translate",  "translateX",  "translateY", 
        "scale",  "scaleX", "scalY",
        "rotate"
      ]
    */
    #getTransform(el, keys) {
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

      const mArr = matrix.split("(")[1].split(")")[0].split(",").map(Number);
      const values = { matrix: mArr };

      if (!keys || !keys.length) return values;

      keys.forEach(key => {
        switch (key) {
          case "translate":
            values["translate"] = [mArr[4], mArr[5]];
            break;
          case "translateX":
            values["translateX"] = mArr[4];
            break;
          case "translateY":
            values["translateY"] = mArr[5];
            break;
          case "scale":
            values["scale"] =
              Math.sqrt(mArr[0] ** 2, mArr[1] ** 2);
            break;
          case "scaleX":
            values["scaleX"] = mArr[0];
            break;
          case "scaleY":
            values["scaleY"] = mArr[3];
            break;
          case "rotate":
            values["rotate"] =
              Math.round(Math.atan2(mArr[1], mArr[0]) * (180 / Math.PI));
            break;
          default:
            break
        }
      })
      return values;
    }
  }

  window.Gesture = Object.freeze(Gesture);
})()