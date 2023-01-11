import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Strings, Unicode } from '../constants';
import { Barricade, ResponseHandler } from '../network';
import { useThemedColor } from '../theme';
import { Header } from './Header';

const RequestDetail = ({
  barricade,
  selectedListItemIndex,
  onBackPressed,
}: {
  barricade: Barricade | undefined;
  selectedListItemIndex?: number;
  onBackPressed: () => void;
}): JSX.Element => {
  const { themeColorStyle } = useThemedColor();

  const onDeailItemPressed = (item: ResponseHandler, index: number) => {
    if (!item.isSelected) {
      const requestConfig = barricade?.requestConfig[selectedListItemIndex!];
      if (requestConfig) {
        requestConfig.responseHandler.map((responseHandler, i) => {
          responseHandler.isSelected = index === i;
          return responseHandler;
        });
        requestConfig.selectedResponseLabel = item.label;
      }
      onBackPressed();
    }
  };

  const renderDetailItem = ({
    item,
    index,
  }: ListRenderItemInfo<ResponseHandler>) => {
    return (
      <TouchableOpacity
        style={[styles.listItemContainer, themeColorStyle.border]}
        onPress={() => onDeailItemPressed(item, index)}>
        <Text style={[styles.label, themeColorStyle.textDark]}>
          {item.label}
        </Text>
        {item.isSelected && (
          <Text style={[styles.icon, themeColorStyle.primary]}>
            {Unicode.CheckMark}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, themeColorStyle.surface]}>
      <Header
        headerLeft={{
          title: Unicode.ChevronLeft + Strings.Space + Strings.Back,
          onPress: onBackPressed,
        }}
        title={barricade?.requestConfig[selectedListItemIndex!]?.label ?? ''}
      />
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={[styles.listContainer, themeColorStyle.surface]}
        data={barricade?.requestConfig[selectedListItemIndex!]?.responseHandler}
        renderItem={renderDetailItem}
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
  icon: {
    fontSize: 18,
  },
});

export { RequestDetail };
