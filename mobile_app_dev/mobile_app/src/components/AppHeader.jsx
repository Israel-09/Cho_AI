import { Text, TouchableOpacity, View, Modal, Image } from "react-native";
import React, { Component, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Inonicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "@/hooks/useAuth";
import Logo from "../../assets/logo.png";
import { router, useRouter } from "expo-router";

export const AppHeader = () => {
  const [aiMode, setAiMode] = useState("proAssistant");
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const setMode = (mode) => {
    setAiMode(mode);
    setModalVisible(false);
  };

  const getUserInitials = () => {
    const names = user?.displayName?.split(" ") || [];
    if (names.length > 1) {
      return (
        names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase()
      );
    } else if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return "U";
    }
  };

  return (
    <View className="flex-row justify-between items-center mx-2 px-2 py-3 border-b border-white/20 mb-2">
      {user && (
        <View className=" ">
          <TouchableOpacity>
            <FontAwesome name="bars" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <View className="items-center ">
        {user ? (
          <>
            {/* <Text className="text-white text-xl">Askcho</Text>
            <TouchableOpacity
              disabled={!user}
              onPress={() => setModalVisible(true)}
              className="flex-row items-center px-3 bg-[#333333] rounded-lg mt-2 w-[fit-content]"
            >
              <Text className="text-white text-md pr-1">
                {aiMode === "proAssistant" ? "Pro Assistant" : "Chat Buddy"}
              </Text>
              <Icon name="caret-down" size={14} color="white" />
            </TouchableOpacity> */}
            <Image
              source={Logo}
              style={{ width: 120, height: 40 }}
              resizeMode="contain"
            />
          </>
        ) : (
          <Image
            source={Logo}
            style={{ width: 120, height: 40 }}
            resizeMode="contain"
          />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View className="flex-1 justify-center items-center bg-black/50 ">
            <View className="bg-[#333333]  rounded-xl lg w-[70%] py-7">
              <Text className="text-white text-xl ml-4 mb-3  ">
                Select AI Mode
              </Text>
              <TouchableOpacity
                className={`py-2 px-4 ${
                  aiMode === "proAssistant" ? "bg-[#606060]" : ""
                }`}
                onPress={() => setMode("proAssistant")}
              >
                <Text className="text-white text-2xl font-bold">
                  Pro Assistant
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-2 px-4 ${
                  aiMode === "chatBuddy" ? "bg-[#606060]" : ""
                }`}
                onPress={() => setMode("chatBuddy")}
              >
                <Text className="text-white text-2xl font-bold">
                  Chat Buddy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="pt-5"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-red-900 text-xl ml-4">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View className="">
        {user ? (
          <>
            <TouchableOpacity
              className="px-4 py-2 bg-[#333333] rounded-full"
              onPress={() => setProfileModalVisible(true)}
            >
              <Text className="text-white text-2xl">{getUserInitials()}</Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={profileModalVisible}
              onRequestClose={() => {
                setProfileModalVisible(!profileModalVisible);
              }}
            >
              <View className="flex-1 justify-center items-center bg-black/50 ">
                <View className="bg-[#333333]  rounded-xl lg w-[80%] py-7 px-5">
                  <Text className="text-white text-2xl ">
                    {user?.displayName || "User"}
                  </Text>
                  <Text className="text-white/80 text-lg mb-7">
                    {user?.email || "No email provided"}
                  </Text>
                  <TouchableOpacity
                    className="bg-red-600 px-4 py-2 rounded-xl flex-row gap-2 items-center"
                    onPress={() => {
                      logout();
                      setProfileModalVisible(false);
                      alert("Logged out successfully");
                    }}
                  >
                    <Inonicons name="log-out-outline" size={20} color="white" />
                    <Text className="text-white text-md">Sign Out</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="mt-4"
                    onPress={() => setProfileModalVisible(false)}
                  >
                    <Text className="text-white text-xl font-bold text-center">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <TouchableOpacity
            className="bg-white px-4 py-2 rounded-xl"
            onPress={() => router.push("/auth/login")}
          >
            <Text className="text-black text-md">SIGN IN</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppHeader;
