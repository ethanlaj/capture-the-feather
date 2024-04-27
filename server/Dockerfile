FROM --platform=linux/amd64 node:lts

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD npm run start