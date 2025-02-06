import { useFocusEffect } from '@react-navigation/native';
import 'core-js/stable/atob';
import React, { useCallback, useEffect } from 'react';
import {
  View,
} from 'react-native';
import Loading from '../../../components/animate/Loading';
import { getLocalToken } from '../../../utils/tokenUtils';
import styles from './index.style';

function SplashScreen({ navigation }) {
  // 從本地存儲中讀取資料
  useEffect(() => {
    getLocalToken().then((isValid) => {
      if (isValid) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    });
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
