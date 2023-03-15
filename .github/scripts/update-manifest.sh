#!/usr/bin/env bash

# get verion
verion=$(echo $(jq '.version' ./package.json) | sed "s|\"||g")
content=$(jq --arg verion "$verion" '.version=$verion' ./public/manifest.json)
# update manifest
echo "$content" > ./public/manifest.json
