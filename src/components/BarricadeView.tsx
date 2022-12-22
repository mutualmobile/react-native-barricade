import React, { useState } from 'react';
import { Modal, NativeSyntheticEvent } from 'react-native';

import { Barricade, RequestConfigForLib } from '../network';
import { ThemeProvider, ThemeType } from '../theme';
import { RequestDetail } from './RequestDetail';
import { RequestList } from './RequestList';

enum ViewType {
  List,
  Detail,
}

export const BarricadeView = ({
  barricade,
  onRequestClose,
  theme = 'light',
  visible,
}: {
  barricade?: Barricade;
  onRequestClose?: (event: NativeSyntheticEvent<any>) => void;
  theme?: ThemeType;
  visible: boolean;
}) => {
  const [viewType, setViewType] = useState<ViewType>(ViewType.List);
  const [detailData, setDetailData] = useState<RequestConfigForLib>();

  const _onBackPressed = () => {
    setDetailData(undefined);
    setViewType(ViewType.List);
  };

  const _onListItemPressed = (item: RequestConfigForLib) => {
    setDetailData(item);
    setViewType(ViewType.Detail);
  };

  const renderContent = () => {
    if (viewType === ViewType.List) {
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
          detailData={detailData}
          onBackPressed={_onBackPressed}
        />
      );
    }
  };

  return (
    <ThemeProvider value={theme}>
      <Modal onRequestClose={onRequestClose} visible={visible}>
        {renderContent()}
      </Modal>
    </ThemeProvider>
  );
};
