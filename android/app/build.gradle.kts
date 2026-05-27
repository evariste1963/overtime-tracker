plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.overtimetracker.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.overtimetracker.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    signingConfigs {
        create("release") {
            val store = findProperty("OvertimeStoreFile")?.toString()
            if (store != null) {
                storeFile = file(store)
                storePassword = findProperty("OvertimeStorePassword")?.toString()
                keyAlias = findProperty("OvertimeKeyAlias")?.toString()
                keyPassword = findProperty("OvertimeKeyPassword")?.toString()
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            val s = signingConfigs.getByName("release")
            if (s.storeFile != null) {
                signingConfig = s
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.0")
}

repositories {
    google()
    mavenCentral()
}
