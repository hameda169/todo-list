FROM node:18

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
SHELL ["/bin/bash", "-c"]
RUN source .env
RUN yarn migrate
EXPOSE 3002
ENV PORT 3002
RUN yarn build
CMD yarn start

