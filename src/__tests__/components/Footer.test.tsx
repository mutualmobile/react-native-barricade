import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Footer } from '../../components/Footer';
import { Barricade } from '../../network/barricade';
import {
  firstApiConfig,
  secondApiConfig,
  thirdApiConfig,
} from '../data/barricade-test-data';

let barricade: Barricade;
beforeEach(() => {
  barricade = new Barricade([firstApiConfig, secondApiConfig, thirdApiConfig]);
  barricade.start();
});

afterEach(() => {
  jest.clearAllMocks();
  barricade.shutdown();
});

describe('given that Barricade is enabled,', () => {
  test('should match Footer snapshot', () => {
    const tree = renderer.create(<Footer barricade={barricade} />);
    expect(tree).toMatchSnapshot();
    expect.assertions(1);

    barricade.shutdown();
  });

  test('when "Disable barricade" button is pressed, should disable barricade', async () => {
    barricade.shutdown = jest.fn();
    const tree = renderer.create(<Footer barricade={barricade} />);
    const instance = tree.root;
    await act(() => instance.findByType(TouchableOpacity).props.onPress());

    expect(barricade.shutdown).toHaveBeenCalled();
    expect.assertions(1);
  });
});

describe('given that Barricade is disabled,', () => {
  test('given that Barricade is disabled, should match Footer snapshot', () => {
    barricade.shutdown();

    const tree = renderer.create(<Footer barricade={barricade} />);
    expect(tree).toMatchSnapshot();

    expect.assertions(1);
  });

  test('when "Enable barricade" button is pressed, should enable barricade', async () => {
    barricade.shutdown();
    barricade.start = jest.fn();
    const tree = renderer.create(<Footer barricade={barricade} />);
    const instance = tree.root;
    await act(() => instance.findByType(TouchableOpacity).props.onPress());

    expect(barricade.start).toHaveBeenCalledTimes(1);
    expect.assertions(1);
  });
});
