import React, { useState } from 'react';
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
import { hScale, vScale } from '../utils';
import { Footer } from './Footer';
import { Header } from './Header';

type RequestDetailProps = {
  barricade: Barricade;
  selectedListItemIndex: number;
  onBackPressed: () => void;
};

const RequestDetail = (props: RequestDetailProps): JSX.Element => {
  const { barricade, selectedListItemIndex, onBackPressed } = props;
  const { themeColorStyle } = useThemedColor();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshList, setRefreshList] = useState(0);

  const onFooterPressed = () => {
    barricade.requestConfig[selectedListItemIndex].disabled =
      !barricade.requestConfig[selectedListItemIndex].disabled;
    setRefreshList(Math.random());
    onBackPressed();
  };

  const onDetailItemPressed = (item: ResponseHandler, index: number) => {
    if (!item.isSelected) {
      const requestConfig = barricade.requestConfig[selectedListItemIndex];
      requestConfig.responseHandler.map((responseHandler, i) => {
        responseHandler.isSelected = index === i;
        return responseHandler;
      });
      requestConfig.selectedResponseLabel = item.label;
      requestConfig.disabled = false;
      onBackPressed();
    }
  };

  const renderDetailItem = ({
    item,
    index,
  }: ListRenderItemInfo<ResponseHandler>) => {
    return (
      <TouchableOpacity
        testID={`responseListItem${index}`}
        style={[styles.listItemContainer, themeColorStyle.border]}
        onPress={() => onDetailItemPressed(item, index)}>
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
          title: `${Unicode.ChevronLeft} ${Strings.Back}`,
          onPress: onBackPressed,
        }}
        title={barricade.requestConfig[selectedListItemIndex]?.label}
      />
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={[styles.listContainer, themeColorStyle.surface]}
        data={barricade.requestConfig[selectedListItemIndex]?.responseHandler}
        renderItem={renderDetailItem}
      />
      <Footer
        onPress={onFooterPressed}
        title={
          barricade.requestConfig[selectedListItemIndex]?.disabled
            ? Strings.EnableAPI
            : Strings.DisableAPI
        }
        titleStyle={
          barricade.requestConfig[selectedListItemIndex]?.disabled
            ? themeColorStyle.primary
            : themeColorStyle.error
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
    marginEnd: hScale(10),
  },
  icon: {
    fontSize: hScale(18),
  },
});

export { RequestDetail };
