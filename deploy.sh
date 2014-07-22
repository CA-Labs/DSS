#!/bin/sh

foxx-manager purge dss && foxx-manager fetch directory . && foxx-manager mount app:dss:0.0.1 /dss && foxx-manager setup /dss