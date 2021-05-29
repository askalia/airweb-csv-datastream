FROM node:14-alpine
COPY . .
RUN yarn install
RUN yarn run build
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["yarn run start:prod"]
EXPOSE 3000
