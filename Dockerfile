FROM node
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
EXPOSE 4001
COPY . .
ENTRYPOINT ["npm", "start"]