import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { Colors, Images } from '../assets';
import { useMountEffect } from '../hooks';
import { GeneralStackParamList, GeneralStackRouteName } from '../navigation';
import { hScale, vScale } from '../utils';

type Props = NativeStackScreenProps<
  GeneralStackParamList,
  GeneralStackRouteName.Splash
>;
export const Splash = ({ navigation }: Props) => {
  useMountEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
      navigation.replace(GeneralStackRouteName.Home);
    }, 3000);
  });

  return (
    <View style={styles.container}>
      <Image source={Images.logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: hScale(20),
  },
  logo: {
    height: vScale(70),
    width: hScale(200),
  },
});
