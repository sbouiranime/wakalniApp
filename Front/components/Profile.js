import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, Platform, ActivityIndicator, Modal, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_PORT } from '../constant/cst';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { Button, TextInput } from 'react-native-paper';

const UserProfile = () => {
  const [user, setUser] = useState({
    id: '',
    fullname: '',
    email: '',
    picture: null,
    password: '',
  });
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [currentPasswordHash, setCurrentPasswordHash] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTokenAndProfile = async () => {
      const retrievedToken = await AsyncStorage.getItem('token');
      setToken(retrievedToken);
      if (retrievedToken) {
        await fetchUserProfile(retrievedToken);
      }
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    };

    fetchTokenAndProfile();
  }, []);

  const fetchUserProfile = async (authToken) => {
    try {
      const response = await axios.get(`${REACT_APP_PORT}/getProfile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data) {
        setUser({
          ...user,
          id: response.data.id,
          fullname: response.data.fullname,
          email: response.data.email,
          picture: response.data.picture ? `data:image/jpeg;base64,${response.data.picture}` : null,
        });
        setCurrentPasswordHash(response.data.password); // Save the hashed password
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleEditProfile = () => {
    setIsModalVisible(true);
  };

  const handleConfirmPassword = async () => {
    const isMatch = await bcrypt.compare(enteredPassword, currentPasswordHash);
    if (isMatch) {
      try {
        const response = await axios.post(`${REACT_APP_PORT}/editProfile`, user, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
          await fetchUserProfile(token); // Refresh user profile data
        }
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    } else {
      Alert.alert('Error', 'Password does not match.');
    }
    setIsModalVisible(false);
    setEnteredPassword('');
  };

  const handleEditProfilePicture = async (fileUri) => {
    setLoading(true);

    try {
      const fileName = fileUri.split('/').pop();
      const fileType = fileName.split('.').pop();

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: `image/${fileType}`,
      });

      const response = await fetch(`${REACT_APP_PORT}/editProfilePicture/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setUser((prevUser) => ({
        ...prevUser,
        picture: fileUri,
      }));

      await fetchUserProfile(token);
    } catch (error) {
      console.error('Failed to update profile picture:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, picture: result.assets[0].uri });
      await handleEditProfilePicture(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.picture || 'https://via.placeholder.com/150' }} style={styles.image} />
      <Button mode="contained" onPress={handlePickImage}>Edit Picture</Button>
      <TextInput
        label="Full Name"
        mode="outlined"
        left={<TextInput.Icon name="account" />}
        value={user.fullname}
        onChangeText={(value) => setUser({ ...user, fullname: value })}
        style={styles.input}
      />
      <TextInput
        label="Email"
        mode="outlined"
        left={<TextInput.Icon name="email" />}
        value={user.email}
        onChangeText={(value) => setUser({ ...user, email: value })}
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        left={<TextInput.Icon name="lock" />}
        secureTextEntry={!showPassword}
        value={user.password}
        onChangeText={(value) => setUser({ ...user, password: value })}
        right={<TextInput.Icon name={showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword(!showPassword)} />}
        style={styles.input}
      />
      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={handleEditProfile}>Save Changes</Button>
        <Button mode="contained" onPress={handleLogout}>Logout</Button>
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Password</Text>
            <TextInput
              label="Enter your password"
              mode="outlined"
              left={<TextInput.Icon name="lock" />}
              secureTextEntry={true}
              value={enteredPassword}
              onChangeText={(value) => setEnteredPassword(value)}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={handleConfirmPassword}>Confirm</Button>
              <Button mode="contained" onPress={() => setIsModalVisible(false)}>Cancel</Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 2,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default UserProfile;
