FROM node:6

ARG DOCKER_HOST
ARG PORT=6100

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


# Install yarn
RUN apt-get update && apt-get install -y apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install yarn

# Install node_modules with yarn
ADD package.json yarn.lock /tmp/
RUN cd /tmp && yarn
RUN mkdir -p /usr/src/app && cd /usr/src/app && ln -s /tmp/node_modules

# Copy app
COPY . /usr/src/app


EXPOSE ${PORT}
CMD [ "node", "bin/server.js" ]

