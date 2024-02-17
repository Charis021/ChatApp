import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput, Button} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';

const {width, height} = Dimensions.get('window');

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <ActivityIndicator size={'large'} color={'#075E54'} />;
  }

  const userSignUp = async () => {
    setLoading(true);
    if (!email || !password || !image || !name) {
      Alert.alert('Attention :', 'All fields are required.');
      setLoading(false);
      return;
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      firestore().collection('users').doc(result.user.uid).set({
        name: name,
        email: result.user.email,
        uid: result.user.uid,
        pic: image,
      });
      setLoading(false);
    } catch (err) {
      Alert.alert('Attention!', 'Something went wrong!');
      setLoading(false);
    }
  };

  const pickImageAndUpload = () => {
    launchImageLibrary({quality: 0.5}, fileobj => {
      const uploadPic = storage()
        .ref()
        .child(`/userProfile/${fileobj.assets[0].fileName}`)
        .putFile(fileobj.assets[0].uri);

      uploadPic.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });

      uploadPic.then(async () => {
        Alert.alert('Image uploaded to the bucket!');
        const url = await storage()
          .ref()
          .child(`/userProfile/${fileobj.assets[0].fileName}`)
          .getDownloadURL();
        setImage(url);
      });
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Welcome to WhatsApp</Text>
        <Image style={styles.image} source={require('../Assets/logo.png')} />
      </View>
      <View>
        {!showNext && (
          <>
            <TextInput
              label={'Email'}
              mode="outlined"
              onChangeText={text => setEmail(text)}
            />
            <TextInput
              label={'Password'}
              mode="outlined"
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />
          </>
        )}
        {showNext ? (
          <>
            <TextInput
              label={'Name'}
              mode="outlined"
              onChangeText={text => setName(text)}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => pickImageAndUpload()}>
              <Text style={styles.buttonText}>Choose profile picture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              disabled={image ? false : true}
              onPress={() => userSignUp()}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowNext(true)}>
            <Text style={styles.buttonText}>NEXT</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.goBack('LogIn')}>
          <Text style={{textAlign: 'center'}}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    alignSelf: 'center',
    width: width * 0.4,
    height: height * 0.2,
  },
  text: {
    fontSize: 22,
    color: '#075E54',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#075E54',
    borderRadius: 10,
    width: width - 20,
    margin: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    padding: 10,
    fontSize: 18,
  },
});
