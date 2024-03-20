import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from "react-native";
import Images from "../../../images";
import styles from "./index.style";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../../../context/AppContext";
import { useFocusEffect } from "@react-navigation/native";
import BindingList from "../../../components/binding/BindingList";
import DateTimePicker from "../../../components/picker/DateTimePicker";
import DateTimePickerIos from "../../../components/picker/DateTimePicker-ios";
import { getVehicle } from "../../../services/Api";
import Loading from "../../../components/animate/Loading";
import dayjs from "dayjs";
import { GetVehicleResponseBody } from "../../../services/Api/types";
import Toast from "react-native-toast-message";

var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

function HomeScreen({ navigation }) {
  const [listStartTime, setListStartTime] = useState<string | null>(null);
  const [listEndTime, setListEndTime] = useState<string | null>(null);
  const [listStartTimeUTC, setListStartTimeUTC] = useState<string>("");
  const [listEndTimeUTC, setListEndTimeUTC] = useState<string>("");
  const [listData, setListData] = useState<
    GetVehicleResponseBody["data"] | null
  >(null);
  const [totalCount, setTotalCount] = useState<string>("");

  const [platform, setPlatform] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const setListTimeRange = ({
    startTime,
    endTime,
  }: {
    startTime: string;
    endTime: string;
  }) => {
    setListStartTime(startTime);
    setListEndTime(endTime);
  };

  const handleFetchBindingData = async ({
    offset,
    limit,
    startTime,
    endTime,
  }: {
    offset: string;
    limit: string;
    startTime: string;
    endTime: string;
  }) => {
    setIsLoading(true);
    // turn date to UTC before fetch data
    // set endTime add one day
    const startTimeUTC = dayjs(startTime).utc().format("YYYY-MM-DDTHH:mm");
    const endTimeUTC = dayjs(dayjs(endTime).add(1, "day"))
      .utc()
      .format("YYYY-MM-DDTHH:mm");
    //
    console.log("fetch: " + startTimeUTC + " ~ " + endTimeUTC);
    setListStartTimeUTC(startTimeUTC);
    setListEndTimeUTC(endTimeUTC);

    const result = await getVehicle({
      offset,
      limit,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
    });

    // 有Fetch到內容
    if (result.status && result.status >= 200 && result.status <= 299) {
      setListData(result.data.data);
      setTotalCount(result.headers["x-total-count"]);
      setIsLoading(false);
      return;
    }
    // 沒Fetch到內容，會噴500
    Toast.show({
      type: "customWarning",
      text1: "所選區間無資料",
      position: "bottom",
    });
    setListData(null);
    setIsLoading(false);
    return;
  };

  const { setGlobalBackgroundColor } = useContext(AppContext);

  useEffect(() => {
    if (listStartTime && listEndTime) {
      handleFetchBindingData({
        offset: "0",
        limit: "50",
        startTime: listStartTime,
        endTime: listEndTime,
      });
    }
  }, [listStartTime, listEndTime]);

  useEffect(() => {
    setPlatform(Platform.OS);
  }, []);

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
      {platform === "android" ? (
        <Modal
          statusBarTranslucent
          animationType="slide"
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
      ) : (
        <Modal
          statusBarTranslucent
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            setModalVisible(false);
          }}
        >
          <DateTimePickerIos
            setModalVisible={setModalVisible}
            setListTimeRange={setListTimeRange}
          />
        </Modal>
      )}
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
              <>
                <View style={styles.listHeadLineArea}>
                  <Text style={styles.listHeadLineTitle}>
                    {listStartTime + " ~ " + listEndTime}
                  </Text>
                  <Text style={styles.listHeadLineSubtitle}>
                    共 {totalCount} 筆
                  </Text>
                </View>
                <View style={styles.list}>
                  <BindingList
                    listData={listData}
                    totalCount={totalCount}
                    startTimeUTC={listStartTimeUTC}
                    endTimeUTC={listEndTimeUTC}
                  />
                </View>
              </>
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
      <View style={styles.createActionArea}>
        <TouchableOpacity
          style={styles.createActionBtnBox}
          onPress={() => {
            setGlobalBackgroundColor("#2C333F");
            navigation.push("Scan");
          }}
        >
          <View style={styles.createBtnAreaPlusIconBox}>
            <Text style={styles.createBtnAreaPlusText}>開始新增</Text>
          </View>
        </TouchableOpacity>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

export default HomeScreen;
