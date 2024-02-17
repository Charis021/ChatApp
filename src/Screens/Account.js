import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import {Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

export default function Account({user}) {
  const [profile, setProfile] = useState('');

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        setProfile(docSnap.data());
      });
  }, []);

  if (!profile) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  return (
    <View
      style={{flex: 1, backgroundColor: '#075E54', justifyContent: 'center'}}>
      <View style={styles.container}>
        <Image style={styles.img} source={{uri: profile.pic}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: '5%',
          }}>
          <Feather name="user" size={25} color="black" />
          <Text style={styles.text}>{profile.name}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginBottom: '5%',
            alignItems: 'center',
          }}>
          <Feather name="mail" size={25} color="black" />
          <Text style={[styles.text, {marginLeft: 10}]}>{profile.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          mode="contained"
          onPress={() => {
            firestore()
              .collection('users')
              .doc(user.uid)
              .update({
                status: firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                auth().signOut();
              });
          }}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: '10%',
    margin: 10,
    borderRadius: 10,
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
  },
  text: {
    fontSize: 23,
    color: 'black',
    marginLeft: 10,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#075E54',
    borderRadius: 10,
    width: '20',
    margin: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    padding: 10,
    fontSize: 18,
  },
});
