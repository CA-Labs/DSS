#!/bin/bash

#$1 => Database we want to play with    

foxx-manager --server.database=$1 purge dss && foxx-manager --server.database=$1 fetch directory . && foxx-manager --server.database=$1 mount app:dss:0.0.1 /dss && foxx-manager --server.database=$1 setup /dss
