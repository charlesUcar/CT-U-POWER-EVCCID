const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV || 'development';
const IS_DEV = APP_ENV === 'development';
const IS_STAGING = APP_ENV === 'staging';

export default {
  name: IS_DEV
    ? 'U-POWER-EVCCID-Dev'
    : IS_STAGING
    ? 'U-POWER-EVCCID-Staging'
    : 'U-POWER-EVCCID',
  slug: IS_DEV
    ? 'u-power-evccid-dev'
    : IS_STAGING
    ? 'u-power-evccid-staging'
    : 'u-power-evccid',
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
    bundleIdentifier: IS_DEV
      ? 'com.upower.evccid.dev'
      : IS_STAGING
      ? 'com.upower.evccid.staging'
      : 'com.upower.evccid',
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
    package: IS_DEV
      ? 'com.upower.evccid.development'
      : IS_STAGING
      ? 'com.upower.evccid.staging'
      : 'com.upower.evccid',
    googleServicesFile: IS_DEV
      ? './google-services-dev.json'
      : IS_STAGING
      ? './google-services-staging.json'
      : './google-services-prod.json',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: IS_DEV
        ? '30a9ef20-70b4-49cc-a899-1868b0ab3eff'
        : IS_STAGING
        ? 'bf339734-6216-4650-b0dd-84cab5294085'
        : '7fa16fc6-0b91-4bd1-8695-a55464b0c2bb',
      env: IS_DEV ? 'development' : IS_STAGING ? 'staging' : 'production',
    },
    // 環境變數 - 這些值會在 build 時被嵌入到應用中
    EXPO_PUBLIC_APP_ENV: APP_ENV,
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
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
    // 自動配置 ProGuard 規則以移除偵錯日誌
    './app.plugin.js',
  ],
};
