import React, { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import io from "socket.io-client";
import Chat from "./Chat";
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Icon, Button } from '@rneui/themed';

const socket = io.connect("https://mobile-app-chat.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    getUsername();
  }, []);

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
    <View style={{ flex: 1 }}>
      {!showChat ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Join A Room</Text>
          <Text>Welcome, {username}!</Text>
          <TextInput
            value={username}
            editable={false}
            style={{ display: 'none' }}
          />
          <TextInput
          style={{ 
            height: 40,
            borderColor: 'grey',
            marginTop: 10,
            width: 150,
            borderWidth: 2, 
            borderRadius: 15 
          }}
            placeholder="Room ID..."
            onChangeText={(text) => setRoom(text)}
          />
          <Button
              title="Join A Custom Room"
              onPress={joinRoom}
              icon={{
                name: 'sign-in',
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
            /><Text>or</Text>
            <Button
              title="Join A Public Room" 
              onPress={joinRandomGame}
              icon={{
                name: 'sign-in',
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
            />
        </View>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}

      <View style={{ justifyContent: 'flex-end' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: '#F2F2F2',
            paddingVertical: 20,
          }}
        >
          <Icon
            name="home"
            type="font-awesome"
            color='#303030'
            onPress={() => navigation.navigate('Home')}
          />

          <>
            <Icon
              name="comment"
              type="font-awesome"
              color='#303030'
              onPress={() => navigation.navigate('Lobby')}
            />

            <Icon
              name="user"
              type="font-awesome"
              color='#303030'
              onPress={() => navigation.navigate('Profile')}
            />
          </>
        </View>
      </View>
    </View>
  );
}

export default App;

