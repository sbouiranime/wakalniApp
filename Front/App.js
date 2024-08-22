import React from 'react';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './pages/SignUpScreen';
import LoginScreen from './pages/LoginScreen';
import ResetPassword from './pages/ResetPassword';
import NewPassword from './pages/NewPassword';
import Home from './pages/Home';
import Welcome from './pages/Welcome';

const Stack = createStackNavigator();

const linking = {
  prefixes: [
    'myapp://',
    'https://myapp.com',
    'exp://localhost:19006'
  ],
  config: {
    screens: {
      SignUpScreen: 'signup',
      LoginScreen: 'login',
      ResetPassword: 'reset-password',
      NewPassword: 'new-password',
      Home: 'home',
    },
  },
};

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="NewPassword" component={NewPassword} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
