# Node v7 as the base image to support ES6
FROM node:10.15.3

# Create a new user to our new container and avoid the root user
RUN useradd --user-group --create-home --shell /bin/false nodd && \
    apt-get clean

ENV ROOT=/home/nodd/source

ENV DOCKER_CERT_PATH=/home/qpham/.docker/machine/machines/manager1

COPY app/ $ROOT/app

COPY config/ $ROOT/config

RUN mkdir $ROOT/logs

COPY index.js $ROOT/

COPY package.json $ROOT/

COPY certs/ $ROOT/certs

RUN chown -R nodd:nodd $ROOT/* /usr/local/

WORKDIR $ROOT
RUN npm install --silent --progress=false --production

RUN chown -R nodd:nodd $ROOT/*
USER nodd

EXPOSE 3000

CMD ["npm", "start"]
