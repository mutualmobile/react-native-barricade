import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer, { act } from 'react-test-renderer';

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

test('should match RequestDetail snapshot', () => {
  const tree = renderer.create(
    <RequestDetail
      barricade={barricade}
      selectedListItemIndex={0}
      onBackPressed={jest.fn}
    />,
  );
  expect(tree).toMatchSnapshot();
  expect.assertions(1);
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
  await act(() => instance.findAllByType(TouchableOpacity)[1].props.onPress());

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
  await act(() => instance.findAllByType(TouchableOpacity)[2].props.onPress());

  expect(barricade.requestConfig[0].responseHandler[1].isSelected).toBe(true);
  expect.assertions(1);
});
