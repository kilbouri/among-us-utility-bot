FROM node:16.17

# Add project files to /app
ADD . /app
WORKDIR /app

RUN yarn install
RUN yarn build

CMD yarn host
