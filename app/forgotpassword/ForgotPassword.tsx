import React, { useState } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { config } from '../config';

export default function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!identifier) {
      setError('Email or phone number is required.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${config.backendUrl}/api/user/auth/forgotpassword`, {
        identifier,
      });

      setSuccess('OTP has been sent to your email. Please check your inbox.');
      router.push({
        pathname: '/otpverification/OtpVerification',
        params: { email: identifier, from: 'forgotpassword' },
      });
    } catch (error: any) {
      console.error('Forgot Password error:', error);
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <View style={styles.headerContainer}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/dt45pu5mx/image/upload/v1743530399/top_left_icon_jbwtev.png",
              }}
              style={styles.topleftimage}
            />
            <Text style={styles.headerTitle}>Forgot Password</Text>
            <Text style={styles.headerSubtitle}>Enter your email or phone number to receive OTP</Text>
          </View>

          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}

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

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>

            <View style={styles.backToLoginContainer}>
              <TouchableOpacity onPress={() => router.replace("/login/LoginForm")}>
                <Text style={styles.backToLoginText}>Back to Login</Text>
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
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 65,
    flex: 0.18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 55,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#009688',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#009688',
    fontWeight: 'bold',
  },
  topleftimage: {
    position: 'absolute',
  },
});