import React from "react";
import {
  Card,
  Text,
  Button,
  ButtonText,
  Heading,
  VStack,
} from "@gluestack-ui/themed";

interface HelloWorldProps {
  name?: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({ name = "World" }) => {
  return (
    <Card className="bg-blue-50 p-6 rounded-xl shadow-sm mx-4 mb-4">
      <VStack className="gap-4 items-center">
        <Heading className="text-2xl font-bold text-blue-800 text-center">
          Hello {name}! 👋
        </Heading>
        <Text className="text-gray-600 text-center">
          Welcome to your React Native + Next.js Monorepo!
        </Text>
        <Button className="bg-blue-500 rounded-lg px-6">
          <ButtonText className="text-white font-semibold">
            Get Started
          </ButtonText>
        </Button>
      </VStack>
    </Card>
  );
};
