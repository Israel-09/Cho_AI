import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import logo from "../../../assets/logo.png";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SignupPage = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [showGenderModal, setShowGenderModal] = useState(false);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer not to say", value: "prefer_not_to_say" },
  ];

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleGenderSelect = (value) => {
    setGender(value);
    setShowGenderModal(false);
  };

  return (
    <SafeAreaProvider className="flex-1">
      <View className="flex-1 bg-black pt-5 items-center">
        <View className="items-center">
          <Image source={logo} className="w-40 h-40" resizeMode="contain" />
        </View>
        <Text className="text-white text-center font-medium text-2xl">
          Create new account
        </Text>
        <Text className="text-white/85 text-center text-xl mt-2 px-10">
          Welcome to AsckCho, your on-the-go personal assistant.
        </Text>
        <View className="w-[80%] space-y-6 mt-5">
          <TextInput
            className="bg-transparent border border-white/20 text-white/85 w-full text-xl rounded-xl p-4 h-14"
            placeholder="Name"
            placeholderTextColor="white"
            autoComplete="name"
          />
          <TextInput
            className="mt-3 bg-transparent border border-white/20 text-white/85 w-full text-xl rounded-xl p-4 h-14"
            placeholder="Email"
            placeholderTextColor="white"
            autoComplete="email"
            keyboardType="email-address"
          />
          <View className="mt-3 flex-row gap-4">
            <TouchableOpacity
              className="flex-1"
              onPress={() => setShowGenderModal(true)}
            >
              <TextInput
                className="bg-transparent border border-white/20 text-white/85 text-xl rounded-xl p-4 h-14"
                placeholder="Gender"
                placeholderTextColor="white"
                value={
                  gender
                    ? genderOptions.find((opt) => opt.value === gender)?.label
                    : ""
                }
                editable={false}
                onPressIn={() => setShowGenderModal(true)}
              />
            </TouchableOpacity>
            <TouchableOpacity className="flex-1" onPress={toggleDatePicker}>
              <TextInput
                className="bg-transparent border border-white/20 text-white text-xl rounded-xl p-4 h-14"
                placeholder="Date of Birth (YYYY-MM-DD)"
                placeholderTextColor="white"
                value={formatDate(date)}
                editable={false}
                onPressIn={toggleDatePicker}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              date={date}
              maximumDate={new Date()}
              onConfirm={handleDateChange}
              onCancel={() => setShowDatePicker(false)}
              textColor="white"
              accentColor="#ffffff"
              buttonTextColorIOS="#ffffff"
            />
          </View>
          {showGenderModal && (
            <View className="absolute top-0 left-0 right-0 top-0 bg-black/80 justify-center items-center z-10">
              <View className="bg-[#1f1f1f] w-[80%] rounded-xl p-4">
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className="py-3"
                    onPress={() => handleGenderSelect(option.value)}
                  >
                    <Text className="text-white text-xl text-center">
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  className="mt-4"
                  onPress={() => setShowGenderModal(false)}
                >
                  <Text className="text-white text-xl text-center font-bold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="mt-3 flex-row items-center">
            <TextInput
              className="bg-transparent border border-white/20 text-white/85 w-full text-xl rounded-xl p-4 h-14"
              placeholder="Password"
              placeholderTextColor="white"
              secureTextEntry={hidePassword}
              autoComplete="password"
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
              {hidePassword ? (
                <Icon
                  name="eye"
                  size={20}
                  color="white"
                  className="self-center ml-[-40px]"
                />
              ) : (
                <Icon
                  name="eye-invisible"
                  size={20}
                  color="white"
                  className="self-center ml-[-40px]"
                />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="bg-white w-full rounded-xl mt-10 p-4">
            <Text className="text-center font-light text-xl">SIGN UP</Text>
          </TouchableOpacity>
          <View className="flex-row mt-1 space-x-2 justify-center">
            <Text className="text-white">Already have an account? </Text>
            <Link href="auth/login" className="text-white font-bold">
              Sign in
            </Link>
          </View>
          <Text className="text-white text-center mt-5">OR</Text>
          <TouchableOpacity className="bg-white w-full rounded-xl mt-5 p-4 flex-row justify-center">
            <Icon
              name="google"
              size={20}
              color="black"
              className="self-center mr-2"
            />
            <Text className="text-center font-light text-xl">
              CONTINUE WITH GOOGLE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default SignupPage;
