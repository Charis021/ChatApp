import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LogIn from './Screens/LogIn';
import SignUp from './Screens/SignUp';
import ChatRoom from './Screens/ChatRoom';
import auth from '@react-native-firebase/auth';
import Home from './Screens/Home';
import Chat from './Screens/Chat';
import Account from './Screens/Account';

const Stack = createNativeStackNavigator();

const Main = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unRegister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setUser(userExist);
      } else setUser('');
    });
    return () => {
      unRegister();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerTintColor: '#075E54', title: 'WhatsApp'}}>
        {user ? (
          <>
            <Stack.Screen
              name="home"
              options={{
                headerShown: false,
              }}>
              {props => <Home {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="Chat"
              options={({route}) => ({title: route.params.name})}>
              {props => <Chat {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="ChatRoom"
              options={({route}) => ({
                title: route.params.name,
                showBackButton: route.params.showBackButton,
              })}>
              {props => <ChatRoom {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Account">
              {props => <Account {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="LogIn"
              component={LogIn}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;


