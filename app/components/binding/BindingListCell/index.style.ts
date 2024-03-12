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
    justifyContent: "flex-start",
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
  evccId: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // backgroundColor: "green",
  },
});

export default styles;
