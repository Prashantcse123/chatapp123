FROM node:8.1
WORKDIR /chatroom
RUN npm install nodemon -g
COPY package.json /chatroom
COPY package-lock.json /chatroom
RUN npm install
COPY . /chatroom
EXPOSE 4000
