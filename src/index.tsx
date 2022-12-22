import React from 'react';
import { NativeSyntheticEvent } from 'react-native';

import { BarricadeView as MMBarricade } from './components';
import { Barricade, RequestConfig } from './network';
import { ThemeType } from './theme';

export {
  Method,
  MockedRequest,
  PathEvaluaionType,
  PathEvaluationClosure,
  RequestConfig,
  ResponseData,
  ResponseHandler,
} from './network/barricade.types';
export { HttpStatusCode } from './network/http-codes';

let barricade: Barricade | undefined;

export const enableBarricade = (baseUrl: string, requests: RequestConfig[]) => {
  barricade = new Barricade(baseUrl, requests);
  barricade.start();
};

export const disableBarricade = () => {
  barricade?.shutdown();
};

export const isBarricadeEnabled = () => {
  return barricade?.running;
};

export const BarricadeView = ({
  onRequestClose,
  theme = 'light',
  visible,
}: {
  onRequestClose?: (event: NativeSyntheticEvent<any>) => void;
  theme?: ThemeType;
  visible: boolean;
}) => {
  return (
    <MMBarricade
      barricade={barricade}
      onRequestClose={onRequestClose}
      theme={theme}
      visible={visible}
    />
  );
};
