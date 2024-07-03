#!/bin/zsh

docker build -t steveh2707/audiobook-file-server:test .
docker login -u steveh2707 -p ${DOCKER_HUB_TOKEN}
docker push steveh2707/audiobook-file-server:test