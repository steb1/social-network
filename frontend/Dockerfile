FROM node:latest

LABEL maintainer="iyossang, magniang, yayediop, khthiam, lomalack"
LABEL description="A social-network with followers,chat,groups, posts and comments "

WORKDIR /app

COPY . .

RUN apt update && \
    apt install -y npm && \
    npm install

EXPOSE 3000

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

CMD ["npm", "run", "dev"]
