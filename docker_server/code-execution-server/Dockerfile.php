FROM php:7.4-cli

COPY run-scripts/run-php.sh /usr/local/bin/run-php
RUN chmod +x /usr/local/bin/run-php

WORKDIR /code