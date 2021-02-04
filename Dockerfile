FROM node:10-slim AS build

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

COPY --from=build /app/dist /app

EXPOSE 5000

CMD ["node", "dist/main"]

