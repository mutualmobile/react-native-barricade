import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { Header } from '../../components/Header';
import { RequestList } from '../../components/RequestList';
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
  barricade.shutdown();
});

test('should match RequestList snapshot', () => {
  const tree = renderer.create(
    <RequestList
      barricade={barricade}
      onDonePressed={jest.fn}
      onListItemPressed={jest.fn}
    />,
  );
  expect(tree).toMatchSnapshot();
  expect.assertions(1);
});

test('when "Done" button is pressed, should close barricade view', async () => {
  const onDonePressed = jest.fn();
  const tree = renderer.create(
    <RequestList
      barricade={barricade}
      onDonePressed={onDonePressed}
      onListItemPressed={jest.fn}
    />,
  );
  const instance = tree.root;
  await act(async () => {
    await instance.props.onDonePressed();
  });

  expect(onDonePressed).toHaveBeenCalled();
  expect.assertions(1);
});

test('when "Reset" button is pressed, should reset barricade config', async () => {
  barricade.resetRequestConfig = jest.fn();
  const tree = renderer.create(
    <RequestList
      barricade={barricade}
      onDonePressed={jest.fn}
      onListItemPressed={jest.fn}
    />,
  );
  const instance = tree.root;
  await act(() => {
    instance.findByType(Header).props.headerLeft.onPress();
  });

  expect(barricade.resetRequestConfig).toHaveBeenCalled();
  expect.assertions(1);
});

test('when a list item is pressed, should call onListItemPressed', async () => {
  const onListItemPressed = jest.fn();
  const tree = renderer.create(
    <RequestList
      barricade={barricade}
      onDonePressed={jest.fn}
      onListItemPressed={onListItemPressed}
    />,
  );
  const instance = tree.root;
  await act(() => {
    const findAllByTestID = instance.findAll(
      el => el.props.testID === 'listItem0',
    );

    findAllByTestID[0].props.onPress();
  });

  expect(onListItemPressed).toHaveBeenCalled();
  expect.assertions(1);
});
