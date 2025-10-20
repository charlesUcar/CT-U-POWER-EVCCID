import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Loading from '../../../components/animate/Loading';
import AppContext from '../../../context/AppContext';
import images from '../../../images';
import { changePassword } from '../../../services/Api';
import styles from './index.style';

function ChangePasswordScreen({ navigation }) {
  // const [userName, setUserName] = useState('KIA');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setGlobalBackgroundColor } = useContext(AppContext);

  const handleOldPasswordChange = (text: string) => {
    setOldPassword(text);
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  const handleSubmit = async () => {
    setGlobalBackgroundColor('#C1DFE2');

    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      Toast.show({
        type: 'customError',
        text1: '請輸入所有欄位',
        position: 'bottom',
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'customError',
        text1: '新密碼與確認密碼不一致',
        position: 'bottom',
      });

      return;
    }

    const payload = {
      newPassword: newPassword,
      oldPassword: oldPassword,
      confirmPassword: confirmPassword,
    };

    try {
      setIsLoading(true);
      const result = await changePassword(payload);

      if (result.success) {
        // 修改成功，導航到首頁或執行其他操作
        Toast.show({
          type: 'customSuccess',
          text1: '修改成功',
          position: 'bottom',
        });

        navigation.replace('Home');
      } else {
        // 修改失敗，顯示錯誤訊息
        setIsLoading(false);
        Toast.show({
          type: 'customError',
          text1: `修改失敗：${result.error}`,
          position: 'bottom',
        });
      }
    } catch (error) {
      // 處理其他錯誤
      console.error('Change Password failed:', error);
      setIsLoading(false);
      Toast.show({
        type: 'customError',
        text1: `修改異常，請稍後再試：${error}`,
        position: 'bottom',
      });
    }
    return;
  };

  useFocusEffect(
    useCallback(() => {
      // 進入ChangePassword頁面將全域背景換成#C1DFE2
      setGlobalBackgroundColor('#C1DFE2');
      return () => {
        setIsLoading(false);
      };
    }, [])
  );

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            Change Password
          </Text>
        </View>
        <KeyboardAvoidingView
          style={styles.formContainer}
          enabled={Platform.OS === 'ios' ? true : false}
          behavior={'padding'}
          keyboardVerticalOffset={20} // 鍵盤彈出時的垂直偏移量
        >
          {/* <View style={styles.userNameContainer}>
            <Text style={styles.label}>User</Text>
            <TextInput
              style={styles.input}
              value={userName}
              placeholderTextColor="gray"
              editable={false}
            />
          </View> */}
          <View style={styles.passwordContainer}>
            <Text style={styles.label}>Old Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleOldPasswordChange(text)}
              value={oldPassword}
              placeholder=""
              placeholderTextColor="gray"
              secureTextEntry={!showOldPassword} // 如果 showOldPassword 為 true，則顯示密碼
            />
            <TouchableOpacity
              onPress={toggleOldPasswordVisibility}
              style={{
                position: 'absolute', // 將 iconContainer 設置為絕對定位
                right: '15%', // 將 iconContainer 放置在 TextInput 的最右邊
                top: '44%',
              }}
            >
              <Ionicons
                name={showOldPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleNewPasswordChange(text)}
              value={newPassword}
              placeholder=""
              placeholderTextColor="gray"
              secureTextEntry={!showNewPassword} // 如果 showNewPassword 為 true，則顯示密碼
            />
            <TouchableOpacity
              onPress={toggleNewPasswordVisibility}
              style={{
                position: 'absolute', // 將 iconContainer 設置為絕對定位
                right: '15%', // 將 iconContainer 放置在 TextInput 的最右邊
                top: '44%',
              }}
            >
              <Ionicons
                name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleConfirmPasswordChange(text)}
              value={confirmPassword}
              placeholder=""
              placeholderTextColor="gray"
              secureTextEntry={!showConfirmPassword} // 如果 showConfirmPassword 為 true，則顯示密碼
            />
            <TouchableOpacity
              onPress={toggleConfirmPasswordVisibility}
              style={{
                position: 'absolute', // 將 iconContainer 設置為絕對定位
                right: '15%', // 將 iconContainer 放置在 TextInput 的最右邊
                top: '44%',
              }}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
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
              <Text style={styles.submitBtnText}>Confirm Change</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default ChangePasswordScreen;
