import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { CustomToast } from '../CustomToast';

export default function SignupStep1() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    if (!name || !email || !phone) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter name, email, and 10-digit phone number.',
        position: 'bottom',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
        position: 'bottom',
      });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone',
        text2: 'Phone number must be exactly 10 digits.',
        position: 'bottom',
      });
      return;
    }

    router.push({
      pathname: '/signup/password_signup',
      params: { 
        name, 
        email, 
        phone,
        type: 'user-standard' // Default user type
      },
    });
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Please sign up to get started</Text>

        <View style={styles.cardWrapper}>
          <View style={styles.card}>
            <Text style={styles.label}>NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#8a8a8a"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="example@gmail.com"
              placeholderTextColor="#8a8a8a"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>PHONE</Text>
            <TextInput
              style={styles.input}
              placeholder="9988776655"
              placeholderTextColor="#8a8a8a"
              keyboardType="numeric"
              maxLength={10}
              value={phone}
             // onChangeText={setPhone}
             onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
             ////
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

             <View style={styles.signupContainer}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/login/LoginForm")}
              >
                <Text style={styles.login}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      
      <Toast
        config={{
          error: (props) => <CustomToast {...props} />,
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: '#1a1a2e',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 90,
    },
    title: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 6,
    },
    subtitle: {
      color: '#B0B0B0',
      fontSize: 16,
      //marginBottom: 28,
    },
    cardWrapper: {
      flex: 1,
      width: '100%',
      backgroundColor: '#F6F6F6',
      borderRadius: 24,
      padding: 22,
      justifyContent: 'flex-start',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderBottomLeftRadius: 0,
      borderBottomEndRadius: 0,
      marginTop: 40,
    },
    card: {
      flex: 1,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      marginTop: 14,
      marginBottom: 6,
      color: '#333333',
    },
    input: {
      backgroundColor: '#EDEDED',
      padding: 14,
      borderRadius: 10,
      fontSize: 16,
      color: '#111',
    },
    button: {
      backgroundColor: '#009688',
      padding: 16,
      borderRadius: 12,
      marginTop: 32,
    },
    buttonText: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
    },
    footer: {
      marginTop: 16,
      color: '#333',
      fontSize: 14,
      textAlign: 'center',
    },
    login: {
      fontSize: 14,
      color: '#00C2B2',
      fontWeight: 'bold',
    },
    noAccountText: {
      color: '#666666',
      fontSize: 14,
    },
    signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  });