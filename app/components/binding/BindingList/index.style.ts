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
    // paddingLeft: 16,
    // paddingRight: 16,
  },
  listHead: {
    flex: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    paddingTop: 8,
    paddingBottom: 8,
    width: "100%",
    backgroundColor: "#0096A3",
    borderRadius: 10,
  },
  order: {
    flex: 1,
    color: "#FFF",
    textAlign: "right",
    // backgroundColor: "red",
  },
  vin: {
    flex: 6,
    color: "#FFF",
    textAlign: "left",
    fontWeight: "800",
    // backgroundColor: "yellow",
  },
  evccId: {
    flex: 2,
    color: "#FFF",
    textAlign: "center",
    fontWeight: "800",
    // backgroundColor: "green",
  },
});

export default styles;
