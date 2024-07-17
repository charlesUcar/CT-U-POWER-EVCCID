import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
} from 'react-native';
import styles from './index.style';
import Loading from '../../../components/animate/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserApiToken } from '../../../services/Api';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import dayjs from 'dayjs';

function SplashScreen({ navigation }) {

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

  // 從本地存儲中讀取資料
  const getLocalToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        console.log('Token found:', token);
        // 檢查有無過期
        if (checkTokenValid(token)) {
          setUserApiToken(token);
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
        return;
      } else {
        console.log('Token not found');
        navigation.replace('Login');
        return;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  useEffect(() => {
    getLocalToken();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // 進入Login頁面將全域背景換成#C1DFE2
      // setTimeout(() => {
      //   setIsLoading(false);
      //   navigation.navigate('Home');
      // }, 3000);
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <View>
        <Loading style="dark" />
      </View>
    </View>
  );
}

export default SplashScreen;
