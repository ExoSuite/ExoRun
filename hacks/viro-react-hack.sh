#!/usr/bin/env bash

DIRECTORY=`dirname $0`

NODE_MODULES=${DIRECTORY}/../node_modules

find ${NODE_MODULES}/react-viro/components/*.js -type f -print0 | \
    xargs -0 sed -i -e 's/StyleSheetPropType/StyleSheetTypes/g'

find ${NODE_MODULES}/react-viro/components/*.js -type f -print0 | \
    xargs -0 sed -i -e 's/StyleSheetTypes(TextStylePropTypes)/StyleSheetTypes/g'

cp ${DIRECTORY}/./viro-react/ViroAnimationPropTypes.js ${NODE_MODULES}/react-viro/components/Animation
cp ${DIRECTORY}/./viro-react/ViroPropTypes.js ${NODE_MODULES}/react-viro/components/Styles
cp ${DIRECTORY}/./viro-react/ViroTextPropTypes.js ${NODE_MODULES}/react-viro/components/Styles
cp ${DIRECTORY}/./viro-react/ViroFlexView.js ${NODE_MODULES}/react-viro/components
