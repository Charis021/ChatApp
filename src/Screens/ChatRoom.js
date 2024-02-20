import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import React, {useState, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  Composer,
  Send,
  InputToolbar,
} from 'react-native-gifted-chat';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const {width} = Dimensions.get('window');

const ChatRoom = ({user}) => {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        setProfile(docSnap.data());
      });
  }, []);

  useEffect(() => {
    const messageRef = firestore()
      .collection('group_chat')
      .orderBy('createdAt', 'desc')
      .limit(100);

    const unsubscribe = messageRef.onSnapshot(querySnapshot => {
      const allMsg = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user?._id,
            name: data.user?.name,
            avatar: data.user?.avatar,
          },
        };
      });
      setMessages(allMsg);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onSend = async messageArray => {
    const msg = messageArray[0];
    const newMessage = {
      ...msg,
      sentBy: user.uid,
      createdAt: new Date(),
    };

    await firestore().collection('group_chat').add(newMessage);
  };

  const onSendAttachment = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });
      const imageUri = res[0].fileCopyUri;
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri = imageUri;

      const task = storage().ref(filename).putFile(uploadUri);

      try {
        await task;
      } catch (e) {
        console.error(e);
      }

      const url = await storage().ref(filename).getDownloadURL();

      const message = {
        _id: Math.random().toString(36).substring(7),
        image: url,
        user: {
          _id: user.uid,
          name: profile.name,
          avatar: profile.pic,
        },
        createdAt: new Date(),
      };

      await firestore().collection('group_chat').add(message);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log(err);
      }
    }
  };

  return (
    <View style={styles.chatContainer}>
      <ImageBackground
        source={require('../Assets/chatBackground.jpg')}
        style={{flex: 1}}>
        {loading ? (
          <ActivityIndicator size="large" color="#ECE5DD" />
        ) : (
          <GiftedChat
            messages={messages}
            onSend={newMessages => {
              onSend(newMessages);
            }}
            user={{
              _id: user.uid,
              name: profile.name,
              avatar: profile.pic,
            }}
            renderBubble={props => {
              const isCurrentUser = props.currentMessage.user._id === user.uid;
              return (
                <View style={{flexDirection: 'column'}}>
                  {!isCurrentUser && (
                    <>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          color: 'black',
                          position: 'absolute',
                          zIndex: 1,
                          top: 5,
                          left: 10,
                        }}>
                        {props.currentMessage.user.name}
                      </Text>
                    </>
                  )}
                  <Bubble
                    {...props}
                    wrapperStyle={{
                      right: {
                        backgroundColor: '#DCF8C5',
                        paddingHorizontal: 5,
                        paddingTop: 3,
                        marginBottom: 5,
                      },
                      left: {
                        backgroundColor: '#FFFFFF',
                        paddingTop: 30,
                        paddingHorizontal: 5,
                        marginBottom: 5,
                      },
                    }}
                    textStyle={{
                      right: {
                        color: 'black',
                      },
                      left: {
                        color: 'black',
                      },
                    }}
                    timeTextStyle={{
                      right: {
                        color: 'grey',
                      },
                      left: {
                        color: 'grey',
                      },
                    }}
                  />
                </View>
              );
            }}
            renderInputToolbar={props => (
              <InputToolbar {...props} containerStyle={styles.inputToolbar} />
            )}
            renderActions={() => (
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={onSendAttachment}>
                <Feather
                  name="paperclip"
                  size={25}
                  color="#075E54"
                  style={styles.icon}
                />
              </TouchableOpacity>
            )}
            renderSend={props => {
              return (
                <Send {...props}>
                  <Feather
                    name="send"
                    size={25}
                    color="white"
                    style={styles.send}
                  />
                </Send>
              );
            }}
          />
        )}
        <Feather name="send" size={25} color="white" style={styles.mic} />
      </ImageBackground>
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  inputToolbar: {
    flex: 1,
    margin: 10,
    width: '80%',
    height: 'auto',
    borderRadius: 20,
    backgroundColor: 'white',
    textInputProps: {
      color: 'black',
    },
  },
  chatContainer: {
    width: width,
    flex: 1,
    backgroundColor: '#ECE5DD',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    bottom: 10,
    left: 280,
  },
  send: {
    position: 'absolute',
    zIndex: 1,
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#075E54',
    top: -35,
    left: 160,
  },
  mic: {
    position: 'absolute',
    zIndex: -1,
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#075E54',
    right: 12,
    bottom: 11,
  },
});
