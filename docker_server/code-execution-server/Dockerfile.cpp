FROM gcc:latest

COPY run-scripts/run-cpp.sh /usr/local/bin/run-cpp
RUN chmod +x /usr/local/bin/run-cpp

WORKDIR /code