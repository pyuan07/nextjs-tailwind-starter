import React, { useState } from "react";
import {
  Box as _Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Card,
  Heading,
  Badge,
  BadgeText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Switch,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  Avatar,
  AvatarImage as _AvatarImage,
  AvatarFallbackText,
  Progress,
  ProgressFilledTrack,
  Spinner,
  AlertDialog as _AlertDialog,
  AlertDialogBackdrop as _AlertDialogBackdrop,
  AlertDialogContent as _AlertDialogContent,
  AlertDialogHeader as _AlertDialogHeader,
  AlertDialogCloseButton as _AlertDialogCloseButton,
  AlertDialogFooter as _AlertDialogFooter,
  AlertDialogBody as _AlertDialogBody,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
  Divider,
} from "@gluestack-ui/themed";

export const UIShowcase: React.FC = () => {
  const [switchValue, setSwitchValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const showToastMessage = () => {
    toast.show({
      placement: "top",
      render: ({ id }) => (
        <Toast
          nativeID={`toast-${id}`}
          className="bg-green-500 rounded-lg shadow-lg mx-4"
        >
          <ToastTitle className="text-white font-semibold">Success!</ToastTitle>
          <ToastDescription className="text-green-100">
            This is a Gluestack UI toast message
          </ToastDescription>
        </Toast>
      ),
    });
  };

  return (
    <VStack className="p-4 gap-6">
      {/* Typography Section */}
      <Card className="bg-white p-5 rounded-xl shadow-sm">
        <Heading className="text-2xl font-bold text-gray-900 mb-4">
          📝 Typography
        </Heading>
        <VStack className="gap-2">
          <Heading className="text-xl font-semibold text-gray-800">
            Heading Large
          </Heading>
          <Heading className="text-lg font-medium text-gray-700">
            Heading Medium
          </Heading>
          <Text className="text-base text-gray-600">Regular body text</Text>
          <Text className="text-sm text-gray-500">Small text</Text>
          <Text className="text-xs text-gray-400">Extra small text</Text>
        </VStack>
      </Card>

      {/* Button Variants */}
      <Card className="bg-white p-5 rounded-xl shadow-sm">
        <Heading className="text-2xl font-bold text-gray-900 mb-4">
          🔘 Buttons
        </Heading>
        <VStack className="gap-3">
          <HStack className="gap-3 flex-wrap">
            <Button className="bg-blue-500 rounded-lg">
              <ButtonText className="text-white">Primary</ButtonText>
            </Button>
            <Button className="bg-gray-500 rounded-lg">
              <ButtonText className="text-white">Secondary</ButtonText>
            </Button>
            <Button className="bg-green-500 rounded-lg">
              <ButtonText className="text-white">Success</ButtonText>
            </Button>
            <Button className="bg-red-500 rounded-lg">
              <ButtonText className="text-white">Danger</ButtonText>
            </Button>
          </HStack>
          <HStack className="gap-3 flex-wrap">
            <Button className="bg-transparent border border-blue-500 rounded-lg">
              <ButtonText className="text-blue-500">Outline</ButtonText>
            </Button>
            <Button className="bg-transparent rounded-lg">
              <ButtonText className="text-blue-500">Ghost</ButtonText>
            </Button>
            <Button className="bg-blue-500 rounded-full px-6">
              <ButtonText className="text-white">Rounded</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Card>

      {/* Badges */}
      <Card className="bg-white p-5 rounded-xl shadow-sm">
        <Heading className="text-2xl font-bold text-gray-900 mb-4">
          🏷️ Badges
        </Heading>
        <HStack className="gap-3 flex-wrap">
          <Badge className="bg-blue-100 px-3 py-1 rounded-full">
            <BadgeText className="text-blue-800 font-medium">Default</BadgeText>
          </Badge>
          <Badge className="bg-green-100 px-3 py-1 rounded-full">
            <BadgeText className="text-green-800 font-medium">
              Success
            </BadgeText>
          </Badge>
          <Badge className="bg-yellow-100 px-3 py-1 rounded-full">
            <BadgeText className="text-yellow-800 font-medium">
              Warning
            </BadgeText>
          </Badge>
          <Badge className="bg-red-100 px-3 py-1 rounded-full">
            <BadgeText className="text-red-800 font-medium">Error</BadgeText>
          </Badge>
          <Badge className="bg-purple-500 px-3 py-1 rounded-lg">
            <BadgeText className="text-white font-medium">Premium</BadgeText>
          </Badge>
        </HStack>
      </Card>

      {/* Form Controls */}
      <Card className="bg-white p-5 rounded-xl shadow-sm">
        <Heading className="text-2xl font-bold text-gray-900 mb-4">
          📋 Form Controls
        </Heading>
        <VStack className="gap-4">
          <VStack className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Input Field
            </Text>
            <Input className="border border-gray-300 rounded-lg">
              <InputField placeholder="Enter your email" className="p-3" />
            </Input>
          </VStack>

          <VStack className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Textarea</Text>
            <Textarea className="border border-gray-300 rounded-lg">
              <TextareaInput
                placeholder="Enter your message"
                className="p-3 min-h-[80px]"
              />
            </Textarea>
          </VStack>

          <HStack className="gap-4 items-center">
            <Text className="text-sm font-medium text-gray-700">Switch</Text>
            <Switch
              value={switchValue}
              onValueChange={setSwitchValue}
              className="data-[state=checked]:bg-blue-500"
            />
          </HStack>
        </VStack>
      </Card>

      {/* Radio & Checkbox */}
      <Card className="bg-white p-5 rounded-xl shadow-sm">
        <Heading className="text-2xl font-bold text-gray-900 mb-4">
          ☑️ Selection Controls
        </Heading>
        <VStack className="gap-4">
          <VStack className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Radio Group
            </Text>
            <RadioGroup value={radioValue} onChange={setRadioValue}>
              <VStack className="gap-2">
                <Radio value="option1">
                  <RadioIndicator className="mr-2">
                    <RadioIcon />
                  </RadioIndicator>
                  <RadioLabel className="text-gray-700">Option 1</RadioLabel>
                </Radio>
                <Radio value="option2">
                  <RadioIndicator className="mr-2">
                    <RadioIcon />
                  </RadioIndicator>
                  <RadioLabel className="text-gray-700">Option 2</RadioLabel>
                </Radio>
              </VStack>
            </RadioGroup>
          </VStack>

          <VStack className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Checkbox Group
            </Text>
            <CheckboxGroup value={checkboxValues} onChange={setCheckboxValues}>
              <VStack className="gap-2">
                <Checkbox value="check1">
                  <CheckboxIndicator className="mr-2">
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel className="text-gray-700">
                    Remember me
                  </CheckboxLabel>
                </Checkbox>
                <Checkbox value="check2">
                  <CheckboxIndicator className="mr-2">
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel className="text-gray-700">
                    Subscribe to newsletter
                  </CheckboxLabel>
                </Checkbox>
              </VStack>
            </CheckboxGroup>
          </VStack>
        </VStack>
      </Card>

      {/* Avatar & Progress */}
      <Card className="bg-white p-5 rounded-xl shadow-sm">
        <Heading className="text-2xl font-bold text-gray-900 mb-4">
          👤 Avatar & Progress
        </Heading>
        <VStack className="gap-4">
          <VStack className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Avatars</Text>
            <HStack className="gap-3">
              <Avatar className="bg-blue-500">
                <AvatarFallbackText className="text-white font-semibold">
                  JD
                </AvatarFallbackText>
              </Avatar>
              <Avatar className="bg-green-500">
                <AvatarFallbackText className="text-white font-semibold">
                  AB
                </AvatarFallbackText>
              </Avatar>
              <Avatar className="bg-purple-500">
                <AvatarFallbackText className="text-white font-semibold">
                  CD
                </AvatarFallbackText>
              </Avatar>
            </HStack>
          </VStack>

          <VStack className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Progress Bar
            </Text>
            <Progress
              value={65}
              className="w-full h-2 bg-gray-200 rounded-full"
            >
              <ProgressFilledTrack className="bg-blue-500 h-full rounded-full" />
            </Progress>
          </VStack>

          <VStack className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Loading Spinner
            </Text>
            <HStack className="gap-4">
              <Spinner className="text-blue-500" />
              <Spinner className="text-green-500" size="large" />
              <Spinner className="text-purple-500" size="small" />
            </HStack>
          </VStack>
        </VStack>
      </Card>

      {/* Interactive Elements */}
      <Card className="bg-white p-5 rounded-xl shadow-sm">
        <Heading className="text-2xl font-bold text-gray-900 mb-4">
          🎯 Interactive Elements
        </Heading>
        <VStack className="gap-3">
          <Button className="bg-blue-500 rounded-lg" onPress={showToastMessage}>
            <ButtonText className="text-white">Show Toast</ButtonText>
          </Button>

          <Button
            className="bg-purple-500 rounded-lg"
            onPress={() => setShowModal(true)}
          >
            <ButtonText className="text-white">Open Modal</ButtonText>
          </Button>
        </VStack>
      </Card>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalBackdrop />
        <ModalContent className="bg-white rounded-xl mx-4">
          <ModalHeader className="border-b border-gray-200 pb-4">
            <Heading className="text-lg font-semibold">Modal Title</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody className="py-4">
            <Text className="text-gray-600">
              This is a Gluestack UI modal component. It supports backdrop,
              headers, body content, and action buttons.
            </Text>
          </ModalBody>
          <ModalFooter className="border-t border-gray-200 pt-4">
            <HStack className="gap-3">
              <Button
                className="bg-gray-300 rounded-lg"
                onPress={() => setShowModal(false)}
              >
                <ButtonText className="text-gray-700">Cancel</ButtonText>
              </Button>
              <Button
                className="bg-blue-500 rounded-lg"
                onPress={() => setShowModal(false)}
              >
                <ButtonText className="text-white">Confirm</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Divider className="my-4" />

      <Text className="text-center text-gray-500 text-sm">
        ✨ Gluestack UI + NativeWind Components Showcase ✨
      </Text>
    </VStack>
  );
};
