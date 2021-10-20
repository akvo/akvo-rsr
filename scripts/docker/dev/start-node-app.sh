#!/usr/bin/env bash
# Script to start a node application
set -eu

# The path to the app's directory containing node_modules
app_dir=$1

cd "$app_dir"
npm install
npm start
