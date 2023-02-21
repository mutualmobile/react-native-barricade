/**
 * @jest-environment jsdom
 */
import React from 'react';
import { DeviceEventEmitter, DevSettings } from 'react-native';
import renderer from 'react-test-renderer';
import { EventType, Strings } from '../constants';

describe('given that its not __DEV__ mode', () => {
  let Barricade;
  beforeAll(() => {
    (global as any).__DEV__ = false;
    Barricade = require('../index');
  });

  describe('and barricade is undefined,', () => {
    test('should match snapshot', () => {
      const tree = renderer.create(<Barricade.BarricadeView />);

      expect(tree).toMatchSnapshot();
      expect.assertions(1);
    });

    test('getBarricadeInstance should return undefined', () => {
      expect(Barricade.getBarricadeInstance()).toBe(undefined);
      expect.assertions(1);
    });
  });

  test('and createBarricade is called, should create barricade instance and add Barricade to debug menu', () => {
    const spy = jest.spyOn(DevSettings, 'addMenuItem');

    const barricade = Barricade.createBarricade();

    expect(barricade).not.toBe(undefined);
    expect(spy).not.toHaveBeenCalledWith(
      Strings.Barricade,
      Barricade.showBarricadeView,
    );
    expect.assertions(2);
  });

  test('and showBarricadeView is called, should not emit ShowBarricadeView event', () => {
    const spy = jest.spyOn(DeviceEventEmitter, 'emit');

    Barricade.showBarricadeView();

    expect(spy).not.toHaveBeenCalledWith(EventType.ShowBarricadeView);
    expect.assertions(1);
  });

  describe('and barricade instance is created,', () => {
    let BarricadeInstance;
    beforeAll(() => {
      BarricadeInstance = Barricade.createBarricade();
    });

    test('getBarricadeInstance should return Barricade instance', () => {
      expect(Barricade.getBarricadeInstance()).toBe(BarricadeInstance);
      expect.assertions(1);
    });
  });
});
