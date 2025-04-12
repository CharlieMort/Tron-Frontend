FROM golang:1.19.2 as builder
WORKDIR /app
RUN go mod init tron-frontend
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /tron-frontend

FROM gcr.io/distroless/base-debian11
WORKDIR /
COPY --from=builder /tron-frontend /tron-frontend
COPY ./src .
ENV PORT 3000
USER nonroot:nonroot
CMD ["tron-frontend"]