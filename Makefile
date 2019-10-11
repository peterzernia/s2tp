up:
	react-native run-android
.PHONY: up

build:
	cd android && ./gradlew bundleRelease && cd ..
	echo 'Output available at android/app/build/outputs/bundle/release/app.aab'
.PHONY: build

log:
	react-native log-android
.PHONY: log
