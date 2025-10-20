import Toast from 'react-native-toast-message';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
import styles from './index.style';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { bindEvccidWithVehicle } from '../../../services/Api';
import BindingSteps from '../../../components/Steps/BindingSteps';
import dayjs from 'dayjs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

function FinalConfirmScreen({ route, navigation }) {
  const { vin, vehicleId, evccId, identifier } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const handleSubmitBinding = async () => {
    // setIsSuccess(false);
    // setModalVisible(true);
    // // 7J3ZZ56T7834500003, JS3TD62V1Y4107896
    // // Alert.alert("V.I.N 已送出");
    // console.log(vin, vehicleId, evccId, identifier);
    const response = await bindEvccidWithVehicle(vehicleId, evccId, identifier);
    if (response.success) {
      setTimeout(() => {
        Toast.show({
          type: 'customSuccess',
          text1: '綁定成功',
          position: 'bottom',
        });
      }, 500);
      // navigation.replace('Home', {});
      setIsSuccess(true);
      setModalVisible(true);
      return;
    } else {
      setTimeout(() => {
        Toast.show({
          type: 'customError',
          text1: `綁定失敗, status: ${response.status}`,
          position: 'bottom',
        });
      }, 500);
      console.error('API request failed with status:', response.status);
      // navigation.replace('Home', {});
      setIsSuccess(false);
      setModalVisible(true);
      return;
    }
  };

  const handleUserCancle = () => {
    navigation.replace('Home');
  };

  const handleContinueScan = () => {
    navigation.replace('Scan');
  };

  const handleBackHome = () => {
    const startTime = dayjs().utc().format('YYYY-MM-DD');
    const endTime = dayjs().utc().format('YYYY-MM-DD');

    navigation.replace('Home', {
      startTime: startTime,
      endTime: endTime,
    });
  };

  return (
    <View style={styles.container}>
      <BindingSteps currentStep={3} />
      <View style={styles.mainContainer}>
        <Text style={styles.title}>建立車輛 VIN 與 EVCCID 綁定</Text>
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
              <Text style={styles.submitUserInputVinBtnText}>確認綁定</Text>
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
      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <View style={styles.modalContent}>
            <View style={styles.messageContainer}>
              <View
                style={[
                  styles.stepTextContainer,
                  { backgroundColor: isSuccess ? '#FFC200' : '#d60020' },
                ]}
              >
                {isSuccess ? (
                  <MaterialIcons name="check" size={28} color="#493800" />
                ) : (
                  <MaterialIcons name="close" size={28} color="#FFF" />
                )}
              </View>
              <Text
                style={[
                  styles.messageText,
                  { color: isSuccess ? '#FFC200' : '#d60020' },
                ]}
              >
                {isSuccess ? '完成綁定' : '綁定失敗'}
              </Text>
              <Text style={styles.subMessageText}>
                {isSuccess ? '繼續掃描，或返回首頁' : '請重新開始'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleContinueScan}
            >
              <Text style={styles.confirmButtonText}>
                {isSuccess ? '繼續掃描' : '重新開始掃描'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.backHomeBtn]}
              onPress={handleBackHome}
            >
              <Text style={[styles.backHomeBtnText]}>返回首頁</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <StatusBar style="light" />
    </View>
  );
}

export default FinalConfirmScreen;
