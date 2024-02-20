import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import NavContainer from './src/navigation/NavContainer';

const App = () => {
  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'#075E54'} />
      <NavContainer />
    </>
  );
};

export default App;

