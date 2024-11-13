FROM prom/statsd-exporter:v0.7.0

COPY statsd_mapping.conf /config/statsd_mapping.conf

CMD ["--statsd.mapping-config=/config/statsd_mapping.conf"]