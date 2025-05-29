import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 0,
    // backgroundColor: "#C1DFE2",
    // backgroundColor: "gray",
    // paddingTop: 16,
    // paddingBottom: 16,
    // paddingLeft: 16,
    // paddingRight: 16,
  },
  listHead: {
    flex: 0,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    paddingTop: 16,
    paddingBottom: 16,
    width: "100%",
    borderBottomWidth: 1,
  },
  order: {
    flex: 1,
    // width: "20%",  
    maxWidth: 30,
    textAlign: "right",
    // backgroundColor: "red",
  },
  vin: {
    flex: 6,
    // width: "60%",
    textAlign: "left",
    letterSpacing: 1,
    // backgroundColor: "yellow",
  },
  vinText: {
    flex: 1,
    textAlign: "left",
    letterSpacing: 1,
    // backgroundColor: "yellow",
  },
  createdTime: {
    textAlign: "left",
    letterSpacing: 1,
    fontSize: 12,
    color: "#555",
    // backgroundColor: "yellow",
  },
  evccId: {
    flex: 3,
    // maxWidth: 30,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "green",
  },
});

export default styles;
