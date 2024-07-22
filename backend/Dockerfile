FROM golang:1.21.0-alpine3.17

LABEL maintainer="iyossang, yayediop, magniang, khthiam, lomalack"
LABEL description="A social-network with followers,chat,groups, posts and comments "

WORKDIR /app

COPY . /app

RUN apk update && \
    apk add gcc libc-dev bash sqlite-dev sqlite

RUN go mod download

RUN CGO_ENABLED=1 GOOS=linux go build -o social-network

EXPOSE 8080

CMD ["/app/social-network"]
