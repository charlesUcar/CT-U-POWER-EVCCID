import { Text, View, TouchableOpacity } from "react-native";
import styles from "./index.style";
import React, { useState } from "react";
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
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startDateString, setStartDateString] = useState<string>("");
  const [endDateString, setEndDateString] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // state
  const [startDateErrorShow, setStartDateErrorShow] = useState<boolean>(false);
  const [endDateErrorShow, setEndDateErrorShow] = useState<boolean>(false);

  const onChangeStartDate = (event, selectedDate: Date | undefined) => {
    if (event.type === "dismissed") return;
    const currentDate = selectedDate;
    currentDate && setStartDate(currentDate);
    const formattedDate = dayjs(currentDate).format("MM-DD-YYYY");
    setStartDateString(formattedDate);
  };

  const onChangeEndDate = (event, selectedDate: Date | undefined) => {
    if (event.type === "dismissed") return;
    const currentDate = selectedDate;
    currentDate && setEndDate(currentDate);
    const formattedDate = dayjs(currentDate).format("MM-DD-YYYY");
    setEndDateString(formattedDate);
  };

  const showStartDateMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: startDate ? startDate : new Date(),
      onChange: onChangeStartDate,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showEndDateMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: endDate ? endDate : new Date(),
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

  const handleSelectDate = (target: number) => {
    setStartDateErrorShow(false);
    setEndDateErrorShow(false);
    setErrorMessage("");
    // target: 0 是startDate , 1是endDate
    if (target === 0) {
      showStartDatePicker();
      return;
    }
    showEndDatePicker();
  };

  const handleSubmit = () => {
    if (!startDate) {
      setStartDateErrorShow(true);
      setErrorMessage("請輸入起訖時間");
      return;
    }

    if (!endDate) {
      setEndDateErrorShow(true);
      setErrorMessage("請輸入起訖時間");
      return;
    }

    if (startDate > endDate) {
      setStartDateErrorShow(true);
      setEndDateErrorShow(true);
      setErrorMessage("開始日期不可晚於結束日期");
      return;
    }

    const compareStartDate = dayjs(startDate);
    const compareEndDate = dayjs(endDate);
    if (compareEndDate.diff(compareStartDate, "day") > 30) {
      setStartDateErrorShow(true);
      setEndDateErrorShow(true);
      setErrorMessage("搜尋期間不可超過30天");
      return;
    }

    const startTimeFormat = dayjs(startDate).format("YYYY-MM-DD");
    const EndTimeFormat = dayjs(endDate).format("YYYY-MM-DD");
    // 把startDate跟endDate傳到Home組件的setListTimeRange
    setListTimeRange({ startTime: startTimeFormat, endTime: EndTimeFormat });
    setModalVisible(false);
  };

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
                  startDateErrorShow ? styles.error : null,
                ]}
              >
                {startDateString}
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
                  endDateErrorShow ? styles.error : null,
                ]}
              >
                {endDateString}
              </Text>
            </TouchableOpacity>

            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>確認送出</Text>
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
