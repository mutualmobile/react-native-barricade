import { Event, EventListener, EventTarget } from '../../network/event';

describe('EventTarget', () => {
  test('given that an instance of EventTarget is created,should add event listeners', () => {
    const event = new EventTarget();

    expect(JSON.stringify(event._eventListeners)).toBe(
      JSON.stringify({
        readystatechange: [() => {}],
        loadend: [() => {}],
        timeout: [() => {}],
        progress: [() => {}],
        loadstart: [() => {}],
        load: [() => {}],
        error: [() => {}],
        abort: [() => {}],
      }),
    );
  });

  test('given that onload callback is not set, should not throw error when load event is triggered', () => {
    const eventTarget = new EventTarget();

    expect(() =>
      eventTarget.dispatchEvent({ type: 'load' } as Event),
    ).not.toThrow();
    expect.assertions(1);
  });

  test.each`
    event                 | callback
    ${'readystatechange'} | ${'onreadystatechange'}
    ${'loadend'}          | ${'onloadend'}
    ${'timeout'}          | ${'ontimeout'}
    ${'progress'}         | ${'onprogress'}
    ${'loadstart'}        | ${'onloadstart'}
    ${'load'}             | ${'onload'}
    ${'error'}            | ${'onerror'}
    ${'abort'}            | ${'onabort'}
  `(
    'given that $event event was triggered, should call $callback function',
    ({ event, callback }) => {
      const eventTarget = new EventTarget();
      eventTarget[callback] = jest.fn();

      eventTarget.dispatchEvent({ type: event } as Event);

      expect(eventTarget[callback]).toHaveBeenCalled();
      expect.assertions(1);
    },
  );

  test('when addEventListener is called with custom load callback, should add callback to _eventListeners list', () => {
    const onload = jest.fn();
    const eventTarget = new EventTarget();

    eventTarget.addEventListener('load', onload);
    expect(eventTarget._eventListeners.load.length).toBe(2);
    expect.assertions(1);
  });

  test('when custom callback with handler fn is added, should trigger handler on dispatch', () => {
    const handleEvent = jest.fn();
    const onload = { handleEvent } as unknown as EventListener;
    const eventTarget = new EventTarget();

    eventTarget.addEventListener('load', onload);
    eventTarget.dispatchEvent({ type: 'load' } as Event);

    expect(handleEvent).toHaveBeenCalled();
    expect.assertions(1);
  });

  test('given that onload callback is set, should remove the callback when removeEventListener is called', () => {
    const onload = jest.fn();
    const eventTarget = new EventTarget();

    eventTarget.addEventListener('load', onload);
    expect(eventTarget._eventListeners.load.length).toBe(2);
    eventTarget.removeEventListener('load', onload);

    expect(eventTarget._eventListeners.load.length).toBe(1);
    expect.assertions(2);
  });

  test('given that progress function is called, should dispatch progress event', () => {
    const eventTarget = new EventTarget();
    eventTarget.dispatchEvent = jest.fn();

    eventTarget._progress(true, 50, 100);

    expect(eventTarget.dispatchEvent).toHaveBeenCalled();
    expect.assertions(1);
  });
});

describe('Event', () => {
  test('given that instance of event was created, when preventDefault is called, defaultPrevented should be true', () => {
    const eventTarget = new EventTarget();
    const event = new Event('load', false, false, eventTarget);

    expect(event.defaultPrevented).toBe(false);
    event.preventDefault();

    expect(event.defaultPrevented).toBe(true);
    expect.assertions(2);
  });

  test('given that instance of event was created and currentTarget is set, should return composedPath when called', () => {
    const eventTarget = new EventTarget();
    const event = new Event('load', false, false, eventTarget);

    event.currentTarget = new EventTarget();

    expect(event.composedPath()).toEqual([event.currentTarget]);
    expect.assertions(1);
  });
});
