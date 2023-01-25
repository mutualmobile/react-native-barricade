import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Footer } from '../../components/Footer';
import { Strings } from '../../constants';
import { LightThemeColors } from '../../theme/colors';

test('should match Footer snapshot', () => {
  const tree = renderer.create(
    <Footer
      title={Strings.DisableBarricade}
      titleStyle={{ color: LightThemeColors.error }}
      onPress={jest.fn}
    />,
  );
  expect(tree).toMatchSnapshot();
  expect.assertions(1);
});

test('given that onPress is passed to Footer, when its pressed should call the onPress prop', async () => {
  const onPress = jest.fn();
  const tree = renderer.create(
    <Footer
      onPress={onPress}
      title={Strings.DisableBarricade}
      titleStyle={{ color: LightThemeColors.error }}
    />,
  );
  const instance = tree.root;
  await act(() => instance.findByType(TouchableOpacity).props.onPress());

  expect(onPress).toHaveBeenCalled();
  expect.assertions(1);
});
