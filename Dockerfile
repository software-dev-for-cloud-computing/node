FROM node:14
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY node/dev4cloud /app/
CMD ["node", "server.js"]
EXPOSE 3000
