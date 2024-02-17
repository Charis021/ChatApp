import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Header = ({navigation, user, showBackButton}) => {
  const [profile, setProfile] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        setProfile(docSnap.data());
        setIsLoading(false);
      });
  }, [user.uid]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chats</Text>
      {showBackButton && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        {isLoading || !profile?.pic ? (
          <View style={styles.image} />
        ) : (
          <Image
            source={{uri: profile.pic}}
            style={styles.image}
            onLoad={() => setIsLoading(false)}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    backgroundColor: '#075E54',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#075E54',
  },
  text: {
    fontSize: 25,
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
  },
});
