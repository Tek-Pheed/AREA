#!/bin/bash

set -e

BASE_PATH="${CI_PRIMARY_REPOSITORY_PATH}/area"

brew install node
brew install cocoapods

cd "$BASE_PATH"
npm install -g @ionic/cli
npm install

ionic capacitor build ios

npx @capacitor/assets generate

PLIST_PATH="/Volumes/workspace/repository/area/ios/App/App/Info.plist"

/usr/libexec/PlistBuddy -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PLIST_PATH" || \
/usr/libexec/PlistBuddy -c "Set :ITSAppUsesNonExemptEncryption false" "$PLIST_PATH"

/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString 1.3" "$PLIST_PATH"

CI_PROJECT_FILE_PATH=/Volumes/workspace/repository/area/ios/App/App.xcworkspace
CI_XCODE_PROJECT=App.xcworkspace

