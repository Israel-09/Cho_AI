import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Logo from "../../../assets/logo.png";
import { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { Link } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/LoadingScreen";

const login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, logout } = useAuth();

  const handleLogin = async () => {
    console.log("Logging in with:", credentials);
    setLoading(true);
    setError(null);
    if (!credentials.email && !credentials.password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }
    try {
      await login(credentials.email, credentials.password);
    } catch (error) {
      //   setError(error.message);
      if (error.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      }
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //just logout user for testing
    logout();
  }, []);

  return (
    <SafeAreaProvider className="flex-1 ">
      {loading && (<LoadingScreen visible={loading} />)}
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {loading && (
          <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-50">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
        <ScrollView
          className="flex-1 bg-black  pt-5"
          contentContainerStyle={{ alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10 ">
            <Image source={Logo} className="w-40 h-40" resizeMode="contain" />
          </View>
          <View className="mb-5 px-4 bg-[#1f1f1f99] py-3 w-[80%]">
            <Text className="text-white text-center font-medium text-xl">
              Sign in with your email here
            </Text>
          </View>
          {error && (
            <View className="w-[80%] items-start text-bold pl-3 ">
              <Text className="text-red-600 font-bold text-xl">{error}</Text>
            </View>
          )}
          <View className="w-[80%] space-y-6 mt-5">
            <TextInput
              className="bg-transparent border border-white/20 text-white w-full text-xl rounded-xl p-4"
              placeholder="Email"
              placeholderTextColor="white"
              onChangeText={(text) =>
                setCredentials((prev) => ({ ...prev, email: text }))
              }
              autoComplete="email"
              keyboardType="email-address"
              value={credentials.email}
              returnKeyType="next"
            />
          </View>
          <View className="w-[80%] space-y-6 mt-5 flex-row items-center">
            <TextInput
              className="bg-transparent border border-white/20 text-white w-full text-xl rounded-xl p-4 "
              placeholder="Password"
              placeholderTextColor="white"
              secureTextEntry={hidePassword}
              onChangeText={(text) =>
                setCredentials((prev) => ({ ...prev, password: text }))
              }
              returnKeyType="submit"
              onSubmitEditing={handleLogin}
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
          <TouchableOpacity
            className="bg-white w-[80%] rounded-xl mt-2 p-4"
            onPress={handleLogin}
            loading={loading}
          >
            <Text className="text-center font-light text-xl">SIGN IN</Text>
          </TouchableOpacity>
          <View className="flex-row mt-5 space-x-2">
            <Text className="text-white">Forgot Password? </Text>
            <Link className="text-white font-bold" href="auth/reset-password">
              Reset
            </Link>
          </View>
          <View className="flex-row mt-1 space-x-2">
            <Text className="text-white">Don't have an account yet? </Text>
            <Link className="text-white font-bold" href="auth/signup">
              Sign Up
            </Link>
          </View>
          <Text className="text-white text-center mt-5">OR</Text>
          <TouchableOpacity className="bg-white w-[80%] rounded-xl mt-5 p-4 flex-row justify-center">
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default login;
