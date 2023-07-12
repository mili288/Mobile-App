import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native";
import io from "socket.io-client";

function Chat({ username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the server-side socket.io
    const newSocket = io("http://localhost:3001");
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
        setMessageList(messages);
      });
    }
  }, [socket, room, username]);

  useEffect(() => {
    // Fetch the initial messages when the component mounts
    fetch(`http://localhost:3001/messages/${room}`)
      .then((response) => response.json())
      .then((data) => {
        setMessageList(data);
      })
      .catch((error) => {
        console.error("Error retrieving messages:", error);
      });
  }, [room]);

  const sendMessage = () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        userId: username, // Pass the user ID
      };

      socket.emit("send_message", messageData);

      setCurrentMessage("");
    }
  };

  const clearMessages = () => {
    socket.emit("leave_room", { gameId: room, userId: username });
    setMessageList([]);
    window.location.reload(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: "center", padding: 10 }}>
          <Text>Live Chat</Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            {messageList.map((messageContent, index) => (
              <View
                style={{
                  backgroundColor:
                    username === messageContent.author ? "lightblue" : "lightgreen",
                  padding: 10,
                  margin: 5,
                  borderRadius: 10,
                }}
                key={index}
                id={username === messageContent.author ? "you" : "other"}
              >
                <View>
                  <View>
                    <Text>{messageContent.message}</Text>
                  </View>
                  <View>
                    <Text>{messageContent.time}</Text>
                    <Text>{messageContent.author}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <View>
          <TextInput
            style={{ height: 40, borderWidth: 1, padding: 10 }}
            value={currentMessage}
            placeholder="Hey..."
            onChangeText={(text) => setCurrentMessage(text)}
            onSubmitEditing={sendMessage}
          />
          <Button title="Send" onPress={sendMessage} />
          <Button title="Leave Room" onPress={clearMessages} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Chat;