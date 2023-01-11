import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, DevSettings } from 'react-native';

import { BarricadeView as MMBarricadeView } from './components';
import { SHOW_BARRICADE_VIEW, Strings } from './constants';
import {
  Barricade,
  HttpStatusCode,
  Method,
  PathEvaluaionType,
  PathEvaluationBasic,
  PathEvaluationCallback,
  Request,
  RequestConfig,
  ResponseData,
  ResponseHandler,
} from './network';
import { ThemeType } from './theme';

let barricade: Barricade | undefined;

const enableBarricade = (requests: RequestConfig[]) => {
  barricade = new Barricade(requests);
  barricade.start();
  DevSettings.addMenuItem(Strings.Barricade, () => {
    DeviceEventEmitter.emit(SHOW_BARRICADE_VIEW);
  });
};

const disableBarricade = () => {
  barricade?.shutdown();
};

const isBarricadeEnabled = () => {
  return barricade?.running;
};

const BarricadeView = ({ theme = 'light' }: { theme?: ThemeType }) => {
  const [visible, setVisibility] = useState(false);

  useEffect(() => {
    DeviceEventEmitter.addListener(SHOW_BARRICADE_VIEW, showBarricadeView);
    return () => {
      DeviceEventEmitter.removeAllListeners(SHOW_BARRICADE_VIEW);
    };
  }, []);

  const showBarricadeView = () => {
    setVisibility(true);
  };

  const hideBarricadeView = () => {
    setVisibility(false);
  };

  return (
    <MMBarricadeView
      barricade={barricade}
      onRequestClose={hideBarricadeView}
      theme={theme}
      visible={visible}
    />
  );
};

export {
  BarricadeView,
  disableBarricade,
  enableBarricade,
  HttpStatusCode,
  isBarricadeEnabled,
  Method,
  PathEvaluaionType,
  PathEvaluationBasic,
  PathEvaluationCallback,
  Request,
  RequestConfig,
  ResponseData,
  ResponseHandler,
  ThemeType,
};
