ASSETS = app/src/main/assets
WEB_FILES = ../index.html ../manifest.json ../sw.js
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
