import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, Text, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Welcome() {
  const navigation = useNavigation();
  const { height, width } = Dimensions.get('window');
  const opacity = new Animated.Value(1);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.navigate('LoginScreen');
        } else {
          setTimeout(() => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }).start(() => {
              navigation.navigate('LoginScreen');
            });
          }, 3000);
        }
      } catch (error) {
        console.error('Failed to fetch the token from storage', error);
      }
    };

    checkToken();
  }, [navigation]);

  return (
    <Animated.View style={[styles.container, { width, height, opacity }]}>
      <View style={styles.gradient}>
        <View style={styles.overlay}>
          <Image source={require('../assets/wakalni.png')} style={styles.logo} />
          <Text style={styles.text}>Find & cook your favourite food</Text>
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.loading} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#C5CAE9', // Light purple background
    backgroundImage: 'linear-gradient(0deg, #E8EAF6 0%, #C5CAE9 100%)', // Gradient from light to darker purple
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Keeping the darker overlay
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  loading: {
    marginTop: 20,
  },
});
