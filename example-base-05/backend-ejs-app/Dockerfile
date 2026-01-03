# Use official Node.js image as base
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend application files
COPY . .

EXPOSE 3002

# Command to run the application
CMD ["node", "server.js"]
