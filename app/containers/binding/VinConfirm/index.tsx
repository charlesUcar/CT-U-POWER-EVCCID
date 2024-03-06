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
import { create } from "apisauce";
import { useFocusEffect } from "@react-navigation/native";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // define the api
  const api = create({
    baseURL: "https://app-upower-testing-vinevccid.azurewebsites.net",
  });

  // start making calls
  // api
  //   .get("/repos/skellock/apisauce/commits")
  //   .then((response) => response.data[0].commit.message)
  //   .then(console.log);

  const handleSubmitUserInputVin = async () => {
    // 7J3ZZ56T7834500003, JS3TD62V1Y4107896
    setIsLoading(true);
    // const { headers } = await api.post("/vehicle", {
    //   vin,
    // });

    // const { data } = await api.get(headers?.location.substring(1) as string);

    // navigation.navigate("PlugIn", {
    //   vin,
    //   vehicleId: (data as vehicle).data[0].vehicleId,
    // });

    navigation.navigate("PlugIn", {
      vin: "JS3TD62V1Y4107896",
      vehicleId: "8a6e1db5-6f4b-4c8c-90de-b74fcca49e49",
    });
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsLoading(false);
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
              <Text style={styles.submitUserInputVinBtnText}>
                {isLoading ? "送出中，請稍後" : "正確，下一步"}
              </Text>
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
