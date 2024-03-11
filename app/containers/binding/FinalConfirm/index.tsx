import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
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
import { bindEvccidWithVehicle } from "../../../services/Api";

function FinalConfirmScreen({ route, navigation }) {
  const { vin, vehicleId, evccId, identifier } = route.params;

  const handleSubmitBinding = async () => {
    // 7J3ZZ56T7834500003, JS3TD62V1Y4107896
    // Alert.alert("V.I.N 已送出");
    console.log(vin, vehicleId, evccId, identifier);
    const status = await bindEvccidWithVehicle(vehicleId, evccId, identifier);
    console.log(status);
    if (status && status >= 200 && status <= 299) {
      Toast.show({
        type: "success",
        text1: "綁定成功",
        position: "bottom",
      });
      return true;
    } else {
      Toast.show({
        type: "error",
        text1: "綁定失敗",
        text2: `status: ${status}`,
        position: "bottom",
      });
      console.error("API request failed with status:", status);
      return false;
    }
  };

  const handleUserCancle = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>建立車輛與 EVCCID 綁定</Text>
        <View style={styles.confirmInfoContainer}>
          <View style={styles.confirmInfos}>
            <View style={styles.confirmInfoBox}>
              <Text style={styles.confirmInfoTitle}>V.I.N</Text>
              <Text style={[styles.confirmInfoTitle]}>{vin}</Text>
            </View>
            <View style={styles.confirmInfoBox}>
              <Text style={styles.confirmInfoTitle}>EVCCID</Text>
              <Text style={[styles.confirmInfoTitle]}>{evccId}</Text>
            </View>
          </View>
          <View style={styles.submitBtnContainer}>
            <TouchableOpacity
              style={styles.submitUserInputVinBtn}
              onPress={handleSubmitBinding}
            >
              <Text style={styles.submitUserInputVinBtnText}>確認送出</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cancleBtnContainer}>
            <TouchableOpacity
              style={styles.cancleBtn}
              onPress={handleUserCancle}
            >
              <Text style={styles.cancleBtnText}>放棄</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default FinalConfirmScreen;
