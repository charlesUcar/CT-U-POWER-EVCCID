import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 0,
    backgroundColor: "#2C333F",
    height: '100%',
    // paddingTop: 50,
    // paddingBottom: 16,
    // paddingLeft: 16,
    // paddingRight: 16,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: '100%',
    // paddingTop: 50,
    // paddingBottom: 16,
    // paddingLeft: 16,
    // paddingRight: 16,
    // backgroundColor: "gray",
  },
  mainContainerInner: {
    flex: 0,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 500,
  },
  title: {
    // marginBottom: 33,
    flex: 0,
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
  },
  waitingPlugInContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "red",
  },
  tipsTextContainer: {
    width: "100%",
    // marginTop: 32,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: 19,
    // paddingBottom: 19,
    // borderColor: "#FFC200",
    // borderWidth: 1,
    // borderRadius: 40,
  },
  tipsText: {
    color: "#fff",
  },
  descriptionTextContainer: {
    width: "100%",
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 20,
    color: "#FFC200",
  },
  backScanBtn: {
  },
  backScanBtnText: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
