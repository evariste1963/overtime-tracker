# Overtime Tracker — Second PC Setup

## 1. Prerequisites

- Java 17+ (install via sdkman: `sdk install java`)
- Android SDK at `~/Android/Sdk` or set `ANDROID_HOME`
- USB-connected Android device with debugging enabled
- Keystore file from PC1 on flash drive

## 2. Clone

```sh
git clone git@github.com:evariste1963/overtime-tracker.git
cd overtime-tracker
```

## 3. Create keystore path

```sh
mkdir -p ~/.android
```

Copy `overtime-keystore.jks` from flash drive into `~/.android/`

## 4. Configure Gradle signing

```sh
mkdir -p ~/.gradle
```

Create `~/.gradle/gradle.properties`:

```
OvertimeStoreFile=/home/YOUR_USERNAME/.android/overtime-keystore.jks
OvertimeStorePassword=android
OvertimeKeyAlias=overtime
OvertimeKeyPassword=android
```

Replace `YOUR_USERNAME` with actual username on this PC.

## 5. Build & install

```sh
cd android
make release         # signed APK, can update app from PC1
adb install -r app/build/outputs/apk/release/app-release.apk
```

Or debug-only (no keystore needed):

```sh
cd android
make build
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Notes

- Debug APL won't update a release-signed app — uninstall first
- Keystore is NOT in the repo (excluded via `.gitignore`)
- Each machine needs its own `~/.gradle/gradle.properties`
