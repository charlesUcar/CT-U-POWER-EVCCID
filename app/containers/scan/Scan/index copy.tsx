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
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { useIsFocused } from "@react-navigation/native";

function ScanScreen({ navigation }) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isScanMode, setIsScanMode] = useState<boolean>(true);
  const [scannedType, setScannedType] = useState<string>("");
  const [scannedCode, setScannedCode] = useState<string>("");
  const [userInputCode, setUserInputCode] = useState<string>("");
  const isFocused = useIsFocused();

  const [isActive, setIsActive] = useState<boolean>(
    isFocused && appStateVisible === "active"
  );
  const devices = Camera.getAvailableCameraDevices();
  const device = useCameraDevice("back");
  const format = useCameraFormat(device, [{ videoResolution: "max" }]);
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13", "code-39"],
    onCodeScanned: (codes: any) => {
      setScannedType(codes[0].type);
      setScannedCode(codes[0].value);
      if (codes[0].value.length === 17) {
        if (isValidVin(codes[0].value)) {
          Alert.alert("GET VIN", codes[0].value);
          console.log(codes[0].value);
          setIsActive(false);
        }
      }
      // console.log(`Scanned ${codes.length} codes!`)
      // console.log(codes);
    },
  });

  const handleUserInputVinChange = (text: string) => {
    setUserInputCode(text);
    // 使用正則表達式驗證郵件地址格式
    // setIsValidEmail(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text));
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
    if (isScanMode) {
      setIsActive(false);
      setIsScanMode(!isScanMode);
      return;
    }
    setIsActive(true);
    setIsScanMode(!isScanMode);
  };

  const handleClickCloseBtn = () => {
    navigation.navigate("Home");
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("appState.current: " + appState.current);
      console.log("nextAppState: " + nextAppState);
      console.log("#############################");
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
      }

      // console.log("AppStateCurrent", appState.current);
      // console.log("isActive:" + isActive);
    });

    return () => {
      subscription.remove();
    };
  }, [isScanMode]);

  requestPermission();

  if (device == null)
    return (
      <View>
        <Text>ERROR</Text>
      </View>
    );
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.closeBtnBox}>
          <TouchableOpacity onPress={handleClickCloseBtn}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>
          {isScanMode ? "QR & Barcode" : "輸入車輛 V.I.N"}
        </Text>
        {isScanMode ? (
          <View style={styles.cameraContainer}>
            {hasPermission && (
              <Camera
                style={{ width: "100%", height: "100%" }}
                device={device}
                format={format}
                fps={30}
                orientation="portrait"
                codeScanner={codeScanner}
                isActive={isActive}
              />
            )}
            <View style={styles.cameraBorderContainer}>
              <View style={styles.cameraBorderBox}>
                <View style={styles.cameraBorderTopLeft}></View>
                <View style={styles.cameraBorderTopRight}></View>
                <View style={styles.cameraBorderBottomLeft}></View>
                <View style={styles.cameraBorderBottomRight}></View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.inputFormContainer}>
            <Text style={styles.label}>V.I.N</Text>
            <TextInput
              style={[
                styles.input,
                !isValidVin(userInputCode) && styles.inputError,
              ]}
              onChangeText={handleUserInputVinChange}
              value={userInputCode}
              autoCapitalize="characters"
              placeholder="Enter V.I.N"
              placeholderTextColor="gray"
            />
            <View style={styles.userInputVinContainer}>
              <TouchableOpacity
                style={styles.submitUserInputVinBtn}
                // onPress={handleToggleInputStyle}
              >
                <Text style={styles.submitUserInputVinBtnText}>送出</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.toggleInputStyle}
          onPress={handleToggleInputStyle}
        >
          <Text style={styles.toggleInputStyleText}>
            {isScanMode ? "我要自己輸入" : "使用相機掃描"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.temp}>
        <Text>Scan</Text>
        <Text>Current state is: {appStateVisible}</Text>
        <Text>Camera state is: {isActive ? "true" : "false"}</Text>
        <Text>{hasPermission ? "相機權限：true" : "相機權限：false"}</Text>
        <Text>{scannedType}</Text>
        <Text>{scannedCode}</Text>
      </View>
    </View>
  );
}

export default ScanScreen;
