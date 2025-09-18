import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import { JobScreens } from '../screens';

const JobNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="JobScreens" component={JobScreens} />
    </Stack.Navigator>
  );
};

export default JobNavigator;
