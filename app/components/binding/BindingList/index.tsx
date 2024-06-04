import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import styles from './index.style';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import BindingListCell from '../BindingListCell';
import { getVehicle } from '../../../services/Api';
import { GetVehicleResponseBody } from '../../../services/Api/types';
import dayjs from 'dayjs';

var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

export type BindingListProps = {
  listData: GetVehicleResponseBody['data'];
  totalCount: string;
  startTimeUTC: string;
  endTimeUTC: string;
};

function BindingList({
  listData,
  totalCount,
  startTimeUTC,
  endTimeUTC,
}: BindingListProps) {
  const { setGlobalBackgroundColor } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchDataTimes, setFetchDataTimes] = useState<number>(0);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [currentListData, setCurrentListData] = useState<
    BindingListProps['listData']
  >([]);

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
    if (isLoading) return;

    const result = await getVehicle({
      offset,
      limit,
      startTime,
      endTime,
    });

    console.log(result.data.data);
    // 有Fetch到內容
    if (result.status && result.status >= 200 && result.status <= 299) {
      // append到現有的資料內
      setCurrentListData([...currentListData, ...result.data.data]);
      // 更新offset跟渲染次數
      setCurrentOffset(currentOffset + 50);
      setFetchDataTimes(fetchDataTimes - 1);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    return;
  };

  // 滑到最底部的函式
  const handleEndReached = async () => {
    if (!fetchDataTimes) return;
    if (isLoading) return;
    setIsLoading(true);
    await handleFetchBindingData({
      limit: '50',
      offset: (currentOffset + 50).toString(),
      startTime: startTimeUTC,
      endTime: endTimeUTC,
    });
    return;
  };

  useEffect(() => {
    // 計算可以下拉讀取資料次數，第一次進入時已獲取前50筆資料
    setFetchDataTimes(Math.ceil(Number(totalCount) / 50) - 1);
    setCurrentListData(listData);
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
      <View style={styles.listHead}>
        <Text style={styles.order}></Text>
        <Text style={styles.vin}>V.I.N</Text>
        <Text style={styles.evccId}>EVCCID</Text>
      </View>

      <FlatList
        style={{
          width: '100%',
          height: '100%',
          marginTop: 8,
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0} // 距離底部多少比例觸發 onEndReached
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator
              style={{ flex: 0, height: 100, marginBottom: 100 }}
              size="large"
              color="#0096A3"
            />
          ) : (
            <View style={{ flex: 0, height: 130 }}></View>
          )
        } // 顯示加載指示器
        data={currentListData}
        renderItem={({ item, index }) => (
          <BindingListCell item={item} index={index + 1} />
        )}
      />
    </View>
  );
}

export default BindingList;
