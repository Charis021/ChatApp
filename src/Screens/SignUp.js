import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
} from 'react-native';
import React, {useState, useEffect} from 'react';
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
  const logoPosition = useState(new Animated.Value(height))[0];
  const textPosition = useState(new Animated.Value(height))[0];
  const inputsOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoPosition, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textPosition, {
        toValue: height * 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(inputsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, []);

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
      <Animated.View
        style={[
          styles.logoContainer,
          {transform: [{translateY: logoPosition}]},
        ]}>
        <Text style={styles.text}>Welcome to WhatsApp</Text>
        <Animated.Image
          style={[styles.image, {opacity: inputsOpacity}]}
          source={require('../Assets/logo.png')}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.inputContainer,
          {opacity: inputsOpacity, transform: [{translateY: textPosition}]},
        ]}>
        {!showNext && (
          <>
            <TextInput
              label={'Email'}
              placeholder="Your Email"
              style={styles.input}
              onChangeText={text => setEmail(text)}
            />
            <TextInput
              label={'Password'}
              placeholder="Your Password"
              style={styles.input}
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />
          </>
        )}
        {showNext ? (
          <>
            <TextInput
              label={'Name'}
              placeholder="Your Name"
              style={styles.input}
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
      </Animated.View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 0.5,
    marginBottom: 10,
    borderColor: '#075E54',
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
  inputContainer: {
    width: '80%',
    marginTop: 20,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#075E54',
    borderRadius: 10,
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    padding: 10,
    fontSize: 18,
  },
});
