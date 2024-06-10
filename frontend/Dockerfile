# Use the official Node.js 14 image as the base image
FROM node:18

# Install serve globally using npm
RUN npm install -g serve

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies using npm ci
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Run the application in development mode
CMD ["serve", "-s", "dist"]
