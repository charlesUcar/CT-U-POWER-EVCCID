import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Platform, Text, TouchableOpacity, View } from 'react-native';
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from 'expo-camera';
import AppContext from '../../../context/AppContext';
import { useIsForeground } from '../../../hooks/useIsForeground';
import styles from './index.style';
import BindingSteps from '../../../components/Steps/BindingSteps';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RootStackParamList = {
  Home: undefined;
  VinConfirm: { vin: string };
  VinTyping: undefined;
};

type ScanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

function ScanScreen({ navigation }: { navigation: ScanScreenNavigationProp }) {
  const [permission, requestPermission] = useCameraPermissions();

  const { setGlobalBackgroundColor } = useContext(AppContext);

  // 獲取安全區域的 insets，用於處理導航列遮擋問題
  const insets = useSafeAreaInsets();

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const [isActive, setIsActive] = useState<boolean>(isFocused && isForeground);
  const [consecutiveScans, setConsecutiveScans] = useState<string[]>([]);
  const isFirstScan = useRef<boolean>(true);
  const lastExecutionTime = useRef<number>(0);
  // enable a torch setting
  const [torch, setTorch] = useState(false);

  const onBarcodeScanned = useCallback(
    (scanningResult: BarcodeScanningResult) => {
      const now = Date.now();
      if (isFirstScan.current) {
        isFirstScan.current = false;
        lastExecutionTime.current = now;
        return;
      }
      if (now - lastExecutionTime.current < 100) {
        return; // 如果距離上次執行不到 100ms，直接返回
      }

      lastExecutionTime.current = now;

      const originValue = scanningResult.data;
      let currentValue = '';
      if (originValue.length > 17) {
        currentValue = originValue.substring(0, 17);
      } else {
        currentValue = originValue;
      }

      console.log('currentValue', currentValue);
      // 更新連續掃描數組
      setConsecutiveScans((prev) => {
        const newScans = [...prev, currentValue];
        // 只保留最後5次的掃描結果
        if (newScans.length > 5) {
          newScans.shift();
        }
        return newScans;
      });
      console.log('consecutiveScans', consecutiveScans);

      if (
        consecutiveScans.length === 5 &&
        consecutiveScans.every((scan) => scan === currentValue) &&
        isActive &&
        isValidVin(currentValue)
      ) {
        setConsecutiveScans([]); // 重置掃描記錄
        navigation.replace('VinConfirm', {
          vin: currentValue,
        });
      }
    },
    [isFirstScan, isActive, navigation, consecutiveScans]
  );

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
    requestPermission();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.withoutPermissionContainer}>
        <Text style={styles.message}>需要您的相機權限才能使用此功能</Text>
        <Button onPress={requestPermission} title="授予權限" />
      </View>
    );
  }
  // if (device == null)
  //   return (
  //     <View>
  //       <Text>ERROR</Text>
  //     </View>
  //   );
  return (
    <View style={[styles.container, { paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 24) : 24 }]}>
      <BindingSteps currentStep={1} />
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <View style={styles.torchBox}>
            <TouchableOpacity
              onPress={() => setTorch(!torch)}
              style={styles.torchIcon}
            >
              <Ionicons
                name={torch ? 'flash-off' : 'flash'}
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
        <Text></Text>

        <View style={styles.cameraContainer}>
          <CameraView
            active={isActive}
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ['qr', 'code39'] }}
            onBarcodeScanned={onBarcodeScanned}
            autofocus="on"
            enableTorch={torch}
          />
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
