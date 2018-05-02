#!/bin/bash
export PORT=5001
echo "PORT=$PORT"
export DATABASE_URL=`heroku config:get DATABASE_URL`
echo "DATABASE_URL was set according to Heroku config"
