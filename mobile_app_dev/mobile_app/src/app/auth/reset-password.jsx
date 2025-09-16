import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import logo from "../../../assets/logo.png";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");

  return (
    <SafeAreaProvider className="flex-1">
      <View className="flex-1 bg-black pt-5 items-center bg-black">
        <View className="items-center mb-10">
          <Image source={logo} className="w-40 h-40" resizeMode="contain" />
        </View>
        <Text className="text-white text-center font-medium text-[2rem] mb-3">
          Reset Password
        </Text>
        <View className="mb-5 px-4 bg-[#1f1f1f99] py-3 w-[80%]">
          <Text className="text-white text-center font-light text-xl">
            Enter your registered email address
          </Text>
        </View>
        <View className="w-[80%] space-y-6 mt-5">
          <TextInput
            className="bg-transparent border border-white/20 text-white w-full text-xl rounded-xl p-4 h-14"
            placeholder="Email"
            placeholderTextColor="white"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            returnKeyType="continue"
          />
          <TouchableOpacity className="bg-white w-full rounded-xl p-4 mt-4">
            <Text className="text-center font-light text-xl">CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default ResetPasswordPage;
