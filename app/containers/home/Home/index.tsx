import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from 'react-native';
import Images from '../../../images';
import styles from './index.style';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import BindingList from '../../../components/binding/BindingList';
import DateTimePicker from '../../../components/picker/DateTimePicker';
import DateTimePickerIos from '../../../components/picker/DateTimePicker-ios';
import { getVehicle } from '../../../services/Api';
import Loading from '../../../components/animate/Loading';
import dayjs from 'dayjs';
import { GetVehicleResponseBody } from '../../../services/Api/types';
import Toast from 'react-native-toast-message';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import crashlytics from '@react-native-firebase/crashlytics';

var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

function HomeScreen({ navigation }) {
  const [listStartTime, setListStartTime] = useState<string | null>(null);
  const [listEndTime, setListEndTime] = useState<string | null>(null);
  const [listStartTimeUTC, setListStartTimeUTC] = useState<string>('');
  const [listEndTimeUTC, setListEndTimeUTC] = useState<string>('');
  const [listData, setListData] = useState<
    GetVehicleResponseBody['data'] | null
  >(null);
  const [totalCount, setTotalCount] = useState<string>('');

  const [platform, setPlatform] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 全域的provider
  const { setGlobalBackgroundColor } = useContext(AppContext);

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
    const startTimeUTC = dayjs(startTime).utc().format('YYYY-MM-DDTHH:mm');
    const endTimeUTC = dayjs(dayjs(endTime).add(1, 'day'))
      .utc()
      .format('YYYY-MM-DDTHH:mm');
    //
    console.log('fetch: ' + startTimeUTC + ' ~ ' + endTimeUTC);
    setListStartTimeUTC(startTimeUTC);
    setListEndTimeUTC(endTimeUTC);

    const resbonse = await getVehicle({
      offset,
      limit,
      startTime: startTimeUTC,
      endTime: endTimeUTC,
    });

    if (resbonse.success) {
      // 成功並有Fetch到內容
      setListData(resbonse.data.data);
      setTotalCount(resbonse.headers['x-total-count']);
      setIsLoading(false);
      return;
    } else {
      if (resbonse.status === 401) {
        Toast.show({
          type: 'customError',
          text1: '請重新登入',
          position: 'bottom',
        });
        navigation.replace('Login');
        return;
      }
      // 沒Fetch到內容，會噴500
      Toast.show({
        type: 'customWarning',
        text1: '所選區間無資料',
        position: 'bottom',
      });
      setListData(null);
      setIsLoading(false);
      return;
    }
  };

  const handleDownloadData = async () => {
    setIsDownloadLoading(true);
    if (listData && Number(totalCount) > 50) {
      const response = await getVehicle({
        offset: '50',
        limit: '10000',
        startTime: listStartTimeUTC,
        endTime: listEndTimeUTC,
      });

      // 有Fetch到內容
      if (response.success) {
        // 蒐集用戶所選區間的所有記錄
        const currentDownloadData: GetVehicleResponseBody['data'] = [
          ...listData,
          ...response.data.data,
        ];
        generationExcel(currentDownloadData);
      }
      return;
    }
    listData && generationExcel(listData);
  };

  const generationExcel = async (
    currentDownloadData: GetVehicleResponseBody['data']
  ) => {
    // 產生Sheet表
    let XLSXArray: (string | number)[][] = [['', 'VIN', 'EVCCID']];
    currentDownloadData?.map((item, index) => {
      XLSXArray.push([index + 1, item.vin, item.evccid ? '已綁定' : '']);
    });

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(XLSXArray);

    XLSX.utils.book_append_sheet(wb, ws, 'VIN綁定記錄', true);

    const currentFileName =
      dayjs(listStartTime).format('YYMMDD') +
      '-' +
      dayjs(listEndTime).format('YYMMDD') +
      '-VIN綁定記錄.xlsx';

    const base64 = XLSX.write(wb, { type: 'base64' });
    const filename = FileSystem.documentDirectory + currentFileName;
    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(filename);
      setIsDownloadLoading(false);
    });
  };

  useEffect(() => {
    if (listStartTime && listEndTime) {
      handleFetchBindingData({
        offset: '0',
        limit: '50',
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
      setGlobalBackgroundColor('#C1DFE2');
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.topHeaderContainer}
        onPress={() => {
          crashlytics().log('open DateTimePicker Modal');
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
      {platform === 'android' ? (
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
            crashlytics().log('close DateTimePicker Modal');
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
                  <View style={styles.listHeadLineTitles}>
                    <Text style={styles.listHeadLineTitle}>
                      {listStartTime + ' ~ ' + listEndTime}
                    </Text>
                    <Text style={styles.listHeadLineSubtitle}>
                      共 {totalCount} 筆
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={handleDownloadData}
                  >
                    <Text style={styles.downloadBtnText}>下載</Text>
                  </TouchableOpacity>
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
                <Text style={{ textAlign: 'center' }}>
                  新增車輛 EV CCID 請按「開始新增」{'\n'}
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
            setGlobalBackgroundColor('#2C333F');
            navigation.push('Scan');
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
