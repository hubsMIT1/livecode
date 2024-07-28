FROM openjdk:11-jdk-slim

COPY run-scripts/run-java.sh /usr/local/bin/run-java
RUN chmod +x /usr/local/bin/run-java

WORKDIR /code