import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
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

import { Colors, Fonts, Strings } from '../../assets';
import { INITIAL_PAGE_NO } from '../../constants/app.constants';
import {
  GeneralStackParamList,
  GeneralStackRouteName,
} from '../../navigation/type';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { getImageUrl, horizontalScale, verticalScale } from '../../utilities';
import { getSearchResults } from '../../redux/actions/photo.action';
import { SearchText } from '../../components/SearchText/SearchText';
import { PhotoServiceTypes } from '../../services/types';
import { ImageSizeSuffix } from '../../constants/enum.constants';

type Props = NativeStackScreenProps<
  GeneralStackParamList,
  GeneralStackRouteName.Home
>;
export const Home = ({ navigation }: Props) => {
  const { searchResult } = useAppSelector(store => store.photoReducer);
  const dispatch = useAppDispatch();
  const page = useRef(INITIAL_PAGE_NO);
  const pages = useRef(INITIAL_PAGE_NO);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchPhotos = (text: string) => {
    setIsLoading(true);
    dispatch(getSearchResults(text, page.current))
      .then(response => {
        page.current = response?.photos?.page + 1 ?? INITIAL_PAGE_NO;
        pages.current = response?.photos?.pages ?? INITIAL_PAGE_NO;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const debounceSearchPhotos = useCallback(debounce(searchPhotos, 400), []);

  const onSearchTextChanged = (text: string) => {
    page.current = INITIAL_PAGE_NO;
    pages.current = INITIAL_PAGE_NO;
    setSearchText(text);
    debounceSearchPhotos(text);
  };

  const onEndReachedThreshold = () => {
    if (page.current <= pages.current && !isLoading) {
      searchPhotos(searchText);
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

  const renderLoader = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    } else return null;
  };

  const renderNoData = () => {
    if (!isLoading && searchText?.length) {
      return (
        <View style={styles.loaderContainer}>
          <Text>{Strings.home.no_data}</Text>
        </View>
      );
    } else return null;
  };

  const renderSearchResults = () => {
    return (
      <FlatList
        data={searchResult}
        keyExtractor={item => item.id}
        renderItem={renderResultItem}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        onEndReached={onEndReachedThreshold}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderLoader}
        ListEmptyComponent={renderNoData}
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
