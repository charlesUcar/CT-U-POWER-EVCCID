import { Text, View, Image } from 'react-native';
import Images from '../../../images';
import styles from './index.style';
import React from 'react';
import { memo } from 'react';
import dayjs from 'dayjs';

type Vehicle = {
  vehicleId: string;
  vin: string;
  evccid: string;
  status: number;
  createdTime: string;
};

const BindingListCell = memo(
  ({ item, index }: { item: Vehicle; index: number }) => {
    return (
      <View style={styles.listHead}>
        <Text style={styles.order}>{index}</Text>
        <View style={styles.vin}>
          <Text style={styles.vinText}>{item.vin}</Text>
          <Text style={styles.createdTime}>
            {dayjs(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </View>
        <View style={styles.evccId}>
          {item.evccid ? (
            <Image source={Images.Success_circle_fill} />
          ) : (
            <Image source={Images.Error_circle_fill} />
          )}
        </View>
      </View>
    );
  }
);

export default BindingListCell;
