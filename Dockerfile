FROM node:14.4.0-alpine
ARG API_VERSION
WORKDIR /var/www
COPY . .
RUN yarn config set registry http://npm.airweb.fr \
    && yarn global add @nestjs/cli \
    && yarn install --non-interactive \
    && yarn build
RUN cp -r node_modules dist/ && cp -r dist/. prisma package.json yarn.lock  ..
WORKDIR /var/www
RUN rm -rf tmp/
RUN yarn install --production --ignore-scripts --prefer-offline --force --non-interactive
RUN npx prisma generate
EXPOSE 3000
#CMD yarn start:dev