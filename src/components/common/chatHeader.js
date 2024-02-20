import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

const ChatHeader = ({title, pic, showBackButton}) => {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleBack}>
        <Feather
          name="arrow-left"
          size={25}
          color="white"
          style={styles.send}
        />
      </TouchableOpacity>
      <Image
        style={styles.image}
        source={{
          uri: pic,
        }}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  image: {
    height: 30,
    width: 30,
    margin: 10,
    position: 'absolute',
    left: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#075E54',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: '500',
  },
});
