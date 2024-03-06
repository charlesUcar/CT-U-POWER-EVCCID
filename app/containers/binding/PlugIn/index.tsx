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
  AppState,
  Alert,
} from "react-native";
import images from "../../../images";
import styles from "./index.style";
import React, { useEffect, useRef, useState } from "react";

function PlugInScreen({ route, navigation }) {
  const { vin } = route.params;

  const handleSubmitUserInputVin = () => {
    // 7J3ZZ56T7834500003, JS3TD62V1Y4107896
    Alert.alert("V.I.N 已送出");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>請將充電槍置入車端</Text>
        <View style={styles.confirmInfoContainer}>
          {/* <Text style={styles.infoTitle}>V.I.N</Text> */}
          <Text style={styles.infoText}>{vin}</Text>
          <View style={styles.submitBtnContainer}>
            <TouchableOpacity
              style={styles.submitUserInputVinBtn}
              onPress={handleSubmitUserInputVin}
            >
              <Text style={styles.submitUserInputVinBtnText}>正確，下一步</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cancleBtnContainer}>
            <TouchableOpacity
              style={styles.cancleBtn}
            >
              <Text style={styles.cancleBtnText}>重新掃描</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default PlugInScreen;
