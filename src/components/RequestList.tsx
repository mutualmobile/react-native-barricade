import React, { useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Strings, Unicode } from '../constants';
import { Barricade, RequestConfigForLib } from '../network';
import { useThemedColor } from '../theme';
import { Footer } from './Footer';
import { Header } from './Header';

const RequestList = ({
  barricade,
  onDonePressed,
  onListItemPressed,
}: {
  barricade: Barricade | undefined;
  onDonePressed?: (event: NativeSyntheticEvent<any>) => void;
  onListItemPressed: (index: number) => void;
}): JSX.Element => {
  const { themeColorStyle } = useThemedColor();
  const [refreshList, setRefreshList] = useState(0);

  const onResetPressed = () => {
    barricade?.resetRequestConfig();
    setRefreshList(Math.random());
  };

  const renderListItem = ({
    item,
    index,
  }: ListRenderItemInfo<RequestConfigForLib>) => {
    return (
      <TouchableOpacity
        style={[styles.listItemContainer, themeColorStyle.border]}
        onPress={() => onListItemPressed(index)}>
        <Text style={[styles.label, themeColorStyle.textDark]}>
          {item.label}
        </Text>
        <Text style={[styles.value, themeColorStyle.textLight]}>
          {item.selectedResponseLabel}{' '}
          <Text style={[styles.icon, themeColorStyle.textLight]}>
            {Unicode.ChevronRight}
          </Text>
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, themeColorStyle.surface]}>
      <Header
        headerLeft={{ title: Strings.Reset, onPress: onResetPressed }}
        title={Strings.Barricade}
        headerRight={{ title: Strings.Done, onPress: onDonePressed }}
      />
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={[styles.listContainer, themeColorStyle.surface]}
        data={barricade?.requestConfig}
        renderItem={renderListItem}
        extraData={refreshList}
      />
      <Footer barricade={barricade} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: {
    flexGrow: 1,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '400',
  },
  value: {
    fontSize: 16,
  },
  icon: {
    fontSize: 18,
  },
});

export { RequestList };
