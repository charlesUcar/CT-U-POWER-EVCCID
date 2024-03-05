import { Text, View, TouchableOpacity, AppState, Alert } from "react-native";
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
  const [scannedType, setScannedType] = useState<string>("");
  const [scannedCode, setScannedCode] = useState<string>("");
  const isFocused = useIsFocused();

  const [isActive, setIsActive] = useState<boolean>(
    isFocused && appStateVisible === "active"
  );
  // const devices = Camera.getAvailableCameraDevices();
  const device = useCameraDevice("back");
  const format = useCameraFormat(device, [{ videoResolution: "max" }]);
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "code-39"],
    onCodeScanned: (codes: any) => {
      setScannedType(codes[0].type);
      setScannedCode(codes[0].value);
      if (codes[0].value.length === 17) {
        if (isValidVin(codes[0].value)) {
          Alert.alert("GET V.I.N", codes[0].value);
          console.log(codes[0].value);
          setIsActive(false);
        }
      }
    },
  });

  const handleToggleInputStyle = () => {
    navigation.navigate("VinTyping");
  };

  const handleClickCloseBtn = () => {
    navigation.navigate("Home");
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

  useEffect(() => {
    console.log(navigation);
    requestPermission();

    return () => {
      setIsActive(false);
    };
  }, [navigation]);

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
        <Text style={styles.title}>QR & Barcode</Text>

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
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.toggleInputStyle}
          onPress={handleToggleInputStyle}
        >
          <Text style={styles.toggleInputStyleText}>我要自己輸入</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.temp}>
        <Text>Scan</Text>
        <Text>Current state is: {appStateVisible}</Text>
        <Text>Camera state is: {isActive ? "true" : "false"}</Text>
        <Text>{hasPermission ? "相機權限：true" : "相機權限：false"}</Text>
        <Text>{scannedType}</Text>
        <Text>{scannedCode}</Text>
      </View> */}
    </View>
  );
}

export default ScanScreen;
