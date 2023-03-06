import CommonMethods from "./commonMethods.js";
import Transform from "./Transform.js";
import Point from "./point.js";
/**
   * 自定義事件，封裝手勢操作
   * Events: 
   *  tap: 單指，觸摸螢幕到離開小於默認間隔(250ms)時觸發
   *  drag: 單指，拖拉元素
   *  scale: 雙指，縮放元素
   *  rotate: 雙指，旋轉元素
  */
class MobileGesture extends CommonMethods {
  static EVENTS = {
    START: 0,
    TAP: 1,
    DRAG: 2,
    PINCH: 3,
    PINCH_IN: 4,
    PINCH_OUT: 5,
    ROTATE: 6,
    END: 7,
  }

  constructor({
    element = null,
    defaultTapTime = 250,
    maxScale = 5,
    minScale = 0.5,
  }) {
    super();
    this.element =
      typeof (element) === 'string' ? document.querySelector(element) : element;
    this.DefaultTapTime = defaultTapTime; // tap 間隔時間
    this.MaxScale = maxScale; // 最大縮放數值
    this.MinScale = minScale; // 最小縮放數值
    this.state = {
      now: null, // touch start 當下的時間
      pointers: [], // touch start 座標位置(Point[x,y])
      rotates: [], // touch start 兩指的直線距離與x軸的角度
      distance: [0, 0], // 縮放比率
      scale: 1,
    };

    const listeners = {
      touchstart: this.handleStart.bind(this),
      touchmove: this.handleMove.bind(this),
      touchend: this.handleEnd.bind(this),
      touchcancel: this.handleEnd.bind(this),
    };
    Object.keys(listeners).forEach(key => {
      this.element.addEventListener(key, listeners[key]);
    })

    this.destroy = () => {
      Object.keys(listeners).forEach(key => {
        this.element.removeEventListener(key, listeners[key]);
      })
    };
  }

  handleStart(evt) {
    this.state.now = performance.now();
    // @TODO: refactor may should record start touches and add identifyId 
    this.state.pointers[0] = new Point(evt.touches[0].pageX, evt.touches[0].pageY);

    if (evt.touches.length === 2) {
      const touchPointers = this.state.pointers;
      this.state.pointers[1] = new Point(evt.touches[1].pageX, evt.touches[1].pageY);
      this.state.distance[0] =
        touchPointers[0].getSqrtLenByPoint(touchPointers[1]);
      this.state.rotates[0] =
        touchPointers[0].getDegreeByPoint(touchPointers[1]);
    }

    evt.state = this.state;
    this.fire(MobileGesture.EVENTS.START, evt);
  }
  handleMove(evt) {
    const startPointerLen = this.state.pointers.length;
    if (evt.touches.length === 2 && startPointerLen === 2) {
      this.pinch(evt);
      this.rotate(evt);
    } else if (startPointerLen === 1) {
      this.drag(evt);
    }
  }

  handleEnd(evt) {
    if ((performance.now() - this.state.now) < this.DefaultTapTime) {
      this.tap(evt);
    };

    this.state.pointers = [];
    this.state.rotates = [];
    this.state.distance = [0, 0];
    this.state.now = null;
    evt.state = this.state;
    this.fire(MobileGesture.EVENTS.END, evt);
  }

  tap(e) {
    const cPointer =
      new Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    const { x, y } = cPointer.subtract(this.state.pointers[0]);

    if (Math.abs(x) < 10 && Math.abs(y) < 10) {
      e.state = this.state;
      this.fire(MobileGesture.EVENTS.TAP, e);
    }
  }

  drag(e) {
    const cPointer = new Point(e.touches[0].pageX, e.touches[0].pageY);
    const { x, y } = cPointer.subtract(this.state.pointers[0]);

    e.deltaX = x;
    e.deltaY = y;
    e.state = this.state;
    this.fire(MobileGesture.EVENTS.DRAG, e);
    this.state.pointers[0] = cPointer;
  };

  pinch(e) {
    const distance = this.state.distance;
    const fPointer =
      new Point(e.touches[0].pageX, e.touches[0].pageY);
    const sPointer =
      new Point(e.touches[1].pageX, e.touches[1].pageY);

    distance[1] = fPointer.getSqrtLenByPoint(sPointer);
    const scale = distance[1] / distance[0];

    e.zoom = this.state.scale = scale;
    e.state = this.state;
    this.fire(MobileGesture.EVENTS.PINCH, e);
    if (scale > 1) this.fire(MobileGesture.EVENTS.PINCH_IN, e);
    if (scale < 1) this.fire(MobileGesture.EVENTS.PINCH_OUT, e);
  }

  rotate(e) {
    const current = {
      fPointer: new Point(e.touches[0].pageX, e.touches[0].pageY),
      sPointer: new Point(e.touches[1].pageX, e.touches[1].pageY),
    }
    const startAngle = this.state.rotates[0];
    const curAngle = current.fPointer.getDegreeByPoint(current.sPointer);

    e.rotate = curAngle - startAngle;
    e.state = this.state;
    this.fire(MobileGesture.EVENTS.ROTATE, e);
  }
}

export default MobileGesture;