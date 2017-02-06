# Epicerie Radar

Une application open-source qui référence les épiceries ouvertes autour de toi!
Elle est disponible sur [Android](https://epicerie-radar.fr/android) et [iOS](https://epicerie-radar.fr/ios).

### For developers/contributors

Feel free to contribute!

For developing I'm using an Android emulator: [Genymotion](https://www.genymotion.com/).

### How to release a new version

#### Android

Update `versionCode` (and maybe `versionName`) in `android/app/build.gradle`

```
cd android && ./gradlew clean
cd android && ./gradlew assembleRelease
```

Upload: `android/app/build/outputs/apk/app-release.apk` to the [play store](https://play.google.com/apps/publish).

#### iOS

Update `CFBundleShortVersionString` in `ios/epicerie/Info.plist`.
Build with XCode, make an archive, then upload to itunes connect.
