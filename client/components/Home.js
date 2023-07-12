import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from '@rneui/themed';
import { StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import { Card, Avatar } from 'react-native-paper';

function HomeScreen() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.log('Error retrieving token from AsyncStorage:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear token from AsyncStorage
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
      navigation.navigate('FirstLogin')
    } catch (error) {
      console.log('Error removing token from AsyncStorage:', error);
    }
  };

  return (
    <>
    <View style={styles.loginText}>
    <Card>
    <Card.Title title="Name" left={LeftContent} />
    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Content>
      <Text variant="titleLarge">Yo</Text>
    </Card.Content>
    <Card.Actions>
    </Card.Actions>
  </Card>
  </View>

  


  <View style={{ flex: 1, justifyContent: 'flex-end', }}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'lightgray',
        paddingVertical: 10,
      }}
    >
      {isLoggedIn && (
      <Icon
        name="home"
        type="font-awesome"
        color='#303030'
        onPress={() => navigation.navigate('Home')}
      />
      )}


      {isLoggedIn && (
        <>
          <Icon
            name="comment"
            type="font-awesome"
            color='#303030'
            onPress={() => navigation.navigate('Chat')}
          />

          <Icon
            name="user"
            type="font-awesome"
            color='#303030'
            onPress={() => navigation.navigate('Profile')}
          />
        </>
      )}

{isLoggedIn ? (
  <Icon
  name="sign-out"
  type="font-awesome"
  color='#303030'
  onPress={handleLogout}
/>
    ) : (
      null
    )}

    </View>
  </View>
  </>
  );
}

const styles = StyleSheet.create({
  loginText: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default HomeScreen;
