import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FirstPage from './components/FirstPage';
import Profile from './components/Profile';
import Login from './components/Login';
import { ForgotPassword } from './components/ForgotPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirstLogin from './components/FirstLogin';
import Home from './components/Home';
import Chat from './components/Chat';
import Lobby from './components/Lobby';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setUser(token ? 'authenticated' : null);
      } catch (error) {
        console.log('Error retrieving token from AsyncStorage:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
       screenOptions={{headerShown: false}}
      >
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="Lobby" component={Lobby} />
        <Stack.Screen name="FirstLogin" component={FirstLogin} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        {user === 'authenticated' ? (
          <Stack.Screen name="Profile" component={Profile} />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
