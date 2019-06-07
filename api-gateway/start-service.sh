#!/usr/bin/env bash

eval `docker-machine env manager1`

docker run --name api-gateway-service --env-file .env --net='host' -d api-gateway-service
