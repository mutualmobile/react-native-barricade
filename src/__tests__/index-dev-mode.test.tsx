/**
 * @jest-environment jsdom
 */
jest.useFakeTimers();
import React from 'react';
import { DeviceEventEmitter, DevSettings } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import { EventType } from '../constants';

import {
  BarricadeView,
  createBarricade,
  getBarricadeInstance,
  showBarricadeView,
} from '../index';

describe('given that its __DEV__ mode', () => {
  describe('and barricade is undefined,', () => {
    test('should match snapshot', () => {
      const tree = renderer.create(<BarricadeView />);

      expect(tree).toMatchSnapshot();
      expect.assertions(1);
    });

    test('getBarricadeInstance should return undefined', () => {
      expect(getBarricadeInstance()).toBe(undefined);
      expect.assertions(1);
    });
  });

  test('and createBarricade is called, should create barricade instance and add Barricade to debug menu', () => {
    const spy = jest.spyOn(DevSettings, 'addMenuItem');

    const barricade = createBarricade();

    expect(barricade).not.toBe(undefined);
    expect(spy).toHaveBeenCalled();
    expect.assertions(2);
  });

  test('and showBarricadeView is called, should emit ShowBarricadeView event', () => {
    const spy = jest.spyOn(DeviceEventEmitter, 'emit');

    showBarricadeView();

    expect(spy).toHaveBeenCalledWith(EventType.ShowBarricadeView);
    expect.assertions(1);
  });

  describe('and barricade instance is created,', () => {
    let BarricadeInstance;
    beforeAll(() => {
      BarricadeInstance = createBarricade();
    });

    test('getBarricadeInstance should return Barricade instance', () => {
      expect(getBarricadeInstance()).toBe(BarricadeInstance);
      expect.assertions(1);
    });

    test('should add listener to ShowBarricadeView event when BarricadeView is mounted', () => {
      const addListenerSpy = jest.spyOn(DeviceEventEmitter, 'addListener');

      renderer.create(<BarricadeView />);

      expect(addListenerSpy).toHaveBeenCalledWith(
        EventType.ShowBarricadeView,
        expect.any(Function),
      );
      expect.assertions(1);
    });

    test('should set visibility of BarricadeView to true when showBarricadeView is called', async () => {
      const MMBarricadeView =
        require('../components/BarricadeView').BarricadeView;

      await act(async () => {
        const tree = renderer.create(<BarricadeView />);

        await jest.advanceTimersByTime(1000);
        showBarricadeView();
        await jest.advanceTimersByTime(1000);

        expect(tree.root.findByType(MMBarricadeView).props.visible).toBe(true);
      });

      expect.assertions(1);
    });

    test('should remove listener to ShowBarricadeView event when BarricadeView is unmounted', async () => {
      const removeAllListenersSpy = jest.spyOn(
        DeviceEventEmitter,
        'removeAllListeners',
      );

      const tree = renderer.create(<BarricadeView />);
      await act(async () => {
        tree.unmount();
      });

      expect(removeAllListenersSpy).toHaveBeenCalledWith(
        EventType.ShowBarricadeView,
      );
      expect.assertions(1);
    });

    test('should close the barricade view when BarricadeView calls onRequestClose', async () => {
      const MMBarricadeView =
        require('../components/BarricadeView').BarricadeView;

      await act(async () => {
        const tree = renderer.create(<BarricadeView />);

        await jest.advanceTimersByTime(1000);
        showBarricadeView();
        await jest.advanceTimersByTime(1000);

        // BarricadeView is visible
        expect(tree.root.findByType(MMBarricadeView).props.visible).toBe(true);

        tree.root.findByType(MMBarricadeView).props.onRequestClose();
        await jest.advanceTimersByTime(1000);

        // BarricadeView is not visible
        expect(tree.root.findByType(MMBarricadeView).props.visible).toBe(false);
      });

      expect.assertions(2);
    });
  });
});
