#!/bin/sh

# This script is used to start the application in production
# It will be run by Render when the application is deployed

# Use the PORT environment variable provided by Render
export PORT=${PORT:-3000}

# Run the preview server with the host binding and port
npm run preview -- --host 0.0.0.0 --port $PORT
