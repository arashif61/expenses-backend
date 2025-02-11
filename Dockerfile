FROM node:20-alpine

ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-arm64-openssl-3.0.x

RUN apk add --no-cache openssl

WORKDIR /app/

COPY ./ /app/
RUN mkdir -p /app/temp/sbicsv

RUN npm install -g npm@latest
RUN npm upgrade --save --legacy-peer-deps
RUN npm install
RUN npx prisma generate --schema=./prisma/schema.prisma

# Entrypoint スクリプトを追加
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]