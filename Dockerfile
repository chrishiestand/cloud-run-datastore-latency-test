FROM node:12-alpine

WORKDIR /app

COPY package*.json /app/

RUN echo installing node dependencies... && \
    npm --prefix=/app install && \
    echo cleaning up... && \
    rm -rf /root/.npm /root/.node-gyp

COPY src /app/src

USER nobody
CMD ["node", "/app/src/index.js"]
