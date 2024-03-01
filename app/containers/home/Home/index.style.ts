import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 0,
    backgroundColor: "#C1DFE2",
    paddingTop: 50,
    // paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  // topHeader
  topHeaderContainer: {
    flex: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    // backgroundColor: "lightblue",
    // marginBottom: 60,
  },
  topHeaderActionBox: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    // backgroundColor: "lightgreen",
    paddingTop: 16,
    paddingBottom: 16,
    // padding: 16,
  },
  topHeaderText: {
    // padding: 16,
    fontSize: 10,
    marginBottom: 2,
  },
  // bodyContainer
  bodyContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "lightgray",
  },
  // topArea
  topArea: {
    flex: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 32,
  },
  logoTypographyImageBox: {
    width: "100%",
  },
  logoTypographyImage: {
    width: 121,
    height: 20,
    resizeMode: "cover",
  },
  accountBox: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 90,
    backgroundColor: "#FFF",
    borderRadius: 50,
  },
  accountBoxText: {
    fontSize: 28,
    fontWeight: "600",
  },
  // listArea
  listArea: {
    // flex: 1,
    marginTop: 48,
    width: "100%",
    // backgroundColor: "yellow",
  },
  listAreaIsEmpty: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: "green",
  },
  createActionArea: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 34,
    left: 0,
    right: 0,
    // width: "100%",
    // backgroundColor: "red",
  },
  createActionBtnBox: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  createBtnAreaPlusIcon: {
    textAlign: "center",
    lineHeight: 72,
    width: 75,
    height: 75,
    backgroundColor: "#FFC200",
    fontSize: 36,
    borderRadius: 50,
  },
  createBtnAreaPlusText: {
    fontSize: 10,
  },
});

export default styles;
