ARG MKDOCS_MATERIAL_TAG=9

FROM squidfunk/mkdocs-material:${MKDOCS_MATERIAL_TAG} AS builder

WORKDIR /docs

COPY mkdocs.yml /docs/mkdocs.yml
COPY docs /docs/docs

RUN mkdocs build --clean

FROM nginx:alpine

COPY --from=builder /docs/site /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
