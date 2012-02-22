#!/bin/bash

THIS_SCRIPT=$0
EXECUTION_MODE=$1

EXPECTED_PIP_VERSION="1.1"

SHARED_SCRIPTS_HOME="$(cd `dirname $THIS_SCRIPT` && pwd)"
CONFIG_DIR="$(cd $SHARED_SCRIPTS_HOME/../config && pwd)"

source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_execution_mode_missing.sh" "`basename $THIS_SCRIPT`" $EXECUTION_MODE
source "$SHARED_SCRIPTS_HOME/verifiers/exit_if_not_using_sudo.sh"

source "$CONFIG_DIR/load_config.sh" "python_system.config" $EXECUTION_MODE

PY_PATH="$PY_BIN_PATH/python"

function install_distribute_package
{
    # See installation notes at http://pypi.python.org/pypi/distribute#distribute-setup-py
    cd "$PACKAGE_DOWNLOAD_DIR"
    DISTRIBUTE_SETUP_URL=http://python-distribute.org/distribute_setup.py
    printf "\n>> Installing distribute package from $DISTRIBUTE_SETUP_URL\n\n"
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
    cd "$PACKAGE_DOWNLOAD_DIR"
    GET_PIP_URL=https://raw.github.com/pypa/pip/$EXPECTED_PIP_VERSION/contrib/get-pip.py
    printf "\n>> Installing pip package from $GET_PIP_URL\n"
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

    printf "\n>> Expected pip version: $EXPECTED_PIP_VERSION\n"

    # check if pip is already installed
    if [ -n "$PIP_PATH" ]; then
        FULL_PIP_VERSION_DETAILS=`pip --version`
        INSTALLED_PIP_VERSION_NUMBER=${FULL_PIP_VERSION_DETAILS:4:${#EXPECTED_PIP_VERSION}}

        if [ "$INSTALLED_PIP_VERSION_NUMBER" = "$EXPECTED_PIP_VERSION" ]; then
            printf ">> Found expected pip version: $FULL_PIP_VERSION_DETAILS\n\n"
        else
            printf ">> Found outdated or unexpected pip version: $FULL_PIP_VERSION_DETAILS\n\n"
            install_distribute_and_pip
        fi
    else
        printf ">> pip not installed\n\n"
        install_distribute_and_pip
    fi
}


ensure_distribute_and_pip_are_installed
