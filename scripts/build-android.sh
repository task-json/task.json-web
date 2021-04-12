#!/bin/bash
set -e

CD=$(dirname $0)
cd $CD/../android

RELEASE_DIR="app/build/outputs/apk/release"
BUILD_TOOLS="$ANDROID_SDK_ROOT/build-tools/30.0.3"

./gradlew build

$BUILD_TOOLS/zipalign -f -v -p 4 \
	$RELEASE_DIR/app-release-unsigned.apk \
	$RELEASE_DIR/app-release-unsigned-aligned.apk

$BUILD_TOOLS/apksigner sign --ks $HOME/.android/release-key.jks \
	--out $RELEASE_DIR/task.json-web-$(git describe).apk \
	$RELEASE_DIR/app-release-unsigned-aligned.apk


