import React from "react";
import {
  Card,
  Text as _Text,
  ScrollView,
  Heading,
  HStack,
  Badge,
  BadgeText,
  VStack,
} from "@gluestack-ui/themed";

export const ComponentShowcase: React.FC = () => {
  const components = [
    { name: "Button", color: "bg-blue-500", textColor: "text-white" },
    {
      name: "Card",
      color: "bg-white border border-gray-200",
      textColor: "text-gray-800",
    },
    { name: "Badge", color: "bg-purple-500", textColor: "text-white" },
    { name: "Alert", color: "bg-yellow-400", textColor: "text-yellow-900" },
    { name: "Input", color: "bg-green-500", textColor: "text-white" },
    { name: "Avatar", color: "bg-red-500", textColor: "text-white" },
  ];

  return (
    <Card className="bg-white mx-4 mb-4 p-5 rounded-xl shadow-sm">
      <Heading className="text-xl font-bold text-gray-800 mb-4">
        🎨 Component Showcase
      </Heading>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack className="gap-3">
          {components.map((component, index) => (
            <Badge
              key={index}
              className={`${component.color} p-4 rounded-lg min-w-[120px] shadow-sm`}
            >
              <VStack className="items-center gap-1">
                <BadgeText
                  className={`${component.textColor} font-semibold text-center`}
                >
                  {component.name}
                </BadgeText>
                <BadgeText
                  className={`${component.textColor} text-xs text-center opacity-75`}
                >
                  Component
                </BadgeText>
              </VStack>
            </Badge>
          ))}
        </HStack>
      </ScrollView>
    </Card>
  );
};
