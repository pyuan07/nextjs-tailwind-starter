import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface HelloWorldProps {
  name?: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({ name = "World" }) => {
  return (
    <View className="bg-blue-50 p-6 rounded-lg shadow-sm mx-4 mb-4">
      <Text className="text-2xl font-bold text-blue-800 text-center mb-2">
        Hello {name}! 👋
      </Text>
      <Text className="text-gray-600 text-center mb-4">
        Welcome to your React Native + Next.js Monorepo!
      </Text>
      <TouchableOpacity className="bg-blue-500 py-3 px-6 rounded-lg">
        <Text className="text-white text-center font-semibold">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
};
