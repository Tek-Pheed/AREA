#!/bin/bash

set -e

BASE_PATH="${CI_PRIMARY_REPOSITORY_PATH}/area"

brew install node
brew install cocoapods

cd "$BASE_PATH"
npm install -g @ionic/cli
npm install

rm -rf ios/

ionic capacitor build ios

npx @capacitor/assets generate

PLIST_PATH="/Volumes/workspace/repository/area/ios/App/App/Info.plist"

/usr/libexec/PlistBuddy -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PLIST_PATH" || \
/usr/libexec/PlistBuddy -c "Set :ITSAppUsesNonExemptEncryption false" "$PLIST_PATH"

/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString 2.0.1" "$PLIST_PATH"