FROM node:12-alpine
WORKDIR /app
COPY ./api/ /app/
RUN ls
USER node
RUN npm i
CMD ["node", "index.js"]
