import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

import { Colors } from '../assets';
import { useMountEffect } from '../hooks';
import { GeneralStackParamList, GeneralStackRouteName } from '../navigation';
import { hScale } from '../utils';

type Props = NativeStackScreenProps<
  GeneralStackParamList,
  GeneralStackRouteName.Splash
>;
export const Splash = ({ navigation }: Props) => {
  useMountEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide({ fade: true }).then(() => {
        navigation.replace(GeneralStackRouteName.Home);
      });
    }, 3000);
  });

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: hScale(20),
  },
});
