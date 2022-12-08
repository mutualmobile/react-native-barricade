export type EventDefinition = {
  readonly [key: string]: Event;
};

export interface EventListener {
  (evt: Event): void;
}

export interface FunctionListener<TEvent> {
  (event: TEvent): void;
}

export class EventTarget {
  _eventListeners: Record<string, any> = [];

  constructor() {
    const events = [
      'abort',
      'error',
      'load',
      'loadstart',
      'progress',
      'timeout',
      'loadend',
      'readystatechange',
    ];

    for (let i = events.length - 1; i >= 0; i--) {
      const eventName = events[i];
      this.addEventListener(eventName, (event: Event) => {
        // @ts-ignore
        const listener = this['on' + eventName];

        if (listener && typeof listener === 'function') {
          listener.call(event.target, event);
        }
      });
    }
  }

  addEventListener(event: string, listener: EventListener) {
    this._eventListeners[event] = this._eventListeners[event] || [];
    this._eventListeners[event].push(listener);
  }

  removeEventListener(event: string, listener: EventListener) {
    const listeners = this._eventListeners[event] || [];

    for (let i = 0, l = listeners.length; i < l; ++i) {
      if (listeners[i] === listener) {
        return listeners.splice(i, 1);
      }
    }
  }

  dispatchEvent(event: Event) {
    const type = event.type;
    const listeners = this._eventListeners[type] || [];

    for (let i = 0; i < listeners.length; i++) {
      if (typeof listeners[i] === 'function') {
        listeners[i].call(this, event);
      } else {
        listeners[i].handleEvent(event);
      }
    }

    return !!event.defaultPrevented;
  }

  _progress(lengthComputable: boolean, loaded: number, total: number) {
    const event = new Event('progress');
    event.target = this;
    // @ts-ignore
    event.lengthComputable = lengthComputable;
    // @ts-ignore
    event.loaded = loaded;
    // @ts-ignore
    event.total = total;
    this.dispatchEvent(event);
  }
}

export class Event {
  /**
   * The type of this event.
   */
  type = '';

  /**
   * The flag indicating bubbling.
   */
  bubbles = false;

  /**
   * The flag indicating whether the event can be canceled.
   */
  cancelable = false;

  /**
   * The target of this event.
   */
  target: EventTarget | null = null;

  constructor(
    type: string,
    bubbles = false,
    cancelable = false,
    target: EventTarget | null = null,
  ) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
    this.target = target;
  }

  /**
   * The current target of this event.
   */
  currentTarget: EventTarget | null = null;

  /**
   * The composed path of this event.
   */
  composedPath(): EventTarget[] {
    return this.currentTarget ? [this.currentTarget] : [];
  }

  /**
   * Constant of NONE.
   */
  readonly NONE: number = 0;

  /**
   * Constant of CAPTURING_PHASE.
   */
  readonly CAPTURING_PHASE: number = 1;

  /**
   * Constant of BUBBLING_PHASE.
   */
  readonly BUBBLING_PHASE: number = 3;

  /**
   * Constant of AT_TARGET.
   */
  readonly AT_TARGET: number = 2;

  /**
   * Indicates which phase of the event flow is currently being evaluated.
   */
  readonly eventPhase: number = 0;

  /**
   * Stop event bubbling.
   */
  stopPropagation(): void {
    // do nothing
  }

  /**
   * Stop event bubbling.
   */
  stopImmediatePropagation(): void {
    // do nothing
  }

  /**
   * Cancel this event.
   */
  preventDefault(): void {
    this.defaultPrevented = true;
  }

  /**
   * The flag to indicating whether the event was canceled.
   */
  defaultPrevented = false;

  /**
   * The flag to indicating if event is composed.
   */
  composed = false;

  /**
   * Indicates whether the event was dispatched by the user agent.
   */
  readonly isTrusted: boolean = false;

  /**
   * The unix time of this event.
   */
  timeStamp: number = Date.now();
}
