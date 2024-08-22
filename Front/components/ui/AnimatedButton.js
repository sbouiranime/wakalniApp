import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';

const AnimatedButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
    setIsClicked(true);
  };

  const skewX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-20deg', '0deg'],
  });

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <TouchableOpacity onPressIn={handlePressIn} style={styles.button}>
      <View>
        <Animated.View
          style={[
            styles.effect,
            {
              transform: [{ skewX }, { translateX }],
              opacity,
            },
          ]}
        />
        <Text style={styles.text}>Button</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    borderColor: 'rgb(61, 106, 255)',
    borderWidth: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  text: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 2,
    fontSize: 14,
    textAlign: 'center',
  },
  effect: {
    position: 'absolute',
    top: '7%',
    left: 0,
    height: '86%',
    width: '100%',
    backgroundColor: '#fff',
    opacity: 0,
  },
});

export default AnimatedButton;
