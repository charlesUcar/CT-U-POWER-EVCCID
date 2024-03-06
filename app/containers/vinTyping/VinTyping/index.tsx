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

function VinTypingScreen({ navigation }) {
  const [userInputVin, setUserInputCode] = useState<string>("");
  const [isUserInputVinError, setIsUserInputVinError] =
    useState<boolean>(false);

  const handleUserInputVinChange = (text: string) => {
    setUserInputCode(text);
    setIsUserInputVinError(false);
  };

  const handleSubmitUserInputVin = () => {
    // 7J3ZZ56T7834500003, JS3TD62V1Y4107896
    if (!isValidVin(userInputVin)) {
      Alert.alert("V.I.N 格式錯誤");
      setIsUserInputVinError(true);
      return;
    }
    navigation.navigate("VinConfirm");
  };

  const isValidVin = (vin: string) => {
    // 檢查是否有17個字符
    if (vin.length !== 17) {
      return false;
    }

    // 檢查字符是否合法
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return false;
    }

    // 檢查第9個字符是否是數字或字母X
    if (!/^[0-9X]$/.test(vin[8])) {
      return false;
    }

    return true;
  };

  const handleToggleInputStyle = () => {
    navigation.goBack();
  };

  const handleClickCloseBtn = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.closeBtnBox}>
          <TouchableOpacity onPress={handleClickCloseBtn}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>輸入車輛 V.I.N</Text>
        <View style={styles.inputFormContainer}>
          <Text style={styles.label}>V.I.N</Text>
          <TextInput
            style={[styles.input, isUserInputVinError && styles.inputError]}
            onChangeText={handleUserInputVinChange}
            value={userInputVin}
            autoCapitalize="characters"
            placeholder="Enter V.I.N"
            placeholderTextColor="gray"
          />
          <View style={styles.userInputVinContainer}>
            <TouchableOpacity
              style={styles.submitUserInputVinBtn}
              onPress={handleSubmitUserInputVin}
            >
              <Text style={styles.submitUserInputVinBtnText}>送出</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.toggleInputStyle}
          onPress={handleToggleInputStyle}
        >
          <Text style={styles.toggleInputStyleText}>使用相機掃描</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default VinTypingScreen;
