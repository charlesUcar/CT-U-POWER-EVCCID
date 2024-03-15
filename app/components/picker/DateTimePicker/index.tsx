import { Text, View, TouchableOpacity } from "react-native";
import styles from "./index.style";
import React, { useEffect, useState } from "react";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";

type SetModalVisibleType = (value: boolean) => void;
type SetListTimeRangeType = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => void;

interface Props {
  setModalVisible: SetModalVisibleType;
  setListTimeRange: SetListTimeRangeType;
}

function DateTimePickerModal({ setModalVisible, setListTimeRange }: Props) {
  // dateTimePicker
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [startTimeString, setStartTimeString] = useState<string>("");
  const [endTimeString, setEndTimeString] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // state
  const [rangeAllSet, setRangeAllSet] = useState<boolean>(false);
  const [startTimeErrorShow, setStartTimeErrorShow] = useState<boolean>(false);
  const [endTimeErrorShow, setEndTimeErrorShow] = useState<boolean>(false);

  const onChangeStartDate = (event, selectedDate: Date | undefined) => {
    if (event.type === "dismissed") return;
    const currentDate = selectedDate;
    currentDate && setStartTime(currentDate);
    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
    setStartTimeString(formattedDate);
  };

  const onChangeEndDate = (event, selectedDate: Date | undefined) => {
    if (event.type === "dismissed") return;
    const currentDate = selectedDate;
    currentDate && setEndTime(currentDate);
    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
    setEndTimeString(formattedDate);
  };

  const showStartDateMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: startTime ? startTime : new Date(),
      onChange: onChangeStartDate,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showEndDateMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: endTime ? endTime : new Date(),
      onChange: onChangeEndDate,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showStartDatePicker = () => {
    showStartDateMode("date");
  };

  const showEndDatePicker = () => {
    showEndDateMode("date");
  };

  const checkInputTimeRangeValid = () => {
    if (!startTime) {
      setStartTimeErrorShow(true);
      setErrorMessage("請輸入起訖時間");
      return false;
    }

    if (!endTime) {
      setEndTimeErrorShow(true);
      setErrorMessage("請輸入起訖時間");
      return false;
    }

    if (startTime > endTime) {
      setStartTimeErrorShow(true);
      setEndTimeErrorShow(true);
      setErrorMessage("開始日期不可晚於結束日期");
      return false;
    }

    const compareStartDate = dayjs(startTime);
    const compareEndDate = dayjs(endTime);
    if (compareEndDate.diff(compareStartDate, "day") > 30) {
      setStartTimeErrorShow(true);
      setEndTimeErrorShow(true);
      setErrorMessage("搜尋期間不可超過30天");
      return false;
    }
    return true;
  };

  const handleSelectDate = (target: number) => {
    setStartTimeErrorShow(false);
    setEndTimeErrorShow(false);
    setErrorMessage("");
    // target: 0 是startTime , 1是endTime
    if (target === 0) {
      showStartDatePicker();
      return;
    }
    showEndDatePicker();
  };

  const handleSubmit = () => {
    if (checkInputTimeRangeValid()) {
      const startTimeFormat = dayjs(startTime).format("YYYY-MM-DD");
      const EndTimeFormat = dayjs(endTime).format("YYYY-MM-DD");
      // 把startTime跟endTime傳到Home組件的setListTimeRange
      setListTimeRange({ startTime: startTimeFormat, endTime: EndTimeFormat });
      setModalVisible(false);
      return;
    }
    return;
  };

  useEffect(() => {
    // if (startTime && endTime) {
    //   setRangeAllSet(true);
    // }
    if (!checkInputTimeRangeValid()) return;
    setRangeAllSet(true);
  }, [startTime, endTime]);

  return (
    <View style={styles.container}>
      <View style={styles.dateTimePickerContainer}>
        <TouchableOpacity
          style={styles.emptyArea}
          onPress={() => {
            setModalVisible(false);
          }}
        ></TouchableOpacity>
        <View style={styles.dateTimePickerArea}>
          <Text style={styles.titleText}>選擇起始日期</Text>
          <View style={styles.dateRangeContainer}>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                handleSelectDate(0);
              }}
            >
              <Text style={styles.labelText}>開始日期</Text>
              <Text
                style={[
                  styles.dateText,
                  startTimeErrorShow ? styles.error : null,
                ]}
              >
                {startTimeString}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                handleSelectDate(1);
              }}
            >
              <Text style={styles.labelText}>結束日期</Text>
              <Text
                style={[
                  styles.dateText,
                  endTimeErrorShow ? styles.error : null,
                ]}
              >
                {endTimeString}
              </Text>
            </TouchableOpacity>

            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              rangeAllSet ? styles.submitBtnActive : null,
            ]}
            onPress={handleSubmit}
          >
            <Text
              style={[
                styles.submitBtnText,
                rangeAllSet ? styles.submitBtnActive : null,
              ]}
            >
              確認送出
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Button onPress={showDatepicker} title="Show date picker!" />
        <Button onPress={showTimepicker} title="Show time picker!" /> */}
        {/* <Text>selected: {date.toLocaleString()}</Text> */}
      </View>
      <Toast />
    </View>
  );
}

export default DateTimePickerModal;
