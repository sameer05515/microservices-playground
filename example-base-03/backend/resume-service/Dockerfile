# Use the official Node.js 14 image as the base image
# FROM node:14
# Use an official Node runtime as the base image
FROM node:lts-buster-slim AS development

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Ensure the environment variables are available
COPY .env .env

# Expose the port the app runs on
EXPOSE 4000

# Define the command to run the app
CMD ["node", "src/services/apolloServer.js"]
