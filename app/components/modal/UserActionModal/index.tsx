import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './index.style';
import { endpoints } from '../../../services/Api/config';

interface UserActionModalProps {
  visible: boolean;
  userName: string | null;
  onClose: () => void;
  onNavigateToChangePassword: () => void;
  onLogout: () => void;
}

function UserActionModal({
  visible,
  userName,
  onClose,
  onNavigateToChangePassword,
  onLogout,
}: UserActionModalProps) {
  // 獲取安全區域的 insets，用於處理導航列遮擋問題
  const insets = useSafeAreaInsets();

  const handleChangePassword = () => {
    onClose();
    onNavigateToChangePassword();
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.modalContent,
            { paddingBottom: Math.max(insets.bottom, 20) }
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.userNameBox}>
            <Text>Hello, </Text>
            <Text style={styles.userNameText}>{userName}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.actionButtonText}>修改密碼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Text style={styles.actionButtonText}>登出</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
          <View style={styles.versionBox}>
            <Text style={styles.versionText}>appVersion: {endpoints.appVersion}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default UserActionModal;
