#!/bin/bash

OSX_DIR="$(cd `dirname $0` && pwd)"
CONFIG_DIR="$OSX_DIR/config"
PIP_REQUIREMENTS_DIR="$(cd "$OSX_DIR/../../pip/requirements" && pwd)"

EXPECTED_PIP_VERSION="1.1"

CURRENT_USER="`whoami`"

# exit if not running with sudo or as root
if [ $CURRENT_USER != "root" ]; then
    printf ">> This script should be executed with sudo to facilitate installation of system Python packages\n"
    printf ">> Current user: $CURRENT_USER\n"
    exit -1
fi

source "$OSX_DIR/ensure_osx_config_files_exist.sh"

source "$CONFIG_DIR/python_system.config"

PY_PATH="$PY_BIN_PATH/python"

function install_distribute_package
{
    # See installation notes at http://pypi.python.org/pypi/distribute#distribute-setup-py
    source "$CONFIG_DIR/osx_build_flags_env_64.config"
    cd "$PACKAGE_DOWNLOAD_DIR"
    DISTRIBUTE_SETUP_URL=http://python-distribute.org/distribute_setup.py
    printf "\n>> Installing distribute package from $DISTRIBUTE_SETUP_URL (with 64-bit architecture)\n\n"
    curl -L -O $DISTRIBUTE_SETUP_URL
    $PY_PATH distribute_setup.py
}

function link_easy_install
{
    # This should ensure the installed easy_install is used rather than /usr/bin/easy_install
    # as long as the /usr/local/bin directory is before /usr/bin on the system path
    printf "\n>> Linking easy_install in /usr/local/bin\n"
    VERSIONED_EASY_INSTALL="easy_install-$PY_VERSION"
    cd /usr/local/bin
    ln -s "$PY_BIN_PATH/$VERSIONED_EASY_INSTALL" $VERSIONED_EASY_INSTALL
    ln -s $VERSIONED_EASY_INSTALL easy_install
    printf "\n>> Resulting easy_install links:\n"
    ls -la /usr/local/bin/easy*
}

function install_pip_package
{
    # See installation notes at http://www.pip-installer.org/en/latest/installing.html
    source "$CONFIG_DIR/osx_build_flags_env_64.config"
    cd "$PACKAGE_DOWNLOAD_DIR"
    GET_PIP_URL=https://raw.github.com/pypa/pip/$EXPECTED_PIP_VERSION/contrib/get-pip.py
    printf "\n>> Installing pip package from $GET_PIP_URL (with 64-bit architecture)\n"
    curl -L -O $GET_PIP_URL
    $PY_PATH get-pip.py
}

function install_distribute_and_pip
{
    install_distribute_package

    # proceed if no errors occurred
    if [ $? -ne 0 ]; then
        printf "\n>> Installation of distribute package failed\n"
        exit -1
    fi

    link_easy_install
    install_pip_package

    # check for any installation errors
    if [ $? -ne 0 ]; then
        printf "\n>> Installation of pip package failed\n"
        exit -1
    fi
}

function ensure_distribute_and_pip_are_installed
{
    PIP_PATH=`which pip`

    # check if pip is already installed
    if [ -n "$PIP_PATH" ]; then
        FULL_PIP_VERSION_DETAILS=`pip --version`
        INSTALLED_PIP_VERSION_NUMBER=${FULL_PIP_VERSION_DETAILS:4:${#EXPECTED_PIP_VERSION}}

        if [ "$INSTALLED_PIP_VERSION_NUMBER" = "$EXPECTED_PIP_VERSION" ]; then
            printf "\n>> Found expected pip version: $FULL_PIP_VERSION_DETAILS\n\n"
        else
            printf "\n>> Found outdated or unexpected pip version: $FULL_PIP_VERSION_DETAILS\n\n"
            install_distribute_and_pip
        fi
    else
        printf "\n>> Expected pip version not installed\n\n"
        install_distribute_and_pip
    fi
}

function install_packages_with_pip
{
    # Function parameters:
    #   $1: pip requirements file name
    #   $2: requirements description

    source "$CONFIG_DIR/osx_build_flags_env_64.config"
    cd "$PACKAGE_DOWNLOAD_DIR"
    printf "\n>> Installing/upgrading $2 packages: (with 64-bit architecture)\n"
    pip install -M -r "$PIP_REQUIREMENTS_DIR/$1"
}

function install_system_packages
{
    printf "\n>> Current system packages:\n"
    pip freeze

    install_packages_with_pip "0_system.txt" "system"
    install_packages_with_pip "1_deployment.txt" "deployment"

    printf "\n>> Installed system packages:\n"
    pip freeze
}

function rebuild_system_environment
{
    ensure_distribute_and_pip_are_installed
    install_system_packages
}


rebuild_system_environment
