import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import * as XLSX from 'xlsx';
import Loading from '../../../components/animate/Loading';
import BindingList from '../../../components/binding/BindingList';
import DateTimePicker from '../../../components/picker/DateTimePicker';
import DateTimePickerIos from '../../../components/picker/DateTimePicker-ios';
import AppContext from '../../../context/AppContext';
import Images from '../../../images';
import { getVehicle } from '../../../services/Api';
import { GetVehicleResponseBody } from '../../../services/Api/types';
import { getUserIdFromToken } from '../../../utils/tokenUtils';
import styles from './index.style';

var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

function HomeScreen({ navigation, route }) {
  const [listStartTime, setListStartTime] = useState<string | null>(null);
  const [listEndTime, setListEndTime] = useState<string | null>(null);
  const [listStartTimeUTC, setListStartTimeUTC] = useState<string>('');
  const [listEndTimeUTC, setListEndTimeUTC] = useState<string>('');
  const [listData, setListData] = useState<
    GetVehicleResponseBody['data'] | null
  >(null);
  const [totalCount, setTotalCount] = useState<string>('');
  const [evccidCount, setEvccidCount] = useState<number>(0);
  const [isSingleDayData, setIsSingleDayData] = useState<boolean>(false);

  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userActionModalVisible, setUserActionModalVisible] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const defaultLimit: number = 80;

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

  const handleSetListTimeRange = (startTime: string, endTime: string) => {
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
        setTimeout(() => {
          Toast.show({
            type: 'customError',
            text1: '請重新登入',
            position: 'bottom',
          });
        }, 500);
        navigation.replace('Login');
        crashlytics().log('Toast show');
        return;
      }
      // 沒Fetch到內容，會回傳空陣列
      // ios沒設定延遲顯示會crash
      setTimeout(() => {
        Toast.show({
          type: 'customWarning',
          text1: '所選區間無資料',
          position: 'bottom',
        });
      }, 500);
      crashlytics().log('Toast show');
      setListData(null);
      setIsLoading(false);
      return;
    }
  };

  const handleDownloadData = async () => {
    setIsDownloadLoading(true);
    if (listData && Number(totalCount) > defaultLimit) {
      const response = await getVehicle({
        offset: defaultLimit.toString(),
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
    let XLSXArray: (string | number)[][] = [['', 'VIN', 'EVCCID', '綁定時間']];
    currentDownloadData?.map((item, index) => {
      XLSXArray.push([
        index + 1,
        item.vin,
        item.evccid ? '已綁定' : '',
        dayjs(item.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      ]);
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

  const handleLogout = async () => {
    setUserActionModalVisible(false);
    try {
      // 刪除 Token
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userName');
      console.log('Token removed');
      console.log('userName removed');
      // 轉到登入頁面
      navigation.replace('Login');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  const calculateEvccidCount = (data: GetVehicleResponseBody['data']) => {
    // 建立一個 Map 來追蹤每個 VIN 是否已經被計算過，避免重複計算
    const vinMap = new Map<string, boolean>();
    let count = 0;

    data.forEach((item) => {
      // 只計算有 evccid 的項目
      if (item.evccid) {
        // 如果這個 VIN 還沒有被計算過
        if (!vinMap.has(item.vin)) {
          count++;
          vinMap.set(item.vin, true);
        }
      }
    });

    return count;
  };

  const handleBindingListData = (data: any) => {
    // 處理從 BindingList 傳來的資料
    setListData(data);
  };

  useEffect(() => {
    if (route.params?.startTime && route.params?.endTime) {
      handleSetListTimeRange(route.params.startTime, route.params.endTime);
    }
  }, [route.params]);

  useEffect(() => {
    if (listStartTime && listEndTime) {
      if (listStartTime === listEndTime) {
        setIsSingleDayData(true);
      } else {
        setIsSingleDayData(false);
      }
      handleFetchBindingData({
        offset: '0',
        limit: defaultLimit.toString(),
        startTime: listStartTime,
        endTime: listEndTime,
      });
    }
  }, [listStartTime, listEndTime]);

  useEffect(() => {
    setPlatform(Platform.OS);
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setUserToken(token);
      const userName = await AsyncStorage.getItem('userName');
      setUserName(userName);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (userToken) {
      getUserIdFromToken(userToken).then((userId) => {
        setUserId(userId);
      });
    }
  }, [userToken]);

  useEffect(() => {
    if (listData) {
      setEvccidCount(calculateEvccidCount(listData));
    }
  }, [listData]);

  useFocusEffect(
    useCallback(() => {
      // 進入Home頁面將全域背景換成#C1DFE2
      setGlobalBackgroundColor('#C1DFE2');
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.topHeaderContainer}>
        <View style={styles.topHeaderActionBox}>
          <Text style={styles.topHeaderText}>搜尋 </Text>
          <TouchableOpacity
            style={[styles.topHeaderActionBtn, styles.todayBtn]}
            onPress={() => {
              handleSetListTimeRange(
                dayjs().utc().format('YYYY-MM-DD'),
                dayjs().utc().format('YYYY-MM-DD')
              );
            }}
          >
            <Text style={styles.topHeaderActionBtnText}>今日</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topHeaderActionBtn, styles.customBtn]}
            onPress={() => {
              crashlytics().log('open DateTimePicker Modal');
              setModalVisible(true);
            }}
          >
            <Text style={styles.topHeaderActionBtnText}>自訂</Text>
          </TouchableOpacity>
        </View>
      </View>
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
                    <View style={styles.listHeadLineSubtitleBox}>
                      <Text style={styles.listHeadLineSubtitle}>
                        共 {totalCount} 筆
                      </Text>
                      {isSingleDayData ? (
                        <View style={styles.evccidCountBox}>
                          <Text style={styles.evccidCountText}>綁定成功：</Text>
                          <Text style={[styles.evccidCountTextNumber]}>
                            {evccidCount} 筆
                          </Text>
                          <Text style={styles.evccidCountDescriptionText}>
                            （重複綁定只算1次）
                          </Text>
                        </View>
                      ) : null}
                    </View>
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
                    onDataChange={handleBindingListData}
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
          <View style={[styles.createBtnAreaPlusIconBox, styles.bgYellow]}>
            <Text style={styles.createBtnAreaPlusText}>開始新增</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.userActionArea}>
        <TouchableOpacity
          style={styles.createActionBtnBox}
          onPress={() => {
            setGlobalBackgroundColor('#2C333F');
            setUserActionModalVisible(true);
          }}
        >
          <View style={[styles.userActionBtnAreaPlusIconBox, styles.bgPrimary]}>
            <Image source={Images.Member} />
          </View>
        </TouchableOpacity>
        <Modal
          statusBarTranslucent
          animationType="slide"
          transparent={true}
          visible={userActionModalVisible}
          onRequestClose={() => {
            setUserActionModalVisible(false);
          }}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setUserActionModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.userNameBox}>
                <Text>Hello, </Text>
                <Text style={styles.userNameText}>{userName}</Text>
              </View>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // 處理修改密碼邏輯
                  setUserActionModalVisible(false);
                  navigation.navigate('ChangePassword'); // 假設有這個頁面
                }}
              >
                <Text style={styles.actionButtonText}>修改密碼</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // 處理登出邏輯
                  handleLogout();
                }}
              >
                <Text style={styles.actionButtonText}>登出</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setUserActionModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

export default HomeScreen;
