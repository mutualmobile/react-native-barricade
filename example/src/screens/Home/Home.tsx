import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import debounce from 'lodash.debounce';

import { Colors, Fonts } from '../../assets';
import {
  GeneralStackParamList,
  GeneralStackRouteName,
} from '../../navigation/type';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { getImageUrl, horizontalScale, verticalScale } from '../../utilities';
import {
  getRecentResults,
  getSearchResults,
  resetRecentResults,
  resetSearchResults,
} from '../../redux/actions/photo.action';
import { SearchText } from '../../components/SearchText/SearchText';
import { PhotoServiceTypes } from '../../services/types';
import { ImageSizeSuffix, INITIAL_PAGE_NO } from '../../constants';

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

  useEffect(() => {
    getPhotos();
  }, []);

  const getPhotos = (text?: string, page: number = INITIAL_PAGE_NO) => {
    setIsLoading(true);
    dispatch(
      text ? getSearchResults(text, page) : getRecentResults(page),
    ).finally(() => {
      setIsLoading(false);
    });
  };
  const debounceSearchPhotos = useCallback(debounce(getPhotos, 400), []);

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
    navigation.navigate(GeneralStackRouteName.Details, { data: item });
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
    index,
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
            uri: getImageUrl(item, ImageSizeSuffix.Small),
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
          <Text>{searchText?.length ? searchError : recentError}</Text>
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
      {renderSearchResults()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: Colors.bgPrimary,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(30),
  },
  searchText: {
    marginBottom: verticalScale(20),
  },
  resultItem: {},
  itemSeparator: {
    height: verticalScale(20),
  },
  img: { height: verticalScale(200), width: '100%' },
  imgTitle: {
    color: Colors.body,
    fontFamily: Fonts.Bold,
    fontSize: horizontalScale(18),
    marginTop: verticalScale(5),
  },
  loaderContainer: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(50),
    width: '100%',
  },
});