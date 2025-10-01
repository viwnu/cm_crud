FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build
RUN ./node_modules/.bin/tsc

CMD ["sh", "./start.sh"]
