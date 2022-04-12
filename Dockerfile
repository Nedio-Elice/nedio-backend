FROM node:16.13.0

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "run", "start:prod"]
