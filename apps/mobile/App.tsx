import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>🚀 Monorepo Starter</Text>

        {/* Hello World Component */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hello Developer! 👋</Text>
          <Text style={styles.cardText}>
            Welcome to your React Native + Next.js Monorepo!
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Shared Demo */}
        <View style={[styles.card, styles.greenCard]}>
          <Text style={styles.cardTitle}>📦 Shared Code Demo</Text>
          <Text style={styles.cardText}>Package: Shared API Configuration</Text>
          <Text style={styles.cardText}>
            Description: This component demonstrates shared code usage between
            web and mobile
          </Text>
        </View>

        {/* Component Showcase */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎨 Component Showcase</Text>
          <View style={styles.row}>
            <View style={[styles.chip, styles.blueChip]}>
              <Text style={styles.chipText}>Button</Text>
            </View>
            <View style={[styles.chip, styles.whiteChip]}>
              <Text style={[styles.chipText, styles.darkText]}>Card</Text>
            </View>
            <View style={[styles.chip, styles.purpleChip]}>
              <Text style={styles.chipText}>Badge</Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ Features Included</Text>
          <Text style={styles.listItem}>• React Native with Expo</Text>
          <Text style={styles.listItem}>• Next.js Web Application</Text>
          <Text style={styles.listItem}>• Shared Code Package</Text>
          <Text style={styles.listItem}>• TypeScript Support</Text>
          <Text style={styles.listItem}>• Turborepo Monorepo</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#e0f2fe",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  greenCard: {
    backgroundColor: "#f0fdf4",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
  },
  blueChip: {
    backgroundColor: "#3b82f6",
  },
  whiteChip: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  purpleChip: {
    backgroundColor: "#8b5cf6",
  },
  chipText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12,
  },
  darkText: {
    color: "#1f2937",
  },
  listItem: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
});
