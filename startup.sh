#!/bin/bash
# Azure App Service startup script for Socket.io server

echo "Starting Socket.io Signaling Server..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies
npm install --production

# Start the server
npm run server:prod
