import React from 'react';
import renderer from 'react-test-renderer';

import { Header } from '../../components/Header';
import { Strings } from '../../constants';

test('given that Header is called with only title props, should match Header snapshot', () => {
  const tree = renderer.create(<Header title={'Header'} />);
  expect(tree).toMatchSnapshot();
  expect.assertions(1);
});

test('given that Header is called with title, headerLeft and headerRight props, should match Header snapshot', () => {
  const tree = renderer.create(
    <Header
      title={'Header with left and right buttons'}
      headerLeft={{ title: Strings.Reset, onPress: jest.fn }}
      headerRight={{ title: Strings.Done, onPress: jest.fn }}
    />,
  );
  expect(tree).toMatchSnapshot();

  expect.assertions(1);
});

test('given that Header is called with title and headerLeft props, should match Header snapshot', () => {
  const tree = renderer.create(
    <Header
      title={'Header with left button'}
      headerLeft={{ title: Strings.Reset, onPress: jest.fn }}
    />,
  );
  expect(tree).toMatchSnapshot();

  expect.assertions(1);
});

test('given that Header is called with title and headerRight props, should match Header snapshot', () => {
  const tree = renderer.create(
    <Header
      title={'Header with right button'}
      headerRight={{ title: Strings.Done, onPress: jest.fn }}
    />,
  );
  expect(tree).toMatchSnapshot();

  expect.assertions(1);
});
