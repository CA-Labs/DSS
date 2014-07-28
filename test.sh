#!/bin/bash

#Number of seconds to wait for arangodb process startup
WAIT_THRESHOLD=25

#Check if arangod process is running or not before running tets

if ! ps aux | grep "/sbin/arangod" | grep -v grep > /dev/null; then

    echo "ArangoDB instance is stopped, starting it..."
    arangod &
    echo "Waiting for ArangoDB process to start..."

    WAIT_TIME=0

    while [ $WAIT_TIME -lt $WAIT_THRESHOLD ]
    do
        sleep 1s
        WAIT_TIME=$((WAIT_TIME + 1))
        if ps aux | grep "/sbin/arangod" | grep -v grep > /dev/null ; then
            break
        fi
    done

    if [ $WAIT_TIME  -eq $WAIT_THRESHOLD ]; then
        echo "ArangoDB instance took too much time to start, exiting process..."
        exit -1
    else
        echo "ArangoDB instance successfully started."
    fi

    echo "Starting tests..."
    npm test

else

    echo "ArangoDB instance already running, starting tests..."
    npm test

fi