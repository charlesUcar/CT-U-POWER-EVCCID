import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  NavigationAction,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Image,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import images from "./app/images";
import HomeScreen from "./app/containers/home/Home";
import ScanScreen from "./app/containers/scan/Scan";
import VinTypingScreen from "./app/containers/vinTyping/VinTyping";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

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
            welcome
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
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push("Home")}
      />
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate("Login")}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="VinTyping" component={VinTypingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C1DFE2",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  logoContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "lightblue",
    marginBottom: 60,
  },
  formContainer: {
    flex: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    // backgroundColor: "lightgreen",
  },
  emailContainer: {
    flex: 0,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    // backgroundColor: "lightgreen",
    paddingLeft: 32,
    paddingRight: 32,
    marginBottom: 24,
  },
  passwordContainer: {
    flex: 0,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    // backgroundColor: "lightgreen",
    paddingLeft: 32,
    paddingRight: 32,
    marginBottom: 24,
  },
  label: {
    marginBottom: 0, // 調整標籤和輸入框之間的間距
    fontSize: 12,
    color: "#2C333F",
  },
  input: {
    width: "100%",
    height: 40,
    // borderColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#2C333F",
    // paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: "600",
  },
  inputError: {
    borderColor: "red", // 驗證錯誤時顯示紅色邊框
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  submitBtn: {
    width: "100%",
    paddingTop: 19,
    paddingBottom: 19,
    backgroundColor: "#00565C",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});
