import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from '@rneui/themed';
import { StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';

function HomeScreen() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    {!isLoggedIn && (
      <>
       <Text style={styles.titleText}>You Are not Logged In Please Log In To Continue</Text>
       <Icon name="hand-o-down"
        type="font-awesome"
        onPress={() => console.log('Home icon pressed')} />
        {isLoggedIn ? (
  <Icon
  name="sign-out"
  type="font-awesome"
  onPress={handleLogout}
/>
    ) : (
      <Button
        title="Login"
        icon={{
          name: 'user',
          type: 'font-awesome',
          size: 15,
          color: 'white',
        }}
        iconRight
        iconContainerStyle={{ marginLeft: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={{
          backgroundColor: 'rgba(199, 43, 98, 1)',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 30,
        }}
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        onPress={() => navigation.navigate('FirstLogin')}
      />
    )}
      </>
      )}
    </View>

    <View style={{ flex: 1, justifyContent: 'flex-end', }}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#F2F2F2',
        paddingVertical: 20,
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
            onPress={() => navigation.navigate('Lobby')}
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
    alignItems: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default HomeScreen;
