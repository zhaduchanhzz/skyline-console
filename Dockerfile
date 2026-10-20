FROM nginx:stable-alpine

ENV SKYLINE_API_UPSTREAM=http://127.0.0.1:9999

COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY skyline_console/static/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
