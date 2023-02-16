import { NativeStackScreenProps } from '@react-navigation/native-stack';
import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, Fonts } from '../assets';
import { SearchText } from '../components';
import { ImageSizeSuffix, INITIAL_PAGE_NO } from '../constants';
import { useAppDispatch, useAppSelector, useMountEffect } from '../hooks';
import { GeneralStackParamList, GeneralStackRouteName } from '../navigation';
import {
  apiTestResult,
  getRecentResults,
  getSearchResults,
  resetRecentResults,
  resetSearchResults,
} from '../redux';
import { PhotoServiceTypes } from '../services';
import { getImageUrl, hScale, vScale } from '../utils';
import DocumentPicker from 'react-native-document-picker';

type Props = NativeStackScreenProps<
  GeneralStackParamList,
  GeneralStackRouteName.Home
>;
export const Home = ({ navigation }: Props) => {
  const {
    recentError,
    recentPage,
    recentResult,
    recentTotalPages,
    searchError,
    searchPage,
    searchResult,
    searchTotalPages,
  } = useAppSelector(store => store.photoReducer);
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useMountEffect(() => {
    getPhotos();
  });

  const getPhotos = (text?: string, page: number = INITIAL_PAGE_NO) => {
    setIsLoading(true);
    dispatch(
      text ? getSearchResults(text, page) : getRecentResults(page),
    ).finally(() => {
      setIsLoading(false);
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearchPhotos = useCallback(debounce(getPhotos, 400), []);

  const submitTestApi = async () => {
    const file = await DocumentPicker.pickSingle();
    console.log('🚀 ~ file: Home.tsx:67 ~ submitTestApi ~ file', file);

    const data = {
      size: file.size,
      mime: file.type,
      originalFileName: file.name,
    };
    dispatch(apiTestResult(data));
  };

  const onSearchTextChanged = (text: string) => {
    dispatch(resetSearchResults());
    setSearchText(text);
    setIsLoading(true);
    debounceSearchPhotos(text);
  };

  const onEndReachedThreshold = () => {
    const isSearch = searchText?.length;
    if (
      !isLoading &&
      (isSearch
        ? searchPage <= searchTotalPages
        : recentPage <= recentTotalPages)
    ) {
      getPhotos(searchText, isSearch ? searchPage : recentPage);
    }
  };

  const onRefresh = () => {
    const isSearch = searchText?.length;
    if (!isLoading) {
      dispatch(isSearch ? resetSearchResults() : resetRecentResults());
      setTimeout(() => getPhotos(searchText, INITIAL_PAGE_NO), 1000);
    }
  };

  const navigateToDetailsScreen = (item: PhotoServiceTypes.Photo) => {
    navigation.navigate(GeneralStackRouteName.Details, { photoId: item.id });
  };

  const renderSearchText = () => {
    return (
      <SearchText
        value={searchText}
        onChangeText={onSearchTextChanged}
        style={styles.searchText}
      />
    );
  };

  const renderResultItem = ({
    item,
  }: {
    item: PhotoServiceTypes.Photo;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => navigateToDetailsScreen(item)}>
        <Image
          source={{
            uri: getImageUrl(
              item.id,
              item.secret,
              item.server,
              ImageSizeSuffix.Small,
            ),
          }}
          style={styles.img}
          resizeMode="cover"
        />
        <Text style={styles.imgTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    } else if (
      searchText?.length ? !!searchError?.length : !!recentError?.length
    ) {
      return (
        <View style={styles.loaderContainer}>
          <Text style={styles.error}>
            {searchText?.length ? searchError : recentError}
          </Text>
        </View>
      );
    } else return null;
  };

  const renderSearchResults = () => {
    return (
      <FlatList
        data={searchText ? searchResult : recentResult}
        keyExtractor={item => item.id}
        renderItem={renderResultItem}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        onEndReached={onEndReachedThreshold}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={isLoading}
        onRefresh={onRefresh}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderSearchText()}
      <Button title="Hello" onPress={submitTestApi} />
      {renderSearchResults()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: Colors.background,
    paddingHorizontal: hScale(20),
    paddingVertical: vScale(30),
  },
  searchText: {
    marginBottom: vScale(20),
  },
  resultItem: {},
  itemSeparator: {
    height: vScale(20),
  },
  img: { height: vScale(200), width: '100%' },
  imgTitle: {
    color: Colors.text,
    fontFamily: Fonts.Bold,
    fontSize: hScale(18),
    marginTop: vScale(5),
  },
  loaderContainer: {
    alignItems: 'center',
    paddingHorizontal: hScale(20),
    paddingVertical: vScale(50),
    width: '100%',
  },
  error: {
    color: Colors.text,
    fontFamily: Fonts.Regular,
    fontSize: hScale(14),
  },
});
