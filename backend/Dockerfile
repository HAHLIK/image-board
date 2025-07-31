#Building stage
FROM golang:1.24-alpine AS builder

WORKDIR /usr/local/src

COPY ./src/go.mod ./src/go.sum ./
RUN go mod download

COPY ./src/ ./
RUN go build -o ./bin/app ./cmd/main.go

COPY ./config ./
COPY ./wait-for-postgres.sh ./


#Running stage
FROM alpine AS runner

RUN apk update
RUN apk add postgresql-client

COPY --from=builder /usr/local/src/wait-for-postgres.sh /
RUN chmod +x wait-for-postgres.sh

COPY --from=builder /usr/local/src/bin/app /

COPY --from=builder /usr/local/src/main.yaml /

ARG CONFIG_PATH POSTGRES_USER POSTGRES_PASSWORD

RUN adduser -D ${POSTGRES_USER}
USER ${POSTGRES_USER}