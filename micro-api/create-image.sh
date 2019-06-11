#!/bin/bash  

docker rm -f micro-admin

docker rmi micro-admin

docker image prune

docker volume prune

docker build -t micro-admin .
