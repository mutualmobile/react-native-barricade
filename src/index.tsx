import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, DevSettings } from 'react-native';

import { BarricadeView as MMBarricade } from './components';
import { Barricade, RequestConfig } from './network';
import { ThemeType } from './theme';

export {
  Method,
  MockedRequest,
  PathEvaluaionType,
  PathEvaluationCallback,
  RequestConfig,
  ResponseData,
  ResponseHandler,
} from './network/barricade.types';
export { HttpStatusCode } from './network/http-codes';

let barricade: Barricade | undefined;
const SHOW_BARRICADE_VIEW = 'SHOW_BARRICADE_VIEW';

export const enableBarricade = (requests: RequestConfig[]) => {
  barricade = new Barricade(requests);
  barricade.start();
  DevSettings.addMenuItem('Barricade', () => {
    DeviceEventEmitter.emit(SHOW_BARRICADE_VIEW);
  });
};

export const disableBarricade = () => {
  barricade?.shutdown();
};

export const isBarricadeEnabled = () => {
  return barricade?.running;
};

export const BarricadeView = ({ theme = 'light' }: { theme?: ThemeType }) => {
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
    <MMBarricade
      barricade={barricade}
      onRequestClose={hideBarricadeView}
      theme={theme}
      visible={visible}
    />
  );
};
