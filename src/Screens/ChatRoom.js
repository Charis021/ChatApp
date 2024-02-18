import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import React, {useState, useEffect} from 'react';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const {width} = Dimensions.get('window');

const ChatRoom = ({user}) => {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(true);

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
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar,
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
      console.log(res);
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
      {loading ? (
        <ActivityIndicator size="large" color="#ECE5DD" />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={newMessages => onSend(newMessages)}
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
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                      position: 'absolute',
                      zIndex: 1,
                      top: 5,
                      left: 10,
                    }}>
                    {props.currentMessage.user.name}
                  </Text>
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
          renderSend={props => {
            return (
              <Send {...props}>
                <Feather
                  name="send"
                  size={30}
                  color="#075E54"
                  style={styles.icon}
                />
              </Send>
            );
          }}
          renderInputToolbar={props => (
            <InputToolbar {...props} containerStyle={styles.inputToolbar} />
          )}
          renderActions={() => (
            <TouchableOpacity
              style={styles.attachmentButton}
              onPress={onSendAttachment}>
              <Text style={styles.attachmentText}>Attach</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: '#FFFFFF',
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
  attachmentButton: {
    backgroundColor: '#075E54',
  },
  attachmentText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    padding: 15,
    fontSize: 15,
  },
  icon: {
    position: 'relative',
    bottom: 8,
    right: 10,
  },
});
