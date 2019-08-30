up:
	react-native run-android

build:
	cd android && ./gradlew bundleRelease && cd ..
	echo 'Output available at android/app/build/outputs/bundle/release/app.aab'
