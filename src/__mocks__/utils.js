export const mockDimensions = ({ width, height }) => {
  jest.resetModules();
  jest.doMock('react-native/Libraries/Utilities/Dimensions', () => ({
    get: jest.fn().mockReturnValue({ width, height }),
  }));
};
