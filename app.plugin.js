const {
  withGradleProperties,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin 用於自動配置 ProGuard 規則以移除偵錯日誌
 * 這個 plugin 會在 expo prebuild 時自動：
 * 1. 更新 gradle.properties 啟用 minify 和資源縮減
 * 2. 更新 build.gradle 使用 proguard-android-optimize.txt
 * 3. 在 proguard-rules.pro 中添加移除偵錯日誌的規則
 */
module.exports = function withProGuardSecurity(config) {
  // 步驟 1: 更新 gradle.properties
  config = withGradleProperties(config, (config) => {
    // 確保啟用 minify
    const minifyProp = config.modResults.find(
      (prop) => prop.key === 'android.enableMinifyInReleaseBuilds'
    );
    if (!minifyProp) {
      config.modResults.push({
        type: 'property',
        key: 'android.enableMinifyInReleaseBuilds',
        value: 'true',
      });
    } else {
      minifyProp.value = 'true';
    }

    // 確保啟用資源縮減
    const shrinkProp = config.modResults.find(
      (prop) => prop.key === 'android.enableShrinkResourcesInReleaseBuilds'
    );
    if (!shrinkProp) {
      config.modResults.push({
        type: 'property',
        key: 'android.enableShrinkResourcesInReleaseBuilds',
        value: 'true',
      });
    } else {
      shrinkProp.value = 'true';
    }

    return config;
  });

  // 步驟 2: 更新 build.gradle 和 proguard-rules.pro
  // 這需要在 withDangerousMod 中處理，因為需要直接修改檔案

  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidPath = path.join(projectRoot, 'android');
      const appPath = path.join(androidPath, 'app');
      const buildGradlePath = path.join(appPath, 'build.gradle');
      const proguardRulesPath = path.join(appPath, 'proguard-rules.pro');

      // 從配置中取得 package name
      const packageName =
        config.android?.package || 'com.upower.evccid.development';
      // 將 package name 轉換為 Java 目錄路徑
      const packagePath = packageName.replace(/\./g, '/');

      // 安全相關的 Kotlin 文件路徑
      const javaMainPath = path.join(appPath, 'src/main/java', packagePath);
      const injectionDetectorPath = path.join(
        javaMainPath,
        'InjectionDetector.kt'
      );
      const securityUtilsPath = path.join(javaMainPath, 'SecurityUtils.kt');
      const mainApplicationPath = path.join(javaMainPath, 'MainApplication.kt');

      // 1. 更新 build.gradle 使用 optimize 版本
      if (fs.existsSync(buildGradlePath)) {
        let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

        // 將 proguard-android.txt 替換為 proguard-android-optimize.txt
        buildGradleContent = buildGradleContent.replace(
          /proguardFiles\s+getDefaultProguardFile\("proguard-android\.txt"\)/g,
          'proguardFiles getDefaultProguardFile("proguard-android-optimize.txt")'
        );

        fs.writeFileSync(buildGradlePath, buildGradleContent);
      }

      // 2. 更新 proguard-rules.pro 添加安全規則
      if (fs.existsSync(proguardRulesPath)) {
        let proguardContent = fs.readFileSync(proguardRulesPath, 'utf8');

        // 檢查是否已經包含我們的規則標記
        const securityRulesMarker =
          '# ============================================\n# 移除偵錯日誌以提升安全性';

        if (!proguardContent.includes(securityRulesMarker)) {
          // 如果沒有，添加完整的規則
          let securityRules = `

# ============================================
# 移除偵錯日誌以提升安全性（自動由 Expo Config Plugin 添加）
# ============================================

# 移除 android.util.Log 的所有調用
# 這會移除所有第三方庫中的 Log.d, Log.v, Log.i, Log.w, Log.e, Log.wtf, Log.println, Log.getStackTraceString, Log.isLoggable
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
    public static *** wtf(...);
    public static *** println(...);
    public static *** getStackTraceString(...);
    public static *** isLoggable(...);
}

# 移除 Throwable.printStackTrace() 的所有調用（包括所有重載版本）
-assumenosideeffects class java.lang.Throwable {
    public *** printStackTrace();
    public *** printStackTrace(java.io.PrintStream);
    public *** printStackTrace(java.io.PrintWriter);
}

# 移除 Exception.printStackTrace() 調用
-assumenosideeffects class java.lang.Exception {
    public *** printStackTrace();
    public *** printStackTrace(java.io.PrintStream);
    public *** printStackTrace(java.io.PrintWriter);
}

# 移除 IOException.printStackTrace() 調用
-assumenosideeffects class java.io.IOException {
    public *** printStackTrace();
    public *** printStackTrace(java.io.PrintStream);
    public *** printStackTrace(java.io.PrintWriter);
}

# 注意：R8（現代 Android 編譯工具）已經包含了高度優化
# 使用 proguard-android-optimize.txt 而不是 proguard-android.txt
# 可以啟用更多優化功能，有助於移除條件分支中的日誌調用
`;

          // 檢查是否已包含代碼混淆保護規則
          if (!proguardContent.includes('代碼混淆保護')) {
            const obfuscationRules = `

# ============================================
# 代碼混淆保護 - 防止 Java 程式碼反編譯（自動由 Expo Config Plugin 添加）
# ============================================

# 啟用更強的混淆和優化
-optimizationpasses 5
-dontpreverify

# 混淆選項
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-allowaccessmodification

# 移除源文件名稱（防止反編譯時顯示原始文件名）
-renamesourcefileattribute SourceFile

# 移除行號信息（防止反編譯時顯示原始行號）
-keepattributes SourceFile,LineNumberTable
-assumenosideeffects class android.util.Log {
    public static *** v(...);
    public static *** d(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# 移除 Kotlin 內省檢查（優化）
-assumenosideeffects class kotlin.jvm.internal.Intrinsics {
    static void checkNotNull(java.lang.Object);
    static void checkNotNull(java.lang.Object, java.lang.String);
}

# 移除所有調試信息
-keepattributes *Annotation*
-dontwarn kotlin.**
-dontwarn kotlinx.**
-dontwarn javax.annotation.**

# MainActivity - 只保留絕對必要的公共接口，內部實現全部混淆
# 注意：類名必須保留（在 AndroidManifest.xml 中引用），但所有內部實現都可以混淆
-keep,allowobfuscation class ${packageName}.MainActivity {
    public <init>();
    public void onCreate(android.os.Bundle);
    public java.lang.String getMainComponentName();
    public com.facebook.react.ReactActivityDelegate createReactActivityDelegate();
    public void invokeDefaultOnBackPressed();
}
# 只保留必要的公共方法，其他所有成員（包括私有方法、欄位、內部類）都可以混淆或移除
-keepclassmembers,allowobfuscation class ${packageName}.MainActivity {
    <fields>;
    <methods>;
}

# MainApplication - 只保留必要的接口
-keep,allowobfuscation class ${packageName}.MainApplication {
    public <init>();
    public void onCreate();
    public void onConfigurationChanged(android.content.res.Configuration);
}
# 只保留必要的公共方法
-keepclassmembers,allowobfuscation class ${packageName}.MainApplication {
    <fields>;
    <methods>;
}

# Expo FileProvider 類 - 只保留絕對必要的接口（FileProvider 必須保留類名和必要方法）
# FileProvider 類名必須保留（在 AndroidManifest.xml 中引用），但內部實現可以混淆
-keep,allowobfuscation class expo.modules.filesystem.FileSystemFileProvider {
    public <init>(...);
    public android.net.Uri getUriForFile(android.content.Context, java.lang.String, java.io.File);
}
# 只保留必要的公共方法，其他所有成員都可以混淆
-keepclassmembers,allowobfuscation class expo.modules.filesystem.FileSystemFileProvider {
    <fields>;
    <methods>;
}

-keep,allowobfuscation class expo.modules.sharing.SharingFileProvider {
    public <init>(...);
    public android.net.Uri getUriForFile(android.content.Context, java.lang.String, java.io.File);
}
# 只保留必要的公共方法，其他所有成員都可以混淆
-keepclassmembers,allowobfuscation class expo.modules.sharing.SharingFileProvider {
    <fields>;
    <methods>;
}

# 注意：上述類的類名必須保留（因為在 AndroidManifest.xml 中引用）
# 但使用 allowobfuscation 允許所有內部實現（方法名、欄位名、參數等）被混淆
# 這樣可以大大降低反編譯後的可讀性
`;
            securityRules += obfuscationRules;
          }

          // 在檔案末尾添加規則（保留現有內容）
          proguardContent += securityRules;
          fs.writeFileSync(proguardRulesPath, proguardContent);
        } else {
          // 如果已經存在，確保包含 Log.wtf
          if (!proguardContent.includes('public static *** wtf(...);')) {
            // 在 Log 規則中添加 wtf
            proguardContent = proguardContent.replace(
              /(public static \*\*\* e\(\.\.\.\);)/,
              '$1\n    public static *** wtf(...);'
            );
            fs.writeFileSync(proguardRulesPath, proguardContent);
          }
        }
      }

      // 3. 確保 InjectionDetector.kt 存在（動態植入檢測）
      if (!fs.existsSync(javaMainPath)) {
        fs.mkdirSync(javaMainPath, { recursive: true });
      }

      if (!fs.existsSync(injectionDetectorPath)) {
        const injectionDetectorCode = `package ${packageName}

import android.content.Context
import android.os.Build
import android.util.Log
import ${packageName}.BuildConfig
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
            Log.e(TAG, "Injection detection error: \${e.message}")
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
            Log.d(TAG, "Cannot read /proc/self/maps: \${e.message}")
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
            Log.e(TAG, "Application injection check error: \${e.message}")
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
            Log.e(TAG, "ClassLoader check error: \${e.message}")
        }

        return false
    }
}
`;
        fs.writeFileSync(injectionDetectorPath, injectionDetectorCode);
        console.log('✓ 已生成 InjectionDetector.kt（動態植入檢測）');
      }

      // 4. 確保 SecurityUtils.kt 存在並包含動態植入檢測
      if (!fs.existsSync(securityUtilsPath)) {
        // 如果 SecurityUtils.kt 不存在，生成完整的文件
        const securityUtilsCode = `package ${packageName}

import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import ${packageName}.BuildConfig
import ${packageName}.InjectionDetector
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
            Log.e(TAG, "Security check error: \${e.message}", e)
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
            val expectedPackageName = "${packageName}"
            if (packageInfo.packageName != expectedPackageName) {
                Log.e(TAG, "Package name mismatch: \${packageInfo.packageName}")
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
                Log.e(TAG, "APK file not accessible: \${sourceDir}")
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
                Log.e(TAG, "Suspicious APK location: \${sourceDir}")
                return false
            }

            // 檢查 APK 文件完整性（檢查文件大小和修改時間異常）
            // 如果 APK 被重新打包，文件大小或修改時間可能會改變
            val apkSize = apkFile.length()
            if (apkSize <= 0) {
                Log.e(TAG, "Invalid APK file size: \${apkSize}")
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
                Log.e(TAG, "APK not installed in normal location: \${sourceDir}")
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
                Log.d(TAG, "Cannot check installer package name: \${e.message}")
            }

            Log.d(TAG, "Integrity check passed")
            return true
        } catch (e: Exception) {
            Log.e(TAG, "Integrity check error: \${e.message}", e)
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
            Log.e(TAG, "Debug detection error: \${e.message}", e)
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
            Log.e(TAG, "Root detection error: \${e.message}", e)
            return false
        }
    }
}
`;
        fs.writeFileSync(securityUtilsPath, securityUtilsCode);
        console.log('✓ 已生成 SecurityUtils.kt（安全檢查工具）');
      } else {
        // 如果文件已存在，更新它以包含動態植入檢測
        let securityUtilsContent = fs.readFileSync(securityUtilsPath, 'utf8');

        // 檢查是否已經包含 InjectionDetector 的調用
        if (
          !securityUtilsContent.includes('InjectionDetector.detectInjection')
        ) {
          // 在 performSecurityChecks 方法中添加動態植入檢測
          const injectionCheckCode = `
            // 5. 動態植入檢測
            if (InjectionDetector.detectInjection(context)) {
                Log.e(TAG, "Security check failed: Code injection detected")
                return false
            }`;

          // 在 Root 檢測之後添加動態植入檢測
          if (securityUtilsContent.includes('// 4. Root 檢測')) {
            // 找到 Root 檢測區塊的結束位置
            const rootDetectionEnd = securityUtilsContent.indexOf(
              'Log.d(TAG, "All security checks passed")'
            );
            if (rootDetectionEnd !== -1) {
              // 在 "All security checks passed" 之前插入動態植入檢測
              securityUtilsContent =
                securityUtilsContent.substring(0, rootDetectionEnd) +
                injectionCheckCode +
                '\n\n' +
                securityUtilsContent.substring(rootDetectionEnd);

              // 確保導入 InjectionDetector
              if (
                !securityUtilsContent.includes(
                  `import ${packageName}.InjectionDetector`
                )
              ) {
                // 在其他 import 語句之後添加
                const lastImportIndex =
                  securityUtilsContent.lastIndexOf('import ');
                if (lastImportIndex !== -1) {
                  const nextLineIndex = securityUtilsContent.indexOf(
                    '\n',
                    lastImportIndex
                  );
                  securityUtilsContent =
                    securityUtilsContent.substring(0, nextLineIndex + 1) +
                    `import ${packageName}.InjectionDetector\n` +
                    securityUtilsContent.substring(nextLineIndex + 1);
                }
              }

              fs.writeFileSync(securityUtilsPath, securityUtilsContent);
              console.log('✓ 已更新 SecurityUtils.kt 以包含動態植入檢測');
            }
          }
        } else {
          // 即使已經有 InjectionDetector 的調用，也要確保有 import
          if (
            securityUtilsContent.includes(
              'InjectionDetector.detectInjection'
            ) &&
            !securityUtilsContent.includes(
              `import ${packageName}.InjectionDetector`
            )
          ) {
            const lastImportIndex = securityUtilsContent.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
              const nextLineIndex = securityUtilsContent.indexOf(
                '\n',
                lastImportIndex
              );
              securityUtilsContent =
                securityUtilsContent.substring(0, nextLineIndex + 1) +
                `import ${packageName}.InjectionDetector\n` +
                securityUtilsContent.substring(nextLineIndex + 1);
              fs.writeFileSync(securityUtilsPath, securityUtilsContent);
              console.log(
                '✓ 已在 SecurityUtils.kt 中添加 InjectionDetector import'
              );
            }
          }
        }
      }

      // 5. 確保 MainApplication.kt 調用安全檢查（如果還沒有）
      if (fs.existsSync(mainApplicationPath)) {
        let mainAppContent = fs.readFileSync(mainApplicationPath, 'utf8');

        // 檢查是否已經包含 SecurityUtils 的調用
        if (!mainAppContent.includes('SecurityUtils.performSecurityChecks')) {
          // 在 onCreate 方法開始處添加安全檢查
          const securityCheckCode = `
    // 執行安全檢查（在應用初始化之前）
    if (!SecurityUtils.performSecurityChecks(this)) {
      // 安全檢查失敗，立即退出應用
      android.os.Process.killProcess(android.os.Process.myPid())
      System.exit(1)
      return
    }`;

          // 在 onCreate 方法中添加
          if (mainAppContent.includes('override fun onCreate()')) {
            const onCreateStart = mainAppContent.indexOf(
              'override fun onCreate()'
            );
            const openBraceIndex = mainAppContent.indexOf('{', onCreateStart);
            if (openBraceIndex !== -1) {
              const superOnCreateIndex = mainAppContent.indexOf(
                'super.onCreate()',
                openBraceIndex
              );
              if (superOnCreateIndex !== -1) {
                // 在 super.onCreate() 之後添加
                const afterSuperOnCreate =
                  mainAppContent.indexOf('\n', superOnCreateIndex) + 1;
                mainAppContent =
                  mainAppContent.substring(0, afterSuperOnCreate) +
                  securityCheckCode +
                  '\n' +
                  mainAppContent.substring(afterSuperOnCreate);

                // 確保導入 SecurityUtils
                if (
                  !mainAppContent.includes(
                    `import ${packageName}.SecurityUtils`
                  )
                ) {
                  const lastImportIndex = mainAppContent.lastIndexOf('import ');
                  if (lastImportIndex !== -1) {
                    const nextLineIndex = mainAppContent.indexOf(
                      '\n',
                      lastImportIndex
                    );
                    mainAppContent =
                      mainAppContent.substring(0, nextLineIndex + 1) +
                      `import ${packageName}.SecurityUtils\n` +
                      mainAppContent.substring(nextLineIndex + 1);
                  }
                }

                fs.writeFileSync(mainApplicationPath, mainAppContent);
                console.log('✓ 已更新 MainApplication.kt 以包含安全檢查');
              }
            }
          }
        }
      }

      return config;
    },
  ]);

  return config;
};
