import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, DevSettings } from 'react-native';

import { BarricadeView as MMBarricadeView } from './components';
import { EventType, Strings } from './constants';
import {
  Barricade,
  HttpStatusCode,
  Method,
  PathEvaluationBasic,
  PathEvaluationCallback,
  PathEvaluationType,
  Request,
  RequestConfig,
  ResponseData,
  ResponseHandler,
} from './network';
import { ThemeType } from './theme';

let barricade: Barricade | undefined;

const createBarricade = (requests: RequestConfig[]) => {
  barricade = new Barricade(requests);
  if (__DEV__) {
    DevSettings.addMenuItem(Strings.Barricade, () => {
      showBarricadeView();
    });
  }

  return barricade;
};

const getBarricadeInstance = () => {
  return barricade;
};

const showBarricadeView = () => {
  DeviceEventEmitter.emit(EventType.ShowBarricadeView);
};

export type BarricadeViewProps = {
  theme?: ThemeType;
};

const BarricadeView = (props: BarricadeViewProps) => {
  const { theme = 'light' } = props;
  const [visible, setVisibility] = useState(false);

  useEffect(() => {
    DeviceEventEmitter.addListener(
      EventType.ShowBarricadeView,
      showBarricadeView,
    );
    return () => {
      DeviceEventEmitter.removeAllListeners(EventType.ShowBarricadeView);
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
  createBarricade,
  getBarricadeInstance,
  HttpStatusCode,
  Method,
  PathEvaluationBasic,
  PathEvaluationCallback,
  PathEvaluationType,
  Request,
  RequestConfig,
  ResponseData,
  ResponseHandler,
  showBarricadeView,
  ThemeType,
};
