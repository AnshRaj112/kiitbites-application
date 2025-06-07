// utils/storage.ts

// app/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';

export const saveToken = async (token: string) => {
  try {
    console.log('Saving token to storage...');
    await AsyncStorage.setItem(TOKEN_KEY, token);
    console.log('Token saved successfully');
    return true;
  } catch (e) {
    console.error('Error saving token:', e);
    return false;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    console.log('Getting token from storage...');
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    console.log('Retrieved token:', token ? 'Token exists' : 'No token found');
    return token;
  } catch (e) {
    console.error('Error getting token:', e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Error removing token:', e);
  }
};
