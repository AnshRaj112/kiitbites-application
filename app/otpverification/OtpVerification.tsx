import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { config } from "../../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OtpVerificationScreen() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { email, from } = useLocalSearchParams();

  const handleSubmit = async () => {
    setError("");

    if (!otp) {
      setError("OTP is required.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${config.backendUrl}/api/user/auth/otpverification`, {
        email,
        otp,
      });

      // Store the token if it exists in the response
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }

      if (from === "forgotpassword") {
        router.push({
          pathname: "/resetpassword/ResetPassword",
          params: { email }
        });
      } else {
        router.replace("/profile/ProfileForm");
      }
    } catch (error: any) {
      console.error("OTP Verification error:", error);
      setError(error.response?.data?.message || "Invalid OTP. Please try again.");
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
            <Text style={styles.headerTitle}>Verify OTP</Text>
            <Text style={styles.headerSubtitle}>
              Enter the OTP sent to your email
            </Text>
          </View>

          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>OTP</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#8a8a8a"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.resendText}>Back</Text>
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
  errorText: { color: "red", marginBottom: 10 },
  submitButton: {
    backgroundColor: "#009688",
    borderRadius: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  resendText: { fontSize: 14, color: "#009688", fontWeight: "bold" },
});