#!/usr/bin/env bash

docker service create --replicas 1 --name micro-admin -l=apiRoute='/admin' -p 3001:3000 -e DB_SERVERS="192.168.99.100:27017" micro-admin
