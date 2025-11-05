// import Config from 'react-native-config';
// import DeviceInfo from 'react-native-device-info';
import Constants from 'expo-constants';

// 從 expo-constants 讀取環境變數（這些值在 build 時被嵌入）
// 優先使用 extra 中的值，fallback 到 process.env（開發模式）
const ENV =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_ENV ||
  (process.env as any).EXPO_PUBLIC_APP_ENV ||
  'development';

let DOMAIN =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  (process.env as any).EXPO_PUBLIC_API_URL ||
  'https://app-upower-testing-vinevccid.azurewebsites.net';

const AppVersion = Constants.expoConfig?.version;
const androidPackageName = Constants.expoConfig?.android?.package;

export const TIMEOUT = 30000;

export const endpoints = {
  upower: DOMAIN,
  env: ENV,
  appVersion: AppVersion,
  androidPackageName: androidPackageName,
};

// export const AppVersion = DeviceInfo.getVersion();
