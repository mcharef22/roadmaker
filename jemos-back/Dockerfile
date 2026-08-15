FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p uploads uploadFilesOnServer

ENV NODE_ENV=development

EXPOSE 5000

CMD ["node", "server.js"]
