FROM node:lts

WORKDIR /usr/app

COPY package.json ./
RUN npm install

COPY ./dist/* ./

EXPOSE 3005

CMD ["node", "index.js"]