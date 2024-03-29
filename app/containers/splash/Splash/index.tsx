import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import images from '../../../images';
import styles from './index.style';
import crashlytics from '@react-native-firebase/crashlytics';
import { login } from '../../../services/Api';
import Toast from 'react-native-toast-message';
import Loading from '../../../components/animate/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserApiToken } from '../../../services/Api';

function SplashScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 從本地存儲中讀取資料
  const getLocalToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        console.log('Token found:', token);
        setUserApiToken(token);
        navigation.replace('Home');
        return token;
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
        <Loading />
      </View>
    </View>
  );
}

export default SplashScreen;
