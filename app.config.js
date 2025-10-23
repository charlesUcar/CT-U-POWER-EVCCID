const IS_DEV = process.env.EXPO_PUBLIC_APP_ENV === 'development';

export default {
  name: IS_DEV ? 'U-POWER-EVCCID-Dev' : 'U-POWER-EVCCID',
  slug: IS_DEV ? 'u-power-evccid-dev' : 'u-power-evccid',
  version: '1.4.1',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0096A3',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription: 'Allow $(PRODUCT_NAME) to access your camera',
    },
    bundleIdentifier: IS_DEV ? 'com.upower.evccid.dev' : 'com.upower.evccid',
    buildNumber: '1.4.1',
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    icon: './assets/icon.png',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0096A3',
    },
    permissions: ['android.permission.CAMERA'],
    package: IS_DEV ? 'com.upower.evccid.development' : 'com.upower.evccid',
    googleServicesFile: IS_DEV
      ? './google-services-dev.json'
      : './google-services-prod.json',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: IS_DEV
        ? '30a9ef20-70b4-49cc-a899-1868b0ab3eff'
        : '7fa16fc6-0b91-4bd1-8695-a55464b0c2bb',
    },
  },
  owner: 'charlesucar',
  plugins: [
    'expo-asset',
    'expo-font',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
      },
    ],
  ],
};
