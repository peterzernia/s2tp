# Speech To Target Process

Speech To Target Process is an Android app that controls the movement of Target Process tickets in your agile process through voice commands.

![](https://raw.githubusercontent.com/peterzernia/cloud/master/s2tp.gif)

Available on the [Google Play Store](https://play.google.com/store/apps/details?id=com.s2tp)

## Usage

- Download the app.
- Create an Access Token on your Target Process profile page, underneath the 'Access Token' tab
- Enter your organization's name ( the one used in your tp url, e.g. Medigo from https://medigo.tpondemand.com )
- Enter the Access Token you created earlier.

Tickets can now be moved around by holding record and saying a ticket number and state
e.g. '6258 in progress' or '5439 QA passed'

## Notes

Make sure you have the Google app installed on your Android device and that Recording Audio is activated.

## Contributions

Feel free to contribute to this project. The trickiest part is setting up React Native. Follow this [guide](https://facebook.github.io/react-native/docs/getting-started), under the React Native CLI Quickstart tab. After that, with a device plugged in, or a simulator running on your computer, run `make up` to start the development server.

## Built with

- [React Native](https://github.com/facebook/react-native)
- [React-Native-Voice](https://github.com/react-native-community/react-native-voice)
- [fuzzyset](https://github.com/Glench/fuzzyset.js)
