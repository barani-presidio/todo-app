FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

ENV NODE_ENV=production

RUN adduser -D appuser && \
    chown -R appuser:appuser /app

USER appuser

CMD ["node", "server.js"]
