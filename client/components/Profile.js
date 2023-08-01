import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Avatar } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chip } from 'react-native-paper';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const response = await axios.get(`https://chat-app-vlzr.onrender.com/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear token from AsyncStorage
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
      navigation.navigate('FirstLogin');
    } catch (error) {
      console.log('Error removing token from AsyncStorage:', error);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <>
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.heading}>Profile</Text>
        <Avatar size={72} rounded title="Rd" containerStyle={styles.avatarContainer} />
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.text}>{user.name}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{user.email}</Text>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.text}>{user.username}</Text>
      </View>
      <View>
      </View>
    </SafeAreaView>

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

            <Icon
              name="sign-out"
              type="font-awesome"
              color="#303030"
              onPress={handleLogout}
            />
          </>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    backgroundColor: 'blue',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Profile;
