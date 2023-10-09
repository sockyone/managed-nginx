FROM openresty/openresty:alpine-fat

RUN apk add --update openssl && \
    rm -rf /var/cache/apk/*

RUN openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 \
      -subj '/CN=sni-support-required-for-valid-ssl' \
      -keyout /etc/ssl/resty-auto-ssl-fallback.key \
      -out /etc/ssl/resty-auto-ssl-fallback.crt

RUN mkdir -p /etc/resty-auto-ssl \
    && addgroup -S nginx \
    && adduser -D -S -h /var/cache/nginx -s /sbin/nologin -G nginx nginx \
    && chown nginx:nginx /etc/resty-auto-ssl \
    && chmod -R a+rw /etc/resty-auto-ssl

RUN luarocks install lua-resty-auto-ssl

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY *.lua /usr/local/openresty/lualib/

EXPOSE 443