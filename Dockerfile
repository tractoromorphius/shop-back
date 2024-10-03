FROM node:lts-alpine as build

WORKDIR /app
COPY *.json ./
RUN npm install
COPY . .

FROM node:lts-alpine as development

WORKDIR /app
COPY *.json ./
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma
RUN npm ci

EXPOSE 4000
CMD [ "npm", "run", "dev" ]

FROM node:lts-alpine as production

WORKDIR /app
COPY *.json ./
COPY --from=build /app/src ./src
RUN npm ci --onli-prod

EXPOSE 4000
CMD [ "npm", "run", "start" ]
