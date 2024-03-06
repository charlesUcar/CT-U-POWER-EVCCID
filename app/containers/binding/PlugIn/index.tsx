import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity } from "react-native";
import images from "../../../images";
import styles from "./index.style";
import React, { useEffect, useRef, useState } from "react";
import { create } from "apisauce";
import Loading from "../../../components/animate/Loading";

function PlugInScreen({ route, navigation }) {
  const { vin, vehicleId } = route.params;
  let timer: NodeJS.Timeout;

  const api = create({
    baseURL: "https://app-upower-testing-vinevccid.azurewebsites.net",
  });

  const fetchEVCCId = async () => {
    try {
      const { data, status } = await api.get(
        `/vehicle/evccid?vehicleid=${vehicleId}`
      );
      if (status && status >= 200 && status <= 299) {
        return data;
      } else {
        console.error("API request failed with status:", status);
        return false;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };

  useEffect(() => {
    timer = setInterval(async () => {
      const result = await fetchEVCCId();
      if (result) {
        console.log("get EVCCID!");
        console.log(result);
        clearInterval(timer);
        navigation.navigate("FinalConfirm", {
          vin,
          vehicleId,
          evccId: result.evccId
        });
      } else {
        console.log("not found");
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
        <View>
          <TouchableOpacity
            onPress={() => {
              clearInterval(timer);
              navigation.navigate("FinalConfirm", {
                vin,
                vehicleId,
                evccId: '1234evccid123456'
              });
            }}
          >
            <Text style={styles.tipsText}>test to next step</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default PlugInScreen;
