# Mobile Application (React Native + Expo)

A modern React Native mobile application built with Expo, featuring cross-platform development with shared business logic.

## 🚀 Tech Stack

- **[Expo 53.0.22](https://expo.dev/)** - React Native platform with managed workflow
- **[React Native 0.79.6](https://reactnative.dev/)** - Cross-platform mobile development
- **[React 19.1.0](https://react.dev/)** - Latest React with shared components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Full type safety
- **[NativeWind 4.0.1](https://www.nativewind.dev/)** - Tailwind CSS for React Native
- **[React Navigation 7](https://reactnavigation.org/)** - Navigation with type safety
- **[Expo SDK 53](https://docs.expo.dev/)** - Native device APIs and services

## 🎯 Features

### 📱 Cross-Platform Development

- **iOS & Android** support with single codebase
- **Native performance** with React Native
- **Expo managed workflow** for simplified development
- **Hot reload** for instant feedback during development

### 🎨 Modern Mobile UI

- **NativeWind** for Tailwind CSS styling on mobile
- **React Navigation** with stack navigation
- **Safe area handling** for modern devices
- **Platform-specific optimizations**

### 🔄 Shared Business Logic

- **Shared types** from the shared package
- **Common services** for API calls
- **Consistent state management** with Zustand
- **Shared utilities** and validation schemas

## 📁 Project Structure

```
src/
├── components/              # Mobile-specific components
│   ├── ComponentShowcase.tsx  # Showcase of mobile components
│   ├── HelloWorld.tsx         # Basic demo component
│   └── SharedDemo.tsx         # Demo of shared functionality
├── App.tsx                 # Main app entry point
├── babel.config.js         # Babel configuration for NativeWind
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json           # Mobile app dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (Latest LTS recommended)
- **npm 10.2.4+**
- **Expo CLI**: `npm install -g @expo/cli`
- **EAS CLI**: `npm install -g eas-cli` (for building)

### Mobile Development Setup

#### iOS Development

- **macOS required** for iOS development
- **Xcode** (latest version from Mac App Store)
- **iOS Simulator** (included with Xcode)
- **iPhone/iPad** (optional, for device testing)

#### Android Development

- **Android Studio** with SDK
- **Android Virtual Device (AVD)** or physical Android device
- **USB debugging enabled** (for physical devices)

### Development

```bash
# Install dependencies (from root)
npm install

# Start development server
npm run dev:mobile

# Or from this directory
npm run dev
```

### Platform-Specific Commands

```bash
# Start on specific platforms
npm run android          # Run on Android device/emulator
npm run ios              # Run on iOS device/simulator
npm run web              # Run in web browser (for testing)

# Reset cache and restart
npm run reset            # Clear Expo cache
```

### Available Scripts

```bash
# Development
npm run dev              # Start Expo development server
npm run start            # Same as dev
npm run android          # Launch on Android
npm run ios              # Launch on iOS
npm run web              # Launch in web browser

# Building
npm run build            # Build for all platforms with EAS
npm run build:android    # Build for Android only
npm run build:ios        # Build for iOS only

# Code Quality
npm run lint             # Lint with ESLint
npm run lint:check       # Check linting without fixing
npm run lint:fix         # Fix linting issues
npm run typecheck        # Run TypeScript checks

# Utilities
npm run clean            # Fix Expo installation
npm run clean:deps       # Clean node_modules
npm run reset            # Clear Expo cache
```

## 📱 Expo Development Workflow

### Development Builds

```bash
# Start development server
expo start

# Open on device
# Scan QR code with Expo Go app (iOS/Android)
# Or press 'i' for iOS simulator
# Or press 'a' for Android emulator
```

### Development Options

```bash
# Start with different options
expo start --clear       # Clear cache
expo start --tunnel      # Use tunnel for external access
expo start --lan         # Use LAN for local network access
expo start --localhost    # Use localhost only
```

### Debugging

```bash
# Debug options
expo start --dev-client  # Use development build
expo start --web         # Run in web browser for debugging
```

## 🎨 Styling with NativeWind

### Tailwind CSS for React Native

NativeWind brings Tailwind CSS to React Native with full support for:

```typescript
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-xl font-bold text-gray-900 dark:text-white">
        Hello NativeWind!
      </Text>
    </View>
  );
}
```

### Configuration

**tailwind.config.js:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**babel.config.js:**

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
```

## 🧭 Navigation

### React Navigation Setup

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Type-Safe Navigation

```typescript
// Navigation types
type RootStackParamList = {
  Home: undefined;
  Details: { itemId: string };
};

// Usage in components
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const navigation = useNavigation<NavigationProp>();
navigation.navigate("Details", { itemId: "123" });
```

## 🔄 Shared Code Integration

### Using Shared Package

```typescript
// Import shared types
import type { User, LoginRequest } from "shared/types";

// Import shared services
import { authService, userService } from "shared/services";

// Import shared hooks
import { useAuth } from "shared/hooks";

// Import shared utilities
import { validateEmail, formatDate } from "shared/utils";
```

### State Management with Shared Store

```typescript
import { useAuthStore } from 'shared/stores';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl">Welcome, {user?.name}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

## 🏗️ Building for Production

### Development Builds

For development with custom native code:

```bash
# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Install on device
eas build:run --platform ios
eas build:run --platform android
```

### Production Builds

```bash
# Build for app stores
eas build --profile production --platform all

# Platform-specific builds
eas build --profile production --platform ios
eas build --profile production --platform android
```

### EAS Configuration

**eas.json:**

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

## 📱 Platform-Specific Features

### iOS Features

- **Face ID/Touch ID** authentication
- **Push notifications** with APNs
- **App Store** distribution
- **iOS-specific UI guidelines**

### Android Features

- **Biometric authentication**
- **Push notifications** with FCM
- **Google Play Store** distribution
- **Material Design** components

### Cross-Platform APIs

- **Camera** access
- **Location** services
- **File system** access
- **Device information**
- **Network** status
- **Async storage**

## 🔧 Configuration

### Environment Variables

Create `.env` in the mobile app directory:

```bash
# Expo configuration
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_APP_NAME=MyApp
```

### Expo Configuration

**app.json/app.config.js:**

```json
{
  "expo": {
    "name": "Mobile App",
    "slug": "mobile-app",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.yourcompany.mobileapp"
    },
    "android": {
      "package": "com.yourcompany.mobileapp"
    }
  }
}
```

## 🧪 Testing

Testing infrastructure is ready but needs implementation:

```bash
# Test commands (once implemented)
npm run test             # Run tests with Jest
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

**Test Structure (to be implemented):**

```
__tests__/
├── components/          # Component tests
├── screens/            # Screen tests
├── navigation/         # Navigation tests
└── integration/        # Integration tests
```

### Testing Tools

- **Jest** - JavaScript testing framework
- **React Native Testing Library** - Component testing
- **Detox** - End-to-end testing (optional)
- **Flipper** - Debugging and profiling

## 🚀 Deployment

### App Store Deployment (iOS)

1. **Build for production:**

   ```bash
   eas build --profile production --platform ios
   ```

2. **Submit to App Store:**

   ```bash
   eas submit --platform ios
   ```

3. **App Store Connect:**
   - Upload metadata and screenshots
   - Set up app pricing and availability
   - Submit for review

### Google Play Store Deployment (Android)

1. **Build for production:**

   ```bash
   eas build --profile production --platform android
   ```

2. **Submit to Google Play:**

   ```bash
   eas submit --platform android
   ```

3. **Google Play Console:**
   - Upload metadata and screenshots
   - Set up app pricing and availability
   - Submit for review

### Internal Distribution

```bash
# Internal testing builds
eas build --profile preview --platform all

# Share with TestFlight (iOS) or Internal Testing (Android)
```

## 🔧 Development Tips

### Debugging

```bash
# React Native debugger
npx react-native log-ios     # iOS logs
npx react-native log-android # Android logs

# Expo debugging
expo start --dev-client      # Development build debugging
```

### Performance

- **Use React.memo** for expensive components
- **Implement FlatList** for large lists
- **Optimize images** with proper sizing
- **Use native modules** for heavy computations

### Common Issues

1. **Metro bundler cache issues:**

   ```bash
   expo start --clear
   ```

2. **iOS simulator issues:**

   ```bash
   expo install --fix
   xcrun simctl shutdown all
   ```

3. **Android emulator issues:**
   ```bash
   adb kill-server
   adb start-server
   ```

## 🤝 Contributing

1. Follow React Native and Expo best practices
2. Use TypeScript for all new code
3. Follow the established component patterns
4. Test on both iOS and Android platforms
5. Use shared code whenever possible

## 📝 Related Documentation

- [Root README](../../README.md) - Monorepo overview
- [GUIDE](../../GUIDE.md) - Comprehensive development guide
- [Web App](../web/README.md) - Next.js web app documentation
- [Shared Package](../../packages/shared/README.md) - Shared code documentation
- [Expo Documentation](https://docs.expo.dev/) - Official Expo docs
- [React Native Documentation](https://reactnative.dev/) - Official React Native docs

---

**Happy mobile development! 📱**
