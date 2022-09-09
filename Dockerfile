FROM node:14 as base
WORKDIR /microservices
COPY package.json tsconfig* ./
RUN npm install

FROM base as payment
COPY payment ./payment

FROM base as order
COPY order ./order

FROM base as product
COPY product ./product

FROM base as customer
COPY customer ./customer

FROM base as gateway
COPY gateway ./gateway