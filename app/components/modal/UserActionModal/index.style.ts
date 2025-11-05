import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  versionBox: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  versionText: {
    fontSize: 12,
  },
  actionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#007D86',
  },
  userNameBox: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 800,
    textTransform: 'uppercase',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 15,
  },
  cancelButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
});

export default styles;
