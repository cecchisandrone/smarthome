#!/bin/bash
# Stop and remove containers, networks, images, and volumes all the services specified in descriptors
exec docker-compose -f docker-compose.yml -f docker-compose.dev.yml down