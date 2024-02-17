FROM node:latest

LABEL maintainer="iyossang, magniang, yayediop, khthiam, lomalack"
LABEL description="A social-network with followers,chat,groups, posts and comments "

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
