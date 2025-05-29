# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.3.0] -2025-5-29

### Added

- 新增綁定步驟指示器，提供更清晰的綁定流程指引
- 新增綁定成功/失敗的狀態提示視窗
- 新增單日綁定統計功能，顯示當日成功綁定數量

### Changed

- 優化列表顯示，新增創建時間欄位
- 改進未綁定車輛的狀態顯示，新增錯誤圖示

## [1.2.1] -2025-4-18

### Fixed

- 微調掃描 VIN 的重複驗證流程，提高掃描 VIN 的成功率

## [1.2.0] -2025-2-17

### Added

- 新增用戶名稱顯示功能

## [1.1.2] -2025-2-13

### Changed

- 移除首頁合作廠商 LOGO

### Fixed

- 修正獲取綁定資料為空時，會有無限迴圈問題

## [1.1.1] -2025-2-7

### Changed

- 升級 Expo SDK 到 52.0.0

## [1.1.0] -2025-2-7

### Added

- 新增用戶登出功能
- 新增用戶修改密碼功能

### Changed

- 升級 Expo SDK 到 51.0.0
- 升級 react-native-vision-camera 到最新版本

## [1.0.4] -2024-10-29

### Fixed

- 透過重複驗證改善掃描 VIN 的準確度

### Changed

- 相機預覽圖改為 30FPS

## [1.0.3] -2024-7-16

### Fixed

- IOS 版本無法登入問題
- 確認按鈕觸及範圍太小問題

## [1.0.2] -2024-6-5

### Fixed

- 搜尋綁定列表，往下滑動會有 Fetch 兩次的問題
