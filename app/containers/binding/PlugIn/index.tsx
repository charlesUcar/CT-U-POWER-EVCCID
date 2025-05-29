import { Text, TouchableOpacity, View } from 'react-native';
import styles from './index.style';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Loading from '../../../components/animate/Loading';
import { getEvccId } from '../../../services/Api';
import BindingSteps from '../../../components/Steps/BindingSteps';

function PlugInScreen({ route, navigation }) {
  const { vin, vehicleId } = route.params;
  let timer: NodeJS.Timeout;

  const fetchEVCCId = async () => {
    const response = await getEvccId(vehicleId);
    if (response.success) {
      return response.data;
    } else {
      console.error('API request failed with status:', response.status);
      return false;
    }
  };

  useEffect(() => {
    // 每5秒檢查有無在資料庫獲取到EVCCID
    timer = setInterval(async () => {
      const result = await fetchEVCCId();
      if (result) {
        console.log('get EVCCID!');
        console.log(result);
        clearInterval(timer);
        navigation.replace('FinalConfirm', {
          vin,
          vehicleId,
          evccId: result.data.evccid,
          identifier: result.data.identifier,
        });
      } else {
        console.log('EVCCID not found');
      }

      // navigation.replace('FinalConfirm', {
      //   vin,
      //   vehicleId,
      //   evccId: '1234evccid123456',
      //   identifier: '1234evccid123456',
      // });
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <BindingSteps currentStep={2} />
      <View style={styles.mainContainer}>
        <View style={styles.mainContainerInner}>
          <Text style={styles.title}>請將充電槍置入車端</Text>
          <View style={styles.waitingPlugInContainer}>
            <Loading />
          </View>
          <View style={styles.tipsTextContainer}>
            <Text style={styles.tipsText}>系統等待 EVCCID 讀取器回應中</Text>
          </View>
          {/* <View style={styles.tipsTextContainer}>
            <Text style={styles.tipsText}>
              請將充電槍置入車端，系統將自動連線
            </Text>
          </View> */}
          <View style={styles.descriptionTextContainer}>
            <Text style={styles.descriptionText}>
              如遇 EVCCID 讀取器讀取失敗
            </Text>
            <Text style={styles.descriptionText}>
              請將充電槍拔出，等待5秒後重新置入車端
            </Text>
            <Text style={styles.descriptionText}>
              可嘗試將車輛電門開啟後，重新將充電槍置入車端
            </Text>
          </View>
          <TouchableOpacity
            style={styles.backScanBtn}
            onPress={() => {
              navigation.replace('Scan');
            }}
          >
            <Text style={styles.backScanBtnText}>重新掃描</Text>
          </TouchableOpacity>
          {/* <View>
          <TouchableOpacity
            onPress={() => {
              clearInterval(timer);
              navigation.navigate("FinalConfirm", {
                vin,
                vehicleId,
                evccId: "1234evccid123456",
              });
            }}
          >
            <Text style={styles.tipsText}>test to next step</Text>
          </TouchableOpacity>
        </View> */}
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

export default PlugInScreen;
