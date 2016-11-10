# epicerie-radar

Android emulator: genymotion

Build production:

Update `versionCode` (and `versionName`) in `android/app/build.gradle`

```
cd android && ./gradlew clean
cd android && ./gradlew assembleRelease
```

Upload: `android/app/build/outputs/apk/app-release.apk`
