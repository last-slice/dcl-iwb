// Listener.ts
type Callback = (...args: any[]) => void;

class Listener {
  private events: { [eventName: string]: Callback[] } = {};

  public on(eventName: string, callback: Callback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);
  }

  public off(eventName: string, callback?: Callback): void {
    if (!this.events[eventName]) {
      return;
    }

    if (!callback) {
      delete this.events[eventName];
    } else {
      const index = this.events[eventName].indexOf(callback);
      if (index !== -1) {
        this.events[eventName].splice(index, 1);
      }
    }
  }

  public emit(eventName: string, data: any): void { // Pass the JSON object as an argument
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      eventCallbacks.forEach((callback) => {
        callback(data); // Pass the JSON object to the callback
      });
    }
  }
}

export default Listener;
