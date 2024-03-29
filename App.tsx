import { StatusBar } from "expo-status-bar";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import {
  NavigationAction,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SafeAreaView, View, Text, Image } from "react-native";
import { AppProvider } from "./app/context/AppContext";
import AppContext from "./app/context/AppContext";
import SplashScreen from "./app/containers/splash/Splash";
import LoginScreen from "./app/containers/login/Login";
import HomeScreen from "./app/containers/home/Home";
import ScanScreen from "./app/containers/scan/Scan";
import VinTypingScreen from "./app/containers/vinTyping/VinTyping";
import {
  VinConfirmScreen,
  PlugInScreen,
  FinalConfirmScreen,
} from "./app/containers/binding";
import Images from "./app/images";

const Stack = createNativeStackNavigator();

const toastconfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  customSuccess: ({ text1, props }) => (
    <View
      style={{ height: 52, width: "100%", paddingLeft: 24, paddingRight: 24 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
          height: "100%",
          width: "100%",
          backgroundColor: "#1E1E1E",
          paddingLeft: 24,
          paddingRight: 24,
          borderRadius: 12,
        }}
      >
        <Image source={Images.Success_circle_fill} />
        <Text style={{ color: "#e3e3e3", fontSize: 14, marginBottom: 2 }}>
          {text1}
        </Text>
      </View>
    </View>
  ),
  customWarning: ({ text1, props }) => (
    <View
      style={{ height: 52, width: "100%", paddingLeft: 24, paddingRight: 24 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
          height: "100%",
          width: "100%",
          backgroundColor: "#1E1E1E",
          paddingLeft: 24,
          paddingRight: 24,
          borderRadius: 12,
        }}
      >
        <Image source={Images.Warning_circle_fill} />
        <Text style={{ color: "#e3e3e3", fontSize: 14, marginBottom: 2 }}>
          {text1}
        </Text>
      </View>
    </View>
  ),
  customError: ({ text1, props }) => (
    <View
      style={{ height: 52, width: "100%", paddingLeft: 24, paddingRight: 24 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
          height: "100%",
          width: "100%",
          backgroundColor: "#1E1E1E",
          paddingLeft: 24,
          paddingRight: 24,
          borderRadius: 12,
        }}
      >
        <Image source={Images.Error_circle_fill} />
        <Text style={{ color: "#e3e3e3", fontSize: 14, marginBottom: 2 }}>
          {text1}
        </Text>
      </View>
    </View>
  ),
};

const Wrapper = () => {
  const { globalBackgroundColor } = useContext(AppContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: globalBackgroundColor as string,
      }}
    >
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Splash"
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="VinTyping" component={VinTypingScreen} />
          <Stack.Screen name="VinConfirm" component={VinConfirmScreen} />
          <Stack.Screen name="PlugIn" component={PlugInScreen} />
          <Stack.Screen name="FinalConfirm" component={FinalConfirmScreen} />
        </Stack.Navigator>
        <Toast config={toastconfig} />
        <StatusBar style="dark" />
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Wrapper />
    </AppProvider>
  );
}
