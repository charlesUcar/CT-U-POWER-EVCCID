import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Text,
  View,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Image,
  AppState,
  Alert,
} from "react-native";
import images from "../../../images";
import styles from "./index.style";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Loading from "../../../components/animate/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { createVehicleByVin, getVehicle } from "../../../services/Api";
import useVinValidator from "../../../hooks/useVinValidator";
import crashlytics from "@react-native-firebase/crashlytics";

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
  const { checkVinValid } = useVinValidator();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitUserInputVin = async () => {
    // 7J3ZZ56T7834500003, JS3TD62V1Y4107896
    // UU6JA69691D713820
    setIsLoading(true);
    if (!checkVinValid(vin)) {
      crashlytics().log("V.I.N inValid");
      Alert.alert("V.I.N 格式錯誤", "請重新掃描並確認 V.I.N");
      setIsLoading(false);
      return;
    }
    // 上傳VIN，伺服器會創建新的vehicle物件並帶入VIN
    // 創建後的vehicle物件location會在headers裡
    const headers = await createVehicleByVin(vin);

    if (headers) {
      const url = headers.location;
      const params = new URLSearchParams(url.split("?")[1]);
      const vehicleId = params.get("vehicleid");
      if (vehicleId) {
        const { data } = await getVehicle({ vehicleId });
        navigation.navigate("PlugIn", {
          vin,
          vehicleId: data.data[0].vehicleId,
        });
        return;
      }
      crashlytics().log('get vehicleId fail');
      Alert.alert("取得Vehicle錯誤", "沒有VehicleId");
      navigation.navigate("Home");
      return;
    } else {
      crashlytics().log('get vehicleId fail');
      Alert.alert("發生錯誤");
      navigation.navigate("Home");
      return;
    }
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
    navigation.navigate("Scan", {});
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
    </View>
  );
}

export default VinConfirmScreen;
