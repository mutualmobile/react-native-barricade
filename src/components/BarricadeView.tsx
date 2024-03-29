import React, { useState } from 'react';
import {
  Modal,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import { Barricade } from '../network';
import { ThemeProvider, ThemeType, useThemedColor } from '../theme';
import { RequestDetail } from './RequestDetail';
import { RequestList } from './RequestList';

enum ViewType {
  List,
  Detail,
}

type BarricadeViewProps = {
  barricade?: Barricade;
  onRequestClose?: <T>(event: NativeSyntheticEvent<T>) => void;
  theme?: ThemeType;
  visible: boolean;
};

export const BarricadeView = (props: BarricadeViewProps) => {
  const { barricade, onRequestClose, theme = 'light', visible } = props;
  const { themeColorStyle } = useThemedColor();
  const [viewType, setViewType] = useState<ViewType>(ViewType.List);
  const [selectedListItemIndex, setSelectedListItemIndex] = useState<number>();

  const _onBackPressed = () => {
    setSelectedListItemIndex(undefined);
    setViewType(ViewType.List);
  };

  const _onListItemPressed = (index: number) => {
    setSelectedListItemIndex(index);
    setViewType(ViewType.Detail);
  };

  const renderContent = () => {
    if (!barricade) {
      return;
    } else if (
      viewType === ViewType.List ||
      typeof selectedListItemIndex === 'undefined'
    ) {
      return (
        <RequestList
          barricade={barricade}
          onListItemPressed={_onListItemPressed}
          onDonePressed={onRequestClose}
        />
      );
    } else {
      return (
        <RequestDetail
          barricade={barricade}
          selectedListItemIndex={selectedListItemIndex}
          onBackPressed={_onBackPressed}
        />
      );
    }
  };

  return (
    <ThemeProvider value={theme}>
      <Modal onRequestClose={onRequestClose} visible={visible}>
        <SafeAreaView
          style={[
            styles.container,
            themeColorStyle.background,
            themeColorStyle.border,
          ]}>
          {renderContent()}
        </SafeAreaView>
      </Modal>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
