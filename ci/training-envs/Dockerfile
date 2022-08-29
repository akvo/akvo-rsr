FROM kiwigrid/gcloud-kubectl-helm:2.12.3-234.0.0-88

# Update to a gcloud version known to work
ARG GCLOUD_COMPONENTS_VERSION="399.0.0"
USER 0
RUN gcloud components update --version "$GCLOUD_COMPONENTS_VERSION" \
    && adduser akvo -D -u 1000
USER akvo
