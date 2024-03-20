import { Text, View, TouchableOpacity } from "react-native";
import styles from "./index.style";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
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

function DateTimePickerIosModal({ setModalVisible, setListTimeRange }: Props) {
  // dateTimePicker
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [startTimeString, setStartTimeString] = useState<string>("");
  const [endTimeString, setEndTimeString] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // state
  const [mode, setMode] = useState<string>("date");
  const [startTimePickerShow, setStartTimePickerShow] =
    useState<boolean>(false);
  const [endTimePickerShow, setEndTimePickerShow] = useState<boolean>(false);
  const [rangeAllSet, setRangeAllSet] = useState<boolean>(false);
  const [startTimeErrorShow, setStartTimeErrorShow] = useState<boolean>(false);
  const [endTimeErrorShow, setEndTimeErrorShow] = useState<boolean>(false);

  const onChangeStartDate = (event, selectedDate: Date | undefined) => {
    console.log("change");
    if (event.type === "dismissed") {
      setStartTimePickerShow(false);
      return;
    }
    const currentDate = selectedDate;
    currentDate && setStartTime(currentDate);
    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
    setStartTimeString(formattedDate);
    setStartTimePickerShow(false);
  };

  const onChangeEndDate = (event, selectedDate: Date | undefined) => {
    if (event.type === "dismissed") {
      setEndTimePickerShow(false);
      return;
    }
    const currentDate = selectedDate;
    currentDate && setEndTime(currentDate);
    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
    setEndTimeString(formattedDate);
  };

  const showStartDateMode = (currentMode) => {
    setStartTimePickerShow(true);
    setMode(currentMode);
  };

  const showEndDateMode = (currentMode) => {
    setEndTimePickerShow(true);
    setMode(currentMode);
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
      setRangeAllSet(false);
      return false;
    }

    if (!endTime) {
      setStartTimeErrorShow(false);
      setEndTimeErrorShow(true);
      setErrorMessage("請輸入起訖時間");
      setRangeAllSet(false);
      return false;
    }

    if (startTime > endTime) {
      setStartTimeErrorShow(true);
      setEndTimeErrorShow(true);
      setErrorMessage("開始日期不可晚於結束日期");
      setRangeAllSet(false);
      return false;
    }

    const compareStartDate = dayjs(startTime);
    const compareEndDate = dayjs(endTime);
    if (compareEndDate.diff(compareStartDate, "day") > 30) {
      setStartTimeErrorShow(true);
      setEndTimeErrorShow(true);
      setErrorMessage("搜尋期間不可超過30天");
      setRangeAllSet(false);
      return false;
    }
    setStartTimeErrorShow(false);
    setEndTimeErrorShow(false);
    setErrorMessage("");
    setRangeAllSet(true);
    return true;
  };

  const handleSelectDate = (target: number) => {
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
    if (!checkInputTimeRangeValid()) return;
  }, [startTime, endTime]);

  useEffect(() => {
    setStartTime(new Date());
    setEndTime(new Date());
    setRangeAllSet(true);

    const formattedDate = dayjs(new Date()).format("YYYY-MM-DD");
    setStartTimeString(formattedDate);
    setEndTimeString(formattedDate);
  }, []);

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
            <View style={styles.dateContainer}>
              <Text style={styles.labelText}>開始日期</Text>
              <View
                style={[
                  styles.dateTextBox,
                  startTimeErrorShow ? styles.error : null,
                ]}
              >
                <View style={styles.dateTextView}>
                  <Text style={styles.dateText}>{startTimeString}</Text>
                </View>
                <View style={styles.dateTimePickerView}>
                  <DateTimePicker
                    style={styles.dateTimePicker}
                    testID="dateTimePicker"
                    value={startTime ? startTime : new Date()}
                    mode={mode}
                    is24Hour={true}
                    onTouchStart={() => {
                      setStartTimePickerShow(true);
                    }}
                    onChange={onChangeStartDate}
                  />
                </View>
              </View>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.labelText}>結束日期</Text>
              <View
                style={[
                  styles.dateTextBox,
                  endTimeErrorShow ? styles.error : null,
                ]}
              >
                <View style={styles.dateTextView}>
                  <Text style={styles.dateText}>{endTimeString}</Text>
                </View>
                <View style={styles.dateTimePickerView}>
                  <DateTimePicker
                    style={styles.dateTimePicker}
                    testID="dateTimePicker"
                    value={endTime ? endTime : new Date()}
                    mode={mode}
                    is24Hour={true}
                    onTouchStart={() => {
                      setEndTimePickerShow(true);
                    }}
                    onChange={onChangeEndDate}
                  />
                </View>
              </View>
            </View>

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
      </View>
      <Toast />
    </View>
  );
}

export default DateTimePickerIosModal;
