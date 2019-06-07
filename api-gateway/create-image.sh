#!/usr/bin/env bash

docker rm -f api-gateway-service

docker rmi api-gateway-service

yes | docker image prune

yes | docker volume prune

mkdir ./certs && cp $DOCKER_CERT_PATH/*.pem "$_"

docker build -t api-gateway-service .
