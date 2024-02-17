import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator} from 'react-native';

const {width, height} = Dimensions.get('window');

const LogIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to WhatsApp</Text>
        <Image style={styles.image} source={require('../Assets/logo.png')} />
      </View>
      <View>
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

        <TouchableOpacity style={styles.button} onPress={() => userLogIn()}>
          <Text style={styles.buttonText}>LOG IN </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{textAlign: 'center'}}>
            Don't have an account? Sign Up!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogIn;

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
