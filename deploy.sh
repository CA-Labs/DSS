#!/bin/bash

#$1 => Database we want to play with
#$2 => DB user
#$3 => DB user password

foxx-manager --server.database=$1 --server.username=$2 --server.password=$3 purge dss && foxx-manager --server.database=$1 --server.username=$2 --server.password=$3 fetch directory . && foxx-manager --server.database=$1 --server.username=$2 --server.password=$3 mount app:dss:0.0.1 /dss && foxx-manager --server.database=$1 --server.username=$2 --server.password=$3 setup /dss
