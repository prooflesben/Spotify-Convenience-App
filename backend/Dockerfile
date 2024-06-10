# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies using npm ci
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port your app runs on (5173 in this case for Vite)
EXPOSE 5173

# Run the application
CMD ["npm", "start"]
