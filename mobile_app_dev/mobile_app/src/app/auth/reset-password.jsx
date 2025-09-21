import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import logo from "../../../assets/logo.png";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import LoadingScreen from "../../components/LoadingScreen";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({});

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    console.log("Submitting password reset for:", email);
    setLoading(true);
    e.preventDefault();
    setFeedback({}); // Reset feedback state
    setErrors({}); // Reset errors state
    if (validateForm()) {
      try {
        await sendPasswordResetEmail(auth, email, {
          url: `https://askcho.ai/signin`,
          handleCodeInApp: true,
        });
        setFeedback({
          message: "Password reset email sent successfully.",
          severity: "success",
        });
      } catch (error) {
        console.error("Error sending password reset email:", error);
        console.log(error.code);
        if (error.code === "auth/user-not-found") {
          setFeedback({
            message: "No user found with this email address.",
            severity: "error",
          });
        } else if (error.code === "auth/missing-email") {
          setErrors({ email: "Invalid email address." });
        } else {
          setErrors({ email: "Error sending password reset email." });
        }
      } finally {
        setLoading(false);
        console.log(feedback);
        setEmail("");
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaProvider className="flex-1">
      <ScrollView
        className="flex-1 bg-black pt-5 bg-black"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ alignItems: "center" }}
      >
        {loading && <LoadingScreen visible={loading} />}
        {feedback.severity === "success" &&
          Alert.alert("Success", feedback.message, [{ text: "OK" }])}
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
          {errors.email && (
            <Text className="text-red-600 font-bold text-lg">
              {errors.email}
            </Text>
          )}
          <TouchableOpacity
            className="bg-white w-full rounded-xl p-4 mt-4"
            onPress={handleSubmit}
          >
            <Text className="text-center font-300 text-xl">CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ResetPasswordPage;
