import Toast from 'react-native-toast-message';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './index.style';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { bindEvccidWithVehicle } from '../../../services/Api';

function FinalConfirmScreen({ route, navigation }) {
  const { vin, vehicleId, evccId, identifier } = route.params;

  const handleSubmitBinding = async () => {
    // 7J3ZZ56T7834500003, JS3TD62V1Y4107896
    // Alert.alert("V.I.N 已送出");
    console.log(vin, vehicleId, evccId, identifier);
    const response = await bindEvccidWithVehicle(vehicleId, evccId, identifier);
    console.log(response.status);
    if (response.success) {
      Toast.show({
        type: 'customSuccess',
        text1: '綁定成功',
        position: 'bottom',
      });
      navigation.replace('Home', {});
      return;
    } else {
      Toast.show({
        type: 'customError',
        text1: `綁定失敗, status: ${response.status}`,
        position: 'bottom',
      });
      console.error('API request failed with status:', response.status);
      navigation.replace('Home', {});
      return;
    }
  };

  const handleUserCancle = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>建立車輛與 EVCCID 綁定</Text>
        <View style={styles.confirmInfoContainer}>
          <View style={styles.confirmInfos}>
            <View style={styles.confirmInfoBox}>
              <Text style={styles.confirmInfoTitle}>V.I.N</Text>
              <Text style={[styles.confirmInfoTitle]}>{vin}</Text>
            </View>
            <View style={styles.confirmInfoBox}>
              <Text style={styles.confirmInfoTitle}>EVCCID</Text>
              <Text style={[styles.confirmInfoTitle]}>{evccId}</Text>
            </View>
          </View>
          <View style={styles.submitBtnContainer}>
            <TouchableOpacity
              style={styles.submitUserInputVinBtn}
              onPress={handleSubmitBinding}
            >
              <Text style={styles.submitUserInputVinBtnText}>確認送出</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cancleBtnContainer}>
            <TouchableOpacity
              style={styles.cancleBtn}
              onPress={handleUserCancle}
            >
              <Text style={styles.cancleBtnText}>放棄</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

export default FinalConfirmScreen;
