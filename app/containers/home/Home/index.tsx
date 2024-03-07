import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Text,
  View,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import Images from "../../../images";
import styles from "./index.style";
import React, { useCallback, useContext, useState } from "react";
import AppContext from "../../../context/AppContext";
import { useFocusEffect } from "@react-navigation/native";

function HomeScreen({ navigation }) {
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const { setGlobalBackgroundColor } = useContext(AppContext);

  useFocusEffect(
    useCallback(() => {
      // 進入Home頁面將全域背景換成#C1DFE2
      setGlobalBackgroundColor("#C1DFE2");
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TouchableOpacity
        style={styles.topHeaderContainer}
        onPress={() => {
          setIsListOpen(!isListOpen);
        }}
      >
        <View style={styles.topHeaderActionBox}>
          <MaterialIcons name="history" size={18} color="black" />
          <Text style={styles.topHeaderText}>車輛記錄</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.bodyContainer}>
        <View style={styles.topArea}>
          <View style={styles.logoTypographyImageBox}>
            <Image
              source={Images.LogoTypography}
              style={styles.logoTypographyImage}
            />
          </View>
          <View style={styles.accountBox}>
            <Text style={styles.accountBoxText}>KIA</Text>
          </View>
        </View>
        {isListOpen ? (
          <View style={styles.listArea}>
            <Text>LIST</Text>
          </View>
        ) : (
          <View style={styles.listAreaIsEmpty}>
            <Text style={{ textAlign: "center" }}>
              新增車輛 EV CCID 請按「開始新增」{"\n"}
              搜尋過去新增紀錄，請使用右上角車輛記錄
            </Text>
          </View>
        )}
      </View>
      <View style={styles.createActionArea}>
        <TouchableOpacity
          style={styles.createActionBtnBox}
          onPress={() => {
            setGlobalBackgroundColor("#2C333F");
            navigation.push("Scan");
          }}
        >
          <View style={styles.createBtnAreaPlusIconBox}>
            <MaterialIcons name="add" size={24} color="black" />
          </View>
          <Text style={styles.createBtnAreaPlusText}>開始新增</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeScreen;
