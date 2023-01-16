import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Colors, Strings } from '../assets';
import { Details, Home, Splash } from '../screens';
import { GeneralStackParamList, GeneralStackRouteName } from './type';

const Stack = createNativeStackNavigator<GeneralStackParamList>();
const GeneralStack = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName={GeneralStackRouteName.Splash}
      screenOptions={{ headerTintColor: Colors.textAlt }}>
      <Stack.Screen
        name={GeneralStackRouteName.Home}
        component={Home}
        options={{ title: Strings.home.header_title }}
      />
      <Stack.Screen
        name={GeneralStackRouteName.Splash}
        component={Splash}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name={GeneralStackRouteName.Details} component={Details} />
    </Stack.Navigator>
  );
};

export default GeneralStack;
