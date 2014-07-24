#!/bin/sh

foxx-manager --server.database=dss purge dss && foxx-manager --server.database=dss fetch directory . && foxx-manager --server.database=dss mount app:dss:0.0.1 /dss && foxx-manager --server.database=dss setup /dss
