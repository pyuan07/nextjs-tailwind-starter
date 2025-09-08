import React from "react";
import { View, Text, ScrollView } from "react-native";

export const ComponentShowcase: React.FC = () => {
  const components = [
    { name: "Button", color: "bg-blue-500", textColor: "text-white" },
    { name: "Card", color: "bg-white", textColor: "text-gray-800" },
    { name: "Badge", color: "bg-purple-500", textColor: "text-white" },
    { name: "Alert", color: "bg-yellow-400", textColor: "text-yellow-900" },
  ];

  return (
    <View className="mx-4 mb-4">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        🎨 Component Showcase
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3">
          {components.map((component, index) => (
            <View
              key={index}
              className={`${component.color} p-4 rounded-lg min-w-[120px] shadow-sm`}
            >
              <Text
                className={`${component.textColor} font-semibold text-center`}
              >
                {component.name}
              </Text>
              <Text
                className={`${component.textColor} text-xs text-center mt-1 opacity-75`}
              >
                Component
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
