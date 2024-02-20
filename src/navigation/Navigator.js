import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LogIn from '../Screens/LogIn';
import SignUp from '../Screens/SignUp';
import ChatRoom from '../Screens/ChatRoom';
import auth from '@react-native-firebase/auth';
import Home from '../Screens/Home';
import Chat from '../Screens/Chat';
import Account from '../Screens/Account';
import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import ChatHeader from '../components/common/chatHeader';

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
            options={({route}) => ({
              header: ({navigation, route}) => (
                <ChatHeader
                  title={route.params.name}
                  pic={route.params.pic}
                  showBackButton={route.params.showBackButton}
                  navigation={navigation}
                />
              ),
            })}>
            {props => <Chat {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen
            name="ChatRoom"
            options={({route}) => ({
              header: ({navigation, route}) => (
                <ChatHeader
                  title={route.params.name}
                  pic={route.params.pic}
                  showBackButton={route.params.showBackButton}
                  navigation={navigation}
                />
              ),
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
  );
};

export default Main;
