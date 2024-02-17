import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Main from './src/Main';
import SignUp from './src/Screens/SignUp';

const App = () => {
  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'#075E54'} />
      <Main />
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ece5dd',
  },
});
