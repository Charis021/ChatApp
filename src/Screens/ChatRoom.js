import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import React, {useState, useEffect} from 'react';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const ChatRoom = ({user}) => {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(true); // State for loading indicator

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
      setLoading(false); // Turn off loading indicator when messages are loaded
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
    // Your code for sending attachments
  };

  return (
    <View style={styles.chatContainer}>
      {loading ? ( // Render activity indicator if loading is true
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
                      padding: 5,
                      marginBottom: 5,
                    },
                    left: {
                      backgroundColor: '#FFFFFF',
                      paddingTop: 30,
                      paddingRight: 15,
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
                      textAlign: 'top',
                    },
                  }}
                />
              </View>
            );
          }}
          renderSend={props => {
            return (
              <Send style={{borderTopWidth: 0}} {...props}>
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
          // renderActions={() => (
          //   <TouchableOpacity
          //     style={styles.attachmentButton}
          //     onPress={onSendAttachment}>
          //     <Text style={styles.attachmentText}>Attach</Text>
          //   </TouchableOpacity>
          // )}
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
    flex: 1,
    backgroundColor: '#ECE5DD',
    justifyContent: 'center',
    alignItems: 'center',
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
