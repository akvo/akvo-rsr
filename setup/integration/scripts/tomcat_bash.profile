# ~/.profile: executed by the command interpreter for login shells.
# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login
# exists.
# see /usr/share/doc/bash/examples/startup-files for examples.
# the files are located in the bash-doc package.

# the default umask is set in /etc/profile
#umask 022

alias la="ls -la"

# Tomcat settings
export JAVA_HOME=/usr/lib/jvm/java-6-openjdk
export PATH=$JAVA_HOME/bin:$PATH
export CATALINA_HOME=/usr/local/tomcat6
export CATALINA_BASE=/usr/local/tomcat6

# TeamCity settings
export TOMCAT_JVM_OPTS="-Xmx512m -XX:MaxPermSize=128m"
export TEAMCITY_OPTS="-Dlog4j.configuration=file:$CATALINA_HOME/conf/teamcity-server-log4j.xml -Dteamcity_logs=$CATALINA_HOME/logs/teamcity"
export CATALINA_OPTS="$TOMCAT_JVM_OPTS $TEAMCITY_OPTS"

# Xvfb and Selenium RC settings
export DISPLAY=:108

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
        . "$HOME/.bashrc"
    fi
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi
