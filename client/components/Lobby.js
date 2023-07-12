import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import io from "socket.io-client";
import Chat from "./Chat";
import { v4 as uuidv4 } from 'uuid';

const socket = io.connect("https://chat-app-vlzr.onrender.com/3001");

function App() {
 // const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

{/*  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
*/}

 const username = 'mili';

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const joinRandomGame = () => {
    if (username !== "") {
      const data = { gameId: "5", userId: username };
      socket.emit("join_game", data);
      setShowChat(true);
      setRoom("5");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!showChat ? (
        <View style={{ alignItems: 'center' }}>
          <Text>Join A Room</Text>
          <Text>Welcome, {username}!</Text>
          <TextInput
            value={username}
            editable={false}
            style={{ display: 'none' }}
          />
          <TextInput
            placeholder="Room ID..."
            onChangeText={(text) => setRoom(text)}
          />
          <Button title="Join A Custom Room" onPress={joinRoom} /><Text>or</Text>
          <Button title="Join A Public Room" onPress={joinRandomGame} />
        {/*  <Button title="Logout" onPress={() => { localStorage.removeItem('token'), localStorage.removeItem('userId'), navigate('/login') }} /> */}
        </View>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </View>
  );
}

export default App;
