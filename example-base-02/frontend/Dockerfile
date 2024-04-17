# Use an official Node runtime as the base image
FROM node:lts-buster-slim AS development

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Expose port 3002
EXPOSE 3002

# Command to run the application
CMD ["npm", "start"]
