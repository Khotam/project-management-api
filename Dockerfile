FROM node:20.10.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY . .

ENV HTTP_PORT 8080
ENV NODE_ENV production
EXPOSE 8080
CMD ["npm", "run", "start:prod"]

