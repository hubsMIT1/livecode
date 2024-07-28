FROM swift:5.4

COPY run-scripts/run-swift.sh /usr/local/bin/run-swift
RUN chmod +x /usr/local/bin/run-swift

WORKDIR /code