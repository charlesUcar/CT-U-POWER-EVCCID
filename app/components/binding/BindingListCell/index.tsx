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
  FlatList,
} from "react-native";
import Images from "../../../images";
import styles from "./index.style";
import React, { useCallback, useContext, useState } from "react";
import AppContext from "../../../context/AppContext";
import { useFocusEffect } from "@react-navigation/native";

type Vehicle = {
  vehicleId: string;
  vin: string;
  evccid: string;
  status: number;
  createdTime: string;
};

function BindingListCell({ item, index }: { item: Vehicle; index: number }) {
  const [isListOpen, setIsListOpen] = useState<boolean>(false);

  const { setGlobalBackgroundColor } = useContext(AppContext);

  useFocusEffect(
    useCallback(() => {
      // 進入Home頁面將全域背景換成#C1DFE2
      setGlobalBackgroundColor("#C1DFE2");
      return () => {};
    }, [])
  );

  return (
    <View style={styles.listHead}>
      <Text style={styles.order}>{index}</Text>
      <Text style={styles.vin}>{item.vin}</Text>

      <View style={styles.evccId}>
        {item.evccid ? <Image source={Images.Success_circle_fill} /> : null}
      </View>
    </View>
  );
}

export default BindingListCell;
