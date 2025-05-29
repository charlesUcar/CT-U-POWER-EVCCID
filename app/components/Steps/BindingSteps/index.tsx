import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import styles from './index.style';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import AppContext from '../../../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';

var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

interface BindingStepsProps {
  currentStep?: number;
}

function BindingSteps({ currentStep = 1 }: BindingStepsProps) {
  const { setGlobalBackgroundColor } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, []);

  useFocusEffect(
    useCallback(() => {
      // 進入Home頁面將全域背景換成#C1DFE2
      setGlobalBackgroundColor('#C1DFE2');
      return () => {};
    }, [])
  );

  const getStepOpacity = (step: number) => {
    return currentStep >= step ? 1 : 0.4;
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <View
          style={[styles.stepItemContainer, { opacity: getStepOpacity(1) }]}
        >
          <View style={styles.stepItemNumber}>
            <Text style={styles.stepItemNumberText}>1</Text>
          </View>
          <Text style={[styles.stepItem]}>輸入 VIN</Text>
        </View>
        <View
          style={[styles.stepItemContainer, { opacity: getStepOpacity(2) }]}
        >
          <View style={styles.stepItemNumber}>
            <Text style={styles.stepItemNumberText}>2</Text>
          </View>
          <Text style={[styles.stepItem]}>取得 EVCCID</Text>
        </View>
        <View
          style={[styles.stepItemContainer, { opacity: getStepOpacity(3) }]}
        >
          <View style={styles.stepItemNumber}>
            <Text style={styles.stepItemNumberText}>3</Text>
          </View>
          <Text style={[styles.stepItem]}>確認綁定資訊</Text>
        </View>
        <View
          style={[styles.stepItemContainer, { opacity: getStepOpacity(4) }]}
        >
          <View style={styles.stepItemNumber}>
            <Text style={styles.stepItemNumberText}>4</Text>
          </View>
          <Text style={[styles.stepItem]}>完成綁定</Text>
        </View>
      </View>
    </View>
  );
}

export default BindingSteps;
