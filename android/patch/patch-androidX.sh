#!/usr/bin/env bash

DIRECTORY=`dirname $0`

NODE_MODULES=${DIRECTORY}/../../node_modules

cp ${DIRECTORY}/lottie/*.java \
    ${NODE_MODULES}/lottie-react-native/src/android/src/main/java/com/airbnb/android/react/lottie
#
cp ${DIRECTORY}/gesturehandler/*.java \
    ${NODE_MODULES}/react-native-gesture-handler/android/src/main/java/com/swmansion/gesturehandler/react

find ${NODE_MODULES}/react-native-keychain/android/src/main/java/com/oblador/keychain/ -type f -print0 | \
    xargs -0 sed -i -e 's/android.support.annotation.NonNull;/androidx.annotation.NonNull;/g'
