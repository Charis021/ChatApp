import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
import Feather from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';

const Chat = ({user, route}) => {
  const [messages, setMessages] = useState([]);
  const {uid} = route.params;

  useEffect(() => {
    const docId = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docId)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    messageRef.onSnapshot(querySnap => {
      const allMsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allMsg);
    });
  }, []);
  const onSend = messageArray => {
    const msg = messageArray[0];
    const myMsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    const docId = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    firestore()
      .collection('chatrooms')
      .doc(docId)
      .collection('messages')
      .add({...myMsg, createdAt: firestore.FieldValue.serverTimestamp()});
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
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: user.uid,
        }}
        renderBubble={props => {
          const isCurrentUser = props.currentMessage.user._id === user.uid;
          return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!isCurrentUser && (
                <>
                  <Image
                    source={{uri: props.currentMessage.user.avatar}}
                    style={styles.avatar}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                      marginLeft: 5,
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
                    padding: 5,
                    marginBottom: 5,
                  },
                  left: {
                    backgroundColor: '#FFFFFF',
                    paddingRight: 15,
                    marginBottom: 5,
                    position: 'relative',
                    right: 40,
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
                  left: {
                    color: 'grey',
                    position: 'relative',
                  },
                  right: {
                    color: 'grey',
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
        renderActions={() => (
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={onSendAttachment}>
            <Text style={styles.attachmentText}>Attach</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: '#FFFFFF',
    textInputProps: {
      color: 'black',
    },
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  chatContainer: {
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
