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
    gap: 0,
    width: "100%",
    height: 50,
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
    paddingLeft: 10,
    // backgroundColor: "yellow",
  },
  evccIdBox: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 0,
    // backgroundColor: "red",
  },
  evccId: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "800",
    lineHeight: 15,
    fontSize: 12,
    // backgroundColor: "green",
  },
});

export default styles;
