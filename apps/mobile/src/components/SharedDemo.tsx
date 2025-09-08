import React from "react";
import { View, Text } from "react-native";
// import { API_ENDPOINTS } from 'shared';

export const SharedDemo: React.FC = () => {
  // Demo of shared constants - will work once we set up proper imports
  const apiInfo = {
    name: "Shared API Configuration",
    description:
      "This component demonstrates shared code usage between web and mobile",
  };

  return (
    <View className="bg-green-50 p-4 rounded-lg mx-4 mb-4">
      <Text className="text-lg font-semibold text-green-800 mb-2">
        📦 Shared Code Demo
      </Text>
      <Text className="text-sm text-gray-700 mb-1">
        <Text className="font-medium">Package:</Text> {apiInfo.name}
      </Text>
      <Text className="text-sm text-gray-700">
        <Text className="font-medium">Description:</Text> {apiInfo.description}
      </Text>
    </View>
  );
};
