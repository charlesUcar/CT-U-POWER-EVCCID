import Images from '../../../images';
import React, { useState } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

const Loading = () => {
  const [spinValue] = useState(new Animated.Value(0));
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  Animated.timing(spinValue, {
    toValue: 1,
    duration: 800,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start(() => {
    spinValue.setValue(0);
  });
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const AnimatedStyle = { transform: [{ rotate: spin }] };

  return (
    <View style={styles.wrapper}>
      <Animated.Image style={AnimatedStyle} source={Images.Loading} />
    </View>
  );
};


const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})


export default Loading;
