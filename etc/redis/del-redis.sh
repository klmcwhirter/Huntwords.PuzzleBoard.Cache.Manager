#!/bin/bash
#*----------------------------------------------------------------------------*
#* Name: del-redis.sh
#*
#* Description: Deletes the redis instance from the current project.
#*
#*----------------------------------------------------------------------------*

oc delete all --selector app=redis-persistent
oc delete secrets redis
oc delete pvc redis

#*----------------------------------------------------------------------------*
