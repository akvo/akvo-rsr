#!/bin/bash

# set the CONFIG_DIR value if necessary
if [ -z "$CONFIG_DIR" ]; then
    export CONFIG_DIR="$(cd `dirname $0` && pwd)/config"
fi

source "$CONFIG_DIR/python_system.config"

function ensure_package_download_dir_exists
{
    if [ ! -d "$PACKAGE_DOWNLOAD_DIR" ]; then
        printf ">> Creating package download directory: $PACKAGE_DOWNLOAD_DIR\n"
        mkdir -p "$PACKAGE_DOWNLOAD_DIR"
    else
        # check if directory is empty
        if [ "$(ls -A $PACKAGE_DOWNLOAD_DIR)" ]; then
            printf ">> Clearing existing package download directory: $PACKAGE_DOWNLOAD_DIR\n"
            sudo rm -r "$PACKAGE_DOWNLOAD_DIR"/*
        else
            printf ">> Using existing package download directory: $PACKAGE_DOWNLOAD_DIR\n"
        fi
    fi
}

ensure_package_download_dir_exists
printf "\n"
