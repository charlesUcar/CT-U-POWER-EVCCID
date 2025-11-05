import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
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
          style={styles.modalContent}
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
