import React, { useEffect, useRef } from "react";
import { View, Animated, Modal } from "react-native";
import logo from "../../assets/logo.png";

const LoadingScreen = ({ visible }) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      // Reset animation values when not visible
      opacityAnim.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View className="flex-1 bg-black/80 justify-center items-center">
        <Animated.Image
          source={logo}
          className="w-40 h-40"
          resizeMode="contain"
          style={{
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          }}
        />
      </View>
    </Modal>
  );
};

export default LoadingScreen;
