import React, { useEffect, useState } from 'react';
import { View, TextInput, Image, StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Icon, Divider, Button } from '@rneui/themed';
import { Card, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import moment from 'moment';
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert } from 'react-native';

function HomeScreen() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [postId, setPostId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [commentSection, setCommentSection] = useState(null);
  const [liked, setLiked] = useState(false);
  const [commentOutlined, setCommentOutlined] = useState(false);
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);
  const [isAddCommentButtonDisabled, setIsAddCommentButtonDisabled] = useState(true);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [likesMap, setLikesMap] = useState({});
  

// Define a function to fetch the updated like counts for all posts
const fetchLikeCounts = async () => {
  try {
    const response = await axios.get('http://192.168.0.106:3000/users/posts-all');

    const fetchedPosts = response.data;
    const updatedLikesMap = {};
    for (const post of fetchedPosts) {
      updatedLikesMap[post._id] = post.likes.length;
    }

    setLikesMap(updatedLikesMap);
  } catch (error) {
    console.error('Error fetching updated like counts:', error);
  }
};

useEffect(() => {
  // Fetch the initial like counts on component mount
  fetchLikeCounts();

  // Poll for updated like counts every 5 seconds (adjust the interval as needed)
  const pollInterval = setInterval(() => {
    fetchLikeCounts();
  }, 5000);

  // Clean up the polling interval when the component unmounts
  return () => {
    clearInterval(pollInterval);
  };
}, []);


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const username = await AsyncStorage.getItem('username');
        setIsLoggedIn(!!token);
        setLoggedInUsername(username || '');
      } catch (error) {
        console.log('Error retrieving token from AsyncStorage:', error);
      }
    };
  
    checkLoginStatus();
  }, []);  

  useEffect(() => {
    // Check if the content is empty or contains only whitespace and set the disabled state accordingly
    setIsCreateButtonDisabled(!content.trim());
  }, [content]);

  useEffect(() => {
    // Check if the comment is empty or contains only whitespace and set the disabled state accordingly
    setIsAddCommentButtonDisabled(!comment.trim());
  }, [comment]);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch all posts from the backend API
        const response = await axios.get('http://192.168.0.106:3000/users/posts-all');

        // Assuming the response contains the array of posts, you can access them with response.data
        const fetchedPosts = response.data;
        console.log('Fetched Posts:', fetchedPosts);

        // Update the posts state with the fetched posts
       // setPosts(fetchedPosts);
        setPosts(fetchedPosts.map((post) => ({ ...post, liked: false })));
      } catch (error) {
        console.error('Error fetching the posts:', error);
      }
    };
    

    fetchPosts();
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

  const handleCreatePost = async () => {
    const username = await AsyncStorage.getItem('username');
    try {
      // Make a POST request to your backend API to create a post
      const response = await axios.post('http://192.168.0.106:3000/users/posts', {
        author: username, // Replace with the actual author value
        content, // Use the value from the content state
        time: moment().format('MM/DD/YYYY h:mm'),
        userId: username,
      });

      // Assuming the response contains the created post object, you can access it with response.data
      const createdPost = response.data;
      console.log('Created Post:', createdPost);

      // Optionally, you can navigate to a different screen or update the UI to show the created post
      // navigation.navigate('PostDetails', { postId: createdPost._id });
      // or update the UI state to show the created post
      // setPosts([...posts, createdPost]);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error('Error creating the post:', error);
    }
  };




  const fetchPosts = async () => {
    try {
      // Fetch all posts from the backend API
      const response = await axios.get('http://192.168.0.106:3000/users/posts-all');

      // Assuming the response contains the array of posts, you can access them with response.data
      const fetchedPosts = response.data;
      console.log('Fetched Posts:', fetchedPosts);

      // Update the posts state with the fetched posts
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching the posts:', error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const username = await AsyncStorage.getItem('username');
  
      // Make a POST request to your backend API to add or remove a like to/from the post
      const response = await axios.post(
        `http://192.168.0.106:3000/users/posts/${postId}/like`,
        { user: username }
      );
  
      // Get the updated post data from the response
      const updatedPost = response.data;
  
      // Update the "liked" property of the post in the posts state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, liked: updatedPost.likes.includes(username) } : post
        )
      );
    } catch (error) {
      console.error('Error adding like to post:', error);
    }
  };
  


  const handleAddComment = async () => {
    try {
      // Make a POST request to your backend API to add a comment to the post
      await axios.post(`http://192.168.0.106:3000/users/posts/${postId}/comments`, {
        text: comment,
        user: await AsyncStorage.getItem('username'),
        time: moment().format('MM/DD/YYYY h:mm'),
      });

      // Clear the comment field and postId state
      setComment('');
      setPostId('');

      // Fetch the updated posts again to reflect the changes, including the new comment
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment to post:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  };

  const handleDeletePost = async (postId) => {
    // Show a confirmation pop-up before deleting the post
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Make a DELETE request to your backend API to delete the post by its ID
              await axios.delete(`http://192.168.0.106:3000/users/posts/${postId}`);
            
              // Optionally, you can update the UI to remove the deleted post from the list
              // Fetch the updated posts again to reflect the changes
              fetchPosts();
            } catch (error) {
              console.error('Error deleting the post:', error);
            }
          },
        },
      ],
      { cancelable: true } // Allow the user to dismiss the pop-up by tapping outside
    );
  };
  

  return (
    <>
     <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >

<View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 }}>
        <TextInput
          style={{ 
            height: 40,
            borderColor: 'grey',
            borderWidth: 2, 
            marginBottom: 10,
            borderRadius: 15 }}
          placeholder="   Write Post"
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        <Button
          title="Create Post"
          icon={{
            name: 'send',
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
            marginHorizontal: 70,
            marginVertical: 10,
          }}
          // Disable the button if the content is empty or contains only whitespace
          disabled={isCreateButtonDisabled}
          onPress={handleCreatePost}
        />
      </View>


        {/* Render the posts */}
        {posts.map((post) => (
        <Card style={{ marginBottom: 10 }} key={post._id}>
                {/* Delete Button */}
{post.author === loggedInUsername && (
  <MaterialCommunityIcons
    style={{ marginLeft: 350, marginBottom: 0 }}
    name={liked ? "delete-outline" : "delete-outline"}
    size={30}
    onPress={() => handleDeletePost(post._id)} // Add the handleDeletePost function
  />
)}
          <Card.Title
            title={post.author}
           // left={LeftContent}
          /> 
          <Card.Content>
          <Text style={{ fontSize: 20 }}>{post.content}</Text>
            <Text style={{ fontSize: 10 }}>{post.time}</Text>


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            {/*  <Button title={`Like (${post.likes})`} onPress={() => handleLikePost(post._id)} /> */}
            <Pressable onPress={() => handleLikePost(post._id)}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons
              style={{ marginRight: 5 }}
              name={post.liked ? 'heart' : 'heart-outline'}
              size={30}
              color={post.liked ? 'red' : 'black'}
            />
            <Text style={{ marginTop: 5 }}>{likesMap[post._id] || 0}</Text>
          </View>
        </Pressable>

            {/*  <Button title="Comment" onPress={() => setPostId(post._id)} /> */}
            <Pressable onPress={() => { setPostId(post._id)}}>
                <MaterialCommunityIcons
                  name={commentOutlined ? "comment" : "comment-outline"}
                  size={30}
                  color={commentOutlined ? "black" : "black"}
                />
              </Pressable>
            </View>
            <Divider style={{ height: 10 }} />
            {postId === post._id && (
              <View style={{ marginTop: 8 }}>
                {post.comments.map((comment) => (
            <View key={comment._id} style={{ paddingBottom: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>{comment.user}</Text>
              <Text style={{ fontSize: 17 }}>{comment.text}</Text>
              <Text style={{ fontSize: 10 }}>{comment.time}</Text>
              <Divider style={{ marginBottom: 10, height: 10 }} />
            </View>
          ))}
                <TextInput
                   style={{ 
                    height: 40,
                    borderColor: 'grey',
                    borderWidth: 2, 
                    marginBottom: 10,
                    borderRadius: 15 
                  }}
                  placeholder="  Enter your comment"
                  value={comment}
                  onChangeText={(text) => setComment(text)}
                />
                <Button
              disabled={isAddCommentButtonDisabled}
              title="Add Comment"
              icon={{
                name: 'send',
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
              onPress={handleAddComment}
            />
              </View>
            )}
          </Card.Content>
        </Card>
      ))}

      <View style={styles.loginText}></View>

     
      </ScrollView>
      <View style={{ flex: 0, justifyContent: 'flex-end' }}>
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
              color="#303030"
              onPress={() => navigation.navigate('Home')}
            />
          )}

          {isLoggedIn && (
            <>
              <Icon
                name="comment"
                type="font-awesome"
                color="#303030"
                onPress={() => navigation.navigate('Lobby')}
              />

              <Icon
                name="user"
                type="font-awesome"
                color="#303030"
                onPress={() => navigation.navigate('Profile')}
              />
            </>
          )}

      {/*    {isLoggedIn ? (
            <Icon
              name="sign-out"
              type="font-awesome"
              color="#303030"
              onPress={handleLogout}
            />
      ) : null}  */}
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
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default HomeScreen;
