import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const LogIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const userLogIn = async () => {
    setLoading(true);
    if (!email || !password) {
      Alert.alert('Attention :', 'All fields are required.');
      setLoading(false);
      return;
    }
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
    } catch (err) {
      Alert.alert('Attention!', 'Invalid Credentials!');
      setLoading(false);
      navigation.navigate('LogIn');
    }
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

        <TouchableOpacity style={styles.button} onPress={userLogIn}>
          <Text style={styles.buttonText}>LOG IN </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{textAlign: 'center'}}>
            Don't have an account? Sign Up!
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default LogIn;

const {width, height} = Dimensions.get('window');

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
