// import Config from 'react-native-config';
// import DeviceInfo from 'react-native-device-info';


const DOMAIN = process.env.EXPO_PUBLIC_API_URL;
export const TIMEOUT = 30000;

export const endpoints = {
  upower: `${DOMAIN}`,
};

// export const AppVersion = DeviceInfo.getVersion();
