#!/bin/bash

# Navigate to the backend directory and run npm run dev
cd ./backend
echo "Starting backend server..."
npm run dev &

# Navigate back to the root directory
cd ..

# Navigate to the frontend directory and run npm run dev
cd ./frontend
echo "Starting frontend server..."
npm run dev &
