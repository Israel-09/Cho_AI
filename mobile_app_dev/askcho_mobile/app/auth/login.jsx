import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Logo from "../../assets/logo.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { width } = useWindowDimensions();
  const isMobile = width < 600; // Mimics theme.breakpoints.down("sm")

  const handleChange = (name, value) => {
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <SafeAreaView className="flex-1 dark:bg-black bg-gray-900">
      <View className="flex-1 justify-center items-center px-4 py-5">
        {/* Logo */}
        <Image
          source={Logo}
          className="h-[90px] w-[90px]"
          resizeMode="contain"
        />

        {/* Title */}
        <Text className="text-white text-3xl font-bold mt-4 text-center">
          Sign in
        </Text>

        {/* Email Sign-in Header */}
        <View className="bg-gray-800 w-[95%] py-2 mt-2 rounded">
          <Text className="text-white text-center">
            Sign in with your email here
          </Text>
        </View>

        {/* Form and Social Buttons */}
        <View
          className={`flex w-[95%] mt-6 ${isMobile ? "flex-col" : "flex-row justify-center"} gap-2`}
        >
          {/* Form Section */}
          <View className={isMobile ? "w-full" : "w-5/12"}>
            {/* Email Input */}
            <TextInput
              className="w-full text-white border border-gray-600 rounded-lg px-4 py-3 mb-4"
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={credentials.email}
              onChangeText={(text) => handleChange("email", text)}
            />

            {/* Password Input with Visibility Toggle */}
            <View className="relative w-full">
              <TextInput
                className="w-full text-white border border-gray-600 rounded-lg px-4 py-3 pr-12 mb-4"
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={credentials.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={handleClickShowPassword}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* Sign-in Button */}
            <TouchableOpacity
              className="w-full bg-white rounded-lg py-3 mb-4"
              onPress={() => {}}
            >
              <Text className="text-black text-center font-semibold">
                Sign in
              </Text>
            </TouchableOpacity>

            {/* Links */}
            <Text className="text-gray-400 text-center">
              Forgot Password?{" "}
              <Link href="/reset-password" className="text-white font-semibold">
                Reset
              </Link>
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Don't have an account yet?{" "}
              <Link href="/auth/signup" className="text-white font-semibold">
                Sign up
              </Link>
            </Text>
          </View>

          {/* Divider */}
          <View className={`flex justify-center my-5 bg-red`}>
            <Text className="text-gray-100 w-full">OR</Text>
          </View>

          {/* Social Buttons */}
          <View className={isMobile ? "w-full" : "w-5/12 flex flex-col gap-3"}>
            {/* Google Button */}
            <TouchableOpacity
              className="w-full bg-white rounded-lg py-3 flex-row items-center justify-center"
              onPress={() => {}}
            >
              <AntDesign
                name="google"
                size={24}
                color="#000000ff"
                style={{ marginRight: 8 }}
              />
              <Text className="text-black font-semibold">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Commented-out Apple and Facebook Buttons */}
            {/* <TouchableOpacity
              className="w-full bg-gray-700 rounded-lg py-3 flex-row items-center justify-center"
              onPress={() => {}}
            >
              <MaterialIcons name="apple" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white font-semibold">
                Continue with Apple
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full bg-gray-700 rounded-lg py-3 flex-row items-center justify-center"
              onPress={() => {}}
            >
              <MaterialIcons name="facebook" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white font-semibold">
                Continue with Facebook
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
