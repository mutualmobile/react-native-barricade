import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Barricade } from '../network';
import { useThemedColor } from '../theme';

export type FooterProps = {
  barricade?: Barricade;
};

const Footer = (props: FooterProps): JSX.Element => {
  const { themeColorStyle } = useThemedColor();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshList, setRefreshList] = useState(0);

  const onButtonPressed = () => {
    props.barricade?.running
      ? props.barricade?.shutdown()
      : props.barricade?.start();
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
            props.barricade?.running
              ? themeColorStyle.error
              : themeColorStyle.primary,
          ]}>
          {props.barricade?.running ? 'Disable Barricade' : 'Enable Barricade'}
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
    marginHorizontal: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export { Footer };
