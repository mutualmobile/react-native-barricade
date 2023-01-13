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
import { hScale, vScale } from '../utils';
import { Footer } from './Footer';
import { Header } from './Header';

type RequestListProps = {
  barricade: Barricade;
  onDonePressed?: (event: NativeSyntheticEvent<any>) => void;
  onListItemPressed: (index: number) => void;
};

const RequestList = (props: RequestListProps): JSX.Element => {
  const { barricade, onDonePressed, onListItemPressed } = props;
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
    paddingHorizontal: hScale(20),
    paddingVertical: vScale(12),
    borderBottomWidth: 1,
  },
  label: {
    fontSize: hScale(18),
    fontWeight: '400',
  },
  value: {
    fontSize: hScale(16),
  },
  icon: {
    fontSize: hScale(18),
  },
});

export { RequestList };
