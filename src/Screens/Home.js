import {FlatList, StyleSheet, Text, Image, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {TouchableOpacity} from 'react-native';
import Header from '../components/common/Header';

const Home = ({user, navigation}) => {
  const [users, setUsers] = useState(null);
  const getUsers = async () => {
    const querySnap = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const allUsers = querySnap.docs.map(doc => doc.data());
    setUsers(allUsers);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const RenderCard = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.name === 'ChatRoom') {
            navigation.navigate('ChatRoom', {
              name: item.name,
              uid: item.uid,
              pic: item.pic,
            });
          } else {
            navigation.navigate('Chat', {
              name: item.name,
              uid: item.uid,
              pic: item.pic,
            });
          }
        }}>
        <View style={styles.container}>
          <Image
            source={{uri: item.pic}}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#075E54',
            }}
          />
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <Header navigation={navigation} user={user} />
      <View style={styles.mainContainer}>
        <FlatList
          data={users}
          renderItem={({item}) => {
            return <RenderCard item={item} />;
          }}
          keyExtractor={item => item.uid}
        />
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'green',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    marginLeft: 15,
    color: 'black',
    fontWeight: '500',
  },
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});
