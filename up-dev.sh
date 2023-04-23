#!/bin/bash
# Starts all the services passed as arguments
exec docker compose --project-name pi -f docker-compose.yml -f docker-compose.dev.yml up --build $@
