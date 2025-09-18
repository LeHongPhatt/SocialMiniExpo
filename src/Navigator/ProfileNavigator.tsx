import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import { ProfileScreens } from '../screens';

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreens" component={ProfileScreens} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
