FROM node
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
RUN npm install dotenv
COPY dev4cloud /app/
CMD ["node", "server.js"]
EXPOSE 3000