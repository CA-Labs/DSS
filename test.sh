#!/bin/bash -v

#Number of seconds to wait for arangodb process startup
WAIT_THRESHOLD=10

#Check if arangod process is running or not before running tets
if ! ps aux | grep "arangod" | grep -v grep > /dev/null; then

    echo "ArangoDB instance is stopped, starting it..."
    arangod &
    echo "Waiting for ArangoDB process to start..."

    WAIT_TIME=0

    while [ $WAIT_TIME -lt $WAIT_THRESHOLD ]
    do
        #Wait at least up to 5 seconds just to be sure ArangoDB process is up and running
        sleep 5s
        WAIT_TIME=$((WAIT_TIME + 5))
        if ps aux | grep "arangod" | grep -v grep > /dev/null ; then
            break
        fi
    done

    if [ $WAIT_TIME  -eq $WAIT_THRESHOLD ]; then
        echo "ArangoDB instance took too much time to start, exiting process..."
        exit -1
    else
        echo "ArangoDB instance successfully started."
    fi

    echo "Deploying DSS foxx application..."
    sh deploy.sh test
    sleep 10s
    echo "Installing dependencies..."
    npm install -d --loglevel=silent
    echo "Starting tests..."
    npm test

else

    echo "ArangoDB instance already running."
    echo "Deploying DSS foxx application..."
    sh deploy.sh test
    sleep 10s
    echo "Installing dependencies..."
    npm install -d --loglevel=silent
    echo "Starting tests..."
    npm test

fi