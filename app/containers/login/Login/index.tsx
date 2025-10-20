import React, { useCallback, useContext, useState } from 'react';
import AppContext from '../../../context/AppContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import images from '../../../images';
import styles from './index.style';
import { login } from '../../../services/Api';
import Toast from 'react-native-toast-message';
import Loading from '../../../components/animate/Loading';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  // 可以根據您的導航結構添加更多路由
};

function LoginScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  const [userName, setUserName] = useState('');
  // const [isValidUserName, setIsValidUserName] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { setGlobalBackgroundColor } = useContext(AppContext);

  const handleUserNameChange = (text: string) => {
    setUserName(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // 使用正則表達式驗證密碼長度是否為8個字符
    setIsValidPassword(/^.{8}$/.test(text));
  };

  const handleSubmit = async () => {
    setGlobalBackgroundColor('#C1DFE2');

    if (!userName || !password) {
      Toast.show({
        type: 'customWarning',
        text1: '請輸入帳密',
        position: 'bottom',
      });
      return;
    }

    const payload = {
      username: userName,
      password: password,
    };

    try {
      setIsLoading(true);
      const result = await login(payload);

      if (result.success) {
        // 登入成功，導航到首頁或執行其他操作
        Toast.show({
          type: 'customSuccess',
          text1: '登入成功',
          position: 'bottom',
        });
        navigation.replace('Home');
      } else {
        // 登入失敗，顯示錯誤訊息
        setIsLoading(false);
        Toast.show({
          type: 'customError',
          text1: '登入失敗，請檢查帳號密碼有無錯誤',
          position: 'bottom',
        });
      }
    } catch (error) {
      // 處理其他錯誤
      console.error('Login failed:', error);
      setIsLoading(false);
      Toast.show({
        type: 'customError',
        text1: '登入異常，請稍後再試',
        position: 'bottom',
      });
    }

    // if (userName && isValidUserName && password && isValidPassword) {
    //   // 在這裡處理提交邏輯
    //   navigation.push("Home");
    // } else if (!userName || !isValidUserName) {
    //   alert("Please enter a valid userName address.");
    //   return;
    // } else if (!password || !isValidPassword) {
    //   Alert.alert(
    //     "Invalid Password",
    //     "Password must be at least 8 characters long."
    //   );
    //   return;
    // }
    return;
  };

  useFocusEffect(
    useCallback(() => {
      // 進入Login頁面將全域背景換成#C1DFE2
      setGlobalBackgroundColor('#C1DFE2');
      return () => {
        setIsLoading(false);
      };
    }, [])
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={images.Logo} style={styles.logoImage} />
          <Text
            style={{
              marginTop: 24,
              marginBottom: 8,
              fontSize: 28,
              fontWeight: '600',
              color: '#2C333F',
            }}
          >
            Log In
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: 'gray',
              fontWeight: '400',
            }}
          >
            Welcome
          </Text>
        </View>
        <KeyboardAvoidingView
          style={styles.formContainer}
          enabled={Platform.OS === 'ios' ? true : false}
          behavior={'padding'}
          keyboardVerticalOffset={20} // 鍵盤彈出時的垂直偏移量
        >
          <View style={styles.userNameContainer}>
            <Text style={styles.label}>UserName</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleUserNameChange}
              value={userName}
              autoCapitalize="none" // 禁用自動大寫，因為電子郵件地址不區分大小寫
              placeholder="Enter Your UserName"
              placeholderTextColor="gray"
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handlePasswordChange(text)}
              value={password}
              placeholder="Enter Your Password"
              placeholderTextColor="gray"
              secureTextEntry={!showPassword} // 如果 showPassword 為 true，則顯示密碼
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{
                position: 'absolute', // 將 iconContainer 設置為絕對定位
                right: '15%', // 將 iconContainer 放置在 TextInput 的最右邊
                top: '44%',
              }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <View
          style={{
            width: '100%',
            paddingLeft: 32,
            paddingRight: 32,
          }}
        >
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            {isLoading ? (
              <Loading />
            ) : (
              <Text style={styles.submitBtnText}>Log in</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default LoginScreen;
