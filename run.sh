#!/bin/bash

# Get the current timestamp
TIMESTAMP=$(date +%s)

# Print the timestamp
echo "Running Docker Compose with TIMESTAMP=$TIMESTAMP"

# Run Docker Compose with the TIMESTAMP environment variable
TIMESTAMP=$TIMESTAMP docker-compose up -d