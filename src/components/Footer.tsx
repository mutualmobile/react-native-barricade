import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';

import { useThemedColor } from '../theme';
import { hScale } from '../utils';

export type FooterProps = {
  onPress?: (event: NativeSyntheticEvent<any>) => void;
  title: string;
  titleStyle: TextStyle;
};

const Footer = (props: FooterProps): JSX.Element => {
  const { onPress, title, titleStyle } = props;
  const { themeColorStyle } = useThemedColor();

  return (
    <View
      style={[
        styles.container,
        themeColorStyle.background,
        themeColorStyle.border,
      ]}>
      <TouchableOpacity onPress={onPress} style={styles.footer}>
        <Text numberOfLines={1} style={[styles.title, titleStyle]}>
          {title}
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
