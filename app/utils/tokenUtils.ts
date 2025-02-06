import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { setUserApiToken } from '../services/Api';

const checkTokenValid = (token: string) => {
  const decoded = jwtDecode(token);
  const now = dayjs().unix();
  // 檢查token有無過期
  if (decoded.exp && now > Number(decoded.exp)) {
    console.log('expired!');
    return false;
  }
  return true;
};

export const getLocalToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      console.log('Token found:', token);
      // 檢查有無過期
      if (checkTokenValid(token)) {
        setUserApiToken(token);
        return true;
      } else {
        return false;
      }
    } else {
      console.log('Token not found');
      return false;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};

export const getUserIdFromToken = async (token: string) => {
  if (typeof token === 'string') {
    const decoded = jwtDecode<{ jti: string }>(token);
    return decoded.jti;
  }
  return null;
};
