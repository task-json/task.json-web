#!/bin/bash
set -e

CD=$(dirname $0)
VERSION=$(git describe) 

gh release upload $VERSION $CD/../android/app/build/outputs/apk/release/task.json-web-$VERSION.apk
