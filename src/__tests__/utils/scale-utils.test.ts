import { mockDimensions } from '../../__mocks__/utils';

describe('given that hScale is called,', () => {
  afterAll(() => {
    jest.resetModules();
  });

  test('should return horizontally scaled up value, when device width is greater than guidelineBaseWidth', () => {
    mockDimensions({ height: 1334, width: 750 });
    const ScaleUtils = require('../../utils/scale-utils');
    expect(ScaleUtils.hScale(50)).toBe(100);

    expect.assertions(1);
  });

  test('should return same value, when device width is same as guidelineBaseWidth', () => {
    mockDimensions({ height: 812, width: 375 });
    const ScaleUtils = require('../../utils/scale-utils');
    expect(ScaleUtils.hScale(50)).toBe(50);

    expect.assertions(1);
  });

  test('should return horizontally scaled down value, when device width is lesser than guidelineBaseWidth', () => {
    mockDimensions({ height: 480, width: 320 });
    const ScaleUtils = require('../../utils/scale-utils');
    expect(ScaleUtils.hScale(50)).toBe(42.66666666666667);

    expect.assertions(1);
  });
});

describe('given that vScale is called,', () => {
  test('should return vertically scaled up value, when device height is greater than guidelineBaseHeight', () => {
    mockDimensions({ height: 1334, width: 750 });
    const ScaleUtils = require('../../utils/scale-utils');
    expect(ScaleUtils.vScale(50)).toBe(82.14285714285714);

    expect.assertions(1);
  });

  test('should return same value, when device height is same as guidelineBaseHeight', () => {
    mockDimensions({ height: 812, width: 375 });
    const ScaleUtils = require('../../utils/scale-utils');
    expect(ScaleUtils.vScale(50)).toBe(50);

    expect.assertions(1);
  });

  test('should return horizontally scaled down value, when device height is lesser than guidelineBaseHeight', () => {
    mockDimensions({ height: 480, width: 320 });
    const ScaleUtils = require('../../utils/scale-utils');
    expect(ScaleUtils.vScale(50)).toBe(29.55665024630542);

    expect.assertions(1);
  });
});

describe('given that width is greater than height,', () => {
  beforeAll(() => {
    mockDimensions({ height: 750, width: 1334 });
  });

  test('should scale horizontally using device height', () => {
    mockDimensions({ height: 750, width: 1334 });
    const ScaleUtils = require('../../utils/scale-utils');
    expect(ScaleUtils.hScale(50)).toBe(100);

    expect.assertions(1);
  });

  test('should scale vertically using device width', () => {
    mockDimensions({ height: 750, width: 1334 });
    const ScaleUtils = require('../../utils/scale-utils');
    expect(ScaleUtils.vScale(50)).toBe(82.14285714285714);

    expect.assertions(1);
  });
});
