FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]