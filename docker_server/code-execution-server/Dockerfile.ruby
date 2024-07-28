FROM ruby:3.0-slim

COPY run-scripts/run-ruby.sh /usr/local/bin/run-ruby
RUN chmod +x /usr/local/bin/run-ruby

WORKDIR /code