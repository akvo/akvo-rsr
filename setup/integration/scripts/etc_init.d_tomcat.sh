#!/bin/sh
#
# Tomcat auto-start script
# 
# description: Starts Tomcat automatically on server startup
# processname: tomcat
# pidfile: /var/run/tomcat.pid

export JAVA_HOME=/usr/lib/jvm/java-6-openjdk
export PATH=$JAVA_HOME/bin:$PATH
export CATALINA_HOME=/usr/local/tomcat6
export CATALINA_BASE=/usr/local/tomcat6

export TOMCAT_JVM_OPTS="-Xmx512m -XX:MaxPermSize=128m"
export TEAMCITY_OPTS="-Dlog4j.configuration=file:$CATALINA_HOME/conf/teamcity-server-log4j.xml -Dteamcity_logs=$CATALINA_HOME/logs/teamcity"
export CATALINA_OPTS="$TOMCAT_JVM_OPTS $TEAMCITY_OPTS"

case $1 in
start)
        su -p -s /bin/sh tomcat $CATALINA_HOME/bin/startup.sh
        ;; 
stop)   
        su -p -s /bin/sh tomcat $CATALINA_HOME/bin/shutdown.sh
        ;; 
restart)
        su -p -s /bin/sh tomcat $CATALINA_HOME/bin/shutdown.sh
        su -p -s /bin/sh tomcat $CATALINA_HOME/bin/startup.sh
        ;; 
esac    
exit 0
