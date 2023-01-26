FROM node:lts

WORKDIR /home/app

COPY package.json ./
RUN yarn

COPY ./dist ./

EXPOSE 3005

CMD ["node", "index.js"]