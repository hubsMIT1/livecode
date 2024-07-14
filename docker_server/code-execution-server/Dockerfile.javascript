FROM node:14-slim

COPY run-scripts/run-javascript.sh /usr/local/bin/run-javascript
RUN chmod +x /usr/local/bin/run-javascript

WORKDIR /code