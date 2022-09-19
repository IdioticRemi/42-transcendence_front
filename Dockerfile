FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# install simple http server for serving static content
RUN npm install -g http-server

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json .

# install project dependencies
RUN npm install -g @vue/cli-service
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .
RUN rm -f vue.config.js

# add certs for ssl
RUN apk add openssl
RUN mkdir -p cert ; openssl req -x509 -nodes -days 360 -newkey rsa:2048 -keyout ./cert/key.pem -out ./cert/cert.pem -subj "/C=FR/ST=Rhone/L=Lyon/O=42Lyon/CN=mdesoeuv"

# Build app for production with minification
RUN npm run build

EXPOSE 8080
# CMD [ "http-server", "-S", "-C", "cert/cert.pem", "-K", "cert/key.pem", "-o", "dist" ]
CMD [ "http-server", "dist" ]