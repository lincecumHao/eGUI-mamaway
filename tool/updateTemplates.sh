#!/bin/bash

fromPath=$1
toPath=$2

for fi in $fromPath/*.ftl; do rm "$toPath/$(basename "$fi" .ftl).xml"; cp "$fi" "$toPath/$(basename "$fi" .ftl).xml"; done