FROM node:lts

WORKDIR /usr/app

COPY package.json ./
RUN npm install -g npm@9.3.1
RUN npm install

COPY ./dist ./

EXPOSE 3005

CMD ["node", "index.js"]