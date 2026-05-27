APK = app/build/outputs/apk/debug/app-debug.apk

.PHONY: build install run clean

build:
	./gradlew assembleDebug

install: build
	adb install -r $(APK)

run: install
	adb shell am start -n com.overtimetracker.app/.MainActivity

clean:
	./gradlew clean
	rm -rf app/build
