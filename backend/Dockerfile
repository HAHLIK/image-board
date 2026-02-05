#Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /build

COPY ./src/go.mod ./src/go.sum ./
RUN go mod download

COPY ./src/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o app ./cmd/main.go

#Runtime stage
FROM alpine:3.20 AS runner

RUN apk add --no-cache postgresql-client bash

WORKDIR /app

COPY --from=builder /build/app .
COPY ./config/config.yaml .
COPY ./wait-for-postgres.sh .

RUN chmod +x ./wait-for-postgres.sh

RUN adduser -D appuser
USER appuser

ENTRYPOINT [ "./wait-for-postgres.sh" ]