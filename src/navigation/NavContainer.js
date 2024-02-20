import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import Main from './Navigator';

const NavContainer = () => {
  return (
    <NavigationContainer>
      <Main/>
    </NavigationContainer>
  );
};

export default NavContainer;
