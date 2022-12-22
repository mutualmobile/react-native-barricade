import React from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { useThemedColor } from '../theme';

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
          {props.title}
        </Text>
        {props.headerLeft && renderButton(props.headerLeft, styles.headerLeft)}
        <View style={styles.flex} />
        {props.headerRight &&
          renderButton(props.headerRight, styles.headerRight)}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        themeColorStyle.background,
        themeColorStyle.border,
      ]}>
      {renderHeader()}
    </SafeAreaView>
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
    marginHorizontal: 12,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 60,
    left: 0,
    right: 0,
  },
  buttonText: {
    fontSize: 18,
    margin: 8,
    textAlign: 'center',
  },
  headerLeft: {
    marginRight: 10,
  },
  headerRight: {
    marginLeft: 10,
  },
});

export { Header };
