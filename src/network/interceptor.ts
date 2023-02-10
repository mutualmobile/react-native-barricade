import { Barricade } from './barricade';
import { Request } from './barricade.types';
import { MockedXMLHttpRequest } from './mocked-xml-http-request';

export function interceptor(ctx: Barricade) {
  class InterceptedMockedXMLHttpRequest extends MockedXMLHttpRequest {
    constructor() {
      super();
    }

    send(data?: string) {
      if (!ctx.running) {
        throw new Error(
          'Barricade instance was shut down while there was a pending request that just tried to complete.',
        );
      }

      super.send(data);
      ctx.handleRequest(this as Request);
    }
  }

  return InterceptedMockedXMLHttpRequest as unknown as typeof XMLHttpRequest;
}
