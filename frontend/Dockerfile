FROM node:latest

LABEL maintainer="iyossang, magniang, yayediop, khthiam, lomalack"
LABEL description="A social-network with followers,chat,groups, posts and comments "

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY . .

RUN apt update

RUN apt install -y npm

RUN npm install

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

CMD ["npm", "run", "dev"]
