FROM --platform=linux/amd64 node:14

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN apt-get update && apt-get install docker.io -y

EXPOSE 3000

CMD [ "npm", "start" ]