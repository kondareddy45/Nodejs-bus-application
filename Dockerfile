FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV MONGO_URI=mongodb://bus-mongo:27017/busBooking

EXPOSE 3000

CMD ["node", "server.js"]
