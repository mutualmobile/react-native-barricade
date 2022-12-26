import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Barricade,
  RequestConfig,
  RequestConfigForLib,
  ResponseHandlerForLib,
} from '../network';
import { useThemedColor } from '../theme';
import { Header } from './Header';

const CheckMark = '\u2713';
const ChevronLeft = '\u2039';

const RequestDetail = ({
  barricade,
  detailData,
  onBackPressed,
}: {
  barricade: Barricade | undefined;
  detailData?: RequestConfigForLib;
  onBackPressed: () => void;
}): JSX.Element => {
  const { themeColorStyle } = useThemedColor();

  const onDeailItemPressed = (item: ResponseHandlerForLib) => {
    if (!item.isSelected) {
      detailData?.responseHandler.map(responseHandler => {
        responseHandler.isSelected = responseHandler.label === item.label;
        return responseHandler;
      });
      const requestConfig = barricade?.requestConfig.map<RequestConfig>(
        config => {
          if (config.label === detailData?.label) {
            config = detailData;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { selectedResponseLabel, ...result } = config;
          return result;
        },
      );
      if (requestConfig) {
        barricade?.updateRequestConfig(requestConfig);
      }
      onBackPressed();
    }
  };

  const renderDetailItem = ({
    item,
  }: ListRenderItemInfo<ResponseHandlerForLib>) => {
    return (
      <TouchableOpacity
        style={[styles.listItemContainer, themeColorStyle.border]}
        onPress={() => onDeailItemPressed(item)}>
        <Text style={[styles.label, themeColorStyle.textDark]}>
          {item.label}
        </Text>
        {item.isSelected && (
          <Text style={[styles.icon, themeColorStyle.primary]}>
            {CheckMark}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, themeColorStyle.surface]}>
      <Header
        headerLeft={{ title: ChevronLeft + ' Back', onPress: onBackPressed }}
        title={detailData?.label ?? ''}
      />
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={[styles.listContainer, themeColorStyle.surface]}
        data={detailData?.responseHandler}
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
