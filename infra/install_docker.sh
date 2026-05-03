#!/bin/bash

sudo apt update -y
sudo apt install -y docker.io

sudo systemctl start docker
sudo systemctl enable docker

# Run your container
docker run -d -p 80:3000 your-docker-image