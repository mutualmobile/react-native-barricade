import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { BarricadeView } from '../../components/BarricadeView';
import { RequestDetail } from '../../components/RequestDetail';
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
  jest.clearAllMocks();
  barricade.shutdown();
});

test('given that barricade is undefined, should match snapshot', () => {
  const tree = renderer.create(
    <BarricadeView
      barricade={undefined}
      onRequestClose={jest.fn}
      visible={true}
    />,
  );
  expect(tree).toMatchSnapshot();
  expect.assertions(1);
});

test('given that theme is light and list view is selected, should match BarricadeView snapshot', () => {
  const tree = renderer.create(
    <BarricadeView
      barricade={barricade}
      onRequestClose={jest.fn}
      theme={'light'}
      visible={true}
    />,
  );
  expect(tree).toMatchSnapshot();
  expect.assertions(1);
});

test('given that theme is dark and list view is selected, should match BarricadeView snapshot', () => {
  const tree = renderer.create(
    <BarricadeView
      barricade={barricade}
      onRequestClose={jest.fn}
      theme={'dark'}
      visible={true}
    />,
  );
  expect(tree).toMatchSnapshot();
  expect.assertions(1);
});

test('given that theme is light and detail view is selected, should match BarricadeView snapshot', async () => {
  const tree = renderer.create(
    <BarricadeView
      barricade={barricade}
      onRequestClose={jest.fn}
      theme={'light'}
      visible={true}
    />,
  );
  const instance = tree.root;
  await act(async () =>
    instance.findByType(RequestList).props.onListItemPressed(0),
  );

  expect(tree).toMatchSnapshot();
  expect.assertions(1);
});

test('given that theme is dark and detail view is selected, should match BarricadeView snapshot', async () => {
  const tree = renderer.create(
    <BarricadeView
      barricade={barricade}
      onRequestClose={jest.fn}
      theme={'dark'}
      visible={true}
    />,
  );
  const instance = tree.root;
  await act(async () =>
    instance.findByType(RequestList).props.onListItemPressed(0),
  );

  expect(tree).toMatchSnapshot();
  expect.assertions(1);
});

test('when "Back" button is pressed from detail view, should go back to list view', async () => {
  const tree = renderer.create(
    <BarricadeView
      barricade={barricade}
      onRequestClose={jest.fn}
      theme={'dark'}
      visible={true}
    />,
  );
  const instance = tree.root;
  await act(async () => {
    await instance.findByType(RequestList).props.onListItemPressed(0);
    await instance.findByType(RequestDetail).props.onBackPressed();
  });

  expect(() => instance.findByType(RequestDetail)).toThrow();
  expect.assertions(1);
});
