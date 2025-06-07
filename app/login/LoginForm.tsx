import React, { useEffect, useRef, useState } from "react"; import {
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
import Toast from 'react-native-toast-message';
import { config } from "../../config";
import { saveToken, getToken, removeToken } from "../../utils/storage";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const navigationInProgress = useRef(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        console.log('Checking for existing token...');
        const token = await getToken();
        console.log('Token found:', !!token);
        if (token) {
          console.log('Redirecting to profile...');
          router.replace("/profile/ProfilePage");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        // Clear invalid token if any
        await removeToken();
      }
    };
    checkLogin();
  }, [router]);

  const handleSubmit = async () => {
    if (navigationInProgress.current) return;
    
    setError("");
    navigationInProgress.current = true;

    if (!identifier || !password) {
      navigationInProgress.current = false;
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Email/username and password are required.',
        position: 'bottom',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${config.backendUrl}/api/user/auth/login`,
        { identifier, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );

      const { token, message } = response.data;
      console.log('Login response received. Token present:', !!token);

      if (!token) {
        console.error('No token in response:', message);
        throw new Error(message || 'No token received from server');
      }

      try {
        console.log('Saving token...');
        await saveToken(token);
        console.log('Token saved successfully');
        
        // Remove isMounted check to prevent navigation blocking
        
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Redirecting to your profile...',
          position: 'bottom',
        });

        // Clear any previous errors
        setError('');
        
        // Navigate after a short delay
        console.log('Initiating navigation to profile...');
        // Navigate immediately after successful login
        console.log('Executing navigation to profile');
        router.replace('/profile/ProfilePage');
      } catch (storageError) {
        console.error('Token storage failed:', storageError);
        throw new Error('Failed to store authentication token');
      }

    } catch (error: any) {
      // Clear any invalid token on error
      await removeToken();
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message === 'Failed to store authentication token') {
        errorMessage = 'Failed to save login session. Please try again.';
      }
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          errorMessage = data?.message || 'Invalid email/phone or password';
        } else if (status === 400) {
          errorMessage = data?.message || 'Invalid request';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        if (data?.redirectTo) {
          router.push(data.redirectTo);
          navigationInProgress.current = false;
          return;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else {
        errorMessage = `Login error: ${error.message}`;
      }

      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
        position: 'bottom',
      });

    } finally {
      navigationInProgress.current = false;
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidView}
        >
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: "https://res.cloudinary.com/dt45pu5mx/image/upload/v1743530399/top_left_icon_jbwtev.png" }}
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
              <TouchableOpacity onPress={() => router.push("/forgotpassword/ForgotPassword")}>
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
              <TouchableOpacity onPress={() => router.push("/signup/SignupForm")}>
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
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  keyboardAvoidView: {
    flex: 1,
    justifyContent: "flex-start"
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 90,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
    marginBottom: 40,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingTop: 40,
  },
  inputGroup: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#111",
    padding: 14,
    borderRadius: 10,
  },
  eyeIcon: {
    padding: 5
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 14,
    color: "#00C2B2",
    fontWeight: "600"
  },
  loginButton: {
    backgroundColor: "#009688",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  noAccountText: {
    fontSize: 14,
    color: "#333"
  },
  signupText: {
    fontSize: 14,
    color: "#00C2B2",
    fontWeight: "bold"
  },
  topleftimage: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
  },
});
