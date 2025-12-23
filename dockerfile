FROM node:14 as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

FROM node:14
WORKDIR /app
COPY --from=builder /app/dist ./
COPY package.json yarn.lock ./
RUN yarn install --production
EXPOSE 3000
CMD ["yarn", "start"]