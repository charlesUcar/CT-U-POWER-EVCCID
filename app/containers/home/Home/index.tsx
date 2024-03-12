import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Text,
  View,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import Images from "../../../images";
import styles from "./index.style";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../../../context/AppContext";
import { useFocusEffect } from "@react-navigation/native";
import BindingList from "../../../components/binding/BindingList";
import DateTimePicker from "../../../components/picker/DateTimePicker";
import { getVehicle } from "../../../services/Api";
import Loading from "../../../components/animate/Loading";

function HomeScreen({ navigation }) {
  const [listStartDate, setListStartDate] = useState<string | null>(null);
  const [listEndDate, setListEndDate] = useState<string | null>(null);
  const [listData, setListData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const setListTimeRange = ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    setListStartDate(startDate);
    setListEndDate(endDate);
  };

  const handleFetchBindingData = async ({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }) => {
    console.log("fetch");
    setIsLoading(true);
    const { data } = await getVehicle({ offset, limit });
    setListData(data);
    setIsLoading(false);
  };

  const { setGlobalBackgroundColor } = useContext(AppContext);

  useEffect(() => {
    if (listStartDate && listEndDate) {
      handleFetchBindingData({ offset: 0, limit: 100 });
    }
  }, [listStartDate, listEndDate]);

  useFocusEffect(
    useCallback(() => {
      // 進入Home頁面將全域背景換成#C1DFE2
      setGlobalBackgroundColor("#C1DFE2");
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.topHeaderContainer}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        {listData ? (
          <View style={styles.topHeaderActionBox}>
            <MaterialIcons name="search" size={24} color="black" />
          </View>
        ) : (
          <View style={styles.topHeaderActionBox}>
            <MaterialIcons name="history" size={18} color="black" />
            <Text style={styles.topHeaderText}>車輛記錄</Text>
          </View>
        )}
      </TouchableOpacity>
      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setModalVisible(false);
        }}
      >
        <DateTimePicker
          setModalVisible={setModalVisible}
          setListTimeRange={setListTimeRange}
        />
      </Modal>
      <View style={styles.bodyContainer}>
        <View style={styles.topArea}>
          <View style={styles.logoTypographyImageBox}>
            <Image
              source={Images.LogoTypography}
              style={styles.logoTypographyImage}
            />
          </View>
          <View style={styles.accountBox}>
            <Text style={styles.accountBoxText}>KIA</Text>
          </View>
        </View>
        {isLoading ? (
          <Loading style="dark" />
        ) : (
          <View style={styles.listContainer}>
            {listData ? (
              <View style={styles.list}>
                <BindingList listData={listData} />
              </View>
            ) : (
              <View style={styles.listIsEmpty}>
                <Text style={{ textAlign: "center" }}>
                  新增車輛 EV CCID 請按「開始新增」{"\n"}
                  搜尋過去新增紀錄，請使用右上角車輛記錄
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      <BlurView
        // experimentalBlurMethod="dimezisBlurView"
        intensity={20}
        style={styles.createActionArea}
      >
        <TouchableOpacity
          style={styles.createActionBtnBox}
          onPress={() => {
            setGlobalBackgroundColor("#2C333F");
            navigation.push("Scan");
          }}
        >
          <View style={styles.createBtnAreaPlusIconBox}>
            <MaterialIcons name="add" size={24} color="black" />
          </View>
          <Text style={styles.createBtnAreaPlusText}>開始新增</Text>
        </TouchableOpacity>
      </BlurView>
      <StatusBar style="dark" />
    </View>
  );
}

export default HomeScreen;
