# /microservices/topics/Dockerfile
# FROM node:14
# Use an official Node runtime as the base image
FROM node:lts-buster-slim AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD ["node", "topics.js"]
