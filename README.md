# Epicerie Radar

Une application open-source qui référence les épiceries ouvertes autour de toi!

Elle est disponible sur [Android](https://epicerie-radar.fr/android) et [iOS](https://epicerie-radar.fr/ios).

### For developers/contributors

Feel free to contribute!
For developing I'm using an Android emulator: [Genymotion](https://www.genymotion.com/).
Logs (~/.Genymobile/Genymotion/deployed)

### Installation
```
git clone git@github.com:spyl94/epicerie-radar.git
cd epicerie-radar
yarn install # Install deps
react-native run-android # Launch the app on the emulator
```

### How to release a new version

#### Android

Update `versionCode` (and maybe `versionName`) in `android/app/build.gradle`

```
cd android
fastlane beta # Beta release
fastlane deploy # Production release
```

#### iOS

```
cd ios
fastlane beta # Beta release
fastlane deploy # Production release
```
