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
import images from "../../../images";
import styles from "./index.style";
import React, { useState } from "react";

function HomeScreen({ navigation }) {
  const [isListOpen, setIsListOpen] = useState<boolean>(false);

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
              source={images.LogoTypography}
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
            console.log("Navigation To Scan Screen");
            // navigation.push('Scan');
          }}
        >
          <Text style={styles.createBtnAreaPlusIcon}>+</Text>
          <Text style={styles.createBtnAreaPlusText}>開始新增</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeScreen;
