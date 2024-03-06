import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    backgroundColor: "#2C333F",
    // paddingTop: 50,
    // paddingBottom: 16,
    // paddingLeft: 16,
    // paddingRight: 16,
  },
  mainContainer: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 300,
    // paddingTop: 50,
    // paddingBottom: 16,
    // paddingLeft: 16,
    // paddingRight: 16,
    // backgroundColor: "gray",
  },
  title: {
    marginBottom: 33,
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  // cameraContainer
  actionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
  },
  // inputFormContainer
  confirmInfoContainer: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // backgroundColor: "lightgreen",
    paddingLeft: 16,
    paddingRight: 16,
  },
  infoTitle: {
    marginBottom: 12, // 調整標籤和輸入框之間的間距
    fontSize: 12,
    color: "#FFF",
  },
  infoText: {
    width: "100%",
    height: 40,
    // borderColor: "transparent",
    // paddingHorizontal: 10,
    letterSpacing: 3,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
  },
  submitBtnContainer: {
    width: "100%",
    marginTop: 32,
    paddingTop: 19,
    paddingBottom: 19,
    borderColor: "#FFC200",
    borderWidth: 1,
    borderRadius: 40,
  },
  submitUserInputVinBtn: {
    width: "100%",
  },
  submitUserInputVinBtnText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFC200",
  },
  cancleBtnContainer: {
    width: "100%",
    marginTop: 32,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: 19,
    // paddingBottom: 19,
    // borderColor: "#FFC200",
    // borderWidth: 1,
    // borderRadius: 40,
  },
  cancleBtn: {
    // backgroundColor: "red",
  },
  cancleBtnText: {
    color: "#fff",
  },
});

export default styles;
