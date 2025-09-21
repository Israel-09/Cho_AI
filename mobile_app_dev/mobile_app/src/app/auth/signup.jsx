import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebase";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../../assets/logo.png";
import LoadingScreen from "../../components/LoadingScreen";

const SignupPage = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({});
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
  });

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
      setForm({ ...form, dob: selectedDate });
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleGenderSelect = (value) => {
    setForm({ ...form, gender: value });
    setShowGenderModal(false);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!form.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!form.dob) {
      newErrors.dob = "Date of Birth is required";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    setFeedback({}); // Reset feedback state
    setErrors({}); // Reset errors state
    if (validateForm()) {
      const createUserAndProfile = httpsCallable(functions, "createAccount");
      try {
        setLoading(true);
        const response = await createUserAndProfile({
          name: form.name,
          email: form.email,
          gender: form.gender,
          dob: formatDate(new Date(form.dob)),
          password: form.password,
        });
        console.log("User created successfully:", response.data);

        await login(form.email, form.password);
        setForm({ name: "", email: "", gender: "", dob: "", password: "" });
      } catch (error) {
        console.error("Error creating user:", error);
        setFeedback({
          message: error.message || "Error creating account.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaProvider className="flex-1">
      {loading && <LoadingScreen visible={loading} />}
      <ScrollView
        className="flex-1 bg-black pt-5"
        contentContainerStyle={{ alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
      >
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
          <View>
            <TextInput
              className={`mb-2 bg-transparent border border-white/20 text-white/85 w-full text-xl rounded-xl p-4 h-14 ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Name"
              placeholderTextColor="white"
              autoComplete="name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              returnKeyType="next"
            />
            {errors.name && (
              <Text className="text-red-500 text-lg mb-1">{errors.name}</Text>
            )}
          </View>
          <View>
            <TextInput
              className={`mb-2 bg-transparent border border-white/20 text-white/85 w-full text-xl rounded-xl p-4 h-14 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="Email"
              placeholderTextColor="white"
              autoComplete="email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              returnKeyType="next"
            />
            {errors.email && (
              <Text className="text-red-500 text-lg mb-1">{errors.email}</Text>
            )}
          </View>
          <View className="flex-row gap-4 mb-2">
            <View className="flex-1">
              <TouchableOpacity onPress={() => setShowGenderModal(true)}>
                <TextInput
                  className={`bg-transparent border border-white/20 text-white/85 text-xl rounded-xl p-4 h-14 ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                  placeholder="Gender"
                  placeholderTextColor="white"
                  value={
                    form.gender
                      ? genderOptions.find((opt) => opt.value === form.gender)
                          ?.label
                      : ""
                  }
                  editable={false}
                  onPress={() => setShowGenderModal(true)}
                />
              </TouchableOpacity>
              {errors.gender && (
                <Text className="text-red-500 text-lg mb-1">
                  {errors.gender}
                </Text>
              )}
            </View>
            <View className="flex-1">
              <TouchableOpacity onPress={toggleDatePicker}>
                <TextInput
                  className={`bg-transparent border border-white/20 text-white text-xl rounded-xl p-4 h-14 ${
                    errors.dob ? "border-red-500" : ""
                  }`}
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  placeholderTextColor="white"
                  value={form.dob ? formatDate(new Date(form.dob)) : ""}
                  editable={false}
                  onPressIn={toggleDatePicker}
                />
              </TouchableOpacity>
              {errors.dob && (
                <Text className="text-red-500 text-lg mb-1">{errors.dob}</Text>
              )}
            </View>
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
            {showGenderModal && (
              <View className="absolute left-0 right-0 bottom-0 bg-black/80 justify-center items-center z-10">
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
          </View>
          <View>
            <View className="flex-row items-center">
              <TextInput
                className={`bg-transparent border border-white/20 text-white/85 w-full text-xl rounded-xl p-4 h-14 ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Password"
                placeholderTextColor="white"
                secureTextEntry={hidePassword}
                autoComplete="password"
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                returnKeyType="done"
              />
              <TouchableOpacity
                className="absolute right-4"
                onPress={() => setHidePassword(!hidePassword)}
              >
                <Icon
                  name={hidePassword ? "eye" : "eye-invisible"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-lg mt-1">
                {errors.password}
              </Text>
            )}
          </View>
          {feedback.message && (
            <Text
              className={`text-lg text-center ${
                feedback.severity === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {feedback.message}
            </Text>
          )}
          <TouchableOpacity
            className="bg-white w-full rounded-xl mt-6 p-4"
            onPress={handleSignup}
            disabled={loading}
          >
            <Text
              className={`text-center font-light text-xl ${
                loading ? "text-gray-500" : "text-black"
              }`}
            >
              {loading ? "SIGNING UP..." : "SIGN UP"}
            </Text>
          </TouchableOpacity>
          <View className="flex-row mt-1 space-x-2 justify-center">
            <Text className="text-white">Already have an account? </Text>
            <Link href="(auth)/signin" className="text-white font-bold">
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
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default SignupPage;
