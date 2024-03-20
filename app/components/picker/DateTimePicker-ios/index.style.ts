import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dateTimePickerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  emptyArea: {
    flex: 3,
    width: "100%",
  },
  dateTimePickerArea: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 300,
    paddingLeft: 24,
    paddingRight: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#FFF",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C333F",
  },
  dateRangeContainer: {
    flex: 0,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 32,
    paddingBottom: 24,
    width: "100%",
  },
  dateContainer: {
    minWidth: 120,
  },
  labelText: {
    fontSize: 12,
  },
  dateTextBox: {
    borderBottomWidth: 1,
    borderBottomColor: "#2C333F",
  },
  dateTextView: {
    minHeight: 48,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 20,
  },
  dateText: {
    fontSize: 20,
  },
  dateTimePickerView: {
    opacity: 0,
    position: "absolute",
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  dateTimePicker: {
    width: "100%",
    height: "100%",
  },
  error: {
    borderBottomColor: "#EB4343",
    color: "#EB4343",
  },
  errorMessage: {
    paddingTop: 12,
    width: "100%",
    fontSize: 12,
    fontWeight: "300",
    textAlign: "center",
    color: "#EB4343",
  },
  submitBtn: {
    width: "100%",
    paddingTop: 19,
    paddingBottom: 19,
    borderWidth: 1,
    borderColor: "rgba(44, 51, 63, 0.5)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: "rgba(44, 51, 63, 0.5)",
    fontSize: 15,
    fontWeight: "bold",
  },
  submitBtnActive: {
    borderColor: "rgb(44, 51, 63)",
    color: "rgb(44, 51, 63)",
  },
});

export default styles;
