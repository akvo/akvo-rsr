#!/bin/sh
#
# Auto-start script for TeamCity build agent 1
# 
# description: Starts TeamCity build agent automatically on server startup
# processname: teamcity_agent1

export JAVA_HOME=/usr/lib/jvm/java-6-openjdk
export PATH=$JAVA_HOME/bin:$PATH
export TEAMCITY_AGENTS_HOME=/home/tomcat/.BuildServer/agents

case $1 in
start)
        su -p -s /bin/sh tomcat $TEAMCITY_AGENTS_HOME/agent1/bin/agent.sh start
        ;;
stop)
        su -p -s /bin/sh tomcat $TEAMCITY_AGENTS_HOME/agent1/bin/agent.sh stop
        ;;
restart)
        su -p -s /bin/sh tomcat $TEAMCITY_AGENTS_HOME/agent1/bin/agent.sh stop
        su -p -s /bin/sh tomcat $TEAMCITY_AGENTS_HOME/agent1/bin/agent.sh start
        ;;
esac
exit 0
