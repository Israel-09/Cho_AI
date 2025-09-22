import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Platform,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";
import AppHeader from "../../components/AppHeader";
import InputSection from "../../components/InputSection";
import { sendMessage } from "../../utils/chatResponse";
import LoadingScreen from "../../components/LoadingScreen";

const Home = () => {
  const theme = useTheme();
  const [aiMode, setAiMode] = useState("proAssistant");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searchSelected, setSearchSelected] = useState(false);
  const scrollViewRef = useRef(null);

  const handleDrawerToggle = () => {
    setNavOpen(!navOpen);
  };

  const handleSend = async (value) => {
    if (!value.trim()) return;
    Keyboard.dismiss();
    setIsChatting(true);
    console.log(messages);
    try {
      await sendMessage(value, setInput, messages, setMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsChatting(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View className="flex-1 bg-black  h-full">
      <AppHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`px-6 mb-4 ${
                message.sender === "user"
                  ? "self-end rounded-2xl bg-[#333333] py-2  max-w-[80%] "
                  : "self-start"
              }`}
            >
              {message.sender === "user" ? (
                <Text className="text-[16px] text-white">{message.text}</Text>
              ) : (
                <Markdown
                  // className="text-xl text-gray-200"
                  style={styles}
                >
                  {message.text}
                </Markdown>
              )}
            </View>
          ))}
        </ScrollView>
        <View className="h-[100px] justify-center items-center">
          <InputSection
            input={input}
            setInput={setInput}
            onChange={(text) => setInput(text)}
            isChatting={isChatting}
            onSend={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  body: {
    color: "white",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "400",
    backgroundColor: "black",
  },
  code_block: {
    backgroundColor: "#290d0dff",
    padding: 10,
    borderRadius: 8,
    color: "black",
  },

  code_inline: {
    backgroundColor: "#a23737ff",
    padding: 4,
    borderRadius: 4,
    color: "black",
  },
});
