#!/bin/bash

# debugging
node -v

# For whatever reason when the slug compiles, it doesn't seem to use the latest
# version of node so we have to rebuild the package to get Sass working
npm rebuild node-sass

# Image resizing spun off into background to avoid blocking web process
node node_modules/gulp/bin/gulp image-resize &

# Build jekyll and start Express
node node_modules/gulp/bin/gulp build-deploy
node index.js
