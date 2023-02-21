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

/**
 * Creates an instance of Barricade and initializes the array of RequestConfig passed to the function.
 * @param requests : Optional Array of RequestConfig. Each item in this array should contain configuration of each API that you want to mock.
 * @returns Instance of Barricade that was created.
 */
const createBarricade = (requests?: RequestConfig[]) => {
  barricade = new Barricade(requests);
  if (__DEV__) {
    DevSettings.addMenuItem(Strings.Barricade, showBarricadeView);
  }

  return barricade;
};

/**
 * Get the instance of Barricade that was created using createBarricade function
 * @returns Instance of Barricade
 */
const getBarricadeInstance = () => {
  return barricade;
};

/**
 * Shows the BarricadeView component. This is useful when you want to show Barricade on press of any text/button press.
 */
const showBarricadeView = () => {
  if (__DEV__) {
    DeviceEventEmitter.emit(EventType.ShowBarricadeView);
  }
};

export type BarricadeViewProps = {
  theme?: ThemeType;
};

/**
 * Component used to display the mocked Request and Response list for the developer to view or change at runtime.
 * @param props.theme Use this to select the preferred color scheme. It can be `dark` or `light`. This is optional and by default it's `light`.
 * @returns BarricadeView component.
 */
const BarricadeView = __DEV__
  ? (props: BarricadeViewProps) => {
      const { theme = 'light' } = props;
      const [visible, setVisibility] = useState(false);

      useEffect(() => {
        DeviceEventEmitter.addListener(EventType.ShowBarricadeView, () =>
          toggleBarricadeView(true),
        );
        return () => {
          DeviceEventEmitter.removeAllListeners(EventType.ShowBarricadeView);
        };
      }, []);

      const toggleBarricadeView = (value: boolean) => {
        setVisibility(value);
      };

      return (
        <MMBarricadeView
          barricade={barricade}
          onRequestClose={() => toggleBarricadeView(false)}
          theme={theme}
          visible={visible}
        />
      );
    }
  : (_props: BarricadeViewProps) => <React.Fragment />;

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
