#!/bin/bash

# debugging
echo "default node: `node -v`"
echo "desired node: `.heroku/node/bin/node -v`"

# For whatever reason when the slug compiles, it doesn't seem to use the latest
# version of node so we have to rebuild the package to get Sass working
#
# Fixed: https://help.heroku.com/tickets/318066
# npm rebuild node-sass

# Image resizing spun off into background to avoid blocking web process
gulp image-resize &

# Build jekyll and start Express
gulp build-deploy
node index.js
