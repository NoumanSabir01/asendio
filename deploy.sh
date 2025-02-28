#!/usr/bin/env bash

# Navigate to project directory
cd /home/asendio/Desktop/AsendioAISite || exit

# Pull the latest changes from the repository
git pull origin main

# Install any new dependencies
npm install --force

# Build the project
npm run build

# # Restart PM2 processes
# pm2 restart AsendioAISite
pm2 delete AsendioAISite
pm2 start ecosystem.config.js
