import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Strings } from '../assets';
import { HttpStatus, ImageSizeSuffix } from '../constants';
import { useMountEffect } from '../hooks';
import { GeneralStackParamList, GeneralStackRouteName } from '../navigation';
import { PhotoService, PhotoServiceTypes } from '../services';
import { getImageUrl, hScale, vScale } from '../utils';

type Props = NativeStackScreenProps<
  GeneralStackParamList,
  GeneralStackRouteName.Details
>;
export const Details = ({ route }: Props) => {
  const [info, setInfo] = useState<PhotoServiceTypes.PhotoDetail>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useMountEffect(() => {
    PhotoService.getPhotoInfo(route.params.photoId)
      .then(response => {
        if (response?.stat === HttpStatus.ok) {
          setInfo(response.photo);
        } else {
          setError(
            response?.message ?? Strings.errorMessage.something_went_wrong,
          );
        }
      })
      .catch(() => {
        setError(Strings.errorMessage.something_went_wrong);
      })
      .finally(() => {
        setIsLoading(false);
      });
  });

  const renderErrorView = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.error}>{error}</Text>
    </View>
  );

  const renderLoadingView = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size={'large'} />
    </View>
  );

  const renderPhotoInfo = () => {
    return (
      <View style={styles.infoContainer}>
        <Image
          style={styles.img}
          source={{
            uri: getImageUrl(
              info!.id,
              info!.secret,
              info!.server,
              ImageSizeSuffix.Large,
            ),
          }}
          resizeMode="cover"
        />
        <Text style={styles.title} numberOfLines={1}>
          {info!.title._content}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {info!.description?._content}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {info ? (
        renderPhotoInfo()
      ) : isLoading ? (
        renderLoadingView()
      ) : error ? (
        renderErrorView()
      ) : (
        <React.Fragment />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.background,
    paddingHorizontal: hScale(20),
    paddingVertical: vScale(30),
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.Bold,
    fontSize: hScale(20),
    marginTop: vScale(10),
    textAlign: 'left',
  },
  description: {
    color: Colors.lightText,
    fontFamily: Fonts.Regular,
    fontSize: hScale(16),
    marginTop: vScale(10),
    textAlign: 'left',
  },
  img: {
    width: '100%',
    height: '80%',
    backgroundColor: Colors.border,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: Colors.text,
    fontFamily: Fonts.Regular,
    fontSize: hScale(14),
  },
});
