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
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 300,
    // paddingTop: 50,
    // paddingBottom: 16,
    // paddingLeft: 16,
    // paddingRight: 16,
    // backgroundColor: "gray",
  },
  title: {
    // marginBottom: 33,
    flex: 0,
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
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
});

export default styles;
