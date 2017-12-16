FROM node:6.9.4

LABEL maintainer Charles Uye <charlesdomain@gmail.com>

# create the log directory
RUN mkdir -p /var/log/applications/nodeservice

# Creating base "src" directory where the source repo will reside in our container.
# Code is copied from the host machine to this "src" folder in the container as a last step.
#RUN mkdir /src
WORKDIR /src


RUN npm install pm2 -g
RUN npm install babel-cli -g
RUN npm install --save babel-preset-es2015
RUN apt-get update && apt-get install -y \
  vim
RUN npm install jshint-junit-reporter mocha-bamboo-reporter
RUN npm install -g forever@0.14.2

# Use Cache please
ADD package.json /src
RUN npm install

ADD . /src

# Entrypoint script
RUN cp docker-entrypoint.sh /usr/local/bin/ && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the port
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]