import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { useThemedColor } from '../theme';
import { hScale, vScale } from '../utils';

export type ButtonProps = {
  onPress?: (event: NativeSyntheticEvent<any>) => void;
  title: string;
};

export type HeaderProps = {
  headerLeft?: ButtonProps;
  headerRight?: ButtonProps;
  title: string;
};

const Header = (props: HeaderProps): JSX.Element => {
  const { headerLeft, headerRight, title } = props;
  const { themeColorStyle } = useThemedColor();

  const renderButton = (buttonProps: ButtonProps, style: ViewStyle) => {
    return (
      <TouchableOpacity onPress={buttonProps.onPress} style={style}>
        <Text style={[styles.buttonText, themeColorStyle.primary]}>
          {buttonProps.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text
          numberOfLines={1}
          style={[styles.title, themeColorStyle.textDark]}>
          {title}
        </Text>
        {headerLeft && renderButton(headerLeft, styles.headerLeft)}
        <View style={styles.flex} />
        {headerRight && renderButton(headerRight, styles.headerRight)}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        themeColorStyle.background,
        themeColorStyle.border,
      ]}>
      {renderHeader()}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    borderBottomWidth: 1,
  },
  header: {
    marginHorizontal: hScale(12),
    height: vScale(50),
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: hScale(20),
    fontWeight: 'bold',
    marginHorizontal: hScale(60),
    left: 0,
    right: 0,
  },
  buttonText: {
    fontSize: hScale(18),
    margin: hScale(8),
    textAlign: 'center',
  },
  headerLeft: {
    marginRight: hScale(10),
  },
  headerRight: {
    marginLeft: hScale(10),
  },
});

export { Header };
