import React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Colors } from '../assets';
import { hScale, vScale } from '../utils';

type IconButtonProps = {
  icon: ImageSourcePropType;
  onPress: (event: GestureResponderEvent) => void;
};

export const IconButton = (props: IconButtonProps) => {
  const { onPress, icon } = props;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={icon} style={styles.buttonIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: hScale(30),
    bottom: vScale(20),
    height: hScale(60),
    justifyContent: 'center',
    position: 'absolute',
    right: hScale(20),
    width: hScale(60),
  },
  buttonIcon: {
    height: hScale(30),
    tintColor: Colors.textAlt,
    width: hScale(30),
  },
});
