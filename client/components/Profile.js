import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Avatar } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chip } from 'react-native-paper';

function Profile({ navigation }) {
  const [user, setUser] = useState(null);

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

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
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
