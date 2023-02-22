const rafThrottle = (callback) => {
  let id = null;
  let lastArgs;

  const fn = (context) => () => {
    id = null;
    callback.apply(context, lastArgs);
  };

  const throttled = function (...args) {
    lastArgs = args;
    if (!id) {
      id = requestAnimationFrame(fn(this));
    }
  };

  // for directly cancel
  throttled.cancel = () => {
    cancelAnimationFrame(id);
    id = null;
  };

  return throttled;
};

export default rafThrottle;
