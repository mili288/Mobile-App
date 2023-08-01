import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import io from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
import moment from 'moment';
import { Button } from '@rneui/themed';

const Chat = ({ username, room }) => {
  const [messageList, setMessageList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Connect to the server-side socket.io
    const newSocket = io("https://mobile-app-chat.onrender.com");
    setSocket(newSocket);

    // Clean up the socket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Join the chat room
      socket.emit("join_room", { gameId: room, userId: username });

      // Listen for received messages
      socket.on("receive_message", (messages) => {
        // Update the message list only if the initial messages have been loaded
        if (initialMessagesLoaded) {
          // Reverse the order of messages received
          setMessageList((prevMessages) => [...messages.reverse(), ...prevMessages]);
        }
      });
    }
  }, [socket, room, username, initialMessagesLoaded]);

  useEffect(() => {
    // Fetch the initial messages when the component mounts
    fetch(`https://mobile-app-chat.onrender.com/messages/${room}`)
      .then((response) => response.json())
      .then((data) => {
        // Reverse the order of initial messages
        setMessageList(data.reverse());
        setInitialMessagesLoaded(true);
      })
      .catch((error) => {
        console.error("Error retrieving messages:", error);
      });
  }, [room]);

  const onSend = (messages) => {
    const messageData = {
      room: room,
      author: username,
      message: messages[0].text,
      time: moment().format('h:mm'),
      userId: username, // Pass the user ID
    };

    socket.emit("send_message", messageData);
  };

  const clearMessages = () => {
    socket.emit("leave_room", { gameId: room, userId: username });
    setMessageList([]);
    setInitialMessagesLoaded(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Lobby" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chatHeader}>Live Chat</Text>
      <FlatList
        style={styles.messageContainer}
        data={messageList}
        renderItem={({ item }) => (
          <View style={[styles.messageItem, item.author === username ? styles.currentUserMessage : styles.otherUserMessage]}>
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
            <View style={styles.messageMeta}>
              <Text style={styles.messageTime}>{item.time}</Text>
              <Text style={styles.messageAuthor}>{item.author}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />
      <GiftedChat
        messages={messageList}
        onSend={onSend}
        user={{
          _id: username,
        }}
      />
       <Button
              title="Leave Room"
              icon={{
                name: 'sign-out',
                type: 'font-awesome',
                size: 20,
                color: 'white',
              }}
              iconContainerStyle={{ marginRight: 10 }}
              titleStyle={{ fontWeight: '700' }}
              buttonStyle={{
                backgroundColor: 'rgba(0, 0, 0, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 80,
                marginVertical: 10,
              }}
              onPress={clearMessages}
            />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  chatHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  messageContainer: {
    flex: 1,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageItem: {
    backgroundColor: "#e9f7ef",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  currentUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#a9d18e",
  },
  otherUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#63C5DA",
  },
  messageContent: {},
  messageText: {
    fontSize: 16,
  },
  messageMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
  },
  messageAuthor: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Chat;
