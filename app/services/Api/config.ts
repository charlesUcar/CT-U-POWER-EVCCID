// import Config from 'react-native-config';
// import DeviceInfo from 'react-native-device-info';

const ENV = (process.env as any).EXPO_PUBLIC_APP_ENV || 'development';
let DOMAIN =
  (process.env as any).EXPO_PUBLIC_API_URL ||
  'https://app-upower-testing-vinevccid.azurewebsites.net';

export const TIMEOUT = 30000;

export const endpoints = {
  upower: DOMAIN,
  env: ENV,
};

// export const AppVersion = DeviceInfo.getVersion();
