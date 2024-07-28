FROM golang:1.16-alpine

COPY run-scripts/run-go.sh /usr/local/bin/run-go
RUN chmod +x /usr/local/bin/run-go

WORKDIR /code