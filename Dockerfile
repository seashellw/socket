FROM node:alpine
WORKDIR /root

RUN npm install -g pnpm

COPY ./package.json ./
COPY ./.npmrc ./
COPY ./.env ./
RUN pnpm install

COPY . ./

EXPOSE 9003
CMD ["pnpm","run","start"]
