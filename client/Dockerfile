FROM --platform=linux/amd64 node:lts

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD npm run preview