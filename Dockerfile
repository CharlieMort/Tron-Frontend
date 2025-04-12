FROM golang:latest as build
WORKDIR /build
COPY . .
RUN go build . -o app .
 
FROM alpine:latest as run
WORKDIR /app
COPY --from=build /build/app .
ENTRYPOINT ["/app/app"]