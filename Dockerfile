
FROM node:24.14.0

WORKDIR /app
RUN mkdir -p dist



COPY ./dist ./dist/
COPY ./public ./public/
COPY .env ./
COPY package*.json ./


RUN npm ci
EXPOSE 3002

CMD ["npm", "run", "start"]
