import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { Image } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  require('../assets/image1.jpg'), // Replace with your image paths
  require('../assets/image2.jpg'),
  require('../assets/image3.jpg'),
];

export default function ImageScroller() {
  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={{
          bottom: 10,
        }}
      >
        {images.map((image, index) => (
          <View style={styles.slide} key={index}>
            <Image source={image} style={styles.image} />
          </View>
        ))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Adjust as needed
  },
  wrapper: {
    height: width * 0.75, // Adjust the height as needed
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width,
    height: width * 0.75,
    resizeMode: 'cover',
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#ffffff',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});
