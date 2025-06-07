import Constants from 'expo-constants';

export const config = {
  backendUrl: Constants.expoConfig?.extra?.backendUrl || 'http://localhost:5001'
}; 