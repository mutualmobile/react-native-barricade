import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { Footer } from '../../components/Footer';
import { RequestDetail } from '../../components/RequestDetail';
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

describe('given that API is enabled,', () => {
  test('should match snapshot', () => {
    const selectedIndex = 0;
    barricade.requestConfig[selectedIndex].disabled = false;

    const tree = renderer.create(
      <RequestDetail
        barricade={barricade}
        selectedListItemIndex={selectedIndex}
        onBackPressed={jest.fn}
      />,
    );

    expect(tree).toMatchSnapshot();
    expect.assertions(1);
  });

  test('when "Disable API Mock" button is pressed, should disable API for mocking', async () => {
    const selectedIndex = 0;
    barricade.requestConfig[selectedIndex].disabled = false;

    const tree = renderer.create(
      <RequestDetail
        barricade={barricade}
        selectedListItemIndex={selectedIndex}
        onBackPressed={jest.fn}
      />,
    );
    const instance = tree.root;
    await act(async () => {
      await instance.findByType(Footer).props.onPress();
    });

    expect(barricade.requestConfig[selectedIndex].disabled).toBe(true);
    expect.assertions(1);
  });
});

describe('given that API is disabled,', () => {
  test('should match snapshot', () => {
    const selectedIndex = 0;
    barricade.requestConfig[selectedIndex].disabled = true;

    const tree = renderer.create(
      <RequestDetail
        barricade={barricade}
        selectedListItemIndex={selectedIndex}
        onBackPressed={jest.fn}
      />,
    );

    expect(tree).toMatchSnapshot();
    expect.assertions(1);
  });

  test('when "Enable API Mock" button is pressed, should enable API for mocking', async () => {
    const selectedIndex = 0;
    barricade.requestConfig[selectedIndex].disabled = true;

    const tree = renderer.create(
      <RequestDetail
        barricade={barricade}
        selectedListItemIndex={selectedIndex}
        onBackPressed={jest.fn}
      />,
    );
    const instance = tree.root;
    await act(async () => {
      await instance.findByType(Footer).props.onPress();
    });

    expect(barricade.requestConfig[selectedIndex].disabled).toBe(false);
    expect.assertions(1);
  });
});

test('when an selected list item is pressed, should select list item', async () => {
  const tree = renderer.create(
    <RequestDetail
      barricade={barricade}
      selectedListItemIndex={0}
      onBackPressed={jest.fn}
    />,
  );
  const instance = tree.root;
  await act(() => {
    const findAllByTestID = instance.findAll(
      el => el.props.testID === 'responseListItem0',
    );

    findAllByTestID[0].props.onPress();
  });

  expect(barricade.requestConfig[0].responseHandler[0].isSelected).toBe(true);
  expect.assertions(1);
});

test('when an unselected list item is pressed, should select list item', async () => {
  const tree = renderer.create(
    <RequestDetail
      barricade={barricade}
      selectedListItemIndex={0}
      onBackPressed={jest.fn}
    />,
  );
  const instance = tree.root;
  await act(() => {
    const findAllByTestID = instance.findAll(
      el => el.props.testID === 'responseListItem1',
    );

    findAllByTestID[0].props.onPress();
  });

  expect(barricade.requestConfig[0].responseHandler[1].isSelected).toBe(true);
  expect.assertions(1);
});
