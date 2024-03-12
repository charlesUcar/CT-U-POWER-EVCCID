import { Text, View, TouchableOpacity, Modal, Alert } from "react-native";
import styles from "./index.style";
import React, { useCallback, useContext, useEffect, useState } from "react";

type SetModalVisibleType = (value: boolean) => void;
type SetListTimeRangeType = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => void;

interface Props {
  setModalVisible: SetModalVisibleType;
  setListTimeRange: SetListTimeRangeType;
}

function DateTimePicker({ setModalVisible, setListTimeRange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.dateTimePickerContainer}>
        <TouchableOpacity
          onPress={() => {
            setListTimeRange({
              startDate: "2024-02-23T10:50:29.167+00:00",
              endDate: "2024-03-23T10:50:29.167+00:00",
            });
            setModalVisible(false);
          }}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default DateTimePicker;
