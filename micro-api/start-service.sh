#!/usr/bin/env bash

docker service create --replicas 1 --name micro-api -l=apiRoute='/api' -p 3002:3000 -e DB_SERVERS="192.168.99.100:27017" micro-api
