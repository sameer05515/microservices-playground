FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY todo.json ./

ENV PORT=3401
EXPOSE 3401

CMD ["node", "server.js"]
