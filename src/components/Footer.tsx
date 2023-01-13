import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Strings } from '../constants';
import { Barricade } from '../network';
import { useThemedColor } from '../theme';
import { hScale } from '../utils';

export type FooterProps = {
  barricade: Barricade;
};

const Footer = (props: FooterProps): JSX.Element => {
  const { barricade } = props;
  const { themeColorStyle } = useThemedColor();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshList, setRefreshList] = useState(0);

  const onButtonPressed = () => {
    barricade.running ? barricade.shutdown() : barricade.start();
    setRefreshList(Math.random());
  };

  return (
    <View
      style={[
        styles.container,
        themeColorStyle.background,
        themeColorStyle.border,
      ]}>
      <TouchableOpacity onPress={onButtonPressed} style={styles.footer}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            barricade.running ? themeColorStyle.error : themeColorStyle.primary,
          ]}>
          {barricade.running
            ? Strings.DisableBarricade
            : Strings.EnableBarricade}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderTopWidth: 1,
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: hScale(12),
  },
  title: {
    textAlign: 'center',
    fontSize: hScale(18),
  },
});

export { Footer };
