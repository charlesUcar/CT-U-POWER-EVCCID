# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:


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
-keep,allowobfuscation class com.upower.evccid.development.MainActivity {
    public <init>();
    public void onCreate(android.os.Bundle);
    public java.lang.String getMainComponentName();
    public com.facebook.react.ReactActivityDelegate createReactActivityDelegate();
    public void invokeDefaultOnBackPressed();
}
# 只保留必要的公共方法，其他所有成員（包括私有方法、欄位、內部類）都可以混淆或移除
-keepclassmembers,allowobfuscation class com.upower.evccid.development.MainActivity {
    <fields>;
    <methods>;
}

# MainApplication - 只保留必要的接口
-keep,allowobfuscation class com.upower.evccid.development.MainApplication {
    public <init>();
    public void onCreate();
    public void onConfigurationChanged(android.content.res.Configuration);
}
# 只保留必要的公共方法
-keepclassmembers,allowobfuscation class com.upower.evccid.development.MainApplication {
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
