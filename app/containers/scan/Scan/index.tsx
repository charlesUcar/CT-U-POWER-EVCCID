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
  Linking,
  AlertButton,
} from "react-native";
import images from "../../../images";
import styles from "./index.style";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Code,
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { useIsForeground } from "../../../hooks/useIsForeground";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const showCodeAlert = (value: string, onDismissed: () => void): void => {
  const buttons: AlertButton[] = [
    {
      text: "Close",
      style: "cancel",
      onPress: onDismissed,
    },
  ];
  if (value.startsWith("http")) {
    buttons.push({
      text: "Open URL",
      onPress: () => {
        Linking.openURL(value);
        onDismissed();
      },
    });
  }
  Alert.alert("Scanned Code", value, buttons);
};

function ScanScreen({ navigation }) {
  const { hasPermission, requestPermission } = useCameraPermission();
  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  // const [isScanMode, setIsScanMode] = useState<boolean>(true);
  const [scannedType, setScannedType] = useState<string>("");
  const [scannedCode, setScannedCode] = useState<string>("");
  const [userInputCode, setUserInputCode] = useState<string>("");

  // 1. Use a simple default back camera
  const device = useCameraDevice("back");

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const [isActive, setIsActive] = useState<boolean>(isFocused && isForeground);

  // 3. (Optional) enable a torch setting
  const [torch, setTorch] = useState(false);

  // 4. On code scanned, we show an aler to the user
  const isShowingAlert = useRef(false);
  const onCodeScanned = useCallback((codes: Code[]) => {
    // console.log(`Scanned ${codes.length} codes:`, codes);
    const type = codes[0]?.type;
    const value = codes[0]?.value;
    if (value == null) return;
    if (value.length !== 17) return;
    // if (isShowingAlert.current) return;
    // showCodeAlert(value, () => {
    //   isShowingAlert.current = false;
    // });
    // isShowingAlert.current = true;

    setScannedType(type);
    setScannedCode(value);

    if (isValidVin(value)) {
      setIsActive(false);
      // Alert.alert("GET VIN", value);
      console.log(value);
      navigation.navigate("VinConfirm", {
        vin: value,
      });
    }
  }, []);

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "code-39"],
    onCodeScanned: onCodeScanned,
  });

  const format = useCameraFormat(device, [{ videoResolution: "max" }]);
  // const codeScanner = useCodeScanner({
  //   codeTypes: ["qr", "ean-13", "code-39"],
  //   onCodeScanned: (codes: any) => {
  //     setScannedType(codes[0].type);
  //     setScannedCode(codes[0].value);
  //     if (codes[0].value.length === 17) {
  //       if (isValidVin(codes[0].value)) {
  //         Alert.alert("GET VIN", codes[0].value);
  //         console.log(codes[0].value);
  //         setIsActive(false);
  //       }
  //     }
  //     // console.log(`Scanned ${codes.length} codes!`)
  //     // console.log(codes);
  //   },
  // });

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
    navigation.push("VinTyping");
  };

  const handleClickCloseBtn = () => {
    navigation.navigate("Home");
  };

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);

      return () => {
        setIsActive(false);
      };
    }, [])
  );

  useEffect(() => {
    requestPermission();
  }, []);

  // if (device == null)
  //   return (
  //     <View>
  //       <Text>ERROR</Text>
  //     </View>
  //   );
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
          {hasPermission && device != null && (
            <Camera
              style={{ width: "100%", height: "100%" }}
              device={device}
              format={format}
              fps={30}
              orientation="portrait"
              codeScanner={codeScanner}
              torch={torch ? "on" : "off"}
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
      <View style={styles.temp}>
        <Text>Scan</Text>
        <Text>Camera state is: {isActive ? "true" : "false"}</Text>
        <Text>{hasPermission ? "相機權限：true" : "相機權限：false"}</Text>
        {/* <Text>{scannedType}</Text> */}
        <Text>{scannedCode}</Text>
      </View>
    </View>
  );
}

export default ScanScreen;
