import { Text, View, TouchableOpacity, Alert } from 'react-native';
import styles from './index.style';
import React, { useCallback, useState } from 'react';
import Loading from '../../../components/animate/Loading';
import { useFocusEffect } from '@react-navigation/native';
import { createVehicleByVin, getVehicle } from '../../../services/Api';
// import useVinValidator from '../../../hooks/useVinValidator';
import { StatusBar } from 'expo-status-bar';
import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';

export type vehicle = {
  code: String;
  data: {
    createdTime: string;
    evccid: string;
    status: number;
    vehicleId: string;
    vin: string;
  }[];
  message: string;
};

function VinConfirmScreen({ route, navigation }) {
  const { vin } = route.params;
  // const { checkVinValid } = useVinValidator();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitUserInputVin = async () => {
    // 7J3ZZ56T7834500003, JS3TD62V1Y4107896
    // UU6JA69691D713820
    setIsLoading(true);
    // if (!checkVinValid(vin)) {
    //   crashlytics().log('V.I.N inValid');
    //   Alert.alert('V.I.N 格式錯誤', '請重新掃描並確認 V.I.N');
    //   setIsLoading(false);
    //   return;
    // }
    if (vin.length !== 17) {
      crashlytics().log('V.I.N inValid');
      Alert.alert('V.I.N 格式錯誤', '請重新掃描並確認 V.I.N');
      setIsLoading(false);
      return;
    }
    // 上傳VIN，伺服器會創建新的vehicle物件並帶入VIN
    // 創建後的vehicle物件location會在headers裡
    const response = await createVehicleByVin(vin);

    if (response.success && response.headers) {
      const url = response.headers.location;
      const params = new URLSearchParams(url.split('?')[1]);
      const vehicleId = params.get('vehicleid');
      if (vehicleId) {
        const { data } = await getVehicle({ vehicleId });
        navigation.replace('PlugIn', {
          vin,
          vehicleId: data.data[0].vehicleId,
        });
        return;
      }
      crashlytics().log('get vehicleId fail');
      Toast.show({
        type: 'customWarning',
        text1: '取得Vehicle錯誤',
        text2: '沒有VehicleId',
        position: 'bottom',
      });
      navigation.replace('Home');
      return;
    }
    if (!response.success && response.status === 401) {
      crashlytics().log('token expired');
      Toast.show({
        type: 'customWarning',
        text1: '請重新登入',
        position: 'bottom',
      });
      navigation.replace('Login');
      return;
    }
    crashlytics().log('create vehicle by vin fail');
    Toast.show({
      type: 'customWarning',
      text1: '發生錯誤',
      position: 'bottom',
    });
    navigation.replace('Home');
  };

  useFocusEffect(
    useCallback(() => {
      // 進入頁面前
      setIsLoading(false);
      return () => {
        // 離開頁面前
      };
    }, [])
  );

  const handleUserCancle = () => {
    navigation.replace('Scan', {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>確認 V.I.N</Text>
        <View style={styles.confirmInfoContainer}>
          {/* <Text style={styles.infoTitle}>V.I.N</Text> */}
          <Text style={styles.infoText}>{vin}</Text>
          <View style={styles.submitBtnContainer}>
            <TouchableOpacity
              style={styles.submitUserInputVinBtn}
              onPress={handleSubmitUserInputVin}
            >
              {isLoading ? (
                <Loading />
              ) : (
                <Text style={styles.submitUserInputVinBtnText}>
                  正確，下一步
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.cancleBtnContainer}>
            <TouchableOpacity
              style={styles.cancleBtn}
              onPress={handleUserCancle}
            >
              <Text style={styles.cancleBtnText}>重新掃描</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

export default VinConfirmScreen;
