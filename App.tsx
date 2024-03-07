import { StatusBar } from "expo-status-bar";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import {
  NavigationAction,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { View } from "react-native";
import { AppProvider } from "./app/context/AppContext";
import AppContext from "./app/context/AppContext";
import LoginScreen from "./app/containers/login/Login";
import HomeScreen from "./app/containers/home/Home";
import ScanScreen from "./app/containers/scan/Scan";
import VinTypingScreen from "./app/containers/vinTyping/VinTyping";
import VinConfirmScreen from "./app/containers/binding/VinConfirm";
import PlugInScreen from "./app/containers/binding/PlugIn";
import FinalConfirmScreen from "./app/containers/binding/FinalConfirm";

const Stack = createNativeStackNavigator();

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
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="VinTyping" component={VinTypingScreen} />
          <Stack.Screen name="VinConfirm" component={VinConfirmScreen} />
          <Stack.Screen name="PlugIn" component={PlugInScreen} />
          <Stack.Screen name="FinalConfirm" component={FinalConfirmScreen} />
        </Stack.Navigator>
        <Toast />
        <StatusBar style="auto" />
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