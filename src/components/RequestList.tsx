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
    barricade.resetRequestConfig();
    setRefreshList(Math.random());
  };

  const onFooterPressed = () => {
    barricade.running ? barricade.shutdown() : barricade.start();
    setRefreshList(Math.random());
  };

  const renderSelectedResponse = (item: RequestConfigForLib) => {
    return (
      <Text style={[styles.value, themeColorStyle.textLight]}>
        {`${item.selectedResponseLabel} `}
        <Text
          style={[
            styles.circleIcon,
            item.disabled ? themeColorStyle.error : themeColorStyle.success,
          ]}>
          {Unicode.Circle}
        </Text>
        <Text style={[styles.rightIcon, themeColorStyle.textLight]}>
          {` ${Unicode.ChevronRight}`}
        </Text>
      </Text>
    );
  };

  const renderListItem = ({
    item,
    index,
  }: ListRenderItemInfo<RequestConfigForLib>) => {
    return (
      <TouchableOpacity
        testID={`requestListItem${index}`}
        style={[styles.listItemContainer, themeColorStyle.border]}
        onPress={() => onListItemPressed(index)}>
        <Text style={[styles.label, themeColorStyle.textDark]}>
          {item.label}
        </Text>
        {renderSelectedResponse(item)}
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
        data={barricade.requestConfig}
        renderItem={renderListItem}
        extraData={refreshList}
      />
      <Footer
        onPress={onFooterPressed}
        title={
          barricade.running ? Strings.DisableBarricade : Strings.EnableBarricade
        }
        titleStyle={
          barricade.running ? themeColorStyle.error : themeColorStyle.primary
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: {
    flexGrow: 1,
  },
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: hScale(20),
    paddingVertical: vScale(12),
    borderBottomWidth: 1,
  },
  label: {
    flex: 1,
    fontSize: hScale(18),
    fontWeight: '400',
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  value: {
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
    fontSize: hScale(16),
  },
  circleIcon: {
    fontSize: hScale(12),
  },
  rightIcon: {
    fontSize: hScale(18),
  },
});

export { RequestList };
