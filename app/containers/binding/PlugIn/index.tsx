import { Text, View } from 'react-native';
import styles from './index.style';
import React, { useEffect } from 'react';
import Loading from '../../../components/animate/Loading';
import { getEvccId } from '../../../services/Api';

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
        console.log('not found');
      }
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>請將充電槍置入車端</Text>
        <View style={styles.waitingPlugInContainer}>
          <Loading />
        </View>
        <View style={styles.tipsTextContainer}>
          <Text style={styles.tipsText}>系統與車端連接中，請稍候</Text>
        </View>
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
  );
}

export default PlugInScreen;
