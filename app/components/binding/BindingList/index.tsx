import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, FlatList } from "react-native";
import Images from "../../../images";
import styles from "./index.style";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../../../context/AppContext";
import { useFocusEffect } from "@react-navigation/native";
import BindingListCell from "../BindingListCell";
import Loading from "../../animate/Loading";

function BindingList({ listData }) {
  const { setGlobalBackgroundColor } = useContext(AppContext);

  useFocusEffect(
    useCallback(() => {
      // 進入Home頁面將全域背景換成#C1DFE2
      setGlobalBackgroundColor("#C1DFE2");
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
          width: "100%",
          height: "100%",
          marginTop: 8,
        }}
        ListFooterComponent={<View style={{ height: 130 }}></View>}
        data={listData}
        renderItem={({ item, index }) => (
          <BindingListCell item={item} index={index + 1} />
        )}
      />
    </View>
  );
}

export default BindingList;
