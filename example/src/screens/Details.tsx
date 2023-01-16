import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '../assets';
import { ImageSizeSuffix } from '../constants';
import { GeneralStackParamList, GeneralStackRouteName } from '../navigation';
import { getImageUrl, hScale, vScale } from '../utils';

type Props = NativeStackScreenProps<
  GeneralStackParamList,
  GeneralStackRouteName.Details
>;
export const Details = ({ route }: Props) => {
  const { data } = route.params;
  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={{
          uri: getImageUrl(data, ImageSizeSuffix.Large),
        }}
        resizeMode="cover"
      />
      <Text style={styles.message} numberOfLines={3}>
        {data.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
    padding: hScale(20),
  },
  message: {
    color: Colors.text,
    fontFamily: Fonts.Bold,
    fontSize: hScale(20),
    marginTop: vScale(10),
    textAlign: 'left',
  },
  img: {
    width: '100%',
    height: '80%',
  },
});
