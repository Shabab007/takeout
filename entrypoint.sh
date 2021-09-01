#!/bin/sh

if [ $HOST_ENV == "stag" ] 
then 
    npm run start-stag
else 
    npm run start-dev
fi