class Observer {
  constructor() {
    this.events = {}
  }
  on(key, callback) {
    this.events[key] = this.events[key] || [];
    this.events[key].push(callback);
  }
  fire(key, evtData) {
    const callbacks = this.events[key];

    if (callbacks) {
      callbacks.forEach(callback => callback(evtData));
    }
  }
  remove(key, callback) {
    const index = this.events[key].indexOf(callback);

    if (index !== -1) this.events[key].splice(index, 1);
  }
  removeAll() {
    this.events[key] = [];
    return true
  }
}

export default Observer;