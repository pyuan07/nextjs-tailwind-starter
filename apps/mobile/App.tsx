import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import config from "./gluestack-ui.config";
import {
  ScrollView,
  VStack,
  HStack as _HStack,
  Text,
  Button as _Button,
  ButtonText as _ButtonText,
  Card,
  Heading,
  Badge as _Badge,
  BadgeText as _BadgeText,
  SafeAreaView,
} from "@gluestack-ui/themed";
import { HelloWorld } from "./src/components/HelloWorld";
import { ComponentShowcase } from "./src/components/ComponentShowcase";
import { UIShowcase } from "./src/components/UIShowcase";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="auto" />

        <ScrollView className="flex-1">
          <VStack className="pt-12 pb-8">
            <Heading className="text-3xl font-bold text-center text-gray-900 mb-6">
              🚀 Monorepo Starter
            </Heading>

            {/* Hello World Component */}
            <HelloWorld name="Developer" />

            {/* Shared Demo */}
            <Card className="bg-green-50 mx-4 mb-4 p-5 rounded-xl shadow-sm">
              <Heading className="text-xl font-semibold text-green-800 mb-2">
                📦 Shared Code Demo
              </Heading>
              <Text className="text-gray-600 mb-1">
                Package: Shared API Configuration
              </Text>
              <Text className="text-gray-600">
                This component demonstrates shared code usage between web and
                mobile
              </Text>
            </Card>

            {/* Quick Component Showcase */}
            <ComponentShowcase />

            {/* Features */}
            <Card className="bg-white mx-4 mb-4 p-5 rounded-xl shadow-sm">
              <Heading className="text-xl font-semibold text-gray-800 mb-4">
                ✨ Features Included
              </Heading>
              <VStack className="gap-2">
                <Text className="text-gray-600">• React Native with Expo</Text>
                <Text className="text-gray-600">• Next.js Web Application</Text>
                <Text className="text-gray-600">• Shared Code Package</Text>
                <Text className="text-gray-600">• TypeScript Support</Text>
                <Text className="text-gray-600">• Turborepo Monorepo</Text>
                <Text className="text-gray-600">
                  • Gluestack UI + NativeWind
                </Text>
              </VStack>
            </Card>

            {/* Full UI Showcase */}
            <Card className="bg-white mx-4 mb-4 p-5 rounded-xl shadow-sm">
              <Heading className="text-xl font-semibold text-gray-800 mb-4">
                🎯 Complete UI Showcase
              </Heading>
              <Text className="text-gray-600 mb-4">
                Explore all available Gluestack UI components:
              </Text>
              <UIShowcase />
            </Card>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
