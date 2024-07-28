FROM gcc:latest

COPY run-scripts/run-c.sh /usr/local/bin/run-c
RUN chmod +x /usr/local/bin/run-c

WORKDIR /code