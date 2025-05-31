import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BACKEND_URL = "http://localhost:5001";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();



  useEffect(() => {
    const checkLogin = async () => {
      // Use the correct method name: getItemAsync
      const token = await SecureStore.getItemAsync("user-jwt");
      if (token) {
        router.replace("/"); // redirect to home if token exists
      }
    };
    checkLogin();
  }, []);
  
  const handleSubmit = async () => {
    setError("");

    if (!identifier || !password) {
      setError("Email/username and password are required.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/auth/login`, {
        identifier,
        password,
      });

      const { jwt, user } = response.data;

      if (!jwt || !user) {
        throw new Error("Invalid response from server.");
      }

      await SecureStore.setItemAsync("user-jwt", String(jwt));
      await SecureStore.setItemAsync("user-data", JSON.stringify(user));

      router.replace("/"); // or "/(tabs)" if using tabs layout
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email/username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidView}
        >
          <View style={styles.headerContainer}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/dt45pu5mx/image/upload/v1743530399/top_left_icon_jbwtev.png",
              }}
              style={styles.topleftimage}
            />
            <Text style={styles.headerTitle}>Login</Text>
            <Text style={styles.headerSubtitle}>
              Please sign in to your existing account
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL or PHONE</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email or Phone"
                  placeholderTextColor="#8a8a8a"
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••"
                  placeholderTextColor="#8a8a8a"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#8a8a8a"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rememberForgotContainer}>
              <TouchableOpacity
                onPress={() => router.push("/forgotpassword/ForgotPassword")}
              >
                <Text style={styles.forgotText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/signup/SignupForm")}
              >
                <Text style={styles.signupText}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e" },
  keyboardAvoidView: { flex: 1, justifyContent: "flex-start", paddingTop: 40 },
  headerContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 65,
    flex: 0.18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  headerSubtitle: { fontSize: 16, color: "#b3b3b3", textAlign: "center" },
  formContainer: {
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    flex: 1,
  },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: "#e8e8e8",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 55,
  },
  input: { flex: 1, height: "100%", fontSize: 16, color: "#333" },
  eyeIcon: { padding: 5 },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 25,
  },
  forgotText: { fontSize: 14, color: "#009688", fontWeight: "500" },
  loginButton: {
    backgroundColor: "#009688",
    borderRadius: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  noAccountText: { fontSize: 14, color: "#333" },
  signupText: { fontSize: 14, color: "#009688", fontWeight: "bold" },
  topleftimage: {
    position: "absolute",
  },
});