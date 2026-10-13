# Release checklist

## Code
- [x] 500 starting coins, save migration
- [x] Mini-games hub (3 games)
- [ ] Playtest on device; tune difficulty

## Build
- [ ] `npm install`, `npm run build`
- [ ] `npx cap add android` / `npx cap add ios`; `npm run cap:sync`
- [ ] App icon + splash (`@capacitor/assets`)
- [ ] Bump versionCode/versionName (Android) and build number (iOS)

## Google Play
- [ ] Play Console account, upload keystore, signed AAB
- [ ] Data Safety, content rating, privacy policy URL
- [ ] Store listing: 512px icon, feature graphic, screenshots
- [ ] Closed test (12 testers, 14 days for new personal accounts), then production

## Apple App Store
- [ ] Apple Developer Program, signing in Xcode (Mac required)
- [ ] Archive and upload to TestFlight
- [ ] App Privacy, age rating, screenshots, review submission
