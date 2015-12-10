#!/bin/bash

npm rebuild node-sass
node node_modules/gulp/bin/gulp image-resize &
node node_modules/gulp/bin/gulp build-deploy
node index.js
