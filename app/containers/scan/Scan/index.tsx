import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './index.style';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Code,
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useIsForeground } from '../../../hooks/useIsForeground';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppContext from '../../../context/AppContext';
import crashlytics from '@react-native-firebase/crashlytics';

function ScanScreen({ navigation }) {
  const { hasPermission, requestPermission } = useCameraPermission();
  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  // const [isScanMode, setIsScanMode] = useState<boolean>(true);
  const [scannedType, setScannedType] = useState<string>('');
  const [scannedCode, setScannedCode] = useState<string>('');

  const { setGlobalBackgroundColor } = useContext(AppContext);

  // 1. Use a simple default back camera
  const device = useCameraDevice('back');

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const [isActive, setIsActive] = useState<boolean>(isFocused && isForeground);

  // 3. (Optional) enable a torch setting
  const [torch, setTorch] = useState(false);

  // 4. On code scanned, we show an aler to the user
  const onCodeScanned = useCallback((codes: Code[]) => {
    const value = codes[0]?.value;
    if (value == null) return;
    if (value.length !== 17) return;
    if (isActive && isValidVin(value)) {
      setIsActive(false);
      // Alert.alert("GET VIN", value);
      crashlytics().log('scanned VIN');
      console.log(value);
      navigation.replace('VinConfirm', {
        vin: value,
      });
    }
  }, []);

  // 5. Initialize the Code Scanner to scan QR codes and Barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'code-39'],
    onCodeScanned: onCodeScanned,
  });

  const format = useCameraFormat(device, [{ videoResolution: 'max' }]);
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
    // if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    //   return false;
    // }

    // 檢查第9個字符是否是數字或字母X
    // if (!/^[0-9X]$/.test(vin[8])) {
    //   return false;
    // }

    return true;
  };

  const handleToggleInputStyle = () => {
    setIsActive(false);
    setTimeout(() => {
      navigation.push('VinTyping');
    }, 0);
  };

  const handleClickCloseBtn = () => {
    setIsActive(false);
    setTimeout(() => {
      navigation.replace('Home');
    }, 0);
  };

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      setGlobalBackgroundColor('#2C333F');
      return () => {
        setIsActive(false);
      };
    }, [])
  );

  useEffect(() => {
    crashlytics().log('request camera permission');
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
        <View style={styles.header}>
          <View style={styles.torchBox}>
            <TouchableOpacity
              onPress={() => setTorch(!torch)}
              style={styles.torchIcon}
            >
              <Ionicons
                name={torch ? 'flash' : 'flash-off'}
                color="white"
                size={24}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.closeBtnBox}>
            <TouchableOpacity onPress={handleClickCloseBtn}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.title}>QR & Barcode</Text>

        <View style={styles.cameraContainer}>
          {hasPermission && device != null && (
            <Camera
              style={{ width: '100%', height: '100%' }}
              device={device}
              format={format}
              fps={15}
              orientation="portrait"
              codeScanner={codeScanner}
              torch={torch ? 'on' : 'off'}
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
        <Text>Camera state is: {isActive ? "true" : "false"}</Text>
        <Text>{hasPermission ? "相機權限：true" : "相機權限：false"}</Text>
        <Text>{scannedType}</Text>
        <Text>{scannedCode}</Text>
      </View> */}
      <StatusBar style="light" />
    </View>
  );
}

export default ScanScreen;
