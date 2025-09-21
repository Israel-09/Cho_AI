import React from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For Material Icons

// Sample file data for static rendering
const sampleFiles = [];

const InputSection = ({ input, setInput, onChange, isChatting, onSend }) => {
  // Helper to get file type label (e.g., [PDF], [JPEG])
  const getFileTypeLabel = (type) => {
    const extension = type.split("/").pop().toUpperCase();
    return `[${extension}]`;
  };

  const handleSend = () => {
    console.log("The input is, ", input, "-- isChatting:", isChatting);
    if (isChatting) return;
    onSend(input);
    setInput("");
  };
  return (
    <View className="w-[95%] mt-4 flex-1 absolute bottom-0 mx-auto mb-4 bg-black ">
      <View className="bg-black rounded-2xl border border-gray-600 p-2 flex flex-col justify-start gap-2 shadow-md">
        {/* File display with navigation */}
        {sampleFiles.length > 0 && (
          <View className="flex flex-row items-center">
            <TouchableOpacity className="p-2">
              <Icon name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-1 py-2"
            >
              {sampleFiles.map((file, index) => (
                <View
                  key={index}
                  className="flex flex-col items-center bg-gray-800 rounded-lg p-2 min-w-[120px] mx-1"
                >
                  <Text
                    className="text-white text-sm max-w-[100px]"
                    numberOfLines={1}
                  >
                    {file.name.length > 15
                      ? `${file.name.slice(0, 15)}...`
                      : file.name}
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    {getFileTypeLabel(file.type)}
                  </Text>
                  <TouchableOpacity className="p-1">
                    <Icon name="close" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity className="p-2">
              <Icon name="chevron-right" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        {/* TextInput */}
        <TextInput
          multiline
          placeholder="AskCho anything"
          maxLength={6 * 80}
          numberOfLines={10}
          className=" bg-transparent p-3 rounded-lg text-white"
          style={{
            fontSize: 16,
            maxHeight: Math.min(150, 20 * 8),
          }}
          value={input}
          onChangeText={onChange}
        />
        <View className="flex flex-row justify-between items-center mt-2">
          <View className="flex flex-row gap-2">
            <TouchableOpacity className="p-2">
              <Icon name="attach-file" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled
              className="border bg-gray-600 rounded-2xl px-2 py-1 flex flex-row items-center"
            >
              <Icon name="search" size={16} color="#fff" />
              <Text className="text-white text-sm ml-1">Research</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="p-2"
            onPress={handleSend}
            disabled={isChatting}
            style={{ opacity: isChatting ? 0.5 : 1 }}
          >
            <Icon name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Placeholder for SigninRequiredDialog */}
      <View className="hidden" />
    </View>
  );
};

export default InputSection;
