// import Config from 'react-native-config';
// import DeviceInfo from 'react-native-device-info';

const ENV = process.env.EXPO_PUBLIC_APP_ENV;
let DOMAIN = process.env.EXPO_PUBLIC_API_URL;

export const TIMEOUT = 30000;

export const endpoints = {
  upower: `${DOMAIN}`,
  env: `${ENV}`,
};

// export const AppVersion = DeviceInfo.getVersion();
