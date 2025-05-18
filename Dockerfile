FROM node:18

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./
RUN npm install yarn

COPY . .
RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]