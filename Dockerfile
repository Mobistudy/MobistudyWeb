FROM node:18.16.1 as build

# install python (needed by some dev deps)
#RUN apk add --no-cache --virtual .gyp \
#    python \
#    make \
#    g++

# create local folder where to keep the src code
RUN mkdir -p /usr/src/app
COPY . /usr/src/app

# build
WORKDIR /usr/src/app
RUN npm install
RUN npx quasar build

FROM caddy:2.4.6-alpine

COPY --from=build /usr/src/app/dist/spa /var/www
