#!/bin/bash

# Navigate to the project directory
cd /home/ec2-user/temp-TW-project || exit

# Fetch the latest changes from the remote repository
git fetch origin main

# Check if there are any differences between the local branch and remote branch
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "New updates detected! Deploying automatically..."
    
    # Pull the latest code
    git pull origin main
    
    # Rebuild and restart the Docker containers
    docker-compose down || true
    docker-compose up -d --build
    
    # Clean up old unused images to save space
    docker image prune -a -f
    
    echo "Deployment successful."
else
    echo "Already up to date."
fi
