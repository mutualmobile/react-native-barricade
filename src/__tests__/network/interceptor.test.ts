import { Barricade } from '../../network/barricade';
import { interceptor } from '../../network/interceptor';
import { firstApiConfig } from '../data/barricade-test-data';

const barricade = new Barricade([firstApiConfig]);
const handleRequest = jest.fn();
barricade.handleRequest = handleRequest;
const InterceptorClass = interceptor(barricade);
const interceptorInstance = new InterceptorClass();

describe('given that interceptor is called with reference to Barricade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('when send is called and barricade is not running, should throw error', () => {
    expect(() => interceptorInstance.send()).toThrow(
      new Error(
        'Barricade instance was shut down while there was a pending request that just tried to complete.',
      ),
    );

    expect.assertions(1);
  });

  test('when send is called and barricade is running, should call handleRequest', () => {
    barricade.start();
    interceptorInstance.open('get', 'url');

    interceptorInstance.send();
    expect(barricade.handleRequest).toHaveBeenCalledWith(interceptorInstance);

    expect.assertions(1);
  });
});
