import { StatusBar } from "expo-status-bar";
import React, { useCallback, useContext, useState } from "react";
import AppContext from "../../../context/AppContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import images from "../../../images";
import styles from "./index.style";
import crashlytics from "@react-native-firebase/crashlytics";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { setGlobalBackgroundColor } = useContext(AppContext);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // 使用正則表達式驗證郵件地址格式
    setIsValidEmail(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // 使用正則表達式驗證密碼長度是否為8個字符
    setIsValidPassword(/^.{8}$/.test(text));
  };

  const handleSubmit = () => {
    setGlobalBackgroundColor("#C1DFE2");
    crashlytics().log("Login Success");
    navigation.push("Home");

    // if (email && isValidEmail && password && isValidPassword) {
    //   // 在這裡處理提交邏輯
    //   navigation.push("Home");
    // } else if (!email || !isValidEmail) {
    //   alert("Please enter a valid email address.");
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
      setGlobalBackgroundColor("#C1DFE2");
      return () => {};
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
              fontWeight: "600",
              color: "#2C333F",
            }}
          >
            Log In
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "gray",
              fontWeight: "400",
            }}
          >
            Welcome
          </Text>
        </View>
        <View style={styles.emailContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !isValidEmail && styles.inputError]}
            onChangeText={handleEmailChange}
            value={email}
            keyboardType="email-address" // 將鍵盤類型設置為電子郵件地址
            autoCapitalize="none" // 禁用自動大寫，因為電子郵件地址不區分大小寫
            placeholder="Enter Your Email"
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
              position: "absolute", // 將 iconContainer 設置為絕對定位
              right: "15%", // 將 iconContainer 放置在 TextInput 的最右邊
              top: "44%",
            }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            paddingLeft: 32,
            paddingRight: 32,
          }}
        >
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default LoginScreen;
