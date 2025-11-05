package com.upower.evccid.development

import android.content.Context
import android.os.Build
import android.util.Log
import com.upower.evccid.development.BuildConfig
import java.io.File
import java.io.BufferedReader
import java.io.FileReader

/**
 * 動態植入檢測器
 * 用於檢測和防止程式碼動態植入攻擊（如 inject.dex）
 * 此文件由 Expo Config Plugin 自動生成
 */
object InjectionDetector {
    private const val TAG = "InjectionDetector"

    // 可疑的目錄，攻擊者通常會在這些位置放置注入的 DEX 檔案
    private val SUSPICIOUS_DIRECTORIES = arrayOf(
        "/data/local/tmp/",
        "/data/local/",
        "/sdcard/",
        "/storage/emulated/0/"
    )

    // 可疑的檔案名稱模式
    private val SUSPICIOUS_FILE_PATTERNS = arrayOf(
        "inject.dex",
        "inject.jar",
        "malware.dex",
        "hook.dex"
    )

    /**
     * 檢查是否存在動態植入攻擊
     * @return true 如果檢測到注入攻擊，false 如果安全
     */
    fun detectInjection(context: Context): Boolean {
        if (BuildConfig.DEBUG) {
            // Debug 模式跳過檢查
            return false
        }

        return try {
            // 1. 檢查可疑目錄中的 DEX 檔案
            if (checkSuspiciousDirectories()) {
                Log.e(TAG, "Code injection detected: Suspicious DEX files found")
                return true
            }

            // 2. 檢查 /proc/self/maps 是否有可疑的記憶體映射
            if (checkMemoryMaps()) {
                Log.e(TAG, "Code injection detected: Suspicious memory maps found")
                return true
            }

            // 3. 檢查應用是否被注入
            if (checkApplicationInjection(context)) {
                Log.e(TAG, "Code injection detected: Application appears to be injected")
                return true
            }

            // 4. 檢查類載入器是否異常
            if (checkClassLoaderAnomalies()) {
                Log.e(TAG, "Code injection detected: ClassLoader anomalies detected")
                return true
            }

            false
        } catch (e: Exception) {
            Log.e(TAG, "Injection detection error: ${e.message}")
            // 如果檢測過程出現異常，出於安全考慮，認為可能存在風險
            true
        }
    }

    /**
     * 檢查可疑目錄中的 DEX 檔案
     */
    private fun checkSuspiciousDirectories(): Boolean {
        for (dirPath in SUSPICIOUS_DIRECTORIES) {
            try {
                val dir = File(dirPath)
                if (!dir.exists() || !dir.isDirectory) {
                    continue
                }

                // 檢查目錄中的檔案
                val files = dir.listFiles()
                if (files != null) {
                    for (file in files) {
                        if (file.isFile) {
                            val fileName = file.name.lowercase()
                            // 檢查是否是 DEX 或 JAR 檔案
                            if (fileName.endsWith(".dex") || fileName.endsWith(".jar")) {
                                // 檢查是否匹配可疑檔案名稱模式
                                for (pattern in SUSPICIOUS_FILE_PATTERNS) {
                                    val patternLower = pattern.lowercase()
                                    if (patternLower == fileName) {
                                        return true
                                    }
                                }
                                
                                // 特別檢查 inject.dex（這是檢測報告中發現的）
                                if (fileName.contains("inject")) {
                                    return true
                                }
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                // 如果無法訪問目錄（可能是權限問題），跳過
                continue
            }
        }
        return false
    }

    /**
     * 檢查 /proc/self/maps 是否有可疑的記憶體映射
     * 這是檢測動態植入最有效的方法之一
     */
    private fun checkMemoryMaps(): Boolean {
        try {
            val mapsFile = File("/proc/self/maps")
            if (!mapsFile.exists() || !mapsFile.canRead()) {
                return false
            }

            val reader = BufferedReader(FileReader(mapsFile))
            try {
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    if (line != null) {
                        // 檢查是否有可疑路徑的記憶體映射
                        for (suspiciousPath in SUSPICIOUS_DIRECTORIES) {
                            if (line!!.contains(suspiciousPath)) {
                                // 檢查是否包含 .dex 或 .jar
                                if (line!!.contains(".dex") || line!!.contains(".jar")) {
                                    return true
                                }
                            }
                        }
                        
                        // 特別檢查 inject.dex
                        if (line!!.contains("inject.dex")) {
                            return true
                        }
                    }
                }
            } finally {
                reader.close()
            }
        } catch (e: Exception) {
            // 無法讀取 maps，可能是權限問題，不視為威脅
            Log.d(TAG, "Cannot read /proc/self/maps: ${e.message}")
        }

        return false
    }

    /**
     * 檢查應用是否被注入
     */
    private fun checkApplicationInjection(context: Context): Boolean {
        try {
            // 檢查 APK 路徑是否異常
            val apkPath = context.applicationInfo?.sourceDir
            if (apkPath.isNullOrEmpty()) {
                return true
            }
            val apkFile = File(apkPath)
            
            if (!apkFile.exists()) {
                return true
            }

            // 檢查 APK 是否在正常位置
            // 正常的 APK 應該在 /data/app/ 或 /system/app/ 等目錄
            val normalPaths = arrayOf(
                "/data/app/",
                "/system/app/",
                "/system/priv-app/",
                "/vendor/app/"
            )
            
            val isNormalPath = normalPaths.any { apkPath.startsWith(it) }
            if (!isNormalPath && !BuildConfig.DEBUG) {
                // 如果在非正常路徑，可能是被注入的
                return true
            }

            // 檢查是否有額外的 DEX 檔案在應用目錄外
            val appDataDir = context.applicationInfo?.dataDir
            if (appDataDir != null) {
                val dataDir = File(appDataDir)
                if (dataDir.exists()) {
                    // 檢查是否有可疑的 DEX 檔案
                    val dexFiles = findDexFiles(dataDir)
                    if (dexFiles.isNotEmpty()) {
                        // 如果發現 DEX 檔案在數據目錄中，可能是被注入的
                        return true
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Application injection check error: ${e.message}")
            return true
        }

        return false
    }

    /**
     * 查找目錄中的所有 DEX 檔案
     */
    private fun findDexFiles(directory: File): List<File> {
        val dexFiles = mutableListOf<File>()
        try {
            if (directory.exists() && directory.isDirectory) {
                directory.walkTopDown().forEach { file ->
                    if (file.isFile && (file.name.endsWith(".dex") || file.name.endsWith(".jar"))) {
                        dexFiles.add(file)
                    }
                }
            }
        } catch (e: Exception) {
            // 忽略錯誤
        }
        return dexFiles
    }

    /**
     * 檢查類載入器是否異常
     */
    private fun checkClassLoaderAnomalies(): Boolean {
        try {
            // 檢查當前應用的類載入器
            val classLoader = InjectionDetector::class.java.classLoader
            
            if (classLoader != null) {
                // 檢查類載入器的類型
                val className = classLoader.javaClass.name
                
                // PathClassLoader 和 DexClassLoader 是正常的
                // 但如果發現其他異常的類載入器，可能是被注入的
                if (className.contains("InMemoryDexClassLoader") ||
                    className.contains("InMemoryClassLoader")) {
                    // 這些類載入器通常用於動態載入，可能是注入的標誌
                    return true
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "ClassLoader check error: ${e.message}")
        }

        return false
    }
}
