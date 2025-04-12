FROM golang:alpine AS build
RUN apk --no-cache add gcc g++ make git
WORKDIR /app
COPY . .
RUN go mod tidy
RUN GOOS=linux go build -ldflags="-s -w" -o ./tron-frontend .

FROM alpine:3.17
RUN apk --no-cache add ca-certificates
WORKDIR /
COPY --from=build /app /app
COPY . /app/src
EXPOSE 3000
ENTRYPOINT /app/tron-frontend