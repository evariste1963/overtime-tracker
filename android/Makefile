# Setup on new machine (one time):
#   1. Copy keystore to ~/.android/overtime-keystore.jks
#   2. Create ~/.gradle/gradle.properties with:
#        OvertimeStoreFile=/home/USER/.android/overtime-keystore.jks
#        OvertimeStorePassword=android
#        OvertimeKeyAlias=overtime
#        OvertimeKeyPassword=android
#   3. make build   (debug, no keystore needed)
#      make release (release, requires keystore)

ASSETS = app/src/main/assets
WEB_FILES = ../index.html ../manifest.json ../sw.js ../overtime-email.js
APK_DEBUG = app/build/outputs/apk/debug/app-debug.apk
APK_RELEASE = app/build/outputs/apk/release/app-release.apk

.PHONY: build install release install-release run clean sync

sync:
	cp $(WEB_FILES) $(ASSETS)/

build: sync
	./gradlew assembleDebug

install: build
	adb install -r $(APK_DEBUG)

release: sync
	./gradlew assembleRelease

install-release: release
	adb install -r $(APK_RELEASE)

run: install
	adb shell am start -n com.overtimetracker.app/.MainActivity

clean:
	./gradlew clean
	rm -rf app/build
