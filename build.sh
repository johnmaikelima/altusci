#!/bin/bash
set -e

echo "Installing root dependencies..."
npm ci --legacy-peer-deps

echo "Installing client dependencies..."
cd client
npm ci --legacy-peer-deps

echo "Building frontend..."
npm run build

echo "Build completed successfully!"
