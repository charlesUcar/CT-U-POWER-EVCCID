import { Text, View, Image } from "react-native";
import Images from "../../../images";
import styles from "./index.style";
import React from "react";

type Vehicle = {
  vehicleId: string;
  vin: string;
  evccid: string;
  status: number;
  createdTime: string;
};

function BindingListCell({ item, index }: { item: Vehicle; index: number }) {
  return (
    <View style={styles.listHead}>
      <Text style={styles.order}>{index}</Text>
      <Text style={styles.vin}>{item.vin}</Text>
      <View style={styles.evccId}>
        {item.evccid ? <Image source={Images.Success_circle_fill} /> : null}
      </View>
    </View>
  );
}

export default BindingListCell;
