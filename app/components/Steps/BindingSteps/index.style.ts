import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 0,
    paddingTop: 60,
    paddingHorizontal: 30,
    // backgroundColor: '#145ad5',
    backgroundColor: '#2C333F',
    width: '100%',
  },
  stepContainer: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 20,
  },
  stepItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 5,
  },
  stepItemNumber: {
    backgroundColor: '#FFC200',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 14,
    fontWeight: '800',
    color: '#493800',
  },
  stepItem: {
    textAlign: 'center',
    fontSize: 12,
    color: '#FFF',
  },
  stepLineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 0,
  },
  stepLine: {
    flex: 1,
    alignSelf: 'center',
    height: 1,
    backgroundColor: '#FFF',
  },
});

export default styles;
