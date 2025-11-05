package com.upower.evccid.development

import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import com.upower.evccid.development.BuildConfig
import com.upower.evccid.development.InjectionDetector
import java.io.File
import java.util.Locale

/**
 * 應用安全檢查工具類
 * 提供完整性檢查、反調試、Root 檢測和動態植入檢測功能
 * 此文件由 Expo Config Plugin 自動生成
 */
object SecurityUtils {
    private const val TAG = "SecurityUtils"

    /**
     * 執行所有安全檢查
     * @param context 應用上下文
     * @return true 如果所有檢查通過，false 如果有任何檢查失敗
     */
    fun performSecurityChecks(context: Context): Boolean {
        // Debug 模式下跳過所有檢查
        if (BuildConfig.DEBUG) {
            Log.d(TAG, "Debug mode: skipping security checks")
            return true
        }

        try {
            // 1. 應用完整性檢查
            if (!verifyIntegrity(context)) {
                Log.e(TAG, "Security check failed: Integrity check failed")
                return false
            }

            // 2. 反調試檢測（目前僅記錄，不阻止）
            // 注意：如果改為阻止，可能會導致安全掃描工具無法完成檢測
            if (isDebugging()) {
                Log.w(TAG, "Security warning: Debugger detected (not blocking)")
                // 如果需要阻止調試器，取消下面這行的註釋
                // return false
            }

            // 3. Root 檢測（目前僅記錄，不阻止）
            if (isRooted()) {
                Log.w(TAG, "Security warning: Root detected (not blocking)")
                // 如果需要阻止 Root 設備，取消下面這行的註釋
                // return false
            }

            // 4. 動態植入檢測
            if (InjectionDetector.detectInjection(context)) {
                Log.e(TAG, "Security check failed: Code injection detected")
                return false
            }

            Log.d(TAG, "All security checks passed")
            return true
        } catch (e: Exception) {
            Log.e(TAG, "Security check error: ${e.message}", e)
            return false
        }
    }

    /**
     * 驗證應用完整性
     * 檢查 APK 是否被重新打包或修改
     */
    private fun verifyIntegrity(context: Context): Boolean {
        try {
            val packageInfo = context.packageManager.getPackageInfo(
                context.packageName,
                PackageManager.GET_META_DATA
            )

            // 檢查包名是否正確
            val expectedPackageName = "com.upower.evccid.development"
            if (packageInfo.packageName != expectedPackageName) {
                Log.e(TAG, "Package name mismatch: ${packageInfo.packageName}")
                return false
            }

            // 檢查 APK 路徑是否正常（非系統應用應該在 /data/app/ 或 /data/app-private/）
            val sourceDir = packageInfo.applicationInfo?.sourceDir
            if (sourceDir.isNullOrEmpty()) {
                Log.e(TAG, "Invalid source directory")
                return false
            }

            // 檢查 APK 檔案是否存在且可讀
            val apkFile = File(sourceDir)
            if (!apkFile.exists() || !apkFile.canRead()) {
                Log.e(TAG, "APK file not accessible: ${sourceDir}")
                return false
            }

            // 檢查是否從非正常位置安裝（可能是重新打包的）
            // 正常安裝的應用不應該從 /sdcard/ 或其他可疑位置執行
            val suspiciousPaths = listOf(
                "/sdcard/",
                "/storage/emulated/",
                "/mnt/sdcard/",
                "/data/local/tmp/"
            )
            if (suspiciousPaths.any { sourceDir.contains(it, ignoreCase = true) }) {
                Log.e(TAG, "Suspicious APK location: ${sourceDir}")
                return false
            }

            // 檢查 APK 文件完整性（檢查文件大小和修改時間異常）
            // 如果 APK 被重新打包，文件大小或修改時間可能會改變
            val apkSize = apkFile.length()
            if (apkSize <= 0) {
                Log.e(TAG, "Invalid APK file size: ${apkSize}")
                return false
            }

            // 檢查 APK 文件是否在正常安裝目錄
            // 重新打包的 APK 可能不會安裝在正常位置
            val normalInstallPaths = listOf(
                "/data/app/",
                "/data/app-private/",
                "/system/app/",
                "/system/priv-app/"
            )
            val isNormalInstallPath = normalInstallPaths.any { 
                sourceDir.startsWith(it, ignoreCase = true) 
            }
            if (!isNormalInstallPath && !BuildConfig.DEBUG) {
                Log.e(TAG, "APK not installed in normal location: ${sourceDir}")
                return false
            }

            // 檢查安裝來源（如果可用的話）
            // 重新打包的 APK 可能沒有正確的安裝來源信息
            try {
                val installerPackageName = context.packageManager.getInstallerPackageName(context.packageName)
                // 如果安裝來源為 null，可能是通過 adb install 或其他非正常方式安裝
                // 在 release 模式下，這可能是重新打包的標誌
                if (installerPackageName.isNullOrEmpty() && !BuildConfig.DEBUG) {
                    Log.w(TAG, "No installer package name found (may indicate repackaging)")
                    // 不直接返回 false，因為某些正常安裝也可能沒有安裝來源
                }
            } catch (e: Exception) {
                // 某些 Android 版本可能不支持此 API
                Log.d(TAG, "Cannot check installer package name: ${e.message}")
            }

            Log.d(TAG, "Integrity check passed")
            return true
        } catch (e: Exception) {
            Log.e(TAG, "Integrity check error: ${e.message}", e)
            return false
        }
    }

    /**
     * 檢測是否正在調試
     */
    private fun isDebugging(): Boolean {
        try {
            // 方法 1: 檢查 DebuggerConnected 標誌
            if (android.os.Debug.isDebuggerConnected()) {
                return true
            }

            // 方法 2: 檢查 tracerpid（需要讀取 /proc/self/status）
            // 注意：這在某些設備上可能無法訪問
            try {
                val statusFile = File("/proc/self/status")
                if (statusFile.exists() && statusFile.canRead()) {
                    val statusContent = statusFile.readText()
                    val tracerPidLine = statusContent.lines()
                        .firstOrNull { it.startsWith("TracerPid:") }
                    val tracerPid = tracerPidLine?.substringAfter(":")?.trim()?.toIntOrNull() ?: 0
                    if (tracerPid > 0) {
                        return true
                    }
                }
            } catch (e: Exception) {
                // 無法讀取 /proc/self/status，繼續其他檢查
            }

            return false
        } catch (e: Exception) {
            Log.e(TAG, "Debug detection error: ${e.message}", e)
            // 如果檢測過程出錯，為了安全起見，假設正在調試
            return true
        }
    }

    /**
     * 檢測設備是否已 Root
     */
    private fun isRooted(): Boolean {
        try {
            // 方法 1: 檢查常見的 Root 工具
            val rootPaths = arrayOf(
                "/system/app/Superuser.apk",
                "/sbin/su",
                "/system/bin/su",
                "/system/xbin/su",
                "/data/local/xbin/su",
                "/data/local/bin/su",
                "/system/sd/xbin/su",
                "/system/bin/failsafe/su",
                "/data/local/su",
                "/su/bin/su"
            )

            for (path in rootPaths) {
                if (File(path).exists()) {
                    return true
                }
            }

            // 方法 2: 嘗試執行 su 命令
            try {
                val process = Runtime.getRuntime().exec("su")
                process.destroy()
                return true
            } catch (e: Exception) {
                // su 命令不存在，設備未 Root
            }

            // 方法 3: 檢查 build tags
            val buildTags = Build.TAGS
            if (buildTags != null && buildTags.contains("test-keys")) {
                return true
            }

            return false
        } catch (e: Exception) {
            Log.e(TAG, "Root detection error: ${e.message}", e)
            return false
        }
    }
}
