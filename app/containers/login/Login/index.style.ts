import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C1DFE2",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  logoContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // backgroundColor: "lightblue",
    marginBottom: 60,
  },
  formContainer: {
    flex: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    // backgroundColor: "lightgreen",
  },
  emailContainer: {
    flex: 0,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    // backgroundColor: "lightgreen",
    paddingLeft: 32,
    paddingRight: 32,
    marginBottom: 24,
  },
  passwordContainer: {
    flex: 0,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    // backgroundColor: "lightgreen",
    paddingLeft: 32,
    paddingRight: 32,
    marginBottom: 24,
  },
  label: {
    marginBottom: 0, // 調整標籤和輸入框之間的間距
    fontSize: 12,
    color: "#2C333F",
  },
  input: {
    width: "100%",
    height: 40,
    // borderColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#2C333F",
    // paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: "600",
  },
  inputError: {
    borderColor: "red", // 驗證錯誤時顯示紅色邊框
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  submitBtn: {
    width: "100%",
    paddingTop: 19,
    paddingBottom: 19,
    backgroundColor: "#00565C",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default styles;
